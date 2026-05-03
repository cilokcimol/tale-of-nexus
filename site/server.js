import { createServer } from 'http';
import { readFile } from 'fs';
import { extname, join, normalize } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = process.env.PORT || 8080;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
};

const TWEET_API_KEYS = (process.env.TWEET_API_KEYS || [
  'sk_c975e19bcd2a660d47f0394a38c36b49ba47ac55',
  'sk_1ec9f184450d9cb1d49f1da6d7d1615183f0aa3c',
  'sk_5579c001283809da7684dd3f0f07d98f0b783522',
  'sk_fad0ba345b42c5975afd30d292b34ccdce133150',
  'sk_508930c62a8ea2ea6fd7817ba34ed6933bd0dcb5',
  'sk_2f030cb63910be80e808c2874a976b1ba8f6fb63',
].join(',')).split(',').map(s => s.trim()).filter(Boolean);

let keyIndex = 0;
const exhausted = new Set();
const cache = new Map();

const TWEET_API_BASE = 'https://api.tweetapi.com';

function nextKey() {
  for (let i = 0; i < TWEET_API_KEYS.length; i++) {
    const idx = (keyIndex + i) % TWEET_API_KEYS.length;
    if (!exhausted.has(idx)) {
      keyIndex = idx;
      return { key: TWEET_API_KEYS[idx], idx };
    }
  }
  return null;
}

async function callTweetApi(path, params) {
  const qs = new URLSearchParams(params).toString();
  const cacheKey = path + '?' + qs;
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.at < hit.ttl) {
    return { status: hit.status, body: hit.body, fromCache: true };
  }
  const url = TWEET_API_BASE + path + (qs ? '?' + qs : '');
  let lastErr = null;
  for (let attempt = 0; attempt < TWEET_API_KEYS.length; attempt++) {
    const k = nextKey();
    if (!k) break;
    try {
      const res = await fetch(url, { headers: { 'X-API-Key': k.key } });
      const text = await res.text();
      if (res.status === 401 || res.status === 403 || res.status === 429) {
        exhausted.add(k.idx);
        keyIndex = (k.idx + 1) % TWEET_API_KEYS.length;
        lastErr = { status: res.status, body: text };
        continue;
      }
      if (res.status >= 500) {
        keyIndex = (k.idx + 1) % TWEET_API_KEYS.length;
        lastErr = { status: res.status, body: text };
        continue;
      }
      const ttl = res.ok ? 60_000 : 5_000;
      cache.set(cacheKey, { at: Date.now(), ttl, body: text, status: res.status });
      return { status: res.status, body: text, keyIdx: k.idx };
    } catch (err) {
      lastErr = { status: 502, body: JSON.stringify({ error: err.message }) };
      keyIndex = (k.idx + 1) % TWEET_API_KEYS.length;
    }
  }
  return lastErr || { status: 503, body: JSON.stringify({ error: 'all keys exhausted' }) };
}

function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  });
  res.end(body);
}

async function handleApi(req, res, parsedUrl) {
  const path = parsedUrl.pathname;
  const params = Object.fromEntries(parsedUrl.searchParams.entries());

  if (path === '/api/x/profile') {
    const username = params.username || 'RialoHQ';
    const r = await callTweetApi('/tw-v2/user/by-username', { username });
    return send(res, r.status, r.body);
  }
  if (path === '/api/x/tweets') {
    const userId = params.userId;
    if (!userId) return send(res, 400, JSON.stringify({ error: 'userId required' }));
    const args = { userId };
    if (params.cursor) args.cursor = params.cursor;
    const r = await callTweetApi('/tw-v2/user/tweets', args);
    return send(res, r.status, r.body);
  }
  if (path === '/api/x/health') {
    return send(res, 200, JSON.stringify({
      keys_total: TWEET_API_KEYS.length,
      keys_exhausted: exhausted.size,
      cache_size: cache.size,
    }));
  }
  return send(res, 404, JSON.stringify({ error: 'unknown api endpoint' }));
}

createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, 'http://x');

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    });
    res.end();
    return;
  }

  if (parsedUrl.pathname.startsWith('/api/')) {
    try { await handleApi(req, res, parsedUrl); }
    catch (err) { send(res, 500, JSON.stringify({ error: err.message })); }
    return;
  }

  const reqPath = (parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname);
  const safe = normalize(reqPath).replace(/^(\.\.\/[/\\])+/, '');
  const filePath = join(__dirname, safe);
  const ext = extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(content);
  });
}).listen(PORT, () => {
  console.log('The Nexus running at: http://localhost:' + PORT);
  console.log('TweetAPI keys loaded: ' + TWEET_API_KEYS.length);
});
