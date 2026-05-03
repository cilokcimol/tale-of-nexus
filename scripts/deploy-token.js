// Deploy NEXUS SPL token on Solana Devnet.
// Usage: DEPLOYER_SECRET=<base58 secret> node deploy-token.js
// The deployer becomes the mint authority. Decimals = 6.
// Initial supply: 1,000,000,000 NEXUS (1B) minted to the deployer's ATA.

import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from '@solana/spl-token';
import bs58 from 'bs58';

const SECRET = process.env.DEPLOYER_SECRET;
if (!SECRET) {
  console.error('Missing DEPLOYER_SECRET env var (base58).');
  process.exit(1);
}

const decimals = 6;
const initialSupply = 1_000_000_000n; // 1B
const RPC = process.env.SOLANA_RPC || clusterApiUrl('devnet');

const conn = new Connection(RPC, 'confirmed');
const deployer = Keypair.fromSecretKey(bs58.decode(SECRET));

console.log('Deployer pubkey:', deployer.publicKey.toBase58());

const bal = await conn.getBalance(deployer.publicKey);
console.log('Deployer balance:', bal / 1e9, 'SOL');

if (bal < 0.05 * 1e9) {
  console.error('Need at least 0.05 SOL for fees. Try `solana airdrop` on devnet first.');
  process.exit(1);
}

console.log('Creating mint...');
const mint = await createMint(
  conn,
  deployer,
  deployer.publicKey, // mint authority
  deployer.publicKey, // freeze authority (could be null; keeping deployer for revoke later)
  decimals
);
console.log('Mint address:', mint.toBase58());

console.log('Creating ATA for deployer...');
const ata = await getOrCreateAssociatedTokenAccount(conn, deployer, mint, deployer.publicKey);
console.log('Deployer ATA:', ata.address.toBase58());

console.log('Minting initial supply...');
const amount = initialSupply * 10n ** BigInt(decimals);
const sig = await mintTo(conn, deployer, mint, ata.address, deployer, amount);
console.log('Mint tx:', sig);

console.log('\nDone. Save these:');
console.log(JSON.stringify({
  network: 'solana-devnet',
  mint: mint.toBase58(),
  decimals,
  initialSupply: initialSupply.toString(),
  deployerATA: ata.address.toBase58(),
  mintAuthority: deployer.publicKey.toBase58(),
  txExplorer: `https://explorer.solana.com/tx/${sig}?cluster=devnet`,
  mintExplorer: `https://explorer.solana.com/address/${mint.toBase58()}?cluster=devnet`,
}, null, 2));
