
const STORE = {
  CHECKIN: 'rn_checkin',
  TASKS:   'rn_tasks',
  PROFILE: 'rn_profile',
  CONNECT: 'rn_connect',
  BADGES:  'rn_badges',
  CHAT:    'rn_chat',
  SPENT:   'rn_spent',
};

const SOCIAL_TASKS = [
  { id: 't1', title: "Like Rialo's Latest Post",  desc: "Show support by liking @RialoHQ's latest announcement.", pts: 50,  url: 'https://x.com/RialoHQ' },
  { id: 't2', title: 'Retweet Latest Post',       desc: "Share the alpha. Retweet Rialo's latest post.",            pts: 100, url: 'https://x.com/RialoHQ' },
  { id: 't3', title: 'Follow @RialoHQ on X',      desc: "Stay updated with Rialo's core team.",                     pts: 150, url: 'https://x.com/intent/follow?screen_name=RialoHQ' },
  { id: 't4', title: 'Join Rialo Discord',        desc: 'Connect with builders and the core team.',                  pts: 200, url: 'https://discord.gg/RialoProtocol' },
  { id: 't5', title: 'Join Rialo Telegram',       desc: 'Get instant updates and chat with the community.',          pts: 150, url: 'https://t.me/rialoprotocol' },
];

const CHAT_TASKS = [
  { id: 'c100',  title: 'Send 100 Chats',  desc: 'Send 100 messages in the Rialo chatroom.',  pts: 200,  threshold: 100  },
  { id: 'c500',  title: 'Send 500 Chats',  desc: 'Send 500 messages in the Rialo chatroom.',  pts: 500,  threshold: 500  },
  { id: 'c1000', title: 'Send 1000 Chats', desc: 'Send 1000 messages in the Rialo chatroom.', pts: 1000, threshold: 1000 },
];

const PROVIDERS = {
  github:  { label: 'GITHUB',  url: 'https://github.com/',                              placeholder: 'github-username' },
  discord: { label: 'DISCORD', url: 'https://discord.gg/RialoProtocol',                 placeholder: '@discordhandle'  },
  twitter: { label: 'X',       url: 'https://x.com/intent/follow?screen_name=RialoHQ',  placeholder: '@xhandle'        },
};

const BADGES = [
  { id: 'bronze', label: 'BRONZE', cost: 100,  img: 'badges/badge-bronze.png' },
  { id: 'silver', label: 'SILVER', cost: 500,  img: 'badges/badge-silver.png' },
  { id: 'gold',   label: 'GOLD',   cost: 2000, img: 'badges/badge-gold.png'   },
];

const GATED_PAGES = ['social', 'redeem', 'leaderboard', 'chatroom', 'tracker', 'profile'];
const GATING_ENABLED = true;

const USER_AVATARS = {
  'EricArgent':  'user-avatars/eric.png',
  'OyenJoestar': 'user-avatars/oyen.png',
  'K.Gufran':    'user-avatars/gufran.png',
  'MAHE':        'user-avatars/mahe.png',
  'Soumya_dip':  'user-avatars/soumya.png',
  'VibeVortex':  'user-avatars/vibe.png',
  'Ar Lor':      'user-avatars/arlor.png',
  'JEAMS':       'user-avatars/jeams.png',
  'Sukanto':     'user-avatars/sukanto.png',
  'Rollins':     'user-avatars/rollins.png',
  'Elias':       'user-avatars/elias.png',
};
function avatarFor(name) {
  return USER_AVATARS[name] || '';
}

const SEED_USERS = [
  { name: 'EricArgent',  pts: 8420, badges: ['gold', 'silver', 'bronze'] },
  { name: 'OyenJoestar', pts: 6180, badges: ['gold', 'bronze'] },
  { name: 'K.Gufran',    pts: 5240, badges: ['gold'] },
  { name: 'MAHE',        pts: 4810, badges: ['silver', 'bronze'] },
  { name: 'Soumya_dip',  pts: 3970, badges: ['silver'] },
  { name: 'VibeVortex',  pts: 3110, badges: ['silver'] },
  { name: 'Ar Lor',      pts: 2480, badges: ['bronze'] },
  { name: 'JEAMS',       pts: 1990, badges: ['bronze'] },
  { name: 'Sukanto',     pts: 1320, badges: ['bronze'] },
  { name: 'Rollins',     pts: 720,  badges: [] },
  { name: 'Elias',       pts: 240,  badges: [] },
];

const SEED_CHAT = [
  { user: 'RialoBot',    role: 'bot',  text: 'Welcome to The Nexus chatroom. Be respectful and earn community points by participating.', mins: 480 },
  { user: 'EricArgent',  role: 'user', text: 'Just hit 8k points. The streak bonus is real.', mins: 240 },
  { user: 'OyenJoestar', role: 'user', text: 'Anyone here building on Rialo IPC yet?', mins: 200 },
  { user: 'K.Gufran',    role: 'user', text: 'Check the new posts mentioning RialoHQ, looks clean.', mins: 150 },
  { user: 'MAHE',        role: 'user', text: 'gm builders. coffee on, dashboard open.', mins: 120 },
  { user: 'Soumya_dip',  role: 'user', text: 'Tracker just refreshed. Engagement up nicely today.', mins: 90 },
  { user: 'VibeVortex',  role: 'user', text: 'redeemed bronze, going for silver next.', mins: 60 },
  { user: 'Ar Lor',      role: 'user', text: 'leaderboard top three is stacked this week.', mins: 45 },
  { user: 'JEAMS',       role: 'user', text: 'shipping a small project on Rialo this weekend.', mins: 30 },
  { user: 'Sukanto',     role: 'user', text: 'who is doing the daily checkin streak past 30 days?', mins: 18 },
  { user: 'Rollins',     role: 'user', text: 'tasks list is fresh, claiming now.', mins: 9 },
  { user: 'Elias',       role: 'user', text: 'first time here, this dashboard is clean.', mins: 3 },
];

const SEED_TWEETS = [
  { text: 'The Nexus public dashboard is live. Realtime Rialo signals, no noise.', likes: 1240, rt: 410 },
  { text: 'New feature: native cross chain attestations on testnet. Builder docs dropping this week.', likes: 980, rt: 260 },
  { text: 'Community call this Friday. Bring your questions on Rialo IPC.', likes: 540, rt: 120 },
  { text: 'Streaks matter. Daily checkin compounding into the leaderboard.', likes: 320, rt: 90 },
];

const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};
const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));

const getCheckin = () => load(STORE.CHECKIN, { dates: [], streak: 0 });
const getTasks   = () => load(STORE.TASKS,   { claimed: [], pending: [] });
const getProfile = () => load(STORE.PROFILE, { username: '', bio: '', avatar: '' });
const getConnect = () => load(STORE.CONNECT, {});
const getBadges  = () => load(STORE.BADGES,  []);
const getChat    = () => load(STORE.CHAT,    { messages: null, sent: 0 });
const getSpent   = () => load(STORE.SPENT,   0);

const isConnected = () => !!(typeof WALLET !== 'undefined' && WALLET && WALLET.state && WALLET.state.pubkey);
const isOAuthConnected = () => Object.keys(getConnect()).length > 0;

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initCheckin();
  renderTasks();
  renderChatTasks();
  initTaskClicks();
  loadProfileForm();
  initProfileForm();
  initConnect();
  initModal();
  initCTA();
  initRedeem();
  initLeaderboard();
  initChat();
  initTracker();
  initGateButtons();
  initWallet();
  animateStats();
  refreshAuthChip();
  refreshGates();
});

let WALLET = null;

function initWalletMenu() {
  const chip = document.getElementById('authChip');
  const menu = document.getElementById('walletMenu');
  if (!chip || !menu) return;

  const closeMenu = () => menu.setAttribute('hidden', '');
  const openMenu  = () => menu.removeAttribute('hidden');

  chip.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!WALLET.state.pubkey) {
      WALLET.connect().catch(err => toast(err.message || 'Connect failed'));
      return;
    }
    if (menu.hasAttribute('hidden')) openMenu(); else closeMenu();
  });

  document.addEventListener('click', (e) => {
    if (menu.hasAttribute('hidden')) return;
    if (e.target === menu || menu.contains(e.target)) return;
    closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  menu.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const act = btn.dataset.act;
    closeMenu();
    if (!WALLET.state.pubkey) return;
    const addr = WALLET.state.pubkey.toBase58();
    if (act === 'copy') {
      try {
        await navigator.clipboard.writeText(addr);
        toast('Address copied');
      } catch {
        toast('Could not copy');
      }
    } else if (act === 'explorer') {
      window.open('https://solscan.io/account/' + addr + '?cluster=devnet', '_blank', 'noopener');
    } else if (act === 'disconnect') {
      try { await WALLET.disconnect(); } catch {}
      toast('Wallet disconnected');
    }
  });
}

function initFaucetButton() {
  const faucet = document.getElementById('faucetBtn');
  if (!faucet) return;

  const txt = faucet.querySelector('.chip__txt');
  let faucetCooldownInterval = null;

  function cooldownKey() {
    return (WALLET && WALLET.state.pubkey) ? 'rn_faucet_cd_' + WALLET.state.pubkey : null;
  }
  function setCooldownUntil(ms) {
    const k = cooldownKey();
    if (!k) return;
    try { localStorage.setItem(k, String(ms)); } catch {}
  }
  function getCooldownUntil() {
    const k = cooldownKey();
    if (!k) return 0;
    try { return Number(localStorage.getItem(k) || 0); } catch { return 0; }
  }
  function stopFaucetTick() {
    if (faucetCooldownInterval) { clearInterval(faucetCooldownInterval); faucetCooldownInterval = null; }
  }
  function resetFaucetBtn() {
    stopFaucetTick();
    faucet.disabled = false;
    faucet.classList.remove('is-cooldown');
    if (txt) txt.textContent = 'FAUCET';
  }
  function startFaucetTick(untilMs) {
    stopFaucetTick();
    const pad = n => n.toString().padStart(2, '0');
    const tick = () => {
      const ms = Math.max(0, untilMs - Date.now());
      if (ms <= 0) { resetFaucetBtn(); return; }
      const h = Math.floor(ms / 3_600_000);
      const m = Math.floor((ms % 3_600_000) / 60_000);
      const s = Math.floor((ms % 60_000) / 1000);
      if (txt) txt.textContent = pad(h) + ':' + pad(m) + ':' + pad(s);
      faucet.classList.add('is-cooldown');
      faucet.disabled = true;
    };
    tick();
    faucetCooldownInterval = setInterval(tick, 1000);
  }

  function refreshFaucetState() {
    if (!WALLET || !WALLET.state.pubkey) {
      resetFaucetBtn();
      return;
    }
    const until = getCooldownUntil();
    if (until && until > Date.now()) {
      startFaucetTick(until);
    } else {
      resetFaucetBtn();
    }
  }

  faucet.addEventListener('click', async () => {
    if (!WALLET.state.pubkey) {
      toast('Connect wallet first');
      try { await WALLET.connect(); } catch { return; }
      if (!WALLET.state.pubkey) return;
    }
    const existing = getCooldownUntil();
    if (existing && existing > Date.now()) { showCooldownModal(existing); return; }

    faucet.disabled = true;
    if (txt) txt.textContent = 'CLAIMING...';
    try {
      const res = await WALLET.claimFaucet();
      toast('+' + (res.amount || 1000) + ' NEXUS claimed');
      const until = Date.now() + 24 * 60 * 60 * 1000;
      setCooldownUntil(until);
      startFaucetTick(until);
    } catch (e) {
      if (e && e.cooldownUntil) {
        setCooldownUntil(e.cooldownUntil);
        startFaucetTick(e.cooldownUntil);
        showCooldownModal(e.cooldownUntil);
      } else if (e && e.code === 'unconfigured') {
        toast('Faucet backend error. Try again later.');
        resetFaucetBtn();
      } else {
        toast(e.message || 'Faucet failed. Try again.');
        resetFaucetBtn();
      }
    }
  });

  return refreshFaucetState;
}


let cooldownInterval = null;
function showCooldownModal(untilMs) {
  const modal = document.getElementById('cooldownModal');
  const timer = document.getElementById('cooldownTimer');
  if (!modal || !timer) return;

  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    if (cooldownInterval) { clearInterval(cooldownInterval); cooldownInterval = null; }
  };

  modal.querySelectorAll('[data-cooldown-close]').forEach(el => {
    el.onclick = close;
  });

  const tick = () => {
    const ms = Math.max(0, untilMs - Date.now());
    if (ms <= 0) {
      timer.textContent = '00:00:00';
      timer.classList.add('is-ready');
      if (cooldownInterval) { clearInterval(cooldownInterval); cooldownInterval = null; }
      return;
    }
    const h = Math.floor(ms / 3_600_000);
    const m = Math.floor((ms % 3_600_000) / 60_000);
    const s = Math.floor((ms % 60_000) / 1000);
    const pad = n => n.toString().padStart(2, '0');
    timer.textContent = pad(h) + ':' + pad(m) + ':' + pad(s);
  };

  if (cooldownInterval) clearInterval(cooldownInterval);
  tick();
  cooldownInterval = setInterval(tick, 1000);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function initWallet() {
  const ready = () => {
    WALLET = window.NexusWallet;
    if (!WALLET) return;
    WALLET.subscribe(refreshAuthChip);
    WALLET.subscribe(renderRedeem);
    WALLET.subscribe(refreshGates);
    WALLET.tryAutoConnect();

    initWalletMenu();

    const refreshFaucetState = initFaucetButton();
    if (refreshFaucetState) WALLET.subscribe(refreshFaucetState);
  };
  if (window.NexusWallet) ready();
  else window.addEventListener('nexus-wallet-ready', ready, { once: true });
}

function initNav() {
  const buttons = document.querySelectorAll('.hdr__nav button');
  buttons.forEach(btn => btn.addEventListener('click', () => switchPage(btn.dataset.page)));
  const brand = document.querySelector('.hdr__brand');
  if (brand) brand.addEventListener('click', e => { e.preventDefault(); switchPage('overview'); });
}
function switchPage(id) {
  document.querySelectorAll('.hdr__nav button').forEach(b => b.classList.toggle('on', b.dataset.page === id));
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === 'page-' + id));
  refreshGates();
  if (id === 'overview') animateStats();
  if (id === 'leaderboard') renderLeaderboard();
  if (id === 'redeem') renderRedeem();
  if (id === 'chatroom') { renderChat(); scrollChatToBottom(); focusChatInput(); }
  if (id === 'tracker') focusTrackerInput();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function initCTA() {
  const cta = document.getElementById('ctaConnect');
  if (cta) cta.addEventListener('click', () => switchPage('profile'));
  document.querySelectorAll('.feat[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => switchPage(btn.dataset.goto));
  });
}

function initGateButtons() {
  document.querySelectorAll('[data-gate-go]').forEach(b => {
    b.addEventListener('click', async () => {
      if (!WALLET) { toast('Wallet not ready'); return; }
      try { await WALLET.connect(); }
      catch (e) { toast(e.message || 'Connect failed'); }
    });
  });
}
function refreshGates() {
  const connected = isConnected();
  const enforce = GATING_ENABLED;
  document.querySelectorAll('.page').forEach(p => {
    const id = p.id.replace('page-', '');
    const gated = GATED_PAGES.includes(id);
    p.classList.toggle('locked', enforce && gated && !connected);
  });
  const editSection = document.getElementById('editProfileSection');
  if (editSection) editSection.classList.toggle('is-locked', enforce && !connected);
  refreshAuthChip();
}
function gateOk() { return !GATING_ENABLED || isConnected(); }
function refreshAuthChip() {
  const chip = document.getElementById('authChip');
  if (!chip) return;
  if (WALLET && WALLET.state.pubkey) {
    chip.classList.add('is-connected');
    chip.textContent = WALLET.fmtAddr(WALLET.state.pubkey);
  } else if (WALLET && WALLET.state.connecting) {
    chip.classList.remove('is-connected');
    chip.textContent = 'CONNECTING...';
  } else {
    chip.classList.remove('is-connected');
    chip.textContent = 'CONNECT WALLET';
  }
}

function animateStats() {
  const checkin = getCheckin();
  const tasks = getTasks();
  const badges = getBadges();
  const targets = [
    { id: 'sv0', val: totalPoints(),        prefix: '', abbr: false },
    { id: 'sv1', val: checkin.streak || 0,  prefix: '', abbr: false },
    { id: 'sv2', val: tasks.claimed.length, prefix: '', abbr: false },
    { id: 'sv3', val: badges.length,        prefix: '', abbr: false },
  ];
  targets.forEach(t => countUp(t.id, t.val, t.prefix, t.abbr));
}
function countUp(id, target, prefix = '', abbr = false) {
  const el = document.getElementById(id);
  if (!el) return;
  const dur = 1800, t0 = performance.now();
  const fmt = v => {
    if (abbr) {
      if (v >= 1e9) return prefix + (v / 1e9).toFixed(1) + 'B';
      if (v >= 1e6) return prefix + (v / 1e6).toFixed(0) + 'M';
    }
    return prefix + v.toLocaleString();
  };
  function step(now) {
    const p = Math.min((now - t0) / dur, 1);
    const e = 1 - Math.pow(1 - p, 4);
    el.textContent = fmt(Math.round(target * e));
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}


function initCheckin() {
  const btn = document.getElementById('checkinBtn');
  if (btn) btn.addEventListener('click', doCheckin);
  renderCheckin();
}
function todayStr() { return new Date().toISOString().split('T')[0]; }
const CHECKIN_FEE_NEXUS = 1;

async function doCheckin() {
  if (!gateOk()) { toast("Connect wallet first"); if (window.NexusWallet) window.NexusWallet.connect().catch(()=>{}); return; }
  const data = getCheckin();
  const today = todayStr();
  if (data.dates.includes(today)) { toast('Already checked in today'); return; }

  if (!WALLET || !WALLET.state.pubkey) {
    toast('Connect wallet first');
    try { await WALLET.connect(); } catch { return; }
    if (!WALLET.state.pubkey) return;
  }
  if ((WALLET.state.balance || 0) < CHECKIN_FEE_NEXUS) {
    toast('Need ' + CHECKIN_FEE_NEXUS + ' NEXUS. Claim from FAUCET first.');
    return;
  }

  const btn = document.getElementById('checkinBtn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'CONFIRM IN WALLET...';
  }
  let sig;
  try {
    const res = await WALLET.payCheckin(CHECKIN_FEE_NEXUS);
    sig = res.signature;
  } catch (e) {
    toast(e.message || 'Check-in tx failed');
    renderCheckin();
    return;
  }

  const yest = new Date(); yest.setDate(yest.getDate() - 1);
  data.streak = data.dates.includes(yest.toISOString().split('T')[0]) ? data.streak + 1 : 1;
  data.dates.push(today);
  save(STORE.CHECKIN, data);
  renderCheckin();
  renderTasks();
  toast('Plus 25 NEXUS. Streak ' + data.streak + ' · TX ' + sig.slice(0, 8) + '...');
}
function renderCheckin() {
  const data = getCheckin();
  const today = todayStr();
  const done = data.dates.includes(today);

  const btn = document.getElementById('checkinBtn');
  if (btn) {
    btn.textContent = done ? 'CHECKED IN' : 'CHECK IN TODAY';
    btn.classList.toggle('is-done', done);
    btn.disabled = done;
  }

  const row = document.getElementById('streakRow');
  if (row) {
    const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
    let html = '';
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      const active = data.dates.includes(ds);
      const isToday = i === 0;
      html += `<div class="streak-day${active ? ' active' : ''}${isToday ? ' today' : ''}">
        ${days[d.getDay()]}<b>${active ? 'X' : '·'}</b>
      </div>`;
    }
    row.innerHTML = html;
  }

  const sc = document.getElementById('streakCount');
  const tc = document.getElementById('totalCheckins');
  const tp = document.getElementById('totalPts');
  if (sc) sc.textContent = data.streak;
  if (tc) tc.textContent = data.dates.length;
  if (tp) tp.textContent = totalPoints().toLocaleString();
}

function totalEarnedPoints() {
  const checkin = getCheckin();
  const tasks = getTasks();
  let pts = checkin.dates.length * 25;
  SOCIAL_TASKS.forEach(t => { if (tasks.claimed.includes(t.id)) pts += t.pts; });
  CHAT_TASKS.forEach(t => { if (tasks.claimed.includes(t.id)) pts += t.pts; });
  return pts;
}
function totalPoints() {
  return Math.max(0, totalEarnedPoints() - getSpent());
}

function renderTasks() {
  const list = document.getElementById('socialList');
  if (!list) return;
  const tasks = getTasks();
  list.innerHTML = SOCIAL_TASKS.map(t => {
    const claimed = tasks.claimed.includes(t.id);
    const pending = tasks.pending.includes(t.id);
    let btnHtml;
    if (claimed) {
      btnHtml = `<button class="task-item__btn" disabled>CLAIMED</button>`;
    } else if (pending) {
      btnHtml = `<button class="task-item__btn is-claim" data-action="claim" data-id="${t.id}">CLAIM ${t.pts}</button>`;
    } else {
      btnHtml = `<button class="task-item__btn" data-action="do" data-id="${t.id}">DO TASK</button>`;
    }
    return `
      <div class="task-item${claimed ? ' done' : ''}" data-id="${t.id}">
        <div class="task-item__check">
          <svg viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 12 10 18 20 6"/></svg>
        </div>
        <div class="task-item__info">
          <div class="task-item__title">${t.title}</div>
          <div class="task-item__desc">${t.desc}</div>
        </div>
        <span class="task-item__pts">${t.pts} NEXUS</span>
        ${btnHtml}
      </div>
    `;
  }).join('');

  const tp = document.getElementById('totalPts');
  if (tp) tp.textContent = totalPoints().toLocaleString();
}

function renderChatTasks() {
  const list = document.getElementById('chatTaskList');
  if (!list) return;
  const tasks = getTasks();
  const sent = getChat().sent || 0;
  list.innerHTML = CHAT_TASKS.map(t => {
    const claimed = tasks.claimed.includes(t.id);
    const ready = sent >= t.threshold;
    let btnHtml;
    if (claimed) {
      btnHtml = `<button class="task-item__btn" disabled>CLAIMED</button>`;
    } else if (ready) {
      btnHtml = `<button class="task-item__btn is-claim" data-action="claim" data-id="${t.id}">CLAIM ${t.pts}</button>`;
    } else {
      btnHtml = `<button class="task-item__btn" disabled>${sent} OF ${t.threshold}</button>`;
    }
    return `
      <div class="task-item${claimed ? ' done' : ''}" data-id="${t.id}">
        <div class="task-item__check">
          <svg viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 12 10 18 20 6"/></svg>
        </div>
        <div class="task-item__info">
          <div class="task-item__title">${t.title}</div>
          <div class="task-item__desc">${t.desc}</div>
        </div>
        <span class="task-item__pts">${t.pts} NEXUS</span>
        ${btnHtml}
      </div>
    `;
  }).join('');
}

function initTaskClicks() {
  const handler = async e => {
    const btn = e.target.closest('.task-item__btn');
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    if (!gateOk()) { toast("Connect wallet first"); if (window.NexusWallet) window.NexusWallet.connect().catch(()=>{}); return; }
    const t = SOCIAL_TASKS.find(x => x.id === id) || CHAT_TASKS.find(x => x.id === id);
    if (!t) return;
    const tasks = getTasks();
    if (action === 'do') {
      window.open(t.url, '_blank', 'noopener');
      if (!tasks.pending.includes(id)) tasks.pending.push(id);
      save(STORE.TASKS, tasks);
      renderTasks();
      toast('Task opened. Claim NEXUS when done');
    } else if (action === 'claim') {
      if (!WALLET || !WALLET.state.pubkey) {
        toast('Connect wallet first');
        if (WALLET) { try { await WALLET.connect(); } catch { return; } }
        if (!WALLET || !WALLET.state.pubkey) return;
      }
      if (WALLET.state.balance < 1) {
        toast('Need 1 NEXUS to confirm claim. Use FAUCET first.');
        return;
      }
      const origLabel = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'CONFIRM IN WALLET...';
      try {
        const res = await WALLET.payCheckin(1);
        if (!tasks.claimed.includes(id)) tasks.claimed.push(id);
        tasks.pending = tasks.pending.filter(x => x !== id);
        save(STORE.TASKS, tasks);
        renderTasks();
        renderChatTasks();
        renderCheckin();
        renderRedeem();
        const sigShort = (res.signature || '').slice(0, 8);
        toast('+' + t.pts + ' NEXUS claimed · TX ' + sigShort + '...');
      } catch (err) {
        btn.disabled = false;
        btn.textContent = origLabel;
        toast(err.message || 'Claim cancelled');
      }
    }
  };
  const a = document.getElementById('socialList');
  const b = document.getElementById('chatTaskList');
  if (a) a.addEventListener('click', handler);
  if (b) b.addEventListener('click', handler);
}

function loadProfileForm() {
  const p = getProfile();
  const u = document.getElementById('usernameInput');
  const b = document.getElementById('bioInput');
  if (u) u.value = p.username || '';
  if (b) b.value = p.bio || '';
  if (p.avatar) showAvatar(p.avatar);
  renderActivitySummary();
  renderMyBadges();
}
function showAvatar(dataUrl) {
  const img = document.getElementById('avatarImg');
  const ph  = document.getElementById('avatarPlaceholder');
  const rm  = document.getElementById('removeAvatarBtn');
  if (img) { img.src = dataUrl; img.style.display = 'block'; }
  if (ph)  ph.style.display = 'none';
  if (rm)  rm.style.display = 'inline-block';
}
function clearAvatar() {
  const img = document.getElementById('avatarImg');
  const ph  = document.getElementById('avatarPlaceholder');
  const rm  = document.getElementById('removeAvatarBtn');
  if (img) { img.src = ''; img.style.display = 'none'; }
  if (ph)  ph.style.display = 'block';
  if (rm)  rm.style.display = 'none';
}
function initProfileForm() {
  const saveBtn   = document.getElementById('saveProfileBtn');
  const fileInput = document.getElementById('avatarInput');
  const removeBtn = document.getElementById('removeAvatarBtn');
  if (saveBtn) saveBtn.addEventListener('click', () => {
    if (!gateOk()) { toast('Connect wallet first'); return; }
    const profile = getProfile();
    profile.username = (document.getElementById('usernameInput')?.value || '').trim();
    profile.bio      = (document.getElementById('bioInput')?.value      || '').trim();
    save(STORE.PROFILE, profile);
    const status = document.getElementById('saveStatus');
    if (status) {
      status.textContent = 'PROFILE SAVED';
      setTimeout(() => { status.textContent = ''; }, 1800);
    }
    renderActivitySummary();
    toast('Profile saved');
  });
  if (fileInput) fileInput.addEventListener('change', e => {
    if (!gateOk()) { toast('Connect wallet first'); fileInput.value = ''; return; }
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 1_500_000) { toast('Image too large. Max 1.5 MB'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target.result;
      const profile = getProfile();
      profile.avatar = dataUrl;
      save(STORE.PROFILE, profile);
      showAvatar(dataUrl);
      toast('Photo uploaded');
    };
    reader.readAsDataURL(f);
  });
  if (removeBtn) removeBtn.addEventListener('click', () => {
    const profile = getProfile();
    profile.avatar = '';
    save(STORE.PROFILE, profile);
    clearAvatar();
    toast('Photo removed');
  });
}

function connHandle(v) {
  if (!v) return '';
  if (typeof v === 'string') return v;
  return '@' + (v.username || v.id || 'linked');
}

function initConnect() {
  ingestOAuthRedirect();
  window.addEventListener('message', (ev) => {
    const d = ev.data;
    if (!d || d.type !== 'nexus-oauth' || !d.provider) return;
    const conn = getConnect();
    conn[d.provider] = d.profile;
    save(STORE.CONNECT, conn);
    renderConnections();
    toast((PROVIDERS[d.provider]?.label || d.provider.toUpperCase()) + ' linked');
  });

  document.querySelectorAll('.connect-card').forEach(card => {
    const provider = card.dataset.provider;
    const btn = card.querySelector('.connect-card__btn');
    btn.addEventListener('click', () => {
      const conn = getConnect();
      if (conn[provider]) {
        delete conn[provider];
        save(STORE.CONNECT, conn);
        renderConnections();
        toast(PROVIDERS[provider].label + ' disconnected');
      } else {
        startOAuth(provider);
      }
    });
  });
  renderConnections();
}

function startOAuth(provider) {
  const target = '/.netlify/functions/oauth-start?provider=' + encodeURIComponent(provider);
  fetch(target, { method: 'HEAD' }).then(r => {
    if (r.status === 404) {
      toast('OAuth backend not deployed yet.');
      openConnectModal(provider);
    } else {
      window.location.href = target;
    }
  }).catch(() => {
    window.location.href = target;
  });
}

function ingestOAuthRedirect() {
  const hash = window.location.hash || '';
  const i = hash.indexOf('?');
  if (i < 0) return;
  const params = new URLSearchParams(hash.slice(i + 1));
  const oauth = params.get('oauth');
  const data = params.get('data');
  const err = params.get('oauth_error');
  if (err) toast('OAuth error: ' + err);
  if (oauth && data) {
    try {
      const profile = JSON.parse(decodeURIComponent(data));
      const conn = getConnect();
      conn[oauth] = profile;
      save(STORE.CONNECT, conn);
      toast((PROVIDERS[oauth]?.label || oauth.toUpperCase()) + ' linked');
    } catch {}
  }
  const tabPart = hash.slice(0, i) || '#profile';
  history.replaceState(null, '', location.pathname + location.search + tabPart);
}

function renderConnections() {
  const conn = getConnect();
  document.querySelectorAll('.connect-card').forEach(card => {
    const provider = card.dataset.provider;
    const btn = card.querySelector('.connect-card__btn');
    const status = card.querySelector('.connect-card__status');
    if (conn[provider]) {
      card.classList.add('is-linked');
      btn.textContent = 'DISCONNECT';
      if (status) status.textContent = 'LINKED \u00b7 ' + connHandle(conn[provider]);
    } else {
      card.classList.remove('is-linked');
      btn.textContent = 'CONNECT';
      if (status) status.textContent = '';
    }
  });
  renderActivitySummary();
  refreshGates();
}

let modalProvider = null;
function initModal() {
  const modal   = document.getElementById('connectModal');
  const cancel  = document.getElementById('modalCancel');
  const close   = document.getElementById('modalClose');
  const confirm = document.getElementById('modalConfirm');
  const backdrop = modal.querySelector('.modal__backdrop');
  const input = document.getElementById('modalInput');

  const closeFn = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    modalProvider = null;
  };
  cancel.addEventListener('click', closeFn);
  close.addEventListener('click', closeFn);
  backdrop.addEventListener('click', closeFn);

  const submit = () => {
    const handle = (input.value || '').trim();
    if (!handle) { toast('Please enter your handle'); return; }
    const conn = getConnect();
    conn[modalProvider] = handle;
    save(STORE.CONNECT, conn);
    if (PROVIDERS[modalProvider]?.url) window.open(PROVIDERS[modalProvider].url, '_blank', 'noopener');
    closeFn();
    renderConnections();
    refreshGates();
    toast(PROVIDERS[modalProvider]?.label + ' connected');
  };
  confirm.addEventListener('click', submit);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
}
function openConnectModal(provider) {
  modalProvider = provider;
  const p = PROVIDERS[provider];
  const modal = document.getElementById('connectModal');
  document.getElementById('modalTitle').textContent = 'CONNECT ' + p.label;
  document.getElementById('modalDesc').textContent  = 'Enter your ' + p.label + ' handle to link your account. The ' + p.label + ' page will open so you can finish the action.';
  const input = document.getElementById('modalInput');
  input.placeholder = p.placeholder;
  input.value = '';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  setTimeout(() => input.focus(), 50);
}

function initRedeem() {
  document.querySelectorAll('[data-redeem]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.redeem;
      redeemBadge(id, btn);
    });
  });
  renderRedeem();
}
async function redeemBadge(id, btn) {
  const b = BADGES.find(x => x.id === id);
  if (!b) return;
  const owned = getBadges();
  if (owned.includes(id)) { toast('Already owned'); return; }
  if (!WALLET) { toast('Wallet not ready, please retry'); return; }
  if (!WALLET.state.pubkey) {
    toast('Connect wallet first');
    try { await WALLET.connect(); } catch { return; }
  }
  if (WALLET.state.balance < b.cost) {
    toast('Need ' + (b.cost - Math.floor(WALLET.state.balance)) + ' more NEXUS. Use FAUCET if needed.');
    return;
  }
  if (btn) { btn.disabled = true; btn.textContent = 'CONFIRM IN WALLET...'; }
  try {
    const res = await WALLET.buyBadge(id);
    owned.push(id);
    save(STORE.BADGES, owned);
    save(STORE.SPENT, getSpent() + b.cost);
    renderRedeem();
    renderMyBadges();
    renderCheckin();
    const nftMint = res.nftMint || '';
    const nftShort = nftMint.slice(0, 6) + '...' + nftMint.slice(-4);
    const solscanUrl = 'https://solscan.io/token/' + nftMint + '?cluster=devnet';
    toast(b.label + ' NFT minted: ' + nftShort + ' (opening Solscan)');
    if (nftMint) setTimeout(() => window.open(solscanUrl, '_blank', 'noopener'), 1200);
  } catch (e) {
    if (e && e.code === 'unconfigured' && e.paymentSig) {
      owned.push(id);
      save(STORE.BADGES, owned);
      save(STORE.SPENT, getSpent() + b.cost);
      renderRedeem();
      renderMyBadges();
      renderCheckin();
      toast(b.label + ' purchased. NFT mint pending backend.');
    } else {
      toast(e.message || 'Mint failed');
      if (btn) { btn.disabled = false; renderRedeem(); }
    }
  }
}
function renderRedeem() {
  const owned = getBadges();
  const balance = (WALLET && WALLET.state.balance) || 0;
  const bal = document.getElementById('redeemBalance');
  if (bal) bal.textContent = (WALLET && WALLET.state.pubkey) ? Math.floor(balance).toLocaleString() : '0';
  document.querySelectorAll('.badge-card').forEach(card => {
    const id = card.dataset.badge;
    const b  = BADGES.find(x => x.id === id);
    const btn = card.querySelector('.badge-card__btn');
    const status = card.querySelector('.badge-card__status');
    if (!b) return;
    if (owned.includes(id)) {
      card.classList.add('is-owned');
      btn.textContent = 'OWNED';
      btn.disabled = true;
      if (status) status.textContent = 'IN YOUR PROFILE';
    } else if (!WALLET || !WALLET.state.pubkey) {
      card.classList.remove('is-owned');
      btn.textContent = 'CONNECT WALLET';
      btn.disabled = false;
      btn.classList.add('btn-frame--mint');
      if (status) status.textContent = 'COSTS ' + b.cost + ' NEXUS';
    } else if (balance < b.cost) {
      card.classList.remove('is-owned');
      btn.textContent = 'NOT ENOUGH NEXUS';
      btn.disabled = true;
      btn.classList.remove('btn-frame--mint');
      if (status) status.textContent = 'NEED ' + (b.cost - Math.floor(balance)) + ' MORE NEXUS';
    } else {
      card.classList.remove('is-owned');
      btn.textContent = 'MINT FOR ' + b.cost + ' NEXUS';
      btn.disabled = false;
      btn.classList.add('btn-frame--mint');
      if (status) status.textContent = 'READY TO MINT';
    }
  });
}
function renderMyBadges() {
  const wrap = document.getElementById('myBadges');
  if (!wrap) return;
  const owned = getBadges();
  if (!owned.length) {
    wrap.innerHTML = '<span class="my-badges__empty">No badges yet. Earn NEXUS and visit the Redeem tab.</span>';
    return;
  }
  wrap.innerHTML = owned.map(id => {
    const b = BADGES.find(x => x.id === id);
    if (!b) return '';
    return `<div class="my-badges__item"><img src="${b.img}" alt="${b.label}"><span>${b.label}</span></div>`;
  }).join('');
}

function initLeaderboard() { renderLeaderboard(); }
function renderLeaderboard() {
  const body = document.getElementById('leaderboardBody');
  if (!body) return;
  const profile = getProfile();
  const meName = profile.username || 'YOU';
  const myPts = totalPoints();
  const myBadges = getBadges();
  const list = SEED_USERS.map(u => ({ ...u, isMe: false }));
  list.push({ name: meName, pts: myPts, badges: myBadges, isMe: true, avatar: profile.avatar });
  list.sort((a, b) => b.pts - a.pts);
  body.innerHTML = list.map((u, i) => {
    const rank = i + 1;
    let topClass = '';
    if (rank === 1) topClass = ' is-top1';
    else if (rank === 2) topClass = ' is-top2';
    else if (rank === 3) topClass = ' is-top3';
    const meCls = u.isMe ? ' is-me' : '';
    const initial = (u.name || 'U').slice(0, 1).toUpperCase();
    const seedAv = avatarFor(u.name);
    const av = u.isMe && u.avatar
      ? `<img src="${u.avatar}" alt="">`
      : (seedAv ? `<img src="${seedAv}" alt="">` : initial);
    const badgeImgs = (u.badges || []).slice(0, 3).map(bid => {
      const b = BADGES.find(x => x.id === bid);
      return b ? `<img src="${b.img}" alt="${b.label}">` : '';
    }).join('');
    return `
      <div class="lb-row${topClass}${meCls}">
        <span class="lb-row__rank">${rank}</span>
        <span class="lb-row__user">
          <span class="lb-row__avatar">${av}</span>
          <span>${u.name}</span>
        </span>
        <span class="lb-row__pts">${u.pts.toLocaleString()}</span>
        <span class="lb-row__bdg">${badgeImgs || '<span style="color:var(--muted);font-size:10px">none</span>'}</span>
      </div>
    `;
  }).join('');
}

function initChat() {
  const form = document.getElementById('chatForm');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    sendMessage();
  });
  ensureSeedChat();
  renderChat();
  renderChatCount();
}
function ensureSeedChat() {
  const data = getChat();
  const expectedNames = new Set(SEED_CHAT.map(m => m.user));
  const present = Array.isArray(data.messages)
    ? new Set(data.messages.filter(m => m.role !== 'me').map(m => m.user))
    : new Set();
  const hasFreshSeed = [...expectedNames].every(n => present.has(n));
  const sentMessages = Array.isArray(data.messages)
    ? data.messages.filter(m => m.role === 'me')
    : [];
  if (data.messages !== null && Array.isArray(data.messages) && hasFreshSeed) return;
  const now = Date.now();
  const seeded = SEED_CHAT.map(m => ({
    user: m.user,
    role: m.role,
    text: m.text,
    time: now - m.mins * 60_000,
  }));
  save(STORE.CHAT, { messages: [...seeded, ...sentMessages], sent: data.sent || 0 });
}
function focusChatInput() {
  const input = document.getElementById('chatInput');
  if (input && !document.querySelector('.page#page-chatroom.locked')) {
    setTimeout(() => input.focus(), 100);
  }
}
function scrollChatToBottom() {
  const log = document.getElementById('chatLog');
  if (log) log.scrollTop = log.scrollHeight;
}
function renderChat() {
  const log = document.getElementById('chatLog');
  if (!log) return;
  const data = getChat();
  const profile = getProfile();
  const myName = profile.username || 'YOU';
  const myAvatar = profile.avatar || '';
  log.innerHTML = (data.messages || []).map(m => {
    const role = m.role || 'user';
    const isMe = role === 'me';
    const isBot = role === 'bot';
    const initial = (m.user || 'U').slice(0, 1).toUpperCase();
    const seedAv = avatarFor(m.user);
    let av;
    if (isMe && myAvatar) av = `<img src="${myAvatar}" alt="">`;
    else if (isBot) av = `<img src="rialo-bot.png" alt="">`;
    else if (seedAv) av = `<img src="${seedAv}" alt="">`;
    else av = initial;
    const cls = isMe ? 'me' : (isBot ? 'bot' : '');
    return `
      <div class="msg ${cls}">
        <div class="msg__avatar">${av}</div>
        <div class="msg__body">
          <div class="msg__top">
            <span class="msg__user">${isMe ? myName : m.user}</span>
            <span class="msg__time">${formatTime(m.time)}</span>
          </div>
          <div class="msg__text">${escapeHtml(m.text)}</div>
        </div>
      </div>
    `;
  }).join('');
  scrollChatToBottom();
}
function renderChatCount() {
  const el = document.getElementById('chatSent');
  if (!el) return;
  el.textContent = (getChat().sent || 0).toLocaleString();
}
function sendMessage() {
  const input = document.getElementById('chatInput');
  if (!input) return;
  const text = (input.value || '').trim();
  if (!text) return;
  if (!gateOk()) { toast("Connect wallet first"); if (window.NexusWallet) window.NexusWallet.connect().catch(()=>{}); return; }
  const data = getChat();
  data.messages = data.messages || [];
  data.messages.push({ user: 'YOU', role: 'me', text, time: Date.now() });
  data.sent = (data.sent || 0) + 1;
  save(STORE.CHAT, data);
  input.value = '';
  renderChat();
  renderChatCount();
  renderChatTasks();
  focusChatInput();
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
function formatTime(t) {
  const diff = Math.max(0, (Date.now() - t) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

const X_API_BASE = (typeof window !== 'undefined' && window.X_API_BASE) ? window.X_API_BASE : '';
const TRACKER_TIMEOUT_MS = 75000;
const RIALO_HANDLE = 'rialohq';
const RIALO_RE = /(?:^|[^a-zA-Z0-9_])@?rialohq(?![a-zA-Z0-9_])/i;
let trackerHandle = '';
let trackerCache = { profile: null, tweets: null, at: 0, handle: '' };
let trackerLoading = false;
let trackerLoadingTimer = null;

function initTracker() {
  const form = document.getElementById('trackerForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const raw = (document.getElementById('trackerInput')?.value || '').trim().replace(/^@+/, '');
      if (!raw) { toast('Enter an X username'); return; }
      if (!/^[A-Za-z0-9_]{1,15}$/.test(raw)) { toast('Invalid X username'); return; }
      trackerHandle = raw;
      loadTracker(true);
    });
  }
  const btn = document.getElementById('trackerRefresh');
  if (btn) btn.addEventListener('click', () => { if (trackerHandle) loadTracker(true); });
  const retry = document.getElementById('trackerRetry');
  if (retry) retry.addEventListener('click', () => { if (trackerHandle) loadTracker(true); });
}
function focusTrackerInput() {
  const inp = document.getElementById('trackerInput');
  if (inp && !trackerHandle) setTimeout(() => inp.focus(), 60);
  if (!trackerHandle && !trackerLoading) setTrackerView('empty');
}
function fmtNum(n) {
  if (typeof n !== 'number' || !isFinite(n)) return '0';
  return n.toLocaleString();
}
function compactNum(n) {
  if (typeof n !== 'number' || !isFinite(n)) return '0';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return String(n);
}
function setStamp(text) {
  const stamp = document.getElementById('trkStamp');
  if (stamp) stamp.textContent = text;
}
function setTrackerView(view) {
  const card = document.getElementById('trackerCard');
  const empty = document.getElementById('trackerEmpty');
  const loading = document.getElementById('trackerLoading');
  const error = document.getElementById('trackerError');
  if (card) card.hidden = view !== 'card';
  if (empty) empty.hidden = view !== 'empty';
  if (loading) loading.hidden = view !== 'loading';
  if (error) error.hidden = view !== 'error';
}
function setTrackerError(msg) {
  const sub = document.getElementById('trkErrorSub');
  if (sub) sub.textContent = msg || 'The X data provider is slow or unavailable. Try again.';
}
function setTrackerLoadingMsg(msg) {
  const sub = document.getElementById('trkLoadingSub');
  if (sub) sub.textContent = msg;
}
async function fetchWithTimeout(url, ms) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { signal: ctrl.signal });
  } finally {
    clearTimeout(id);
  }
}
async function loadTracker(force) {
  if (trackerLoading || !trackerHandle) return;
  const fresh = trackerCache.profile && trackerCache.handle === trackerHandle && (Date.now() - trackerCache.at < 60_000);
  if (fresh && !force) { renderTracker(); return; }
  trackerLoading = true;
  setTrackerView('loading');
  setTrackerLoadingMsg('Looking up @' + trackerHandle + '. This can take up to a minute.');
  if (trackerLoadingTimer) clearTimeout(trackerLoadingTimer);
  trackerLoadingTimer = setTimeout(() => {
    setTrackerLoadingMsg('Still working. The X data provider is slow right now.');
  }, 12000);
  const submitBtn = document.getElementById('trackerSubmit');
  if (submitBtn) submitBtn.disabled = true;
  try {
    const profRes = await fetchWithTimeout(X_API_BASE + '/api/x/profile?username=' + encodeURIComponent(trackerHandle), TRACKER_TIMEOUT_MS);
    if (!profRes.ok) {
      const body = await profRes.text().catch(() => '');
      throw new Error('profile ' + profRes.status + ' ' + body.slice(0, 120));
    }
    const profJson = await profRes.json();
    const profile = profJson.data || profJson;
    if (!profile || !profile.id) throw new Error('Profile not found.');
    setTrackerLoadingMsg('Profile loaded. Fetching posts mentioning @RialoHQ.');
    const isRialoSelf = String(profile.username || trackerHandle).toLowerCase() === RIALO_HANDLE;
    const tweets = [];
    const seenIds = new Set();
    let cursor = '';
    const MAX_PAGES = isRialoSelf ? 1 : 5;
    const TARGET_MENTIONS = 60;
    for (let page = 0; page < MAX_PAGES; page++) {
      let url = X_API_BASE + '/api/x/tweets?userId=' + encodeURIComponent(profile.id);
      if (cursor) url += '&cursor=' + encodeURIComponent(cursor);
      const twRes = await fetchWithTimeout(url, TRACKER_TIMEOUT_MS);
      if (!twRes.ok) break;
      const twJson = await twRes.json();
      const batch = Array.isArray(twJson.data) ? twJson.data : (twJson.data?.tweets || twJson.tweets || []);
      if (!batch.length) break;
      let added = 0;
      for (const t of batch) {
        const id = t && (t.id || t.tweetId || t.id_str);
        if (id && seenIds.has(id)) continue;
        if (id) seenIds.add(id);
        tweets.push(t);
        added++;
      }
      const pag = twJson.pagination || twJson.data?.pagination || {};
      const next = pag.nextCursor || pag.next_cursor || pag.cursor || twJson.nextCursor;
      const mentionsSoFar = isRialoSelf ? tweets.length : tweets.filter(tweetMentionsRialo).length;
      setTrackerLoadingMsg('Scanning posts. Found ' + mentionsSoFar + ' mention' + (mentionsSoFar === 1 ? '' : 's') + ' so far.');
      if (!next || !added) break;
      if (mentionsSoFar >= TARGET_MENTIONS) break;
      cursor = next;
    }
    trackerCache = { profile, tweets, at: Date.now(), handle: trackerHandle };
    setTrackerView('card');
    renderTracker();
    if (force) toast('Loaded @' + trackerHandle);
  } catch (err) {
    console.warn('tracker load failed', err);
    let msg = 'The X data provider is slow or unavailable. Try again in a moment.';
    if (err && err.name === 'AbortError') msg = 'Request timed out. The X data provider did not respond. Try again.';
    else if (err && /404/.test(String(err.message))) msg = 'Username not found on X.';
    else if (err && /Profile not found/.test(String(err.message))) msg = 'Username not found on X.';
    setTrackerError(msg);
    setTrackerView('error');
    if (force) toast('Could not load that profile');
  } finally {
    trackerLoading = false;
    if (trackerLoadingTimer) { clearTimeout(trackerLoadingTimer); trackerLoadingTimer = null; }
    if (submitBtn) submitBtn.disabled = false;
  }
}
function tweetMentionsRialo(t) {
  if (!t) return false;
  const mentionLists = [
    t.mentions,
    t.entities && t.entities.mentions,
    t.entities && t.entities.user_mentions
  ];
  for (const ml of mentionLists) {
    if (Array.isArray(ml)) {
      for (const m of ml) {
        const h = (m && (m.username || m.screen_name)) || '';
        if (String(h).toLowerCase() === RIALO_HANDLE) return true;
      }
    }
  }
  const fields = [
    t.text, t.fullText, t.full_text, t.rawContent,
    t.quotedTweet && (t.quotedTweet.text || t.quotedTweet.fullText),
    t.retweetedTweet && (t.retweetedTweet.text || t.retweetedTweet.fullText),
    t.replyTo && (t.replyTo.username || t.replyTo.screen_name)
  ];
  for (const f of fields) {
    if (f && RIALO_RE.test(String(f))) return true;
  }
  return false;
}
function formatJoinedDate(iso) {
  if (!iso) return 'unknown';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return 'unknown';
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  return months[d.getMonth()] + ' ' + d.getFullYear();
}
function renderTracker() {
  const data = trackerCache;
  if (!data.profile) return;
  setTrackerView('card');
  const p = data.profile;
  setText('trkHandleName', (p.name || trackerHandle).toUpperCase());
  setText('trkHandleAt', '@' + (p.username || trackerHandle));
  const open = document.getElementById('trkOpen');
  if (open) open.href = 'https://x.com/' + (p.username || trackerHandle);
  const av = document.getElementById('trkAvatar');
  if (av) {
    if (p.avatar) {
      const big = String(p.avatar).replace('_normal.', '_400x400.');
      av.innerHTML = '<img src="' + big + '" alt="">';
    }
  }
  const all = data.tweets || [];
  const filtered = (String(p.username || trackerHandle).toLowerCase() === RIALO_HANDLE)
    ? all
    : all.filter(tweetMentionsRialo);

  setText('trkFollowers', fmtNum(p.followerCount));
  setText('trkPosts', fmtNum(filtered.length));
  setText('trkFollowing', fmtNum(p.followingCount));
  setText('trkJoined', formatJoinedDate(p.createdAt));

  const feed = document.getElementById('trackerFeed');
  if (feed) {
    const list = filtered.slice(0, 6);
    if (!list.length) {
      feed.innerHTML = '<div class="footnote" style="padding:14px">No recent posts from this account mention @RialoHQ.</div>';
    } else {
      feed.innerHTML = list.map(t => {
        const text = String(t.text || t.fullText || t.full_text || t.rawContent || '').slice(0, 280);
        const lk = t.likeCount || t.favoriteCount || 0;
        const rt = t.retweetCount || 0;
        const vw = t.viewCount || t.viewsCount || 0;
        const cAt = t.createdAt || t.created_at;
        const when = cAt ? formatTime(new Date(cAt).getTime()) : '';
        return `
          <div class="tweet">
            <div class="tweet__text">${escapeHtml(text)}</div>
            <div class="tweet__meta">
              <span><b>${fmtNum(lk)}</b> LIKES</span>
              <span><b>${fmtNum(rt)}</b> REPOSTS</span>
              <span><b>${compactNum(vw)}</b> VIEWS</span>
              <span>${when}</span>
            </div>
          </div>
        `;
      }).join('');
    }
  }
  const d = new Date(data.at);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  setStamp('TODAY ' + hh + ':' + mm);
}
function setText(id, t) { const el = document.getElementById(id); if (el) el.textContent = t; }
function mulberry32(a) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function renderActivitySummary() {
  const el = document.getElementById('activitySummary');
  if (!el) return;
  const profile = getProfile();
  const checkin = getCheckin();
  const tasks   = getTasks();
  const conn    = getConnect();
  const linked  = Object.keys(conn);
  const owned   = getBadges();
  const chat    = getChat();

  if (!profile.username && linked.length === 0 && checkin.dates.length === 0 && tasks.claimed.length === 0) {
    el.textContent = 'Connect your accounts above and complete tasks to populate your activity summary.';
    return;
  }
  const bits = [];
  if (profile.username) bits.push('Hi ' + profile.username + '.');
  bits.push(checkin.dates.length + ' checkins · streak ' + checkin.streak + '.');
  const totalTasks = SOCIAL_TASKS.length + CHAT_TASKS.length;
  bits.push(tasks.claimed.length + ' of ' + totalTasks + ' tasks completed.');
  bits.push(totalPoints().toLocaleString() + ' NEXUS earned.');
  if (chat.sent) bits.push(chat.sent.toLocaleString() + ' chat messages sent.');
  if (owned.length) bits.push('Badges: ' + owned.map(b => b.toUpperCase()).join(', ') + '.');
  if (linked.length) {
    const lbls = linked.map(k => PROVIDERS[k]?.label || k.toUpperCase()).join(', ');
    bits.push('Linked: ' + lbls + '.');
  }
  el.textContent = bits.join(' ');
}

let toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
}
