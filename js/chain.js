/* MUSIG — network helpers + live on-chain reads (JSON-RPC, no libraries). */
(function () {
  const CFG = window.MUSIG_CONFIG;

  const Chain = {
    isSingle() { return CFG.mode === "single" && !!CFG.networks[CFG.singleNetwork]; },
    primary() { return Chain.isSingle() ? CFG.singleNetwork : CFG.primaryNetwork; },
    /** Active networks for the current mode (single → 1, multi → all 4). */
    list() {
      const p = Chain.primary();
      return Object.entries(CFG.networks).map(([id, n]) => ({ id, ...n }))
        .filter((n) => !Chain.isSingle() || n.id === p)
        .sort((a, b) => (b.id === p) - (a.id === p));
    },
    get(id) { const n = CFG.networks[id]; return n ? { id, ...n } : null; },
    /** EVM networks share token.evm, Solana uses token.sol. */
    ca(id) { const n = CFG.networks[id]; return n ? ((n.type === "solana" ? CFG.token.sol : CFG.token.evm) || "").trim() : ""; },

    explorerToken(id) { const n = CFG.networks[id], a = Chain.ca(id); return n && a ? n.explorer + a : ""; },
    chartUrl(id) { const n = CFG.networks[id], a = Chain.ca(id); return n && a && n.dexscreener ? `https://dexscreener.com/${n.dexscreener}/${a}` : ""; },

    async rpc(id, method, params) {
      const n = CFG.networks[id];
      const res = await fetch(n.rpcUrls[0], {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
      });
      const j = await res.json();
      if (j.error) throw new Error(j.error.message || "RPC error");
      return j.result;
    },

    format(raw, dec) {
      const b = BigInt(raw), d = 10n ** BigInt(dec);
      const i = b / d; const f = (b % d).toString().padStart(dec, "0").replace(/0+$/, "");
      return i.toString() + (f ? "." + f : "");
    },

    async evmCall(id, to, data) {
      return Chain.rpc(id, "eth_call", [{ to, data }, "latest"]);
    },
    async evmDecimals(id, ca) {
      try { return Number(BigInt(await Chain.evmCall(id, ca, "0x313ce567"))); }
      catch { return CFG.project.decimalsFallback; }
    },

    /** Live total supply (decimal string) or null if CA not set / unreachable. */
    async totalSupply(id) {
      const n = CFG.networks[id], ca = Chain.ca(id);
      if (!n || !ca) return null;
      try {
        if (n.type === "solana") {
          const r = await Chain.rpc(id, "getTokenSupply", [ca]);
          return Chain.format(r.value.amount, r.value.decimals);
        }
        const dec = await Chain.evmDecimals(id, ca);
        return Chain.format(await Chain.evmCall(id, ca, "0x18160ddd"), dec);
      } catch { return null; }
    },
  };

  window.Chain = Chain;
})();
