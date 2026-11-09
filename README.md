# MUSIG ($MUSIG) — Website

Multi-Sig NFT Album Vault & Exclusive IP Ownership. Static site (HTML/CSS/vanilla JS, no build step). Networks: **Solana, Robinhood Chain, Base, BSC**.

- Prominent hero CA box with network SVG, per-network tabs, **Copy CA** (no Buy buttons), Chart / Explorer links.
- `multi` mode always shows all 4 networks; `single` mode shows only one network and re-themes colors & copy for it.
- Total supply is read live on-chain (JSON-RPC, no libraries). Anything not configured is hidden or shown as "Coming soon" / "—".

## Run

`python3 -m http.server` → `http://localhost:8000`. Works on GitHub Pages / any static host.

## Configure — `js/config.js`

| Key | Purpose |
|---|---|
| `mode` | `"multi"` = always Solana + Robinhood + Base + BSC · `"single"` = only `singleNetwork` |
| `singleNetwork` | `solana` \| `robinhood` \| `base` \| `bsc` |
| `token.evm` | CA shared by Robinhood, Base and BSC (`""` = Coming soon) |
| `token.sol` | Solana mint (`""` = Coming soon) |
| `primaryNetwork` | CA tab shown first in multi mode |
| `theme` | Multi-mode neon colors (`accent`, `accent2`, `accent3`, `ink`, `glow1`, `glow2`) |
| `networks.<id>.theme` | Colors used when that network is the single network |
| `networks.<id>.rpcUrls / explorer / dexscreener / dex / wallets / native / pitch` | Network settings & values used in texts |
| `networks.<id>.text` | Optional per-network overrides of `text.single` keys |
| `text.multi / text.single` | Mode-dependent copy. Placeholders: `{ticker} {name} {short} {native} {dex} {wallets} {pitch} {chainInfo} {x}` |
| `social.x / xHandle / telegram` | Social links (Telegram hidden when empty) |
| `tokenomics[]` | Extra tokenomics cards; empty `value` = hidden |

Static section copy (vault mechanism, use cases, roadmap, FAQ) lives in `index.html`.

## Assets

- `assets/art/logo.svg`, `vault.svg`, `keys.svg` — original artwork.
- `assets/networks/*.svg` — network icons.
- `assets/img/og.png` — social share image (1200×630).
