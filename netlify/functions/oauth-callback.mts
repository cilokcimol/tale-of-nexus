import type { Context } from '@netlify/functions';

type Provider = 'github' | 'discord' | 'twitter';

interface Profile {
  provider: Provider;
  id: string;
  username: string;
  avatar?: string;
  url?: string;
  raw?: unknown;
}

export default async function handler(req: Request, _ctx: Context) {
  const url = new URL(req.url);
  const provider = (url.searchParams.get('provider') || '') as Provider;
  if (!['github', 'discord', 'twitter'].includes(provider)) {
    return new Response('Unknown provider', { status: 400 });
  }
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');
  if (error) return redirectToProfile(`?oauth_error=${encodeURIComponent(error)}`);
  if (!code || !state) return new Response('Missing code/state', { status: 400 });

  const cookies = parseCookies(req.headers.get('cookie') || '');
  const expectedState = cookies[`oauth_state_${provider}`];
  if (!expectedState || expectedState !== state) {
    return new Response('Bad state', { status: 400 });
  }

  const origin = process.env.SITE_ORIGIN || url.origin;
  const redirect_uri = `${origin}/.netlify/functions/oauth-callback?provider=${provider}`;

  let profile: Profile;
  try {
    if (provider === 'github') profile = await exchangeGithub(code, redirect_uri);
    else if (provider === 'discord') profile = await exchangeDiscord(code, redirect_uri);
    else profile = await exchangeTwitter(code, redirect_uri, cookies['oauth_verifier_twitter']);
  } catch (e: any) {
    return redirectToProfile(`?oauth_error=${encodeURIComponent(e?.message || 'exchange failed')}`);
  }

  const { raw, ...safeProfile } = profile;
  const payload = encodeURIComponent(JSON.stringify(safeProfile));
  const html = `<!doctype html><meta charset="utf-8"><title>Linked</title>
<style>body{font:14px/1.5 system-ui;background:#f3ead2;color:#181818;display:grid;place-items:center;min-height:100vh;margin:0}div{padding:20px 28px;border:1.5px solid #181818;border-radius:10px;background:#f8f1da;text-align:center}b{color:#7CD0BD}</style>
<div><b>${escapeHtml(provider.toUpperCase())}</b> linked.<br>Returning to The Nexus...</div>
<script>
(function(){
  try {
    var data = ${JSON.stringify(safeProfile)};
    var conn = JSON.parse(localStorage.getItem('rn_connect') || '{}');
    conn[${JSON.stringify(provider)}] = data;
    localStorage.setItem('rn_connect', JSON.stringify(conn));
  } catch(e){}
  if (window.opener && !window.opener.closed) {
    try { window.opener.postMessage({ type:'nexus-oauth', provider:${JSON.stringify(provider)}, profile:${JSON.stringify(safeProfile)} }, '*'); } catch(e){}
    window.close();
  } else {
    location.replace('/#profile?oauth=' + ${JSON.stringify(provider)} + '&data=' + '${payload}');
  }
})();
</script>`;
  const headers = new Headers({ 'content-type': 'text/html; charset=utf-8' });
  headers.append('Set-Cookie', `oauth_state_${provider}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure`);
  if (provider === 'twitter') headers.append('Set-Cookie', `oauth_verifier_twitter=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure`);
  return new Response(html, { status: 200, headers });

  function redirectToProfile(qs: string) {
    return new Response(null, { status: 302, headers: { Location: `/#profile${qs}` } });
  }
}

function parseCookies(s: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of s.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'": '&#39;' } as any)[c]);
}

async function exchangeGithub(code: string, redirect_uri: string): Promise<Profile> {
  const id = process.env.GITHUB_CLIENT_ID!;
  const secret = process.env.GITHUB_CLIENT_SECRET!;
  const tokRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    body: JSON.stringify({ client_id: id, client_secret: secret, code, redirect_uri }),
  });
  const tok = await tokRes.json() as any;
  if (!tok.access_token) throw new Error(tok.error_description || 'github token failed');
  const userRes = await fetch('https://api.github.com/user', {
    headers: { authorization: `Bearer ${tok.access_token}`, 'user-agent': 'TheNexus' },
  });
  const u = await userRes.json() as any;
  return {
    provider: 'github',
    id: String(u.id),
    username: u.login,
    avatar: u.avatar_url,
    url: u.html_url,
  };
}

async function exchangeDiscord(code: string, redirect_uri: string): Promise<Profile> {
  const id = process.env.DISCORD_CLIENT_ID!;
  const secret = process.env.DISCORD_CLIENT_SECRET!;
  const tokRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: id, client_secret: secret, grant_type: 'authorization_code', code, redirect_uri,
    }),
  });
  const tok = await tokRes.json() as any;
  if (!tok.access_token) throw new Error(tok.error_description || 'discord token failed');
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { authorization: `Bearer ${tok.access_token}` },
  });
  const u = await userRes.json() as any;
  const avatar = u.avatar
    ? `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png`
    : undefined;
  return {
    provider: 'discord',
    id: u.id,
    username: u.global_name || u.username,
    avatar,
    url: `https://discord.com/users/${u.id}`,
  };
}

async function exchangeTwitter(code: string, redirect_uri: string, verifier: string | undefined): Promise<Profile> {
  if (!verifier) throw new Error('Missing PKCE verifier');
  const id = process.env.TWITTER_CLIENT_ID!;
  const secret = process.env.TWITTER_CLIENT_SECRET!;
  const tokRes = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      authorization: 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'),
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri,
      code_verifier: verifier,
      client_id: id,
    }),
  });
  const tok = await tokRes.json() as any;
  if (!tok.access_token) throw new Error(tok.error_description || tok.error || 'twitter token failed');
  const userRes = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url,username,name', {
    headers: { authorization: `Bearer ${tok.access_token}` },
  });
  const j = await userRes.json() as any;
  const u = j.data;
  if (!u) throw new Error('twitter user fetch failed');
  return {
    provider: 'twitter',
    id: u.id,
    username: u.username,
    avatar: u.profile_image_url,
    url: `https://x.com/${u.username}`,
  };
}
