// Models landing (models.html) and model detail (model.html?m=<key>).
(function () {
  const { list, byKey, PROVIDERS } = window.MODELS;
  const AB = window.AB;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const P = (m) => PROVIDERS[m.provider];
  const ord = (n) => `#${n}`;
  const share = (r) => r.rank / r.of; // lower is better
  const DOMAIN_ICON = { Coding: "code", Agentic: "smart_toy", Reasoning: "psychology", Multimodal: "imagesmode", Mathematics: "calculate", Knowledge: "menu_book" };

  /* ================= Landing ================= */
  if (document.body.dataset.view === "list") {
    const state = { q: "", provider: "", weights: "", sort: "best" };
    const provKeys = [...new Set(list.map((m) => m.provider))];
    $("#mx-providers").innerHTML = `<button class="mx-chip is-on" data-p="">All</button>` +
      provKeys.map((k) => `<button class="mx-chip" data-p="${k}"><img src="${PROVIDERS[k].logo}" alt="">${PROVIDERS[k].name}</button>`).join("");

    // featured: three quick answers
    const nWins = (m) => m.results.filter((r) => r.rank === 1).length;
    const byBest = (pool) => [...pool].filter((m) => m.best).sort((a, b) => nWins(b) - nWins(a) || share(a.best) - share(b.best) || b.best.of - a.best.of)[0];
    const bestProp = byBest(list.filter((m) => m.weights === "Proprietary"));
    const mostEval = [...list].sort((a, b) => b.results.length - a.results.length)[0];
    const bestOpen = byBest(list.filter((m) => m.weights === "Open"));
    const wins = (m) => m.results.filter((r) => r.rank === 1).length;
    const feat = [
      ["Best proprietary model", bestProp, bestProp && `#1 on ${wins(bestProp)} benchmark${wins(bestProp) === 1 ? "" : "s"}, incl. ${bestProp.best.benchmark}`],
      ["Most benchmarks evaluated", mostEval, `${mostEval.results.length} benchmarks`],
      ["Best open-weight model", bestOpen, bestOpen && `${ord(bestOpen.best.rank)} of ${bestOpen.best.of} on ${bestOpen.best.benchmark}`],
    ].filter((f) => f[1]);
    $("#mx-featured").innerHTML = feat.map(([label, m, sub]) => `
      <a class="mx-feat" href="model.html?m=${m.key}" style="--accent:${P(m).color}">
        <span class="mx-feat__label">${label}</span>
        <span class="mx-feat__name"><img src="${P(m).logo}" alt="">${esc(m.name)}</span>
        <span class="mx-feat__sub">${esc(sub)}</span>
      </a>`).join("");

    function render() {
      let items = list.filter((m) =>
        (!state.provider || m.provider === state.provider) &&
        (!state.weights || m.weights === state.weights) &&
        (!state.q || (m.name + " " + P(m).name).toLowerCase().includes(state.q)));
      const s = state.sort;
      items.sort((a, b) =>
        s === "name" ? a.name.localeCompare(b.name) :
        s === "benchmarks" ? b.results.length - a.results.length :
        (a.best ? share(a.best) : 9) - (b.best ? share(b.best) : 9) || wins(b) - wins(a) || (b.best ? b.best.of : 0) - (a.best ? a.best.of : 0));
      $("#mx-count").textContent = `${items.length} model${items.length === 1 ? "" : "s"}`;
      $("#mx-grid").innerHTML = items.map((m) => `
        <a class="mx-card" href="model.html?m=${m.key}">
          <div class="mx-card__top">
            <img src="${P(m).logo}" alt="" class="mx-card__logo">
            <div class="mx-card__id"><div class="mx-card__name">${esc(m.name)}</div><div class="mx-card__prov">${P(m).name}</div></div>
            <span class="mx-badge mx-badge--${m.weights.toLowerCase()}">${m.weights}</span>
          </div>
          <div class="mx-card__stats">
            <div><span>#1 finishes</span><b>${wins(m)}</b></div>
            <div><span>Benchmarks</span><b>${m.results.length}</b></div>
          </div>
          <div class="mx-card__best">${m.best ? `<span class="gs">emoji_events</span>Best: <b>${ord(m.best.rank)} of ${m.best.of}</b> on ${esc(m.best.benchmark)}` : "No ranked results yet"}</div>
          <div class="mx-card__bars" aria-hidden="true">${m.results.slice(0, 8).map((r) => `<i style="height:${Math.max(8, 100 - ((r.rank - 1) / Math.max(1, r.of - 1)) * 92)}%;background:${P(m).color}" title="${esc(r.benchmark)}: ${ord(r.rank)} of ${r.of}"></i>`).join("")}</div>
        </a>`).join("") || `<div class="mx-empty">No models match.</div>`;
    }
    $("#mx-q").addEventListener("input", (e) => { state.q = e.target.value.trim().toLowerCase(); render(); });
    $("#mx-weights").addEventListener("change", (e) => { state.weights = e.target.value; render(); });
    $("#mx-sort").addEventListener("change", (e) => { state.sort = e.target.value; render(); });
    $("#mx-providers").addEventListener("click", (e) => {
      const b = e.target.closest("[data-p]"); if (!b) return;
      state.provider = b.dataset.p;
      $("#mx-providers").querySelectorAll(".mx-chip").forEach((c) => c.classList.toggle("is-on", c === b));
      render();
    });
    render();
    return;
  }

  /* ================= Detail (Vals-style) ================= */
  const key = new URLSearchParams(location.search).get("m");
  const m = byKey(key) || byKey("gemini-4-argon") || list[0];
  const p = P(m);
  const root = $("#md");
  document.title = `${m.name} | Models | Kaggle`;

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const rel = m.specs.released ? m.specs.released.split("-").map(Number) : null;
  const relShort = rel ? `${MONTHS[rel[1] - 1]} ${rel[2]}, ${rel[0]}` : null;
  const relLong = rel ? `${LONG[rel[1] - 1]} ${rel[2]}, ${rel[0]}` : null;
  const tokens = (n) => (n == null ? "–" : n >= 1e6 ? (n / 1e6).toFixed(n % 1e6 ? 2 : 0).replace(/\.?0+$/, "") + "M" : Math.round(n / 1000) + "K");
  const money = (v) => (v < 1 ? v.toFixed(2) : Number.isInteger(v) ? v.toFixed(2) : v.toFixed(2));
  const MOD_ICON = { text: "title", image: "image", video: "videocam", audio: "graphic_eq", pdf: "draft" };

  // AutomationBench run (the headline numbers, like Vals Index on vals.ai)
  const ab = m.results.find((r) => r.benchmark === "AutomationBench");
  const headline = ab || m.best;
  const abAll = AB.rows.reduce((acc, r) => { const k = r.model; if (!acc[k] || acc[k].score < r.score) acc[k] = r; return acc; }, {});
  const abList = Object.values(abAll);

  const sentence = [
    `${m.name} is a${m.weights === "Open" ? "n open-weight" : ""} model from ${p.name}${relLong ? `, released ${relLong}` : ""}.`,
    ab ? ` It ranks ${ord(ab.rank)} of ${ab.of} models on <a href="automationbench.html">AutomationBench</a> with ${ab.display}.` : "",
    m.best && m.best !== ab ? ` Its best result is ${ord(m.best.rank)} of ${m.best.of} on <a href="${m.best.href}">${esc(m.best.benchmark)}</a>.` : "",
  ].join("");

  // a tick ruler showing where this model sits among all AutomationBench models
  function ruler(values, mine, lowerBetter) {
    if (mine == null || !values.length) return `<div class="vk-ruler vk-ruler--empty"></div>`;
    const lo = Math.min(...values), hi = Math.max(...values);
    const pos = (v) => (hi === lo ? 50 : 6 + ((v - lo) / (hi - lo)) * 88);
    const N = 44, me = pos(mine);
    const ticks = Array.from({ length: N }, (_, i) => {
      const x = 2 + (i / (N - 1)) * 96;
      return `<i style="left:${x}%" class="${x <= me ? "is-fill" : ""}${i % 11 === 0 ? " is-major" : ""}"></i>`;
    }).join("");
    return `<div class="vk-ruler" role="img" aria-label="Position among ${values.length} models">${ticks}<b style="left:${me}%"></b><u style="left:${pos(lo)}%"></u><u style="left:${pos(hi)}%"></u></div>`;
  }
  const lat = ab && ab.lat != null ? ab.lat * AB.meta.leaderboardTasks / 100 : null; // minutes-scale for the whole run
  const fmtLat = (s) => { const mm = Math.floor(s / 60), ss = Math.round(s % 60); return `${mm}<small>min</small> ${String(ss).padStart(2, "0")}<small>s</small>`; };

  root.innerHTML = `
    <article class="vd">
      <div class="vd__brand"><img src="${p.logo}" alt="">${esc(p.name)}</div>
      <h1 class="vd__title">${esc(m.name)}<a class="vd__ext" href="models.html" title="All models" aria-label="All models"><span class="gs">open_in_new</span></a></h1>
      <p class="vd__lede">${sentence}</p>

      ${relShort ? `<div class="vd__release">Release date: ${relShort}</div>` : ""}
      <dl class="vd-specs">
        <div><dt>Developer</dt><dd>${esc(p.name)} <span class="vd-flag" title="${p.country}">${p.flag || ""}</span></dd></div>
        <div><dt>Context window</dt><dd>${tokens(m.specs.context)}</dd></div>
        <div><dt>Max output tokens</dt><dd>${tokens(m.specs.maxOut)}</dd></div>
        <div><dt>Token costs (in/out)</dt><dd>${m.specs.price ? `$${money(m.specs.price[0])}/${money(m.specs.price[1])}` : "–"}</dd></div>
        <div><dt>Weights</dt><dd>${m.weights === "Open" ? "Open" : "Private"}</dd></div>
        <div><dt>Input modalities</dt><dd class="vd-mods">${m.specs.modalities.map((k) => `<span class="gs" title="${k}">${MOD_ICON[k] || "title"}</span>`).join("")}</dd></div>
      </dl>

      <div class="vk">
        <div class="vk__card vk__card--acc">
          <span class="vk__label">Accuracy${ab ? "" : headline ? ` · ${esc(headline.benchmark)}` : ""}</span>
          <div class="vk__value">${!headline ? "–" : headline.unit === "%" ? `${headline.value.toFixed(2)}<small>%</small>${ab && ab.ci != null ? `<em>±${ab.ci.toFixed(2)}</em>` : ""}` : esc(headline.display)}</div>
          ${ruler(abList.map((r) => r.score), ab ? ab.value : null)}
        </div>
        <div class="vk__card vk__card--cost">
          <span class="vk__label">Cost / task (AutomationBench)</span>
          <div class="vk__value">${ab && ab.cost != null ? `<small>$</small>${ab.cost.toFixed(2)}${ab.costEst ? '<em title="Estimate">est.</em>' : ""}` : "–"}</div>
          ${ruler(abList.map((r) => r.cost), ab ? ab.cost : null, true)}
        </div>
        <div class="vk__card vk__card--lat">
          <span class="vk__label" title="Full AutomationBench run at 100 tasks in parallel">Latency (full run)</span>
          <div class="vk__value">${lat != null ? fmtLat(lat) : "–"}</div>
          ${ruler(abList.map((r) => r.lat), ab ? ab.lat : null, true)}
        </div>
      </div>
      <a class="vk__source" href="automationbench.html"><img src="assets/logos/zapier.svg" alt="">AutomationBench</a>

      <div class="vt" role="tablist" aria-label="Results view">
        <button role="tab" class="is-on" aria-selected="true" data-t="acc">Accuracy</button>
        <button role="tab" aria-selected="false" data-t="cost">Cost</button>
        <button role="tab" aria-selected="false" data-t="lat">Latency</button>
        <button role="tab" aria-selected="false" data-t="ref">Refusals</button>
      </div>
      <div class="vt-head"><span>Benchmarks</span><span id="vt-col">Accuracy</span><span>Rankings</span></div>
      <div class="vt-body" id="vt-body"></div>
    </article>`;

  function rows(t) {
    const rs = m.results;
    if (!rs.length) return `<div class="vt-empty">No benchmark results yet.</div>`;
    return rs.map((r) => {
      const icon = DOMAIN_ICON[r.domain] || "leaderboard";
      let bar = 0, val = "–", rank = `${r.rank} <small>/ ${r.of}</small>`;
      if (t === "acc") {
        bar = r.unit === "%" ? r.value : (r.max ? (r.value / r.max) * 100 : 0);
        val = r.unit === "%" ? `${r.value.toFixed(2)} <small>%</small>${r.ci != null ? ` <em>±${r.ci.toFixed(2)}</em>` : ""}` : esc(r.display);
      } else if (t === "cost" && r.cost != null) {
        const maxC = Math.max(...abList.map((x) => x.cost));
        bar = (r.cost / maxC) * 100; val = `$${r.cost.toFixed(2)}${r.costEst ? " <em>est.</em>" : ""}`;
        const sorted = [...abList].sort((a, b) => a.cost - b.cost); rank = `${sorted.findIndex((x) => x.cost === r.cost) + 1} <small>/ ${sorted.length}</small>`;
      } else if (t === "lat" && r.lat != null) {
        const maxL = Math.max(...abList.map((x) => x.lat));
        bar = (r.lat / maxL) * 100; val = `${Math.floor(r.lat / 60)}m ${String(Math.round(r.lat % 60)).padStart(2, "0")}s <small>/ task</small>`;
        const sorted = [...abList].sort((a, b) => a.lat - b.lat); rank = `${sorted.findIndex((x) => x.lat === r.lat) + 1} <small>/ ${sorted.length}</small>`;
      } else if (t === "ref") {
        const run = m.runs.find((x) => x.benchmark === r.benchmark);
        val = run ? (run.reasoning === "max with fallback" ? "Fallback used" : "None reported") : "–";
        rank = "";
      } else { rank = `<small>–</small>`; }
      return `<a class="vt-row" href="${r.href}">
        <span class="vt-name"><span class="gs">${icon}</span>${esc(r.benchmark)}</span>
        <span class="vt-bar${t === "acc" ? "" : " vt-bar--alt"}"><i style="width:${Math.max(0, Math.min(100, bar))}%"></i></span>
        <span class="vt-val">${val}</span>
        <span class="vt-rank">${rank}</span>
      </a>`;
    }).join("");
  }
  const COL = { acc: "Accuracy", cost: "Cost / task", lat: "Latency", ref: "Refusals" };
  function setTab(t) {
    root.querySelectorAll(".vt button").forEach((b) => { const on = b.dataset.t === t; b.classList.toggle("is-on", on); b.setAttribute("aria-selected", on); });
    $("#vt-col").textContent = COL[t];
    $("#vt-body").innerHTML = rows(t);
  }
  root.querySelector(".vt").addEventListener("click", (e) => { const b = e.target.closest("[data-t]"); if (b) setTab(b.dataset.t); });
  setTab("acc");
})();
