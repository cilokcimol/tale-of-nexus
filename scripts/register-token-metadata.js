#!/usr/bin/env node
// Register Metaplex Token Metadata for the NEXUS SPL token.
// Run once with the deployer/mint authority secret in DEPLOYER_SECRET (base58).
//
//   DEPLOYER_SECRET=<base58> NEXUS_MINT=<mint> METADATA_URI=<https-json> \
//   node scripts/register-token-metadata.js
//
// Defaults to the NEXUS devnet mint and the live JSON URL on the Netlify site.

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  mplTokenMetadata,
  createMetadataAccountV3,
  updateMetadataAccountV2,
  fetchMetadataFromSeeds,
  findMetadataPda,
} from '@metaplex-foundation/mpl-token-metadata';
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi';
import bs58 from 'bs58';

const RPC = process.env.SOLANA_RPC || 'https://api.devnet.solana.com';
const MINT = process.env.NEXUS_MINT || 'FL9NH8yEvAJKoCArAr5LDt6fB46qK74sZvoVKFv11S8B';
const METADATA_URI = process.env.METADATA_URI || 'https://thenexus.netlify.app/nexus-token.json';

if (!process.env.DEPLOYER_SECRET) {
  console.error('DEPLOYER_SECRET (base58) is required');
  process.exit(1);
}

const umi = createUmi(RPC).use(mplTokenMetadata());
const secret = bs58.decode(process.env.DEPLOYER_SECRET);
const kp = umi.eddsa.createKeypairFromSecretKey(secret);
umi.use(keypairIdentity(kp));

const mint = publicKey(MINT);

const data = {
  name: 'NEXUS',
  symbol: 'NEXUS',
  uri: METADATA_URI,
  sellerFeeBasisPoints: 0,
  creators: null,
  collection: null,
  uses: null,
};

console.log('RPC          :', RPC);
console.log('Mint         :', MINT);
console.log('Authority    :', kp.publicKey);
console.log('Metadata URI :', METADATA_URI);

let exists = null;
try {
  exists = await fetchMetadataFromSeeds(umi, { mint });
} catch (_) {}

if (exists) {
  console.log('Metadata account already exists, updating...');
  const sig = await updateMetadataAccountV2(umi, {
    metadata: findMetadataPda(umi, { mint })[0],
    updateAuthority: kp,
    data,
    primarySaleHappened: null,
    isMutable: null,
    newUpdateAuthority: null,
  }).sendAndConfirm(umi);
  console.log('Updated:', bs58.encode(sig.signature));
} else {
  console.log('Creating new metadata account...');
  const sig = await createMetadataAccountV3(umi, {
    mint,
    mintAuthority: kp,
    payer: kp,
    updateAuthority: kp.publicKey,
    data,
    isMutable: true,
    collectionDetails: null,
  }).sendAndConfirm(umi);
  console.log('Created:', bs58.encode(sig.signature));
}

console.log('Done.');
console.log('Solscan:', `https://solscan.io/token/${MINT}?cluster=devnet`);
