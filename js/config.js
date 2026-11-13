window.MUSIG_CONFIG = {
  project: {
    name: "Musig Ai",
    ticker: "$MUS",
    symbol: "MUS",
    tagline: "Multi-Sig NFT Album Vault & Exclusive IP Ownership",
    decimalsFallback: 18,
  },

  social: {
    x: "https://x.com/multisighuman",
    xHandle: "@multisighuman",
    telegram: "", // "" = hidden Musigxyz
  },
  app: {
    label: "Go to App",
    url: "",
    comingSoonTitle: "App coming soon",
    comingSoonText: "The Musig project is currently being deployed. The app will launch soon after the final tests are completed. Follow {x} for the official launch announcement.",
  },

  mode: "single",
  singleNetwork: "robinhood",

  token: {
    evm: "0x6a0c60489c93b9e9dbf38b838a0a5344d2b8cdf7",
    sol: "",
  },

  /** CA tab selected first in multi mode */
  primaryNetwork: "solana",

  /** Multi-mode theme: accent/accent2/accent3 = neon gradient, ink = text on accent buttons, glow1/glow2 = background glows */
  theme: { accent: "#b14bff", accent2: "#22e1ff", accent3: "#ff3cac", ink: "#0a0418", glow1: "#3a0f7a", glow2: "#06395c" },

  networks: {
    solana: {
      name: "Solana",
      short: "Solana",
      type: "solana",
      native: "SOL",
      rpcUrls: ["https://api.mainnet-beta.solana.com"],
      explorer: "https://solscan.io/token/",
      dex: "Jupiter",
      dexscreener: "solana",
      wallets: "Phantom, Solflare or Backpack",
      pitch: "high-speed, low-fee settlement for music micro-ownership",
      color: "#9945FF",
      icon: "assets/networks/solana.svg",
      theme: { accent: "#9945ff", accent2: "#14f195", accent3: "#c08bff", ink: "#05140c", glow1: "#3b1a6e", glow2: "#0c3b2e" },
    },
    robinhood: {
      name: "Robinhood Chain",
      short: "Robinhood",
      type: "evm",
      chainId: 4663,
      native: "ETH",
      rpcUrls: ["https://rpc.mainnet.chain.robinhood.com"],
      explorer: "https://robinhoodchain.blockscout.com/token/",
      dex: "Uniswap",
      dexscreener: "",
      wallets: "MetaMask, Rabby or Coinbase Wallet",
      pitch: "a finance-native EVM chain built for tokenized assets",
      color: "#CCFF00",
      icon: "assets/networks/robinhood.svg",
      theme: { accent: "#ccff00", accent2: "#00f0c8", accent3: "#b14bff", ink: "#0d1a02", glow1: "#2a3a0a", glow2: "#2a0f5a" },
    },
    base: {
      name: "Base",
      short: "Base",
      type: "evm",
      chainId: 8453,
      native: "ETH",
      rpcUrls: ["https://mainnet.base.org"],
      explorer: "https://basescan.org/token/",
      dex: "Uniswap",
      dexscreener: "base",
      wallets: "MetaMask, Rabby or Coinbase Wallet",
      pitch: "onchain for everyone — artists and fans included",
      color: "#0052FF",
      icon: "assets/networks/base.svg",
      theme: { accent: "#3d7bff", accent2: "#22e1ff", accent3: "#b14bff", ink: "#ffffff", glow1: "#0a2a8a", glow2: "#2a0f6a" },
    },
    bsc: {
      name: "BNB Smart Chain",
      short: "BSC",
      type: "evm",
      chainId: 56,
      native: "BNB",
      rpcUrls: ["https://bsc-dataseed.bnbchain.org"],
      explorer: "https://bscscan.com/token/",
      dex: "PancakeSwap",
      dexscreener: "bsc",
      wallets: "MetaMask, Trust Wallet or Rabby",
      pitch: "deep liquidity and tiny fees for a global fanbase",
      color: "#F0B90B",
      icon: "assets/networks/bsc.svg",
      theme: { accent: "#f0b90b", accent2: "#ff7a1a", accent3: "#b14bff", ink: "#1e1600", glow1: "#4a3a05", glow2: "#3a0f5a" },
    },
  },

  /**
   * Mode-dependent copy. Placeholders:
   *   {ticker} {name} {short} {native} {dex} {wallets} {pitch} {chainInfo} {x}
   * Per-network copy in single mode: add networks.<id>.text = { key: "..." }.
   */
  text: {
    multi: {
      navChains: "Networks",
      heroNote: "Same CA on Robinhood · Base · BSC",
      aboutHtml: "<b>{ticker}</b> lives on <b>Solana, Robinhood Chain, Base and BNB Smart Chain</b> — so collectors can join a vault from whichever ecosystem they already call home.",
      tick: "Multichain — Solana, Robinhood, Base & BSC",
      chainsKicker: "4 networks · 1 vault culture",
      chainsTitle: "One sound. Four chains.",
      chainsNoteHtml: "Robinhood, Base and BSC share the <b>same CA</b>; Solana has its own mint. Supply is read live from each network. Only trust CAs shown here and on {x}.",
      step1: "Phantom / Solflare / Backpack for Solana. MetaMask, Rabby or Coinbase Wallet for Robinhood Chain, Base and BSC.",
      step2: "Fund your wallet with SOL, ETH (Robinhood / Base) or BNB (BSC).",
      step3: "Copy the official {ticker} CA for your network — Robinhood, Base and BSC use the same CA.",
      step4: "Paste the CA into Jupiter, Uniswap or PancakeSwap, swap and join the vault community.",
      faqQ: "Which networks is {ticker} on?",
      faqA: "Solana, Robinhood Chain, Base and BNB Smart Chain. Robinhood, Base and BSC share one contract address; Solana has its own mint.",
      roadmap: "Live on Solana, Robinhood, Base & BSC",
    },
    single: {
      navChains: "Network",
      heroNote: "Native on {name}",
      aboutHtml: "<b>{ticker}</b> is native to <b>{name}</b> — {pitch}.",
      tick: "Built on {name}",
      chainsKicker: "Home network",
      chainsTitle: "Built on {name}.",
      chainsNoteHtml: "Contract address and supply are read live from {name}. Only trust the CA shown here and on {x}.",
      step1: "Install {wallets}.",
      step2: "Fund your wallet with {native} on {name}.",
      step3: "Copy the official {ticker} contract address from the top of this page.",
      step4: "Paste the CA into {dex}, swap {native} for {ticker} and join the vault community.",
      faqQ: "Which network is {ticker} on?",
      faqA: "{name}{chainInfo}. Always verify the CA before swapping.",
      roadmap: "{name} ecosystem integrations",
    },
  },

  /** Extra tokenomics cards. value "" = hidden. Total supply is read live on-chain. */
  tokenomics: [
    { label: "Buy tax", value: "" },
    { label: "Sell tax", value: "" },
    { label: "Liquidity", value: "" },
    { label: "Contract", value: "" },
  ],
};
