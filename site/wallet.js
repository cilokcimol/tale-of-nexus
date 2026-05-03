import {
  Connection,
  PublicKey,
  Transaction,
  clusterApiUrl,
} from 'https://esm.sh/@solana/web3.js@1.95.3';

import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAccount,
} from 'https://esm.sh/@solana/spl-token@0.4.6';

export const CFG = {
  cluster: 'devnet',
  rpc: clusterApiUrl('devnet'),
  mint: 'FL9NH8yEvAJKoCArAr5LDt6fB46qK74sZvoVKFv11S8B',
  decimals: 6,
  treasury: '2vUk36mVVDySeyj6wFUKoAZ66CN6sJLss49qK6jvTuy5',
  faucetEndpoint: '/.netlify/functions/faucet',
  mintBadgeEndpoint: '/.netlify/functions/mint-badge',
  badgePrice: { bronze: 100, silver: 500, gold: 2000 },
  faucetAmount: 1000,
  faucetCooldownH: 24,
};

const conn = new Connection(CFG.rpc, 'confirmed');
const MINT = new PublicKey(CFG.mint);
const TREASURY = new PublicKey(CFG.treasury);

const state = {
  pubkey: null,
  ata: null,
  balance: 0,
  connecting: false,
};

const subs = new Set();
function emit() { for (const fn of subs) try { fn(state); } catch {} }
export function subscribe(fn) { subs.add(fn); fn(state); return () => subs.delete(fn); }

function fmtAddr(pk) {
  const s = pk.toBase58();
  return s.slice(0, 4) + '...' + s.slice(-4);
}
function fmtAmount(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Math.round(n).toString();
}

function getProvider() {
  if (typeof window === 'undefined') return null;
  const p = window.solana || window.phantom?.solana;
  if (p && p.isPhantom) return p;
  return p || null;
}

export async function connect() {
  const p = getProvider();
  if (!p) {
    window.open('https://phantom.app/', '_blank', 'noopener');
    throw new Error('Phantom wallet not detected. Install Phantom and reload.');
  }
  if (state.connecting) return;
  state.connecting = true; emit();
  try {
    try { await p.disconnect(); } catch {}
    const res = await p.connect();
    state.pubkey = new PublicKey(res.publicKey.toString());
    state.ata = await getAssociatedTokenAddress(MINT, state.pubkey);
    await refreshBalance();
  } finally {
    state.connecting = false; emit();
  }
}

export async function disconnect() {
  const p = getProvider();
  try { await p?.disconnect?.(); } catch {}
  state.pubkey = null;
  state.ata = null;
  state.balance = 0;
  localStorage.removeItem('rn_wallet_connected');
  emit();
}

export async function tryAutoConnect() {
  try { localStorage.removeItem('rn_wallet_connected'); } catch {}
}

export async function refreshBalance() {
  if (!state.pubkey) { state.balance = 0; return; }
  try {
    const acc = await getAccount(conn, state.ata);
    const raw = Number(acc.amount);
    state.balance = raw / 10 ** CFG.decimals;
  } catch {
    state.balance = 0;
  }
  emit();
}

export async function claimFaucet() {
  if (!state.pubkey) throw new Error('Connect a wallet first.');

  let r;
  try {
    r = await fetch(CFG.faucetEndpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ wallet: state.pubkey.toBase58() }),
    });
  } catch {
    const err = new Error('Faucet backend unreachable');
    err.code = 'unconfigured';
    throw err;
  }

  if (r.status === 404 || r.status === 405) {
    const err = new Error('Faucet backend not deployed');
    err.code = 'unconfigured';
    throw err;
  }

  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    if (r.status === 429 && j.code === 'cooldown' && j.cooldownUntil) {
      const err = new Error(j.error || 'Faucet cooldown active');
      err.code = 'cooldown';
      err.cooldownUntil = j.cooldownUntil;
      throw err;
    }
    if (j.code === 'unconfigured') {
      const err = new Error(j.error || 'Faucet not configured');
      err.code = 'unconfigured';
      throw err;
    }
    throw new Error(j.error || 'Faucet failed');
  }

  if (!j.tx) throw new Error('Faucet response invalid');

  const { Transaction: Tx } = await import('https://esm.sh/@solana/web3.js@1.95.3');
  const raw = Uint8Array.from(atob(j.tx), c => c.charCodeAt(0));
  const tx = Tx.from(raw);

  const p = getProvider();
  const { signature } = await p.signAndSendTransaction(tx);
  await conn.confirmTransaction(signature, 'confirmed');

  try {
    await fetch(CFG.faucetEndpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ wallet: state.pubkey.toBase58(), confirm: true, signature }),
    });
  } catch {}

  await refreshBalance();
  return { signature, amount: j.amount || 1000 };
}

export async function buyBadge(badgeId) {
  if (!state.pubkey) throw new Error('Connect a wallet first.');
  const price = CFG.badgePrice[badgeId];
  if (price == null) throw new Error('Unknown badge: ' + badgeId);
  if (state.balance < price) throw new Error(`Insufficient NEXUS. Need ${price}, have ${state.balance}.`);

  const userAta = state.ata;
  const treasuryAta = await getAssociatedTokenAddress(MINT, TREASURY);

  const tx = new Transaction();

  const treasuryAccInfo = await conn.getAccountInfo(treasuryAta);
  if (!treasuryAccInfo) {
    tx.add(createAssociatedTokenAccountInstruction(
      state.pubkey, treasuryAta, TREASURY, MINT,
      TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID
    ));
  }

  const amount = BigInt(price) * 10n ** BigInt(CFG.decimals);
  tx.add(createTransferInstruction(userAta, treasuryAta, state.pubkey, amount));

  tx.feePayer = state.pubkey;
  const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash();
  tx.recentBlockhash = blockhash;

  const p = getProvider();
  const { signature: paymentSig } = await p.signAndSendTransaction(tx);
  await conn.confirmTransaction({ signature: paymentSig, blockhash, lastValidBlockHeight }, 'confirmed');
  await refreshBalance();

  let r;
  try {
    r = await fetch(CFG.mintBadgeEndpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ wallet: state.pubkey.toBase58(), tier: badgeId, paymentSig }),
    });
  } catch {
    const err = new Error('Badge backend unreachable');
    err.code = 'unconfigured';
    err.paymentSig = paymentSig;
    throw err;
  }
  if (r.status === 404 || r.status === 405) {
    const err = new Error('Badge backend not deployed');
    err.code = 'unconfigured';
    err.paymentSig = paymentSig;
    throw err;
  }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    if (j.code === 'unconfigured') {
      const err = new Error(j.error || 'Badge backend not configured');
      err.code = 'unconfigured';
      err.paymentSig = paymentSig;
      throw err;
    }
    const err = new Error(j.error || `Mint failed (${r.status})`);
    err.paymentSig = paymentSig;
    throw err;
  }
  return { paymentSig, signature: j.signature, nftMint: j.nftMint, badgeId, amount: price };
}

export async function payCheckin(amountNexus = 1) {
  if (!state.pubkey) throw new Error('Connect a wallet first.');
  if (state.balance < amountNexus) {
    throw new Error(`Insufficient NEXUS. Need ${amountNexus}, have ${state.balance}. Claim from FAUCET.`);
  }

  const userAta = state.ata;
  const treasuryAta = await getAssociatedTokenAddress(MINT, TREASURY);

  const tx = new Transaction();

  const treasuryAccInfo = await conn.getAccountInfo(treasuryAta);
  if (!treasuryAccInfo) {
    tx.add(createAssociatedTokenAccountInstruction(
      state.pubkey, treasuryAta, TREASURY, MINT,
      TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID
    ));
  }

  const amount = BigInt(amountNexus) * 10n ** BigInt(CFG.decimals);
  tx.add(createTransferInstruction(userAta, treasuryAta, state.pubkey, amount));

  tx.feePayer = state.pubkey;
  const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash();
  tx.recentBlockhash = blockhash;

  const p = getProvider();
  const { signature } = await p.signAndSendTransaction(tx);
  await conn.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed');
  await refreshBalance();
  return { signature, amount: amountNexus };
}

export const ui = { fmtAddr, fmtAmount };

if (typeof window !== 'undefined') {
  window.NexusWallet = {
    CFG, state, subscribe, connect, disconnect, tryAutoConnect,
    refreshBalance, claimFaucet, buyBadge, payCheckin, fmtAddr, fmtAmount,
  };
  window.dispatchEvent(new Event('nexus-wallet-ready'));
}
