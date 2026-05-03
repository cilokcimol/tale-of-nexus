import type { Context } from '@netlify/functions';
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  clusterApiUrl,
  SystemProgram,
} from '@solana/web3.js';
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMint2Instruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  createCreateMetadataAccountV3Instruction,
  createCreateMasterEditionV3Instruction,
  PROGRAM_ID as METADATA_PROGRAM_ID,
} from '@metaplex-foundation/mpl-token-metadata';
import bs58 from 'bs58';
import { getStore } from '@netlify/blobs';

const NEXUS_DECIMALS = 6n;
const TIERS = {
  bronze: { price: 100n, name: 'Bronze Nexus', symbol: 'TNB' },
  silver: { price: 500n, name: 'Silver Nexus', symbol: 'TNS' },
  gold:   { price: 2000n, name: 'Gold Nexus',  symbol: 'TNG' },
} as const;

export default async function handler(req: Request, _ctx: Context) {
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  const SECRET      = process.env.DEPLOYER_SECRET;
  const NEXUS_MINT  = process.env.NEXUS_MINT     || 'FL9NH8yEvAJKoCArAr5LDt6fB46qK74sZvoVKFv11S8B';
  const TREASURY    = process.env.NEXUS_TREASURY  || '2vUk36mVVDySeyj6wFUKoAZ66CN6sJLss49qK6jvTuy5';
  const SITE_ORIGIN = process.env.SITE_ORIGIN     || 'https://taleofnexus.netlify.app';

  if (!SECRET) return json({ error: 'DEPLOYER_SECRET not configured', code: 'unconfigured' }, 500);

  let body: any;
  try { body = await req.json(); } catch { return json({ error: 'Invalid JSON body' }, 400); }

  const wallet     = String(body?.wallet     || '');
  const tier       = String(body?.tier       || '') as keyof typeof TIERS;
  const paymentSig = String(body?.paymentSig || '');

  if (!wallet || !tier || !paymentSig) return json({ error: 'wallet, tier, paymentSig required' }, 400);
  if (!TIERS[tier]) return json({ error: 'Unknown tier' }, 400);

  let userPk: PublicKey;
  let auth: Keypair;
  try { userPk = new PublicKey(wallet); }
  catch { return json({ error: 'Invalid wallet address' }, 400); }
  try { auth = Keypair.fromSecretKey(bs58.decode(SECRET)); }
  catch { return json({ error: 'Invalid DEPLOYER_SECRET' }, 500); }

  const store = getStore('nft-mints');
  const seen  = await store.get(paymentSig, { type: 'text' });
  if (seen) return json({ error: 'paymentSig already redeemed', existing: seen }, 409);

  const rpc  = process.env.SOLANA_RPC || clusterApiUrl('devnet');
  const conn = new Connection(rpc, 'confirmed');

  const txRecord = await conn.getParsedTransaction(paymentSig, {
    maxSupportedTransactionVersion: 0,
    commitment: 'confirmed',
  });
  if (!txRecord) return json({ error: 'Payment transaction not found on chain yet. Wait a moment and retry.' }, 404);
  if (txRecord.meta?.err) return json({ error: 'Payment transaction failed on chain' }, 400);

  const t              = TIERS[tier];
  const expectedAmount = t.price * 10n ** NEXUS_DECIMALS;
  if (!verifyTransfer(txRecord, NEXUS_MINT, wallet, TREASURY, expectedAmount)) {
    return json({ error: 'Payment amount or destination did not match expected' }, 400);
  }

  const nftMintKp = Keypair.generate();
  const nftMintPk = nftMintKp.publicKey;
  const metadataUri = `${SITE_ORIGIN}/badges/${tier}.json`;

  try {
    const userNftAta = await getAssociatedTokenAddress(nftMintPk, userPk);

    const [metadataPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('metadata'), METADATA_PROGRAM_ID.toBuffer(), nftMintPk.toBuffer()],
      METADATA_PROGRAM_ID,
    );

    const [masterEditionPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata'),
        METADATA_PROGRAM_ID.toBuffer(),
        nftMintPk.toBuffer(),
        Buffer.from('edition'),
      ],
      METADATA_PROGRAM_ID,
    );

    const mintRent = await conn.getMinimumBalanceForRentExemption(MINT_SIZE);
    const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash('confirmed');

    const mintTx = new Transaction({ feePayer: auth.publicKey, recentBlockhash: blockhash });

    mintTx.add(
      SystemProgram.createAccount({
        fromPubkey:          auth.publicKey,
        newAccountPubkey:    nftMintPk,
        space:               MINT_SIZE,
        lamports:            mintRent,
        programId:           TOKEN_PROGRAM_ID,
      }),
      createInitializeMint2Instruction(nftMintPk, 0, auth.publicKey, auth.publicKey),
      createAssociatedTokenAccountInstruction(
        auth.publicKey, userNftAta, userPk, nftMintPk,
        TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID,
      ),
      createMintToInstruction(nftMintPk, userNftAta, auth.publicKey, 1),
      createCreateMetadataAccountV3Instruction(
        {
          metadata:        metadataPda,
          mint:            nftMintPk,
          mintAuthority:   auth.publicKey,
          payer:           auth.publicKey,
          updateAuthority: auth.publicKey,
        },
        {
          createMetadataAccountArgsV3: {
            data: {
              name:                   t.name,
              symbol:                 t.symbol,
              uri:                    metadataUri,
              sellerFeeBasisPoints:   0,
              creators:               [{ address: auth.publicKey, verified: true, share: 100 }],
              collection:             null,
              uses:                   null,
            },
            isMutable:         false,
            collectionDetails: null,
          },
        },
      ),
      createCreateMasterEditionV3Instruction(
        {
          edition:         masterEditionPda,
          mint:            nftMintPk,
          updateAuthority: auth.publicKey,
          mintAuthority:   auth.publicKey,
          payer:           auth.publicKey,
          metadata:        metadataPda,
          tokenProgram:    TOKEN_PROGRAM_ID,
          systemProgram:   SystemProgram.programId,
        },
        { createMasterEditionArgs: { maxSupply: 0 } },
      ),
    );

    mintTx.sign(auth, nftMintKp);
    const sig = await conn.sendRawTransaction(mintTx.serialize(), { skipPreflight: false });
    await conn.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, 'confirmed');

    const nftAddr = nftMintPk.toBase58();
    await store.set(paymentSig, JSON.stringify({ nft: nftAddr, sig, tier, ts: Date.now() }));

    return json({ ok: true, nftMint: nftAddr, signature: sig, tier });

  } catch (e: any) {
    console.error('[mint-badge]', e?.logs?.join('\n') || e?.message || e);
    return json({ error: e?.message || 'NFT mint failed' }, 500);
  }
}

function verifyTransfer(
  tx:           any,
  expectedMint: string,
  fromWallet:   string,
  toTreasury:   string,
  expectedRaw:  bigint,
): boolean {
  const pre: any[]  = tx.meta?.preTokenBalances  || [];
  const post: any[] = tx.meta?.postTokenBalances || [];
  const delta = (owner: string) => {
    const p = pre .filter(b => b.mint === expectedMint && b.owner === owner)
                  .reduce((s: bigint, b: any) => s + BigInt(b.uiTokenAmount.amount || '0'), 0n);
    const q = post.filter(b => b.mint === expectedMint && b.owner === owner)
                  .reduce((s: bigint, b: any) => s + BigInt(b.uiTokenAmount.amount || '0'), 0n);
    return q - p;
  };
  return delta(fromWallet) <= -expectedRaw && delta(toTreasury) >= expectedRaw;
}

function json(b: unknown, status = 200) {
  return new Response(JSON.stringify(b), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
