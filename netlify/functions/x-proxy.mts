import type { Context } from '@netlify/functions';

const DEFAULT_KEYS = [
  'sk_c975e19bcd2a660d47f0394a38c36b49ba47ac55',
  'sk_1ec9f184450d9cb1d49f1da6d7d1615183f0aa3c',
  'sk_5579c001283809da7684dd3f0f07d98f0b783522',
  'sk_fad0ba345b42c5975afd30d292b34ccdce133150',
  'sk_508930c62a8ea2ea6fd7817ba34ed6933bd0dcb5',
  'sk_2f030cb63910be80e808c2874a976b1ba8f6fb63',
];

const KEYS = (process.env.TWEET_API_KEYS || DEFAULT_KEYS.join(',')).split(',').map(s => s.trim()).filter(Boolean);
const BASE = 'https://api.tweetapi.com';

let keyIndex = 0;
const exhausted = new Set<number>();
const cache = new Map<string, { at: number; ttl: number; status: number; body: string }>();

function nextKey(): { key: string; idx: number } | null {
  for (let i = 0; i < KEYS.length; i++) {
    const idx = (keyIndex + i) % KEYS.length;
    if (!exhausted.has(idx)) {
      keyIndex = idx;
      return { key: KEYS[idx], idx };
    }
  }
  return null;
}

async function callApi(path: string, params: Record<string, string>): Promise<{ status: number; body: string }> {
  const qs = new URLSearchParams(params).toString();
  const cacheKey = path + '?' + qs;
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.at < hit.ttl) {
    return { status: hit.status, body: hit.body };
  }
  const url = BASE + path + (qs ? '?' + qs : '');
  let last: { status: number; body: string } | null = null;
  for (let attempt = 0; attempt < KEYS.length; attempt++) {
    const k = nextKey();
    if (!k) break;
    try {
      const res = await fetch(url, { headers: { 'X-API-Key': k.key } });
      const text = await res.text();
      if (res.status === 401 || res.status === 403 || res.status === 429) {
        exhausted.add(k.idx);
        keyIndex = (k.idx + 1) % KEYS.length;
        last = { status: res.status, body: text };
        continue;
      }
      if (res.status >= 500) {
        keyIndex = (k.idx + 1) % KEYS.length;
        last = { status: res.status, body: text };
        continue;
      }
      const ttl = res.ok ? 60_000 : 5_000;
      cache.set(cacheKey, { at: Date.now(), ttl, status: res.status, body: text });
      return { status: res.status, body: text };
    } catch (err: any) {
      keyIndex = (k.idx + 1) % KEYS.length;
      last = { status: 502, body: JSON.stringify({ error: err.message }) };
    }
  }
  return last || { status: 503, body: JSON.stringify({ error: 'all keys exhausted' }) };
}

function json(body: string, status: number) {
  return new Response(body, {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-cache',
      'access-control-allow-origin': '*',
    },
  });
}

export default async function handler(req: Request, _ctx: Context) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET, OPTIONS',
        'access-control-allow-headers': 'content-type',
      },
    });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace('/.netlify/functions/x-proxy', '');
  const params = Object.fromEntries(url.searchParams.entries());

  if (path === '/api/x/profile') {
    const username = params.username || 'RialoHQ';
    const r = await callApi('/tw-v2/user/by-username', { username });
    return json(r.body, r.status);
  }
  if (path === '/api/x/tweets') {
    const userId = params.userId;
    if (!userId) return json(JSON.stringify({ error: 'userId required' }), 400);
    const args: Record<string, string> = { userId };
    if (params.cursor) args.cursor = params.cursor;
    const r = await callApi('/tw-v2/user/tweets', args);
    return json(r.body, r.status);
  }
  if (path === '/api/x/health') {
    return json(JSON.stringify({
      keys_total: KEYS.length,
      keys_exhausted: exhausted.size,
      cache_size: cache.size,
    }), 200);
  }
  return json(JSON.stringify({ error: 'unknown endpoint' }), 404);
}

export const config = {
  path: ['/api/x/*'],
};
