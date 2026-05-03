import type { Context } from '@netlify/functions';
import crypto from 'node:crypto';

type Provider = 'github' | 'discord' | 'twitter';

export default async function handler(req: Request, _ctx: Context) {
  const url = new URL(req.url);
  const provider = (url.searchParams.get('provider') || '') as Provider;
  if (!['github', 'discord', 'twitter'].includes(provider)) {
    return new Response('Unknown provider', { status: 400 });
  }
  const origin = process.env.SITE_ORIGIN || url.origin;
  const redirect_uri = `${origin}/.netlify/functions/oauth-callback?provider=${provider}`;

  const state = b64url(crypto.randomBytes(16));
  const cookies: string[] = [
    `oauth_state_${provider}=${state}; Path=/; Max-Age=600; HttpOnly; SameSite=Lax; Secure`,
  ];

  let authUrl = '';
  if (provider === 'github') {
    const clientId = process.env.GITHUB_CLIENT_ID;
    if (!clientId) return new Response('Server missing GITHUB_CLIENT_ID', { status: 500 });
    authUrl = 'https://github.com/login/oauth/authorize?' + new URLSearchParams({
      client_id: clientId,
      redirect_uri,
      state,
      scope: 'read:user',
      allow_signup: 'true',
    });
  } else if (provider === 'discord') {
    const clientId = process.env.DISCORD_CLIENT_ID;
    if (!clientId) return new Response('Server missing DISCORD_CLIENT_ID', { status: 500 });
    authUrl = 'https://discord.com/oauth2/authorize?' + new URLSearchParams({
      client_id: clientId,
      redirect_uri,
      response_type: 'code',
      scope: 'identify',
      state,
      prompt: 'consent',
    });
  } else if (provider === 'twitter') {
    const clientId = process.env.TWITTER_CLIENT_ID;
    if (!clientId) return new Response('Server missing TWITTER_CLIENT_ID', { status: 500 });
    const verifier = b64url(crypto.randomBytes(32));
    const challenge = b64url(crypto.createHash('sha256').update(verifier).digest());
    cookies.push(`oauth_verifier_twitter=${verifier}; Path=/; Max-Age=600; HttpOnly; SameSite=Lax; Secure`);
    authUrl = 'https://twitter.com/i/oauth2/authorize?' + new URLSearchParams({
      client_id: clientId,
      redirect_uri,
      response_type: 'code',
      scope: 'users.read tweet.read offline.access',
      state,
      code_challenge: challenge,
      code_challenge_method: 'S256',
    });
  }

  const headers = new Headers({ Location: authUrl });
  for (const c of cookies) headers.append('Set-Cookie', c);
  return new Response(null, { status: 302, headers });
}

function b64url(buf: Buffer | Uint8Array): string {
  return Buffer.from(buf).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
