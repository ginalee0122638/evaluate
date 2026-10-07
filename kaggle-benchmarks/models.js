// Models landing (models.html) and model detail (model.html?m=<key>).
(function () {
  const { list, byKey, PROVIDERS } = window.MODELS;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const P = (m) => PROVIDERS[m.provider];
  const ord = (n) => `#${n}`;
  const pct = (v) => (v == null ? "–" : v.toFixed(1) + "%");

  /* ================= Landing ================= */
  if (document.body.dataset.view === "list") {
    const state = { q: "", provider: "", weights: "", sort: "best" };
    const provKeys = [...new Set(list.map((m) => m.provider))];
    $("#mx-providers").innerHTML = `<button class="mx-chip is-on" data-p="">All</button>` +
      provKeys.map((k) => `<button class="mx-chip" data-p="${k}"><img src="${PROVIDERS[k].logo}" alt="">${PROVIDERS[k].name}</button>`).join("");

    // featured: three quick answers
    const byComp = list.filter((m) => m.composite != null).sort((a, b) => b.composite - a.composite);
    const mostEval = [...list].sort((a, b) => b.results.length - a.results.length)[0];
    const bestOpen = list.filter((m) => m.weights === "Open").sort((a, b) => (a.best ? a.best.rank / a.best.of : 1) - (b.best ? b.best.rank / b.best.of : 1))[0];
    const feat = [
      ["Highest Kaggle composite", byComp[0], `${pct(byComp[0].composite)} composite`],
      ["Most benchmarks evaluated", mostEval, `${mostEval.results.length} benchmarks`],
      ["Best open-weight model", bestOpen, bestOpen && bestOpen.best ? `${ord(bestOpen.best.rank)} of ${bestOpen.best.of} on ${bestOpen.best.benchmark}` : ""],
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
        s === "best" ? (a.best ? a.best.rank / a.best.of : 9) - (b.best ? b.best.rank / b.best.of : 9) || (b.best ? b.best.of : 0) - (a.best ? a.best.of : 0) :
        (b.composite ?? -1) - (a.composite ?? -1));
      $("#mx-count").textContent = `${items.length} model${items.length === 1 ? "" : "s"}`;
      $("#mx-grid").innerHTML = items.map((m) => `
        <a class="mx-card" href="model.html?m=${m.key}">
          <div class="mx-card__top">
            <img src="${P(m).logo}" alt="" class="mx-card__logo">
            <div class="mx-card__id"><div class="mx-card__name">${esc(m.name)}</div><div class="mx-card__prov">${P(m).name}</div></div>
            <span class="mx-badge mx-badge--${m.weights.toLowerCase()}">${m.weights}</span>
          </div>
          <div class="mx-card__stats">
            <div><span>Kaggle composite</span><b>${pct(m.composite)}</b></div>
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

  /* ================= Detail ================= */
  const key = new URLSearchParams(location.search).get("m");
  const m = byKey(key) || list.find((x) => x.composite != null);
  const root = $("#md");
  document.title = `${m.name} | Models | Kaggle`;
  const p = P(m);
  const first = m.firstEvaluatedExact || m.firstEvaluated;
  const siblings = list.filter((x) => x.provider === m.provider && x.key !== m.key).slice(0, 6);
  const others = list.filter((x) => x.provider !== m.provider && x.composite != null).sort((a, b) => Math.abs(a.composite - (m.composite ?? 50)) - Math.abs(b.composite - (m.composite ?? 50))).slice(0, 4);
  const DOMAINS = ["Coding", "Agentic", "Reasoning", "Multimodal", "Mathematics", "Knowledge"];

  const sentence = [
    `${m.name} is ${m.weights === "Open" ? "an open-weight" : "a proprietary"} model from ${p.name}${first ? `, first evaluated on Kaggle in ${first}` : ""}.`,
    m.compositeRank ? ` It ranks ${ord(m.compositeRank)} of ${m.compositeOf} on the Kaggle composite with ${pct(m.composite)}.` : "",
    m.best ? ` Its best result is ${ord(m.best.rank)} of ${m.best.of} on ${m.best.benchmark}.` : "",
  ].join("");

  root.innerHTML = `
    <nav class="md-crumb"><a href="models.html">Models</a><span class="gs">chevron_right</span><span>${esc(m.name)}</span></nav>
    <header class="md-head">
      <img src="${p.logo}" alt="" class="md-logo">
      <div>
        <h1 class="md-title">${esc(m.name)}</h1>
        <div class="md-meta">
          <span>${p.name}</span><i>·</i>
          <span class="mx-badge mx-badge--${m.weights.toLowerCase()}">${m.weights === "Open" ? "Open weights" : "Proprietary"}</span>
          ${first ? `<i>·</i><span>First evaluated ${esc(first)}</span>` : ""}
        </div>
      </div>
      <a class="btn btn--outlined md-compare" href="models.html"><span class="gs">compare_arrows</span>Compare</a>
    </header>
    <p class="md-summary">${esc(sentence)}</p>

    <section class="md-kpis">
      <div class="md-kpi"><span>Kaggle composite</span><b>${pct(m.composite)}</b><small>${m.compositeRank ? `${ord(m.compositeRank)} of ${m.compositeOf} models` : "Not enough domains evaluated"}</small></div>
      <div class="md-kpi"><span>Best result</span><b>${m.best ? `${ord(m.best.rank)} of ${m.best.of}` : "–"}</b><small>${m.best ? esc(m.best.benchmark) : ""}</small></div>
      <div class="md-kpi"><span>Benchmarks evaluated</span><b>${m.results.length}</b><small>on Kaggle Benchmarks</small></div>
      <div class="md-kpi"><span>Cost per task</span><b>${m.runs.length ? "$" + Math.min(...m.runs.map((r) => r.cost)).toFixed(2) : m.specs.codingCost || "–"}</b><small>${m.runs.length ? "AutomationBench, cheapest run" : m.specs.codingCost ? "Coding benchmarks" : ""}</small></div>
    </section>

    <div class="md-grid">
      <div class="md-main">
        <section class="md-card">
          <div class="md-card__head"><h2>Benchmark results</h2>
            <label class="ab-select"><span class="ab-select__label">Sort</span><select id="md-sort"><option value="rank">Best rank</option><option value="score">Score</option><option value="name">Name</option></select><span class="gs">expand_more</span></label>
          </div>
          <div class="md-results" id="md-results"></div>
        </section>
        ${m.domains ? `
        <section class="md-card">
          <div class="md-card__head"><h2>Score by domain</h2></div>
          <div class="md-domains">${DOMAINS.map((d) => { const v = m.domains[d]; return `
            <div class="md-dom"><div class="md-dom__track"><i style="height:${v ?? 0}%;background:${p.color}"></i></div><b>${v == null ? "–" : v + "%"}</b><span>${d}</span></div>`; }).join("")}</div>
        </section>` : ""}
        ${m.runs.length ? `
        <section class="md-card">
          <div class="md-card__head"><h2>AutomationBench runs</h2><a class="md-link" href="automationbench.html">Leaderboard<span class="gs">arrow_forward</span></a></div>
          <table class="md-table"><thead><tr><th>Reasoning level</th><th class="num">Score</th><th class="num">Cost / task</th></tr></thead>
          <tbody>${m.runs.sort((a, b) => b.score - a.score).map((r) => `<tr><td><span class="tag tag--${r.reasoning.replace(/ /g, "-")}">${r.reasoning}</span></td><td class="num mono">${r.score.toFixed(2)}%</td><td class="num mono">$${r.cost.toFixed(2)}${r.est ? "†" : ""}</td></tr>`).join("")}</tbody></table>
        </section>` : ""}
      </div>

      <aside class="md-side">
        <section class="md-card">
          <div class="md-card__head"><h2>Specifications</h2></div>
          <dl class="md-specs">
            <div><dt>Developer</dt><dd>${p.name}</dd></div>
            <div><dt>Country</dt><dd>${p.country}</dd></div>
            <div><dt>Weights</dt><dd>${m.weights}</dd></div>
            ${m.specs.price ? `<div><dt>Token costs (in / out per 1M)</dt><dd class="mono">$${m.specs.price[0]} / $${m.specs.price[1]}</dd></div>` : ""}
            ${m.specs.speed ? `<div><dt>Output speed</dt><dd class="mono">${m.specs.speed}</dd></div>` : ""}
            ${m.specs.abLatency ? `<div><dt>Avg latency (AutomationBench)</dt><dd class="mono">${Math.floor(m.specs.abLatency / 60)}m ${String(m.specs.abLatency % 60).padStart(2, "0")}s</dd></div>` : ""}
            ${first ? `<div><dt>First evaluated</dt><dd>${esc(first)}</dd></div>` : ""}
          </dl>
        </section>
        ${siblings.length ? `
        <section class="md-card">
          <div class="md-card__head"><h2>More from ${p.name}</h2></div>
          <div class="md-mini">${siblings.map((x) => `<a href="model.html?m=${x.key}"><img src="${P(x).logo}" alt=""><span>${esc(x.name)}</span><b>${pct(x.composite)}</b></a>`).join("")}</div>
        </section>` : ""}
        ${others.length ? `
        <section class="md-card">
          <div class="md-card__head"><h2>Similar models</h2></div>
          <div class="md-mini">${others.map((x) => `<a href="model.html?m=${x.key}"><img src="${P(x).logo}" alt=""><span>${esc(x.name)}</span><b>${pct(x.composite)}</b></a>`).join("")}</div>
        </section>` : ""}
      </aside>
    </div>`;

  function renderResults(sort) {
    const rows = [...m.results].sort((a, b) =>
      sort === "name" ? a.benchmark.localeCompare(b.benchmark) :
      sort === "score" ? (b.unit === "%" ? b.value : 0) - (a.unit === "%" ? a.value : 0) :
      a.rank / a.of - b.rank / b.of);
    $("#md-results").innerHTML = rows.map((r) => {
      const pctile = 1 - (r.rank - 1) / Math.max(1, r.of);
      const medal = r.rank <= 3 ? `<span class="md-medal md-medal--${r.rank}">${r.rank}</span>` : "";
      return `<a class="md-row" href="${r.href}">
        <span class="md-row__name">${esc(r.benchmark)}</span>
        <span class="md-row__rank">${medal}${ord(r.rank)} <small>of ${r.of}</small></span>
        <span class="md-row__bar"><i style="width:${Math.max(4, pctile * 100)}%;background:${p.color}"></i></span>
        <span class="md-row__score mono">${esc(r.display)}</span>
      </a>`;
    }).join("") || `<div class="mx-empty">No ranked results yet.</div>`;
  }
  $("#md-sort").addEventListener("change", (e) => renderResults(e.target.value));
  renderResults("rank");
})();
