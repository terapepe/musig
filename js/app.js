/* MUSIG — page logic: mode/theme, CA box, networks, tokenomics, modals, motion. */
(function () {
  const CFG = window.MUSIG_CONFIG;
  const T = CFG.project.ticker;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const short = (a, l = 6, r = 4) => (a && a.length > l + r + 3 ? a.slice(0, l) + "…" + a.slice(-r) : a || "");
  const fmt = (v, max = 2) => {
    if (v === null || v === undefined || v === "") return "—";
    const [i, f = ""] = String(v).split(".");
    const frac = f.slice(0, max).replace(/0+$/, "");
    return i.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (frac ? "." + frac : "");
  };
  const COPY_ICON = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>`;

  const App = {
    caNet: Chain.primary(),
    texts: {},
    vars: {},

    toast(msg) {
      const t = $("#toast"); t.textContent = msg; t.hidden = false;
      clearTimeout(this._tt); this._tt = setTimeout(() => (t.hidden = true), 2000);
    },
    async copy(text, label) {
      try { await navigator.clipboard.writeText(text); }
      catch { const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); }
      this.toast((label ? label + " CA" : "CA") + " copied!");
    },
    openModal(html) { $("#modalBody").innerHTML = html; $("#modal").hidden = false; document.body.style.overflow = "hidden"; },
    closeModal() { $("#modal").hidden = true; document.body.style.overflow = ""; },

    /** Single/multi: theme vars + texts (data-t / data-t-html). */
    applyMode() {
      const single = Chain.isSingle(), n = Chain.get(Chain.primary()), body = document.body;
      body.dataset.mode = single ? "single" : "multi";
      body.dataset.net = single ? n.id : "";
      const th = { ...CFG.theme, ...(single ? n.theme : {}) };
      [["--a1", th.accent], ["--a2", th.accent2], ["--a3", th.accent3], ["--ink", th.ink], ["--glow-1", th.glow1], ["--glow-2", th.glow2]]
        .forEach(([k, v]) => v && body.style.setProperty(k, v));

      this.texts = { ...CFG.text[single ? "single" : "multi"], ...(single ? n.text : {}) };
      this.vars = {
        ticker: T, name: n.name, short: n.short, native: n.native, dex: n.dex, wallets: n.wallets, pitch: n.pitch,
        chainInfo: n.type === "evm" ? ` (EVM, Chain ID ${n.chainId})` : " (SPL token)",
        x: `<a href="${esc(CFG.social.x)}" target="_blank" rel="noopener">${esc(CFG.social.xHandle)}</a>`,
      };
      $$("[data-t]").forEach((el) => (el.textContent = this.fill(el.dataset.t, false)));
      $$("[data-t-html]").forEach((el) => (el.innerHTML = this.fill(el.dataset.tHtml, true)));

      const nets = Chain.list();
      $("#netKicker").innerHTML = nets.map((x) => `<img src="${x.icon}" alt="">`).join("") + `<span>${esc(single ? "Live on " + n.name : nets.map((x) => x.short).join(" · "))}</span>`;
      $("#orbitNets").innerHTML = nets.map((x, i) => `<span class="orbit-net" style="--i:${i};--n:${nets.length};--net:${x.color}"><img src="${x.icon}" alt=""></span>`).join("");
    },
    fill(key, html) {
      return String(this.texts[key] ?? "").replace(/\{(\w+)\}/g, (m, k) => (k in this.vars ? (html || k !== "x" ? this.vars[k] : CFG.social.xHandle) : m));
    },

    bindSocial() {
      $$("[data-x-link]").forEach((a) => (a.href = CFG.social.x));
      $$("[data-x-handle]").forEach((s) => (s.textContent = CFG.social.xHandle));
      if (CFG.social.telegram) { const tg = $("#tgLink"); tg.href = CFG.social.telegram; tg.hidden = false; }
      $("#year").textContent = new Date().getFullYear();
      const words = [T, "MULTI-SIG VAULT", "NFT ALBUMS", ...Chain.list().map((n) => n.name.toUpperCase()), "CO-OWN THE MASTER", "VOTE TO LICENSE", "EXCLUSIVE IP"];
      const line = words.map((w) => `<span>${esc(w)}</span><img src="assets/art/logo.svg" alt="">`).join("");
      $("#marquee").innerHTML = line + line;
    },

    /* ---------- Hero CA box ---------- */
    renderCA() {
      const nets = Chain.list();
      $("#caTabs").hidden = nets.length < 2;
      $("#caTabs").innerHTML = nets.map((n) => `<button role="tab" class="ca-tab ${n.id === this.caNet ? "active" : ""}" style="--net:${n.color}" data-action="ca-tab" data-net="${n.id}"><img src="${n.icon}" alt="">${esc(n.short)}</button>`).join("");
      const n = Chain.get(this.caNet), ca = Chain.ca(this.caNet);
      $("#caBox").style.setProperty("--net", n.color);
      $("#caIcon").src = n.icon; $("#caIcon").alt = n.name;
      $("#caNet").textContent = n.name;
      $("#caNote").textContent = n.type === "evm" && !Chain.isSingle() ? this.fill("heroNote", false) : (Chain.isSingle() ? this.fill("heroNote", false) : "SPL mint");
      $("#caValue").textContent = ca || "Coming soon";
      $("#caValue").classList.toggle("empty", !ca);
      $("#caCopy").disabled = !ca;
      $("#caLinks").innerHTML = ca
        ? [[Chain.chartUrl(n.id), "Chart"], [Chain.explorerToken(n.id), "Explorer"]].filter((l) => l[0])
            .map(([u, t]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)} ↗</a>`).join("")
        : `<span>CA will be announced on <a href="${esc(CFG.social.x)}" target="_blank" rel="noopener">${esc(CFG.social.xHandle)}</a> — don't trust anything else.</span>`;
    },

    /* ---------- Networks (live supply) ---------- */
    renderChains() {
      $("#chainGrid").innerHTML = Chain.list().map((n) => {
        const ca = Chain.ca(n.id);
        return `<div class="chain-card" style="--net:${n.color}">
          <div class="chain-head"><img src="${n.icon}" alt=""><div><b>${esc(n.name)}</b><div class="muted small">${n.type === "solana" ? "SPL token" : "EVM · Chain ID " + n.chainId}</div></div></div>
          <div class="kv"><span>CA</span>${ca ? `<code>${esc(short(ca, 8, 6))}</code>` : `<span class="soon">Coming soon</span>`}</div>
          <div class="kv"><span>Total supply</span><b data-supply="${n.id}">${ca ? "Loading…" : "—"}</b></div>
          <div class="kv"><span>DEX</span><b>${esc(n.dex)}</b></div>
          <div class="chain-actions">
            <button class="btn btn-primary btn-sm" ${ca ? `data-action="copy" data-text="${esc(ca)}" data-label="${esc(n.short)}"` : "disabled"}>${COPY_ICON}Copy CA</button>
            ${Chain.chartUrl(n.id) ? `<a class="btn btn-ghost btn-sm" href="${esc(Chain.chartUrl(n.id))}" target="_blank" rel="noopener">Chart</a>` : ""}
            ${Chain.explorerToken(n.id) ? `<a class="btn btn-ghost btn-sm" href="${esc(Chain.explorerToken(n.id))}" target="_blank" rel="noopener">Explorer</a>` : ""}
          </div>
        </div>`;
      }).join("");
    },

    async loadSupplies() {
      const results = await Promise.all(Chain.list().map(async (n) => [n.id, Chain.ca(n.id) ? await Chain.totalSupply(n.id) : null]));
      for (const [id, v] of results) {
        const el = $(`[data-supply="${id}"]`);
        if (el && Chain.ca(id)) el.textContent = v !== null ? fmt(v, 0) : "Unavailable";
      }
      this.renderTokenomics(results);
    },

    renderTokenomics(supplies = []) {
      const live = supplies.filter(([, v]) => v !== null);
      const nets = Chain.list(), cards = [];
      if (live.length) {
        const [id, v] = live.find(([i]) => i === Chain.primary()) || live[0];
        cards.push({ label: "Total supply", value: fmt(v, 0), note: "Live on " + Chain.get(id).name });
      }
      cards.push({ label: "Ticker", value: T }, nets.length === 1
        ? { label: "Network", value: nets[0].short, note: nets[0].type === "evm" ? "EVM · Chain ID " + nets[0].chainId : "SPL token" }
        : { label: "Networks", value: String(nets.length), note: nets.map((n) => n.short).join(" · ") });
      CFG.tokenomics.filter((t) => t.value).forEach((t) => cards.push(t));
      $("#tokoCards").innerHTML = cards.map((c) => `<div class="toko-card"><span class="k">${esc(c.label)}</span><b>${esc(c.value)}</b>${c.note ? `<span class="muted small">${esc(c.note)}</span>` : ""}</div>`).join("");
    },

    copyModal() {
      return `<h3 id="modalTitle">Copy ${T} CA</h3>
        <p class="sub">Pick your network. Robinhood, Base and BSC share the same CA.</p>
        <div class="net-list">${Chain.list().map((n) => {
          const ca = Chain.ca(n.id);
          return ca
            ? `<button class="net-opt" style="--net:${n.color}" data-action="copy" data-text="${esc(ca)}" data-label="${esc(n.short)}"><img src="${n.icon}" alt=""><div><div class="n">${esc(n.name)}</div><div class="d mono">${esc(short(ca, 8, 6))}</div></div><span class="go">${COPY_ICON}Copy</span></button>`
            : `<div class="net-opt off" style="--net:${n.color}"><img src="${n.icon}" alt=""><div><div class="n">${esc(n.name)}</div><div class="d">Coming soon</div></div></div>`;
        }).join("")}</div>
        <div class="notice">Always verify the CA on ${esc(CFG.social.xHandle)} before swapping.</div>`;
    },

    handle(action, el) {
      switch (action) {
        case "toggle-nav": return $("#nav").classList.toggle("open");
        case "ca-tab": this.caNet = el.dataset.net; return this.renderCA();
        case "copy-ca": { const ca = Chain.ca(this.caNet); return ca && this.copy(ca, Chain.get(this.caNet).short); }
        case "copy": return this.copy(el.dataset.text, el.dataset.label);
        case "open-copy": {
          if (Chain.isSingle()) { const id = Chain.primary(), ca = Chain.ca(id); return ca ? this.copy(ca, Chain.get(id).short) : this.toast("CA coming soon"); }
          return this.openModal(this.copyModal());
        }
        case "close-modal": return this.closeModal();
      }
    },

    /* ---------- Motion ---------- */
    motion() {
      $("#eq").innerHTML = Array.from({ length: 28 }, (_, i) => `<i style="--d:${(i * 0.137) % 1.2}s;--h:${30 + ((i * 37) % 70)}%"></i>`).join("");
      const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))), { threshold: 0.12 });
      $$(".reveal").forEach((el) => io.observe(el));
    },

    init() {
      this.applyMode();
      this.bindSocial();
      this.renderCA();
      this.renderChains();
      this.renderTokenomics();
      this.motion();
      this.loadSupplies();
      document.addEventListener("click", (e) => {
        const el = e.target.closest("[data-action]");
        if (el) { e.preventDefault(); this.handle(el.dataset.action, el); }
        else if (e.target.closest(".nav a")) $("#nav").classList.remove("open");
      });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") this.closeModal(); });
    },
  };

  App.init();
})();
