// Renders the data-driven parts of the page from window.PAGE_DATA (see data.js).
(function () {
  const D = window.PAGE_DATA;
  const $ = (sel) => document.querySelector(sel);
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const logo = (org, cls = "logo-img") => {
    const o = D.orgs[org];
    return o && o.logo ? `<img src="${o.logo}" alt="" class="${cls}">` : `<span class="${cls} logo-img--blank"></span>`;
  };

  /* ---------------- Hero: odometer stats ---------------- */
  function odometer(n) {
    const str = n.toLocaleString("en-US");
    const digits = [...str].map((ch) => {
      if (!/\d/.test(ch)) return `<span class="odo__sep">${ch}</span>`;
      const strip = Array.from({ length: 10 }, (_, i) => `<span>${i}</span>`).join("");
      return `<span class="odo__digit"><span class="odo__strip" data-d="${ch}">${strip}</span></span>`;
    }).join("");
    return `<span class="odo" role="img" aria-label="${str}">${digits}</span>`;
  }
  $("#hero-stats").innerHTML = D.hero.stats
    .map((s) => `<span class="stat">${odometer(s.value)}<span class="stat__label">${s.label}</span></span>`)
    .join("");
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.querySelectorAll(".odo__strip").forEach((el) => (el.style.transform = `translateY(-${el.dataset.d}0%)`));
  }));

  /* ---------------- Leaderboards by domain ---------------- */
  let activeDomain = D.domains[0];
  function renderTabs() {
    $("#domain-tabs").innerHTML = D.domains
      .map((d) => `<button role="tab" aria-selected="${d === activeDomain}" class="tab${d === activeDomain ? " is-active" : ""}" data-domain="${d}">${d}</button>`)
      .join("");
  }
  $("#domain-tabs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-domain]");
    if (!b) return;
    activeDomain = b.dataset.domain;
    renderTabs();
    renderDomain();
  });

  function columnChart({ title, subtitle, rows, lowerIsBetter }) {
    const max = Math.max(...rows.map((r) => r.value));
    const bars = rows.map((r) => `
      <div role="listitem" class="mini-col" title="${esc(r.model)}: ${esc(r.label)}${r.estimate ? " (estimate)" : ""}">
        <div class="mini-col__value">${esc(r.label)}</div>
        <div class="mini-col__bar${r.estimate ? " is-estimate" : ""}" style="height:${Math.max(4, (r.value / max) * 100)}%"></div>
      </div>`).join("");
    const labels = rows.map((r) => `
      <div class="mini-label">${logo(r.org, "logo-img logo-img--16")}<div class="mini-label__text">${esc(r.model)}</div></div>`).join("");
    return `
      <div class="metric">
        <div><h5 class="h5">${title}</h5><p class="body2 muted">${subtitle}</p></div>
        <div class="mini-cols" role="list" aria-label="${title}">${bars}</div>
        <div class="mini-labels" aria-hidden="true">${labels}</div>
      </div>`;
  }

  function renderDomain() {
    const L = D.domainLeaderboards[activeDomain];
    if (!L) {
      $("#domain-panel").innerHTML = `<div class="empty"><span class="gs">calculate</span><p>No ${activeDomain.toLowerCase()} benchmarks on Kaggle yet.</p><p class="muted">Add one to <code>benchmarkCatalog</code> in <code>data.js</code> with <code>domain: "${activeDomain}"</code>.</p></div>`;
      return;
    }
    const ticks = [0, 25, 50, 75, 100];
    // Elo / index metrics are drawn relative to the best model on that benchmark
    const best = L.benchmarks.map((b, i) => Math.max(...L.models.map((m) => m.scores[i] ?? -Infinity)));
    const fmt = (b, v) => (b.format ? b.format(v) : b.unit ? String(Math.round(v)) : v.toFixed(1));
    const height = (b, i, v) => (b.unit ? (Math.max(v, 0) / best[i]) * 100 : v);
    const modelHref = (name) => `model.html?m=${slug(name)}`;
    const cols = `repeat(${L.models.length}, minmax(0, 1fr))`;
    const groups = L.models.map((m) => `
      <div role="list" aria-label="${esc(m.name)}" class="group">
        ${m.scores.map((v, i) => {
          const b = L.benchmarks[i];
          return v == null
            ? `<div role="listitem" class="col col--na" title="${esc(m.name)} · ${esc(b.name)}: no published score"><div class="col__value">–</div><div class="col__bar col__bar--na"></div></div>`
            : `<div role="listitem" class="col" title="${esc(m.name)} · ${esc(b.name)}: ${fmt(b, v)}${b.unit === "elo" ? " Elo" : b.unit || b.format ? "" : "%"}">
            <div class="col__value">${fmt(b, v)}</div>
            <div class="col__bar" style="height:${height(b, i, v)}%;background:${b.color}"></div>
          </div>`;
        }).join("")}
      </div>`).join("");
    const modelLabels = L.models.map((m) => `
      <a class="group-label" href="${modelHref(m.name)}" title="View ${esc(m.name)}">${logo(m.org, "logo-img logo-img--20")}<div class="group-label__text">${esc(m.name)}</div></a>`).join("");
    const benchLabels = L.models.map(() => `
      <div class="bench-labels">${L.benchmarks.map((b) => `
        <div class="bench-label"><a href="${b.href}" target="_blank" rel="noopener" title="${esc(b.name)}">${esc(b.name)}</a></div>`).join("")}
      </div>`).join("");
    const hasMetrics = L.speed && L.cost;

    $("#domain-panel").innerHTML = `
      <div class="panel__head">
        <div>
          <h5 class="h5">${L.title}</h5>
          <p class="body2 muted">${L.subtitle}</p>
        </div>
        <a class="btn btn--text-link" href="#explore">View all<span class="gs">arrow_forward</span></a>
      </div>
      <div class="legend legend--static">${L.benchmarks.map((b) => `<span class="legend__item"><span class="swatch" style="background:${b.color}"></span>${esc(b.name)}${b.unit === "elo" ? " (Elo)" : b.unit === "index" ? " (index)" : b.unit === "usd" ? " (final funds)" : ""}${b.note ? ` · ${esc(b.note)}` : ""}</span>`).join("")}</div>
      <div class="score-chart" aria-label="Scores by model and benchmark" style="--cols:${cols};--n:${L.models.length};--gw:${Math.max(108, L.benchmarks.length * 20 + 36)}px">
        <div role="figure" class="score-chart__figure">
          <div></div>
          <div class="score-chart__row">${modelLabels}</div>
          <div class="score-chart__axis" aria-hidden="true">${ticks.map((t) => `<div style="bottom:${t}%">${t}%</div>`).join("")}</div>
          <div class="score-chart__plot">
            ${ticks.map((t) => `<div aria-hidden="true" class="gridline" style="bottom:${t}%"></div>`).join("")}
            <div class="score-chart__row score-chart__bars">${groups}</div>
          </div>
          <div></div>
          <div class="score-chart__row">${benchLabels}</div>
        </div>
      </div>
      ${hasMetrics ? `<div class="metrics">${columnChart(L.speed)}${columnChart(L.cost)}</div>` : ""}
      <p class="body2 muted footnote">Each benchmark's primary metric, from its Kaggle leaderboard. “–” means the model hasn't been evaluated on that benchmark. Non-percentage metrics (such as YC-Bench final funds) are drawn relative to the best model.${L.footnote ? " " + esc(L.footnote) : ""}</p>`;
  }
  renderTabs();
  renderDomain();

  /* ---------------- Explore benchmarks ---------------- */
  $("#explore-grid").innerHTML = D.exploreBenchmarks.map((b) => {
    const max = Math.max(...b.top.map((t) => t.raw));
    const min = Math.min(...b.top.map((t) => t.raw));
    const rows = b.top.map((t) => {
      // Bars are relative to the leader; spread the visual range a little so close scores stay distinguishable.
      const pct = max === min ? 100 : 70 + 30 * ((t.raw - min) / (max - min));
      return `
        <div class="lb-row${t.leader ? " is-leader" : ""}">
          <div class="lb-row__line">
            <p class="lb-row__rank">#${t.rank}</p>
            <p class="lb-row__model">${esc(t.model)}</p>
            <p class="lb-row__score">${esc(t.score)}</p>
            <div class="lb-row__logo">${logo(t.org, "logo-img logo-img--16")}</div>
          </div>
          <div class="lb-row__track"><div class="lb-row__fill" style="width:${pct}%"></div></div>
        </div>`;
    }).join("");
    return `
      <div role="listitem" class="bench-card">
        <a href="${b.href}" class="bench-card__link" aria-label="${esc(b.title)} benchmark">
          <div class="bench-card__head">
            <div class="bench-card__title" title="${esc(b.title)}">${esc(b.title)}${b.isNew ? ' <span class="new-tag">New</span>' : ""}</div>
            <span class="bench-card__subtitle" title="${esc(b.subtitle)}">${esc(b.subtitle)}</span>
            <div class="owner">
              <div class="avatar" aria-hidden="true">
                <div class="avatar__img" style="background-image:url('${b.avatar}')"></div>
                <svg width="32" height="32" viewBox="0 0 32 32"><circle r="15" cx="16" cy="16" fill="none" stroke-width="2" stroke="#fff"></circle><circle r="15" cx="16" cy="16" fill="none" stroke-width="2" stroke="#202124"></circle></svg>
              </div>
              <span class="owner__name" title="${esc(b.owner)}">${esc(b.owner)}</span>
            </div>
          </div>
          <div class="bench-card__lb">${rows}<p class="lb-more">+ ${b.more} more models</p></div>
        </a>
        <div class="bench-card__foot">
          <span class="caption muted">Updated <span aria-label="${b.updated.long}">${b.updated.short}</span></span>
          <div class="vote">
            <button class="vote__btn" aria-label="Upvote" data-vote><span class="gs">arrow_drop_up</span></button>
            <span class="vote__count" aria-live="polite" aria-label="${b.votes} votes">${b.votes}</span>
          </div>
        </div>
      </div>`;
  }).join("");
  $("#explore-grid").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-vote]");
    if (!btn) return;
    const count = btn.nextElementSibling;
    const on = btn.classList.toggle("is-voted");
    const n = parseInt(count.textContent, 10) + (on ? 1 : -1);
    count.textContent = n;
    count.setAttribute("aria-label", `${n} votes`);
  });

  /* ---------------- New Release Rankings (hero widget) ---------------- */
  (function () {
    const R = D.releaseRankings || [];
    const PER = 3, pages = Math.ceil(R.length / PER), DELAY = 6000;
    const ICON = { Coding: "code_blocks", Agentic: "smart_toy", Reasoning: "psychology", Multimodal: "imagesmode", Mathematics: "calculate", Knowledge: "menu_book" };
    const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    let page = 0, timer = null, paused = false;
    $("#rank-pages").innerHTML = Array.from({ length: pages }, (_, i) =>
      `<button role="tab" class="rank__page" data-page="${i}" aria-label="Page ${i + 1}"><i></i></button>`).join("");
    function show(p, animate = true) {
      page = (p + pages) % pages;
      const list = $("#rank-list");
      list.classList.remove("is-in");
      const render = () => {
        list.innerHTML = R.slice(page * PER, page * PER + PER).map((r) => `
          <li class="rank__row">
            <a class="rank__link" href="model.html?m=${slug(r.name)}" aria-label="${esc(r.name)} is number ${r.rank} in ${esc(r.benchmark)}"></a>
            ${logo(r.org, "rank__logo")}
            <div class="rank__body">
              <div class="rank__name">${esc(r.name)}</div>
              <div class="rank__meta">is <b>#${r.rank}</b> in <span class="gs">${ICON[r.domain] || "leaderboard"}</span><a class="rank__bench" href="${r.href}">${esc(r.benchmark)}</a>${r.effort ? ` <span class="rank__effort">· ${esc(r.effort)}</span>` : ""}</div>
            </div>
            <span class="gs rank__chev">chevron_right</span>
          </li>`).join("");
        requestAnimationFrame(() => list.classList.add("is-in"));
      };
      animate ? setTimeout(render, 160) : render();
      document.querySelectorAll(".rank__page").forEach((b, i) => {
        b.classList.toggle("is-on", i === page);
        b.setAttribute("aria-selected", i === page);
        const bar = b.querySelector("i");
        bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = "";
      });
      clearTimeout(timer);
      if (!paused) timer = setTimeout(() => show(page + 1), DELAY);
    }
    $("#rank-pages").addEventListener("click", (e) => { const b = e.target.closest("[data-page]"); if (b) show(+b.dataset.page); });
    const box = $("#rank");
    box.addEventListener("mouseenter", () => { paused = true; box.classList.add("is-paused"); clearTimeout(timer); });
    box.addEventListener("mouseleave", () => { paused = false; box.classList.remove("is-paused"); show(page + 1); });
    box.style.setProperty("--delay", DELAY + "ms");
    if (R.length) show(0, false);
  })();


})();
