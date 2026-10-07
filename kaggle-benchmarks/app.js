// Renders the data-driven parts of the page from window.PAGE_DATA (see data.js).
(function () {
  const D = window.PAGE_DATA;
  const $ = (sel) => document.querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const logo = (org, cls = "logo-img") => {
    const o = D.orgs[org];
    return o && o.logo ? `<img src="${o.logo}" alt="" class="${cls}">` : `<span class="${cls} logo-img--blank"></span>`;
  };

  /* ---------------- Chrome: nav drawer + cookie bar ---------------- */
  document.querySelectorAll("[data-toggle-nav]").forEach((el) =>
    el.addEventListener("click", () => document.body.classList.toggle("nav-open")));
  const cookieBtn = document.querySelector("[data-dismiss-cookies]");
  cookieBtn && cookieBtn.addEventListener("click", () => $("#cookie-bar").remove());

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
      $("#domain-panel").innerHTML = `<div class="empty">No ${activeDomain.toLowerCase()} leaderboard data yet. Add it to <code>domainLeaderboards</code> in <code>data.js</code>.</div>`;
      return;
    }
    const ticks = [0, 25, 50, 75, 100];
    const groups = L.models.map((m) => `
      <div role="list" aria-label="${esc(m.name)}" class="group">
        ${m.scores.map((v, i) => `
          <div role="listitem" class="col" title="${esc(m.name)} · ${esc(L.benchmarks[i].name)}: ${v.toFixed(1)}%">
            <div class="col__value">${v.toFixed(1)}</div>
            <div class="col__bar" style="height:${v}%;background:${L.benchmarks[i].color}"></div>
          </div>`).join("")}
      </div>`).join("");
    const modelLabels = L.models.map((m) => `
      <div class="group-label">${logo(m.org, "logo-img logo-img--20")}<div class="group-label__text">${esc(m.name)}</div></div>`).join("");
    const benchLabels = L.models.map(() => `
      <div class="bench-labels">${L.benchmarks.map((b) => `
        <div class="bench-label"><a href="${b.href}" title="${esc(b.name)}">${esc(b.name)}</a></div>`).join("")}
      </div>`).join("");

    $("#domain-panel").innerHTML = `
      <div class="panel__head">
        <div>
          <h5 class="h5">${L.title}</h5>
          <p class="body2 muted">${L.subtitle}</p>
        </div>
        <button class="btn btn--text-link">View all<span class="gs">arrow_forward</span></button>
      </div>
      <div class="legend legend--static">${L.benchmarks.map((b) => `<span class="legend__item"><span class="swatch" style="background:${b.color}"></span>${esc(b.name)}</span>`).join("")}</div>
      <div class="score-chart" aria-label="Scores by model and benchmark">
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
      <div class="metrics">
        ${columnChart(L.speed)}
        ${columnChart(L.cost)}
      </div>
      <p class="body2 muted footnote">Scores are each leaderboard's primary metric (non-percentage metrics are scaled to the best model). Speed and cost are averaged over the latest runs on these benchmarks that recorded usage. Values marked ~ are rough estimates by model size where no usage was recorded yet.</p>`;
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
            <div class="bench-card__title" title="${esc(b.title)}">${esc(b.title)}</div>
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

  /* ---------------- Accordion rows (New models / New Benchmarks) ---------------- */
  function accordion(container, onActivate) {
    container.addEventListener("mouseover", (e) => {
      const card = e.target.closest(".acc-card");
      if (!card || card.classList.contains("is-open")) return;
      container.querySelectorAll(".acc-card").forEach((c) => c.classList.toggle("is-open", c === card));
      onActivate && onActivate(card);
    });
    container.addEventListener("focusin", (e) => {
      const card = e.target.closest(".acc-card");
      if (card) card.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    });
  }

  /* ---------------- New models ---------------- */
  $("#new-models-all").href = D.newModelsHref;
  $("#new-models").innerHTML = D.newModels.map((m, i) => {
    const color = D.orgs[m.org].color;
    const entries = D.domains.map((d) => [d, m.scores[d]]);
    const title = entries.map(([d, v]) => `${d}: ${v == null ? "–" : v + "%"}`).join("\n");
    return `
      <a href="https://www.kaggle.com/benchmarks/index?models=${m.id}" class="acc-card model-card${i === 0 ? " is-open" : ""}" data-family="${m.family}" title="${title}" style="--accent:${color}">
        <div class="acc-card__top">
          <div class="org-chip">${logo(m.org, "logo-img logo-img--20")}<span>${D.orgs[m.org].name}</span></div>
          ${m.firstEvaluated ? `<div class="acc-card__date">First evaluated<br>${m.firstEvaluated}</div>` : ""}
        </div>
        <div class="acc-card__name">${esc(m.name)}</div>
        <div class="spark" aria-hidden="true">${entries.map(([, v]) => `<div class="spark__bar" style="height:${v == null ? 0 : v}%"></div>`).join("")}</div>
        <div role="list" aria-label="Score by domain" class="domains">
          ${entries.map(([d, v]) => `
            <div role="listitem" class="domain">
              <div aria-hidden="true" class="domain__track">${v == null ? "" : `<div class="domain__fill" style="height:${v}%"></div>`}</div>
              <div class="domain__value">${v == null ? "–" : v + "%"}</div>
              <div title="${d}" class="domain__label">${d}</div>
            </div>`).join("")}
        </div>
      </a>`;
  }).join("");

  /* ---------------- Score progression chart ---------------- */
  const P = D.progression;
  $("#prog-title").textContent = P.title;
  $("#prog-subtitle").textContent = P.subtitle;
  let activeFamily = D.newModels[0].family;

  function stepPath(pts, best) {
    let d = `M ${pts[0][3]} ${pts[0][4]}`;
    let curY = pts[0][4];
    for (let i = 1; i < pts.length; i++) {
      const y = best ? Math.min(curY, pts[i][4]) : pts[i][4];
      d += ` H ${pts[i][3]} V ${y}`;
      curY = y;
    }
    return d + ` H ${P.endX}`;
  }

  function renderProgression() {
    const svg = $("#progression");
    const grid = P.yTicks.map(([v, y]) =>
      `<g><line class="grid" x1="40" x2="936" y1="${y}" y2="${y}"></line><text x="32" y="${y + 4}" text-anchor="end">${v}</text></g>`).join("");
    const xs = P.xTicks.map(([l, x]) => `<text x="${x}" y="292" text-anchor="middle">${l}</text>`).join("");
    // Inactive series first so the active one paints on top.
    const ordered = [...P.series].sort((a, b) => (a.family === activeFamily) - (b.family === activeFamily));
    const series = ordered.map((s) => {
      const active = s.family === activeFamily;
      const d = stepPath(s.points, !active);
      const label = `${s.family}: ${s.points.map((p) => `${p[0]} ${p[1].toFixed(1)}`).join(", ")}`;
      const last = s.points[s.points.length - 1];
      return `
        <g class="series${active ? " is-active" : ""}" tabindex="0" role="button" aria-label="${esc(label)}" data-family="${s.family}">
          <path d="${d}" fill="none" stroke="transparent" stroke-width="14" pointer-events="stroke"></path>
          <path d="${d}" fill="none" stroke="${s.color}" stroke-width="${active ? 2.5 : 1.5}" opacity="${active ? 1 : 0.85}" pointer-events="none"></path>
          ${active ? `<circle cx="${P.endX}" cy="${last[4]}" r="10" fill="${s.color}" opacity="0.25"></circle>` : ""}
          ${s.points.map((p) => `<g><circle cx="${p[3]}" cy="${p[4]}" r="${active ? 4 : 3}" fill="${s.color}"><title>${esc(p[0])} · ${p[1].toFixed(1)} · first evaluated ${p[2]}</title></circle></g>`).join("")}
        </g>`;
    }).join("");
    svg.innerHTML = grid + xs + series;

    const legendOrder = [activeFamily, ...P.series.map((s) => s.family).filter((f) => f !== activeFamily)];
    $("#prog-legend").innerHTML = legendOrder.map((f) => {
      const s = P.series.find((x) => x.family === f);
      return `<button type="button" class="legend__btn${f === activeFamily ? " is-active" : ""}" data-family="${f}"><span class="swatch swatch--line" style="background:${s.color}"></span>${f}${f === activeFamily ? "" : " (best so far)"}</button>`;
    }).join("");
  }
  function setFamily(f) {
    if (!f || f === activeFamily) return;
    activeFamily = f;
    renderProgression();
  }
  $("#prog-legend").addEventListener("click", (e) => setFamily(e.target.closest("[data-family]")?.dataset.family));
  $("#progression").addEventListener("click", (e) => setFamily(e.target.closest(".series")?.dataset.family));
  $("#progression").addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFamily(e.target.closest(".series")?.dataset.family); }
  });
  renderProgression();
  accordion($("#new-models"), (card) => setFamily(card.dataset.family));

  /* ---------------- New Benchmarks ---------------- */
  $("#new-benchmarks").innerHTML = D.newBenchmarks.map((b, i) => {
    const vals = b.rows.map((r) => r[2]);
    const max = Math.max(...vals), min = Math.min(...vals);
    const cols = b.rows.map(([name, org, v]) => {
      const h = max === min ? 100 : 55 + 45 * ((v - min) / (max - min));
      return `
        <div title="${esc(name)}: ${b.format(v)}" class="nb-col" style="--accent:${D.orgs[org].color}">
          <div class="nb-col__barwrap">
            <div class="nb-col__value">${b.format(v)}</div>
            <div class="nb-col__bar" style="height:${h}%"></div>
          </div>
          ${logo(org, "logo-img nb-col__logo")}
          <div class="nb-col__name">${esc(name)}</div>
        </div>`;
    }).join("");
    return `
      <a href="${b.href}" class="acc-card nb-card${i === 0 ? " is-open" : ""}">
        <div class="acc-card__top">
          <div class="acc-card__name acc-card__name--bench">${esc(b.title)}</div>
          ${b.released ? `<div class="acc-card__date">Release date<br>${b.released}</div>` : ""}
        </div>
        <div class="nb-cols">${cols}</div>
      </a>`;
  }).join("");
  accordion($("#new-benchmarks"));
})();
