// AutomationBench page. Data lives in ab-data.js (window.AB).
(function () {
  const AB = window.AB;
  const P = AB.providers;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  /* ---------------- State ---------------- */
  const state = {
    k: 1,
    showing: "top",            // top score per model | all runs
    harness: "",
    weights: "",
    providers: new Set(Object.keys(P)),
    view: "graph",
    sort: { key: "score", dir: -1 },
    expanded: false,
  };

  const rows = AB.rows.map((r, i) => ({ ...r, id: i, harness: "Codex" }));
  const effortTag = (r) => (r.reasoning === "max with fallback" ? "Max + fallback" : r.reasoning[0].toUpperCase() + r.reasoning.slice(1));

  /* ---------------- pass@k model ----------------
     Official runs are single-attempt. pass@k is modelled so that more attempts help,
     with diminishing returns: pass@k = 1 - (1 - p)^(k^0.6). */
  const passAt = (p, k) => (k === 1 ? p : 100 * (1 - Math.pow(1 - p / 100, Math.pow(k, 0.6))));
  const parseTok = (s) => parseFloat(s) * ({ B: 1e9, M: 1e6, K: 1e3 }[s.slice(-1)] || 1);
  const fmtTok = (n) => (n >= 1e9 ? (n / 1e9).toFixed(1) + "B" : n >= 1e6 ? Math.round(n / 1e6) + "M" : Math.round(n / 1e3) + "K");
  const fmtLat = (s) => { s = Math.round(s); const m = Math.floor(s / 60), r = s % 60; return m ? `${m}m ${String(r).padStart(2, "0")}s` : `${r}s`; };
  const fmtPct = (v) => { const s = v.toFixed(2); return (s.endsWith("0") ? v.toFixed(1) : s) + "%"; };
  const fmtMoney = (v) => "$" + (v < 1 && v >= 0.1 ? v.toFixed(2) : v < 0.1 ? v.toFixed(3) : v.toFixed(2));
  const fmtTotal = (v) => "$" + (v >= 100 ? Math.round(v).toLocaleString("en-US") : v.toFixed(2));
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const modelHref = (r) => `model.html?m=${slug(r.model)}`;

  function view(r) {
    const k = state.k;
    return {
      ...r,
      s: passAt(r.score, k),
      ciK: r.ci / Math.sqrt(k),
      costK: r.cost * k,
      tokK: [fmtTok(parseTok(r.tok[0]) * k), fmtTok(parseTok(r.tok[1]) * k)],
      latK: r.lat * (1 + 0.08 * (k - 1)),
    };
  }

  function currentRows() {
    let list = rows
      .filter((r) => (!state.harness || r.harness === state.harness))
      .filter((r) => (!state.weights || r.weights === state.weights))
      .filter((r) => state.providers.has(r.provider))
      .map(view);
    if (state.showing === "top") {
      const best = new Map();
      list.forEach((r) => { if (!best.has(r.model) || best.get(r.model).s < r.s) best.set(r.model, r); });
      list = [...best.values()];
    }
    return list.sort((a, b) => b.s - a.s);
  }

  /* ---------------- Header ---------------- */
  const M = AB.meta;
  $("#ab-org").textContent = `${M.org} · ${M.updated}`;
  $("#ab-title").textContent = M.name;
  $("#ab-desc-text").textContent = M.description;
  $("#ab-desc-more").addEventListener("click", (e) => {
    const open = $("#ab-desc").classList.toggle("is-open");
    e.currentTarget.textContent = open ? "less" : "more";
  });
  $("#ab-links").innerHTML = M.links.map((l) =>
    `<a href="${l.href}" target="_blank" rel="noopener"><span class="gs">${l.icon}</span>${l.label}</a>`).join("") +
    `<a href="#methodology" id="go-method"><span class="gs">menu_book</span>Methodology</a>`;
  $("#go-method").addEventListener("click", (e) => {
    e.preventDefault();
    const tab = document.querySelector('.ab-tab[data-tab="leaderboard"]');
    if ($("#tab-leaderboard").hidden) tab.click();
    $("#methodology").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("#ab-stats").innerHTML = [
    [M.released, "Released"],
    [M.categories.join(", "), "Categories"],
    [M.modelsBenchmarked, "Models benchmarked"],
    [M.topModel, "Highest scoring model"],
  ].map(([v, l]) => `<div><dt>${l}</dt><dd>${esc(v)}</dd></div>`).join("");

  // tabs
  document.querySelectorAll(".ab-tab").forEach((t) => t.addEventListener("click", () => {
    document.querySelectorAll(".ab-tab").forEach((x) => { x.classList.toggle("is-active", x === t); x.setAttribute("aria-selected", x === t); });
    $("#tab-leaderboard").hidden = t.dataset.tab !== "leaderboard";
    $("#tab-repro").hidden = t.dataset.tab !== "repro";
    if (t.dataset.tab === "leaderboard") renderPareto(false);
  }));

  /* ---------------- Controls ---------------- */
  $("#f-harness").insertAdjacentHTML("beforeend", AB.harnesses.map((h) => `<option value="${h}">${h}</option>`).join(""));
  $("#f-harness").addEventListener("change", (e) => { state.harness = e.target.value; update(); });
  $("#f-weights").addEventListener("change", (e) => { state.weights = e.target.value; update(); });
  $("#lb-reset").addEventListener("click", () => {
    state.harness = state.weights = "";
    $("#f-harness").value = $("#f-weights").value = "";
    state.providers = new Set(Object.keys(P));
    renderProviderPop();
    update();
  });
  $("#passk").addEventListener("click", (e) => {
    const b = e.target.closest("[data-k]");
    if (!b) return;
    state.k = +b.dataset.k;
    $("#passk").querySelectorAll("[data-k]").forEach((x) => { const on = x === b; x.classList.toggle("is-on", on); x.setAttribute("aria-checked", on); });
    update();
  });
  document.querySelectorAll("[data-view]").forEach((b) => b.addEventListener("click", () => {
    state.view = b.dataset.view;
    document.querySelectorAll("[data-view]").forEach((x) => x.classList.toggle("is-on", x === b));
    update();
  }));
  document.querySelectorAll(".c-sort").forEach((th) => th.addEventListener("click", () => {
    const key = th.dataset.sort;
    state.sort = state.sort.key === key ? { key, dir: -state.sort.dir } : { key, dir: key === "cost" ? 1 : -1 };
    renderTable();
  }));
  $("#tbl-more").addEventListener("click", () => { state.expanded = !state.expanded; renderTable(); });

  // provider filter popover
  function renderProviderPop() {
    $("#pop-providers").innerHTML = `<div class="ab-pop__title">Providers</div>` + Object.entries(P).map(([key, p]) =>
      `<label class="ab-check"><input type="checkbox" value="${key}" ${state.providers.has(key) ? "checked" : ""}><span class="swatch-dot" style="background:${p.color}"></span>${p.name}</label>`).join("");
  }
  renderProviderPop();
  $("#pop-providers").addEventListener("change", (e) => {
    const v = e.target.value;
    e.target.checked ? state.providers.add(v) : state.providers.delete(v);
    update();
  });
  document.querySelector('[data-pop="providers"]').addEventListener("click", (e) => {
    e.stopPropagation();
    $("#pop-providers").hidden = !$("#pop-providers").hidden;
  });
  document.addEventListener("click", (e) => { if (!e.target.closest("#pop-providers")) $("#pop-providers").hidden = true; });

  /* ---------------- Bar graph ---------------- */
  const prevHeights = new Map();
  function niceMax(v) {
    for (const m of [25, 50, 60, 75, 100]) if (v * 1.12 <= m) return m;
    return 100;
  }
  function renderBars(list) {
    const max = niceMax(Math.max(...list.map((r) => r.s), 1));
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);
    const el = $("#bars");
    el.style.setProperty("--n", list.length);
    el.innerHTML = `
      <div class="bars__axis" aria-hidden="true">${ticks.map((t) => `<span style="bottom:${(t / max) * 100}%">${t % 1 ? t.toFixed(1) : t}%</span>`).join("")}</div>
      <div class="bars__plot">
        ${ticks.map((t) => `<div class="bars__grid" style="bottom:${(t / max) * 100}%"></div>`).join("")}
        <div class="bars__cols">
          ${list.map((r) => {
            const h = (r.s / max) * 100;
            const prev = prevHeights.has(r.id) ? prevHeights.get(r.id) : 0;
            return `<div class="bar" title="${esc(r.model)} (${effortTag(r)}) · ${fmtPct(r.s)}">
              <div class="bar__val"><b>${fmtPct(r.s)}</b><small>±${r.ciK.toFixed(1)}%</small></div>
              <div class="bar__fill" data-h="${h}" style="height:${prev}%;background:${P[r.provider].color}"></div>
            </div>`;
          }).join("")}
        </div>
      </div>
      <div></div>
      <div class="bars__labels">
        ${list.map((r) => `<a class="bar-label" href="${modelHref(r)}" title="View ${esc(r.model)}"><img src="${P[r.provider].logo}" alt=""><span>${esc(r.model)}<br>(${effortTag(r)})</span></a>`).join("")}
      </div>`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.querySelectorAll(".bar__fill").forEach((b, i) => { b.style.height = b.dataset.h + "%"; prevHeights.set(list[i].id, +b.dataset.h); });
    }));
  }

  /* ---------------- Trajectory links ---------------- */
  // Each leaderboard row opens a trajectory for one of its tasks (see ab-sim.js).
  function trajHref(r) {
    const key = ABSIM.slug(r.model + "-" + r.reasoning);
    const task = window.AB_TASKS[ABSIM.hash(key) % window.AB_TASKS.length];
    return `trajectory.html?model=${encodeURIComponent(key)}&task=${encodeURIComponent(task.id)}&trial=1`;
  }

  /* ---------------- Table ---------------- */
  function renderTable() {
    const list = currentRows();
    const { key, dir } = state.sort;
    list.sort((a, b) => dir * ((key === "cost" ? a.costK - b.costK : a.s - b.s)));
    document.querySelectorAll(".c-sort").forEach((th) => {
      const on = th.dataset.sort === key;
      th.classList.toggle("is-sorted", on);
      th.innerHTML = `${on ? `<span class="gs">${dir < 0 ? "arrow_downward" : "arrow_upward"}</span>` : ""}${th.dataset.sort === "score" ? "Score" : "Cost / Task"}`;
    });
    const LIMIT = 15;
    const shown = state.expanded ? list : list.slice(0, LIMIT);
    const rankOf = new Map(currentRows().map((r, i) => [r.id, i + 1]));
    $("#tbody").innerHTML = shown.map((r) => `
      <tr>
        <td class="c-rank">${rankOf.get(r.id)}</td>
        <td class="c-model"><a class="mcell" href="${modelHref(r)}" title="View ${esc(r.model)}"><img src="${P[r.provider].logo}" alt=""><div><div class="mcell__name">${esc(r.model)}</div><div class="mcell__sub">${P[r.provider].sub}</div></div></a></td>
        <td class="c-harness"><span class="tag">${r.harness}</span></td>
        <td class="c-reason"><span class="tag tag--${r.reasoning.replace(/ /g, "-")}">${r.reasoning}</span></td>
        <td class="c-num mono"><div>${fmtPct(r.s)}</div><small>±${r.ciK.toFixed(1)}%</small></td>
        <td class="c-num mono">${fmtMoney(r.costK)}${r.est ? '<sup title="Estimated: not published on zapier.com/benchmarks">†</sup>' : ""}</td>
        <td class="c-num mono">${fmtTotal(r.costK * AB.meta.leaderboardTasks)}${r.est ? '<sup title="Estimated: not published on zapier.com/benchmarks">†</sup>' : ""}</td>
        <td class="c-num mono">${r.tokK[0]} / ${r.tokK[1]}</td>
        <td class="c-num mono">${fmtLat(r.latK)}</td>
      </tr>`).join("");
    const more = list.length - LIMIT;
    $("#tbl-more").hidden = more <= 0;
    $("#tbl-more-label").textContent = state.expanded ? "Show less" : `See ${more} more`;
    $("#tbl-more").classList.toggle("is-open", state.expanded);
  }

  /* ---------------- Update all ---------------- */
  function update() {
    const list = currentRows();
    const empty = list.length === 0;
    $("#lb-empty").hidden = !empty;
    $("#view-graph").hidden = empty || state.view !== "graph";
    $("#view-table").hidden = empty || state.view !== "table";
    $("#lb-title").textContent = state.view === "table" ? "Complete Results" : "Leaderboard";
    $("#lb-sub").hidden = state.view !== "table";
    $("#lb-sub").textContent = AB.meta.resultsUpdated;
    if (!empty) { state.view === "graph" ? renderBars(list) : renderTable(); }
    $("#lb-note").innerHTML = state.k === 1
      ? "Score is Zapier's strict pass rate (task_completed_correctly) on the private held-out set, single attempt. † Cost estimated where Zapier doesn't publish it."
      : `pass@${state.k}: a task counts as solved if any of ${state.k} independent attempts passes every assertion. Cost and tokens cover all ${state.k} attempts. Modelled from pass@1 for this prototype.`;
    renderTrust(list);
    renderPareto(false);
  }

  /* ---------------- Why trust ---------------- */
  function renderTrust() {
    const all = rows.map(view).sort((a, b) => b.s - a.s);
    const top = all[0].s, d3 = all[0].s - all[2].s, d10 = all[0].s - all[Math.min(9, all.length - 1)].s;
    const auto = [
      [`Peak score sits at ${top.toFixed(1)}%, leaving massive runway for future model growth.`,
       `Top 3 models are separated by a ${d3.toFixed(2)}% delta. The top 10 models span a wider ${d10.toFixed(2)}% spread.`],
      [`All ${rows.length} results have been independently executed and verified on Kaggle’s platform compute.`,
       "Standardized replication eliminates self-reporting bias and hardware-delta variances."],
    ];
    $("#trust").innerHTML = AB.trust.map((t, i) => `
      <div class="trust__col"><h3>${t.title}</h3><ul>${(t.points === "auto" ? auto[i] : t.points).map((p) => `<li>${p}</li>`).join("")}</ul></div>`).join("");
  }

  /* ---------------- Methodology + citation ---------------- */
  $("#method").innerHTML = AB.methodology.map(([h, ps]) => `<h3 class="method__h">${h}</h3>${ps.map((p) => `<p>${p}</p>`).join("")}`).join("");
  $("#cite").textContent = AB.citation;
  $("#cite-copy").addEventListener("click", async (e) => {
    try { await navigator.clipboard.writeText(AB.citation); } catch (err) {}
    const b = e.currentTarget; b.querySelector(".gs").textContent = "check";
    setTimeout(() => (b.querySelector(".gs").textContent = "content_copy"), 1400);
  });

  /* ---------------- Tasks ---------------- */
  $("#tasks-title").textContent = `Tasks · ${AB.taskCount}`;
  const domains = Object.keys(AB.tasks);
  let dom = domains[0];
  function renderTasks() {
    $("#task-tabs").innerHTML = domains.map((d) => `<button role="tab" aria-selected="${d === dom}" class="pill${d === dom ? " is-on" : ""}" data-d="${d}">${d}</button>`).join("");
    $("#task-grid").innerHTML = AB.tasks[dom].map(([t, path, desc, avg]) => `
      <article class="task">
        <h3>${t}</h3>
        <div class="task__path">${path}</div>
        <p>${desc}</p>
        <div class="task__foot">
          <div><div class="task__k">Avg. score</div><div class="task__v">${avg}%</div></div>
          <div><div class="task__k">Top models</div><div class="task__logos"><img src="${P.google.logo}" alt="Google"><img src="${P.openai.logo}" alt="OpenAI"><img src="${P.anthropic.logo}" alt="Anthropic"></div></div>
        </div>
      </article>`).join("");
  }
  $("#task-tabs").addEventListener("click", (e) => { const b = e.target.closest("[data-d]"); if (b) { dom = b.dataset.d; renderTasks(); } });
  renderTasks();

  /* ================= Pareto frontier chart ================= */
  const svg = $("#pareto");
  const NS = "http://www.w3.org/2000/svg";
  let zoom = null;              // { x: [lo, hi] (log10), y: [lo, hi] } or null = auto
  let played = false;
  let pxKey = "cost";

  const xVal = (r) => (pxKey === "cost" ? r.costK : r.latK);
  const xFmt = (v) => (pxKey === "cost" ? (v >= 1 ? "$" + (+v.toFixed(2)) : "$" + v.toFixed(2)) : fmtLat(v));

  function frontierOf(list) {
    const sorted = [...list].sort((a, b) => xVal(a) - xVal(b) || b.s - a.s);
    const f = []; let best = -1;
    sorted.forEach((r) => { if (r.s > best) { f.push(r); best = r.s; } });
    return f;
  }
  function median(a) { const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; }

  function renderPareto(animate) {
    if ($("#tab-leaderboard").hidden) return;
    let list = currentRows();
    const all = list;
    const frontier = frontierOf(all);
    const fIds = new Set(frontier.map((r) => r.id));
    if ($("#p-show").value === "frontier") list = frontier;

    const box = $("#pareto-chart").getBoundingClientRect();
    const W = Math.max(320, box.width), H = document.fullscreenElement ? Math.max(420, window.innerHeight - 220) : (W < 600 ? 380 : 560);
    const m = { l: W < 600 ? 44 : 64, r: 20, t: 16, b: 56 };
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("width", W); svg.setAttribute("height", H);
    svg.innerHTML = "";
    if (!list.length) return;

    const xs = all.map(xVal), ys = all.map((r) => r.s);
    const autoX = [Math.log10(Math.min(...xs) * 0.85), Math.log10(Math.max(...xs) * 1.18)];
    const autoY = [Math.max(0, Math.floor((Math.min(...ys) - 6) / 10) * 10), Math.min(100, Math.ceil((Math.max(...ys) + 6) / 10) * 10)];
    const dx = zoom ? zoom.x : autoX, dy = zoom ? zoom.y : autoY;
    const X = (v) => m.l + ((Math.log10(v) - dx[0]) / (dx[1] - dx[0])) * (W - m.l - m.r);
    const Y = (v) => H - m.b - ((v - dy[0]) / (dy[1] - dy[0])) * (H - m.t - m.b);
    const inv = { x: (px) => dx[0] + ((px - m.l) / (W - m.l - m.r)) * (dx[1] - dx[0]), y: (py) => dy[0] + ((H - m.b - py) / (H - m.t - m.b)) * (dy[1] - dy[0]) };
    svg._scale = { m, W, H, dx, dy, inv };

    const el = (tag, attrs, parent = svg) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); parent.appendChild(n); return n; };
    const defs = el("defs", {});
    const clip = el("clipPath", { id: "plot-clip" }, defs);
    el("rect", { x: m.l, y: m.t, width: W - m.l - m.r, height: H - m.t - m.b }, clip);

    // regions: cheaper-than-median & better-than-median = efficient; the opposite = inefficient
    const mx = median(xs), my = median(ys);
    const regions = el("g", { class: "p-regions", "clip-path": "url(#plot-clip)" });
    el("rect", { x: m.l, y: m.t, width: Math.max(0, X(mx) - m.l), height: Math.max(0, Y(my) - m.t), class: "p-eff" }, regions);
    el("rect", { x: X(mx), y: Y(my), width: Math.max(0, W - m.r - X(mx)), height: Math.max(0, H - m.b - Y(my)), class: "p-ineff" }, regions);
    el("text", { x: m.l + 16, y: m.t + 28, class: "p-eff-label" }, regions).textContent = "Efficient";
    el("text", { x: W - m.r - 16, y: H - m.b - 16, "text-anchor": "end", class: "p-ineff-label" }, regions).textContent = "Inefficient";

    // grid + axes
    const grid = el("g", { class: "p-grid" });
    const yStep = (dy[1] - dy[0]) > 40 ? 10 : 5;
    for (let v = Math.ceil(dy[0] / yStep) * yStep; v <= dy[1]; v += yStep) {
      el("line", { x1: m.l, x2: W - m.r, y1: Y(v), y2: Y(v) }, grid);
      el("text", { x: m.l - 10, y: Y(v) + 4, "text-anchor": "end" }, grid).textContent = v;
    }
    const cand = pxKey === "cost"
      ? [0.05, 0.1, 0.2, 0.3, 0.5, 1, 2, 3, 5, 10, 20]
      : [15, 30, 60, 90, 120, 180, 240, 360, 600, 900, 1200];
    cand.filter((v) => Math.log10(v) >= dx[0] && Math.log10(v) <= dx[1]).forEach((v) => {
      el("line", { x1: X(v), x2: X(v), y1: m.t, y2: H - m.b, class: "p-vgrid" }, grid);
      el("text", { x: X(v), y: H - m.b + 20, "text-anchor": "middle" }, grid).textContent = xFmt(v);
    });
    el("line", { x1: m.l, x2: m.l, y1: m.t, y2: H - m.b, class: "p-axis" }, grid);
    el("line", { x1: m.l, x2: W - m.r, y1: H - m.b, y2: H - m.b, class: "p-axis" }, grid);
    el("text", { x: (m.l + W - m.r) / 2, y: H - 10, "text-anchor": "middle", class: "p-axis-title" }, grid).textContent =
      pxKey === "cost" ? `Cost per Task (USD, Log Scale)${state.k > 1 ? ` · ${state.k} attempts` : ""}` : "Avg latency (Log Scale)";
    el("text", { x: 14, y: (m.t + H - m.b) / 2, transform: `rotate(-90 14 ${(m.t + H - m.b) / 2})`, "text-anchor": "middle", class: "p-axis-title" }, grid).textContent =
      `Total Score${state.k > 1 ? ` (pass@${state.k})` : ""}`;

    const plot = el("g", { "clip-path": "url(#plot-clip)" });

    // frontier line (dashed), drawn through a mask so the dashes "draw" in
    const fPts = frontier.map((r) => [X(xVal(r)), Y(r.s)]);
    const d = fPts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
    const mask = el("mask", { id: "f-mask", maskUnits: "userSpaceOnUse" }, defs);
    const maskPath = el("path", { d, class: "f-mask-path" }, mask);
    el("path", { d, class: "f-line", mask: "url(#f-mask)" }, plot);

    // points
    const pts = el("g", { class: "p-points" }, plot);
    const order = [...list].sort((a, b) => xVal(a) - xVal(b));
    order.forEach((r, i) => {
      const onF = fIds.has(r.id);
      const g = el("g", { class: `pt${onF ? " is-frontier" : ""}`, "data-id": r.id, "data-provider": r.provider, transform: `translate(${X(xVal(r))},${Y(r.s)})`, tabindex: 0 }, pts);
      const inner = el("g", { class: "pt__in", style: `--d:${(animate || !played ? i * 45 : 0)}ms` }, g);
      el("circle", { r: 15, class: "pt__bg" }, inner);
      if (onF) el("circle", { r: 15, class: "pt__ring", style: `--d:${animate || !played ? 700 + frontier.indexOf(r) * 160 : 0}ms` }, inner);
      el("image", { href: P[r.provider].logo, x: -9, y: -9, width: 18, height: 18 }, inner);
    });

    // frontier labels
    const labels = el("g", { class: "p-labels" }, plot);
    // place each label beside its point, trying four spots and skipping ones that collide
    const placed = [...frontier.map((r) => { const x = X(xVal(r)), y = Y(r.s); return { x0: x - 17, x1: x + 17, y0: y - 17, y1: y + 17 }; })];
    const hits = (b) => placed.some((p) => b.x0 < p.x1 && b.x1 > p.x0 && b.y0 < p.y1 && b.y1 > p.y0);
    frontier.forEach((r, i) => {
      if ($("#p-show").value !== "frontier" && !list.includes(r)) return;
      const x = X(xVal(r)), y = Y(r.s);
      const t = el("text", { class: "p-label", style: `--d:${animate || !played ? 800 + i * 160 : 0}ms` }, labels);
      t.textContent = `${r.model} (${effortTag(r)})`;
      const w = t.getComputedTextLength(), h = 16;
      const spots = [
        { x: x + 20, y: y - 14, a: "start" }, { x: x + 20, y: y + 26, a: "start" },
        { x: x - 20, y: y - 14, a: "end" }, { x: x - 20, y: y + 26, a: "end" },
      ];
      const box = (sp) => (sp.a === "start" ? { x0: sp.x, x1: sp.x + w, y0: sp.y - h + 4, y1: sp.y + 4 } : { x0: sp.x - w, x1: sp.x, y0: sp.y - h + 4, y1: sp.y + 4 });
      const fits = (sp) => { const b = box(sp); return b.x0 > m.l && b.x1 < W - m.r && b.y0 > m.t; };
      const sp = spots.find((c) => fits(c) && !hits(box(c))) || spots.find(fits) || spots[0];
      t.setAttribute("x", sp.x); t.setAttribute("y", sp.y); t.setAttribute("text-anchor", sp.a);
      placed.push(box(sp));
    });

    // animation
    const len = maskPath.getTotalLength ? maskPath.getTotalLength() : 0;
    maskPath.style.strokeDasharray = len;
    maskPath.style.strokeDashoffset = animate ? len : 0;
    // before the first scroll into view, hold everything in its "pre-animation" state
    if (!played) animate = "pending";
    svg.classList.toggle("is-animating", !!animate);
    svg.classList.remove("is-in");
    if (animate === "pending") {
      maskPath.style.strokeDashoffset = len;
    } else if (animate) {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        svg.classList.add("is-in");
        maskPath.style.transition = `stroke-dashoffset 1400ms cubic-bezier(.4,0,.2,1) ${Math.min(900, order.length * 45)}ms`;
        maskPath.style.strokeDashoffset = 0;
      }));
    } else {
      svg.classList.add("is-in");
    }

    // legend
    const present = [...new Set(all.map((r) => r.provider))];
    $("#p-legend").innerHTML = Object.keys(P).filter((k) => present.includes(k) || !state.providers.has(k)).map((k) =>
      `<button class="p-leg${state.providers.has(k) ? "" : " is-off"}" data-provider="${k}"><span class="swatch-dot" style="background:${P[k].color}"></span>${P[k].name}</button>`).join("");
  }

  // tooltip + hover highlight
  const tip = $("#p-tip");
  function showTip(g) {
    const r = currentRows().find((x) => x.id === +g.dataset.id);
    if (!r) return;
    svg.classList.add("has-hover");
    svg.querySelectorAll(".pt").forEach((p) => p.classList.toggle("is-hover", p === g));
    tip.innerHTML = `<div class="p-tip__name"><img src="${P[r.provider].logo}" alt="">${esc(r.model)} <span>(${effortTag(r)})</span></div>
      <div class="p-tip__row"><span>Score${state.k > 1 ? ` (pass@${state.k})` : ""}</span><b>${fmtPct(r.s)}</b></div>
      <div class="p-tip__row"><span>Cost / task</span><b>${fmtMoney(r.costK)}${r.est ? " †" : ""}</b></div>
      <div class="p-tip__row"><span>Avg latency</span><b>${fmtLat(r.latK)}</b></div>
      ${g.classList.contains("is-frontier") ? '<div class="p-tip__f">On the Pareto frontier</div>' : ""}`;
    tip.hidden = false;
    const cb = $("#pareto-chart").getBoundingClientRect(), gb = g.getBoundingClientRect();
    let left = gb.left - cb.left + gb.width / 2 + 14, top = gb.top - cb.top - 10;
    if (left + 240 > cb.width) left = gb.left - cb.left - 254;
    tip.style.left = left + "px"; tip.style.top = Math.max(0, top) + "px";
  }
  function hideTip() { tip.hidden = true; svg.classList.remove("has-hover"); svg.querySelectorAll(".pt.is-hover").forEach((p) => p.classList.remove("is-hover")); }
  svg.addEventListener("mouseover", (e) => { const g = e.target.closest(".pt"); g ? showTip(g) : hideTip(); });
  svg.addEventListener("focusin", (e) => { const g = e.target.closest(".pt"); if (g) showTip(g); });
  svg.addEventListener("mouseleave", hideTip);

  // legend: hover highlights a provider, click toggles it
  $("#p-legend").addEventListener("mouseover", (e) => {
    const b = e.target.closest("[data-provider]"); if (!b) return;
    svg.classList.add("has-hover");
    svg.querySelectorAll(".pt").forEach((p) => p.classList.toggle("is-hover", p.dataset.provider === b.dataset.provider));
  });
  $("#p-legend").addEventListener("mouseleave", hideTip);
  $("#p-legend").addEventListener("click", (e) => {
    const b = e.target.closest("[data-provider]"); if (!b) return;
    const k = b.dataset.provider;
    state.providers.has(k) ? state.providers.delete(k) : state.providers.add(k);
    renderProviderPop(); update();
  });

  // zoom (wheel) + pan (drag) + reset (double-click)
  svg.addEventListener("wheel", (e) => {
    const s = svg._scale; if (!s) return;
    e.preventDefault();
    const pt = svg.getBoundingClientRect();
    const px = ((e.clientX - pt.left) / pt.width) * s.W, py = ((e.clientY - pt.top) / pt.height) * s.H;
    const cx = s.inv.x(px), cy = s.inv.y(py), f = e.deltaY > 0 ? 1.15 : 1 / 1.15;
    zoom = { x: [cx - (cx - s.dx[0]) * f, cx + (s.dx[1] - cx) * f], y: [cy - (cy - s.dy[0]) * f, cy + (s.dy[1] - cy) * f] };
    hideTip(); renderPareto(false);
  }, { passive: false });
  let drag = null;
  svg.addEventListener("pointerdown", (e) => { if (e.target.closest(".pt")) return; drag = { x: e.clientX, y: e.clientY, s: svg._scale }; svg.setPointerCapture(e.pointerId); svg.classList.add("is-dragging"); });
  svg.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const s = drag.s, r = svg.getBoundingClientRect();
    const ddx = ((e.clientX - drag.x) / r.width) * s.W / (s.W - s.m.l - s.m.r) * (s.dx[1] - s.dx[0]);
    const ddy = ((e.clientY - drag.y) / r.height) * s.H / (s.H - s.m.t - s.m.b) * (s.dy[1] - s.dy[0]);
    zoom = { x: [s.dx[0] - ddx, s.dx[1] - ddx], y: [s.dy[0] + ddy, s.dy[1] + ddy] };
    renderPareto(false);
  });
  svg.addEventListener("pointerup", () => { drag = null; svg.classList.remove("is-dragging"); });
  svg.addEventListener("dblclick", () => { zoom = null; renderPareto(false); });

  $("#px").addEventListener("change", (e) => { pxKey = e.target.value; zoom = null; renderPareto(true); });
  $("#p-show").addEventListener("change", () => renderPareto(true));
  $("#p-replay").addEventListener("click", () => { zoom = null; renderPareto(true); });
  $("#p-full").addEventListener("click", () => {
    const sec = $("#pareto-section");
    document.fullscreenElement ? document.exitFullscreen() : sec.requestFullscreen && sec.requestFullscreen();
  });
  document.addEventListener("fullscreenchange", () => renderPareto(false));
  $("#p-download").addEventListener("click", () => {
    const head = ["rank", "model", "provider", "harness", "reasoning_level", "weights", `score_pass@${state.k}`, "cost_per_task_usd", "cost_estimated", "avg_latency_s"];
    const lines = currentRows().map((r, i) => [i + 1, r.model, P[r.provider].name, r.harness, r.reasoning, r.weights, r.s.toFixed(2), r.costK.toFixed(3), r.est ? "yes" : "no", Math.round(r.latK)]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
    const blob = new Blob([[head.join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `automationbench-pass@${state.k}.csv`; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  // play the animation the first time the chart scrolls into view
  const io = new IntersectionObserver((entries) => {
    if (entries.some((en) => en.isIntersecting) && !played) { played = true; renderPareto(true); io.disconnect(); }
  }, { threshold: 0.35 });
  io.observe($("#pareto-chart"));
  let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => renderPareto(false), 120); });

  /* ---------------- Download image / share ---------------- */
  function loadScript(src) {
    return new Promise((res, rej) => { const sc = document.createElement("script"); sc.src = src; sc.onload = res; sc.onerror = rej; document.head.appendChild(sc); });
  }
  $("#lb-image").addEventListener("click", async (e) => {
    const btn = e.currentTarget; btn.classList.add("is-busy");
    try {
      if (!window.html2canvas) await loadScript("vendor/html2canvas.min.js");
      const node = $("#lb");
      const canvas = await window.html2canvas(node, { backgroundColor: "#ffffff", scale: 2, ignoreElements: (el) => el.classList && (el.classList.contains("lb-head__icons") || el.id === "pop-providers") });
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `automationbench-leaderboard-pass@${state.k}.png`;
      a.click();
    } catch (err) {
      alert("Couldn’t create the image. Open the page through the dev server (npm run dev) rather than as a file, so the browser allows exporting it.");
    } finally { btn.classList.remove("is-busy"); }
  });
  $("#lb-share").addEventListener("click", () => {
    const top = currentRows().slice(0, 3).map((r, i) => `${i + 1}. ${r.model} ${fmtPct(r.s)}`).join("\n");
    const text = `AutomationBench leaderboard (pass@${state.k}) on Kaggle Benchmarks:\n${top}`;
    window.open(`https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(location.href)}`, "_blank", "noopener,width=600,height=520");
  });

  /* ---------------- Waffle: tasks × models ---------------- */
  const WT = window.AB_TASKS, WM = ABSIM.models;
  const DOMAIN_LABEL = { sales: "Sales", marketing: "Marketing", operations: "Operations", support: "Support", finance: "Finance", hr: "HR" };
  $("#w-domain").insertAdjacentHTML("beforeend", Object.entries(DOMAIN_LABEL).map(([k, v]) => `<option value="${k}">${v}</option>`).join(""));
  const results = new Map(); // key: model|task -> boolean[5]
  WM.forEach((m) => WT.forEach((t) => results.set(m.key + "|" + t.id, ABSIM.trials(m, t))));
  const passCount = (m, t) => results.get(m.key + "|" + t.id).filter(Boolean).length;
  const taskRate = (t) => WM.reduce((a, m) => a + passCount(m, t), 0) / (WM.length * ABSIM.TRIALS);
  const SHADES = ["#f1f3f4", "#d2ecd9", "#a8dab5", "#6fc48a", "#34a853", "#137333"]; // 0..5 passes

  $("#w-legend").innerHTML = `<span>Trials passed</span>` + SHADES.map((c, i) => `<span class="w-key"><i style="background:${c}"></i>${i}/5</span>`).join("") +
    `<span class="w-legend__note">Columns ranked by leaderboard score</span>`;

  function renderWaffle() {
    const dom = $("#w-domain").value, sort = $("#w-sort").value;
    let tasks = WT.filter((t) => !dom || t.domain === dom);
    if (sort === "hard") tasks = [...tasks].sort((a, b) => taskRate(a) - taskRate(b));
    if (sort === "easy") tasks = [...tasks].sort((a, b) => taskRate(b) - taskRate(a));
    const g = $("#waffle");
    g.style.setProperty("--cols", WM.length);
    const head = `<div class="w-corner"></div>` + WM.map((m, j) =>
      `<a class="w-col" href="model.html?m=${ABSIM.slug(m.model)}" data-col="${j}" title="${esc(m.model)} · ${fmtPct(m.score)}"><img src="${P[m.provider].logo}" alt=""><span>${esc(m.model)}</span></a>`).join("") + `<div class="w-rate-h">Pass rate</div>`;
    let lastDom = null;
    const body = tasks.map((t, i) => {
      const sep = sort === "domain" && t.domain !== lastDom ? `<div class="w-domain" style="grid-column:1/-1">${DOMAIN_LABEL[t.domain]}</div>` : "";
      lastDom = t.domain;
      return sep + `<div class="w-task" data-row="${i}" title="${esc(t.id)}"><span>${esc(t.title)}</span></div>` +
        WM.map((m, j) => {
          const n = passCount(m, t);
          const first = results.get(m.key + "|" + t.id).findIndex(Boolean);
          const trial = (first < 0 ? 0 : first) + 1;
          return `<a class="w-cell" style="background:${SHADES[n]}" data-row="${i}" data-col="${j}" data-n="${n}" data-model="${m.key}" data-task="${t.id}"
            href="trajectory.html?model=${encodeURIComponent(m.key)}&task=${encodeURIComponent(t.id)}&trial=${trial}" aria-label="${esc(m.model)} on ${esc(t.title)}: ${n} of 5 trials passed"></a>`;
        }).join("") + `<div class="w-rate">${Math.round(taskRate(t) * 100)}%</div>`;
    }).join("");
    const foot = `<div class="w-task w-total">Model pass rate</div>` + WM.map((m) => {
      const v = tasks.reduce((a, t) => a + passCount(m, t), 0) / (tasks.length * ABSIM.TRIALS);
      return `<div class="w-colrate">${Math.round(v * 100)}</div>`;
    }).join("") + `<div></div>`;
    g.innerHTML = head + body + foot;
  }
  $("#w-domain").addEventListener("change", renderWaffle);
  $("#w-sort").addEventListener("change", renderWaffle);

  const wtip = $("#w-tip");
  $("#waffle").addEventListener("mouseover", (e) => {
    const c = e.target.closest(".w-cell");
    $("#waffle").querySelectorAll(".is-x").forEach((x) => x.classList.remove("is-x"));
    if (!c) { wtip.hidden = true; return; }
    $("#waffle").querySelectorAll(`[data-row="${c.dataset.row}"].w-task, [data-col="${c.dataset.col}"].w-col`).forEach((x) => x.classList.add("is-x"));
    const m = WM.find((x) => x.key === c.dataset.model), t = WT.find((x) => x.id === c.dataset.task);
    const runs = results.get(m.key + "|" + t.id);
    wtip.innerHTML = `<div class="w-tip__t">${esc(t.title)}</div><div class="w-tip__id">${t.id}</div>
      <div class="w-tip__m"><img src="${P[m.provider].logo}" alt="">${esc(m.model)}</div>
      <div class="w-tip__runs">${runs.map((ok, i) => `<span class="${ok ? "ok" : "no"}" title="Trial ${i + 1}">${ok ? "✓" : "✕"}</span>`).join("")}</div>
      <div class="w-tip__hint">${c.dataset.n}/5 passed · click to open trajectory</div>`;
    wtip.hidden = false;
    const sec = $("#waffle-section").getBoundingClientRect(), cb = c.getBoundingClientRect();
    let left = cb.right - sec.left + 10; if (left + 230 > sec.width) left = cb.left - sec.left - 240;
    wtip.style.left = left + "px"; wtip.style.top = (cb.top - sec.top - 8) + "px";
  });
  $("#waffle").addEventListener("mouseleave", () => { wtip.hidden = true; $("#waffle").querySelectorAll(".is-x").forEach((x) => x.classList.remove("is-x")); });
  renderWaffle();

  update();
})();
