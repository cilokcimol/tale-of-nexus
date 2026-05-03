import type { Context } from '@netlify/functions';
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  clusterApiUrl,
} from '@solana/web3.js';
import {
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import bs58 from 'bs58';
import { getStore } from '@netlify/blobs';

const FAUCET_AMOUNT = 1000n;
const FAUCET_DECIMALS = 6n;
const FAUCET_COOLDOWN_MS = 24 * 60 * 60 * 1000;

export default async function handler(req: Request, _ctx: Context) {
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  const SECRET = process.env.DEPLOYER_SECRET;
  const MINT_ADDR = process.env.NEXUS_MINT || 'FL9NH8yEvAJKoCArAr5LDt6fB46qK74sZvoVKFv11S8B';
  if (!SECRET) return json({ error: 'Server not configured: DEPLOYER_SECRET missing', code: 'unconfigured' }, 500);

  let body: any;
  try { body = await req.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }
  const wallet = String(body?.wallet || '');
  const confirm = !!body?.confirm;
  const sig = String(body?.signature || '');
  if (!wallet) return json({ error: 'wallet required' }, 400);

  let userPk: PublicKey;
  try { userPk = new PublicKey(wallet); } catch { return json({ error: 'Invalid wallet' }, 400); }

  const store = getStore('faucet');
  const now = Date.now();
  const last = Number((await store.get(wallet, { type: 'text' })) || 0);
  if (last && now - last < FAUCET_COOLDOWN_MS) {
    const cooldownUntil = last + FAUCET_COOLDOWN_MS;
    const waitH = Math.ceil((cooldownUntil - now) / 3_600_000);
    return json({
      error: `Cooldown active. Try again in ~${waitH}h.`,
      code: 'cooldown',
      cooldownUntil,
    }, 429);
  }

  const conn = new Connection(process.env.SOLANA_RPC || clusterApiUrl('devnet'), 'confirmed');
  let auth: Keypair;
  try { auth = Keypair.fromSecretKey(bs58.decode(SECRET)); }
  catch { return json({ error: 'Invalid DEPLOYER_SECRET' }, 500); }

  const mint = new PublicKey(MINT_ADDR);
  const userAta = await getAssociatedTokenAddress(mint, userPk);

  if (confirm && sig) {
    try {
      const tx = await conn.getSignatureStatus(sig, { searchTransactionHistory: true });
      const ok = tx?.value && (tx.value.confirmationStatus === 'confirmed' || tx.value.confirmationStatus === 'finalized');
      if (!ok) return json({ error: 'Transaction not confirmed yet' }, 409);
      await store.set(wallet, String(now));
      return json({ ok: true, cooldownUntil: now + FAUCET_COOLDOWN_MS });
    } catch (e: any) {
      return json({ error: e?.message || 'Confirm failed' }, 500);
    }
  }

  const tx = new Transaction();

  const ataInfo = await conn.getAccountInfo(userAta);
  if (!ataInfo) {
    tx.add(createAssociatedTokenAccountInstruction(
      userPk, userAta, userPk, mint,
      TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID,
    ));
  }

  const amount = FAUCET_AMOUNT * 10n ** FAUCET_DECIMALS;
  tx.add(createMintToInstruction(mint, userAta, auth.publicKey, amount));

  tx.feePayer = userPk;
  const { blockhash } = await conn.getLatestBlockhash();
  tx.recentBlockhash = blockhash;

  tx.partialSign(auth);

  const serialized = tx.serialize({ requireAllSignatures: false }).toString('base64');
  return json({
    tx: serialized,
    amount: Number(FAUCET_AMOUNT),
    mint: MINT_ADDR,
  });
}

function json(b: unknown, status = 200) {
  return new Response(JSON.stringify(b), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
