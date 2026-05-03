# Tale of Nexus

Community dashboard for the Rialo ecosystem, deployed on Solana Devnet. Tracks daily check-ins, social missions, on-chain badge minting, leaderboard rankings, a live chatroom, and an X post tracker. OAuth2 integration for GitHub, Discord, and X. Serverless backend via Netlify Functions.

## Live Site

https://taleofnexus.netlify.app

## Stack

- Frontend: HTML, CSS, JavaScript (no framework)
- Backend: Netlify Functions (TypeScript, esbuild)
- Blockchain: Solana Devnet via @solana/web3.js and @solana/spl-token
- NFT: Metaplex Token Metadata Program (mpl-token-metadata v2)
- Auth: OAuth2 for GitHub, Discord, and X (PKCE for X)
- Storage: Netlify Blobs (faucet cooldown, NFT mint deduplication)

## Project Structure

```
tale-of-nexus/
 site/                              Static frontend (HTML, CSS, JavaScript)
  index.html                        Application shell and page layout
  style.css                         Design system and component styles
  app.js                            Application logic and page routing
  wallet.js                         Solana wallet integration (Phantom)
  badges/
   badge-bronze.png                 Bronze badge image asset
   badge-silver.png                 Silver badge image asset
   badge-gold.png                   Gold badge image asset
   bronze.json                      Bronze NFT metadata (Metaplex standard)
   silver.json                      Silver NFT metadata (Metaplex standard)
   gold.json                        Gold NFT metadata (Metaplex standard)
 netlify/
  functions/
   faucet.mts                       NEXUS token faucet with 24h cooldown
   mint-badge.mts                   On-chain NFT minting via Metaplex
   oauth-start.mts                  OAuth2 authorization URL generation
   oauth-callback.mts               OAuth2 token exchange (GitHub, Discord, X)
   x-proxy.mts                      X API proxy with server-side key rotation
 api/                               Python API proxy (reference, not deployed)
 scripts/
  deploy-token.js                   SPL token deployment utility
  register-token-metadata.js        On-chain token metadata registration
 package.json                       Node.js dependencies
 netlify.toml                       Netlify build and redirect configuration
 .gitignore                         Excludes node_modules, secrets, and cache
 README.md                          Project documentation
```

## Features

### Overview
Landing page with project narrative and entry point for connecting a Phantom wallet.

### Mission
Social task board. Users complete actions on X and Discord to earn NEXUS points. Tasks require wallet connection. Completed tasks record an on-chain NEXUS transfer as proof.

### Redeem
Badge minting. Three tiers: Bronze (100 NEXUS), Silver (500 NEXUS), Gold (2000 NEXUS). Each mint produces a real NFT on Solana Devnet via the Metaplex Token Metadata Program. Mint address is linked to Solscan after success.

### Leaderboard
Ranking by total NEXUS points earned. Wallet connection required to enter. Username set via the Profile page.

### Chatroom
Live feed of community messages. Bot posts and user messages separated by role styling.

### X Tracker
Displays recent posts mentioning RialoHQ. Pulls data via the server-side X API proxy to keep credentials off the client.

### Profile
Account hub. Connect GitHub, Discord, and X via OAuth2. View earned badges. Set display name and avatar.

### Faucet
Header chip. Claims 1000 NEXUS per 24h window. Cooldown state persists in localStorage and displays a live countdown timer.

## Environment Variables

All secrets are managed via the Netlify dashboard. No credentials are committed to this repository.

| Variable | Description |
|---|---|
| DEPLOYER_SECRET | Solana deployer keypair (base58) used to sign faucet and mint transactions |
| NEXUS_MINT | SPL token mint address for the NEXUS token |
| SITE_ORIGIN | Canonical site URL used in OAuth callbacks and NFT metadata URIs |
| GITHUB_CLIENT_ID | GitHub OAuth App client ID |
| GITHUB_CLIENT_SECRET | GitHub OAuth App client secret |
| DISCORD_CLIENT_ID | Discord application client ID |
| DISCORD_CLIENT_SECRET | Discord application client secret |
| TWITTER_CLIENT_ID | X (Twitter) OAuth2 client ID |
| TWITTER_CLIENT_SECRET | X (Twitter) OAuth2 client secret |

## Local Development

Install dependencies:

```bash
npm install
```

Run the static frontend (no build step required):

```bash
cd site && npx serve .
```

To test Netlify Functions locally:

```bash
npx netlify dev
```

Set the required environment variables in a local `.env` file (excluded from version control).

## Deployment

The site is deployed to Netlify. Connect this repository to a Netlify project and configure the environment variables listed above via the Netlify dashboard. The build command is `npm install` and the publish directory is `site`.

## License

MIT
