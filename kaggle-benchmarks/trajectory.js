// Trajectory (trial) view, modelled on the Harbor viewer's trial page.
// URL: trajectory.html?model=<model key>&task=<task id>&trial=<1-5>&tab=<trajectory|verifier|config|log>
(function () {
  const P = window.AB.providers, S = window.ABSIM, TASKS = window.AB_TASKS;
  const q = new URLSearchParams(location.search);
  const modelKey = q.get("model") || S.models[0].key;
  const taskId = q.get("task") || TASKS[0].id;
  const trialIdx = Math.min(S.TRIALS, Math.max(1, +q.get("trial") || 1)) - 1;
  let tab = q.get("tab") || "trajectory";
  const T = S.trajectory(modelKey, taskId, trialIdx);
  const root = document.getElementById("tr");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  if (!T) { root.innerHTML = `<div class="tr-error">Failed to load trial. <a href="automationbench.html">Back to AutomationBench</a></div>`; return; }

  const fmtDur = (s) => (s < 60 ? `${s.toFixed(1)}s` : `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`);
  const fmtCount = (n) => (n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "k" : String(n));
  const fmtCost = (c) => "$" + (c < 0.01 ? c.toFixed(4) : c.toFixed(3));
  const url = (o) => { const p = new URLSearchParams({ model: modelKey, task: taskId, trial: trialIdx + 1, ...o }); if (p.get("tab") === "trajectory") p.delete("tab"); return "trajectory.html?" + p.toString(); };
  const taskIdx = TASKS.findIndex((t) => t.id === taskId);
  const prevTask = TASKS[(taskIdx - 1 + TASKS.length) % TASKS.length].id, nextTask = TASKS[(taskIdx + 1) % TASKS.length].id;
  const runs = S.trials(T.model, T.task);

  const env = 6 + (S.hash(T.trialName) % 9), setup = 3 + (S.hash(T.trialName + "a") % 5), verify = 2 + (S.hash(T.trialName + "v") % 3);
  const phases = [["Env Setup", env, "#c6dafc"], ["Agent Setup", setup, "#d7c6fc"], ["Agent Execution", T.totals.duration, "#81c995"], ["Verifier", verify, "#fbc96b"]];
  const total = phases.reduce((a, p) => a + p[1], 0);
  const agentName = "codex";

  /* ---------------- header ---------------- */
  root.innerHTML = `
    <nav class="tr-crumb" aria-label="Breadcrumb">
      <a href="automationbench.html">AutomationBench</a><span>/</span>
      <a href="automationbench.html#waffle-section">Jobs</a><span>/</span>
      <span class="tr-crumb__job" title="${T.jobName}">${T.jobName}</span><span>/</span>
      <span class="tr-crumb__cur" title="${T.trialName}">${T.trialName}</span>
    </nav>
    <header class="tr-head">
      <div class="tr-head__row">
        <h1 class="tr-title" id="tr-title" title="Click to copy">${T.trialName}</h1>
        <span class="tr-result ${T.passed ? "is-pass" : "is-fail"}"><span class="gs">${T.passed ? "check_circle" : "cancel"}</span>${T.passed ? "Passed" : "Failed"} · reward ${T.passed ? "1.0" : "0.0"}</span>
      </div>
      <div class="tr-meta">
        <span class="copy" data-copy="zapier/AutomationBench">zapier/AutomationBench</span><i>|</i>
        <span class="copy" data-copy="${T.task.id}">${T.task.id}</span><i>|</i>
        <span class="copy" data-copy="${agentName}@0.42.0">${agentName}@0.42.0</span><i>|</i>
        <span class="copy tr-meta__model" data-copy="${P[T.model.provider].name.toLowerCase()}/${T.model.key}"><img src="${P[T.model.provider].logo}" alt="">${P[T.model.provider].name.toLowerCase()}/${T.model.key}</span><i>|</i>
        <time>Started ${T.started.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" })} UTC</time>
      </div>
      <div class="tr-hints">
        <span><kbd>←</kbd><kbd>→</kbd> switch trials <b>(${trialIdx + 1} / ${S.TRIALS})</b></span>
        <span><kbd>⇧</kbd><kbd>←</kbd><kbd>→</kbd> switch tasks</span>
        <span><kbd>⌥</kbd><kbd>←</kbd><kbd>→</kbd> switch tabs</span>
        <span><kbd>Esc</kbd> go back</span>
      </div>
      <div class="tr-uri copy" data-copy="kaggle://benchmarks/zapier/automationbench/jobs/${T.jobName}/${T.trialName}">kaggle://benchmarks/zapier/automationbench/jobs/${T.jobName}/${T.trialName}</div>
    </header>

    <section class="tr-summary">
      <div class="tr-trials">
        <div class="tr-label">Trials</div>
        <div class="tr-trials__row">${runs.map((ok, i) => `<a href="${url({ trial: i + 1, tab })}" class="tr-trial ${ok ? "ok" : "no"}${i === trialIdx ? " is-cur" : ""}" title="Trial ${i + 1}: ${ok ? "passed" : "failed"}">${i + 1}</a>`).join("")}</div>
      </div>
      <div class="tr-kpis">
        <div><span>Partial credit</span><b>${(T.partial * 100).toFixed(0)}%</b></div>
        <div><span>Duration</span><b>${fmtDur(total)}</b></div>
        <div><span>Steps</span><b>${T.steps.length}</b></div>
        <div><span>Cost</span><b>${fmtCost(T.totals.cost)}</b></div>
        <div><span>Tokens</span><b>in ${fmtCount(T.totals.tin)} · out ${fmtCount(T.totals.tout)}</b></div>
      </div>
      <div class="tr-phases">
        <div class="tr-phases__bar">${phases.map(([n, d, c]) => `<div style="flex:${d};background:${c}" title="${n}: ${fmtDur(d)}"></div>`).join("")}</div>
        <div class="tr-phases__legend">${phases.map(([n, d, c]) => `<span><i style="background:${c}"></i>${n} <b>${fmtDur(d)}</b></span>`).join("")}</div>
      </div>
    </section>

    <div class="tr-tabs" role="tablist">
      ${["trajectory", "verifier", "config", "log"].map((t) => `<a role="tab" href="${url({ tab: t })}" data-tab="${t}" class="tr-tab${t === tab ? " is-on" : ""}">${t[0].toUpperCase() + t.slice(1)}</a>`).join("")}
    </div>
    <div class="tr-body" id="tr-body"></div>
    <nav class="tr-nav">
      <a href="${url({ task: prevTask, trial: 1 })}"><span class="gs">chevron_left</span>Previous task</a>
      <a href="automationbench.html#waffle-section">All task results</a>
      <a href="${url({ task: nextTask, trial: 1 })}">Next task<span class="gs">chevron_right</span></a>
    </nav>`;

  /* ---------------- tabs ---------------- */
  const body = document.getElementById("tr-body");
  function stepHeader(s) {
    const role = s.source === "agent" ? agentName : s.source;
    const m = s.metrics;
    return `<div class="st-head">
      <span class="st-id">#${s.id}</span>
      <span class="st-role st-role--${s.source}">${role}</span>
      <span class="mono">+${fmtDur(s.at)}</span>
      ${s.dur ? `<span class="mono">${fmtDur(s.dur)}</span>` : ""}
      ${s.source === "agent" ? `<span class="mono st-model">${T.model.key}</span>` : ""}
      ${m ? `<span class="mono">${fmtCost(m.cost)}</span><span class="mono">in ${fmtCount(m.in)}</span><span class="mono">cache ${fmtCount(m.cached)}</span><span class="mono">out ${fmtCount(m.out)}</span>` : ""}
      <span class="gs st-chev">expand_more</span>
    </div>`;
  }
  function collapsible(label, icon, content, open) {
    return `<details class="blk"${open ? " open" : ""}><summary><span class="gs">${icon}</span>${label}<span class="gs blk__chev">expand_more</span></summary><pre>${esc(content)}</pre></details>`;
  }
  function renderTrajectory() {
    const maxDur = Math.max(...T.steps.map((s) => s.dur || 0), 1);
    body.innerHTML = `
      <div class="traj">
        <aside class="traj-overview">
          <div class="traj-overview__head"><span>Steps</span><button class="tr-btn" id="toggle-all">Expand all</button></div>
          ${T.steps.map((s) => `<a href="#step-${s.id}" class="ov"><span class="ov__id">#${s.id}</span><span class="ov__role st-role--${s.source}">${s.source === "agent" ? agentName : s.source}</span>
            <span class="ov__bar"><i style="width:${((s.dur || 0) / maxDur) * 100}%"></i></span><span class="ov__dur mono">${s.dur ? fmtDur(s.dur) : "–"}</span></a>`).join("")}
        </aside>
        <div class="traj-steps">
          ${T.steps.map((s, i) => `
            <details class="step" id="step-${s.id}" ${i < 3 ? "open" : ""}>
              <summary>${stepHeader(s)}</summary>
              <div class="step__body">
                ${s.reasoning ? collapsible("Reasoning", "psychology", s.reasoning, true) : ""}
                ${s.text ? `<div class="step__text">${esc(s.text)}</div>` : ""}
                ${(s.calls || []).map((c) => `
                  <div class="call">
                    ${collapsible(`<b>${c.fn}</b> <span class="mono call__args">${esc(JSON.stringify(c.args)).slice(0, 90)}</span>`, "build", JSON.stringify(c.args, null, 2), false)}
                    ${collapsible("Observation", "output", c.obs, false)}
                  </div>`).join("")}
              </div>
            </details>`).join("")}
        </div>
      </div>`;
    const btn = document.getElementById("toggle-all");
    btn.addEventListener("click", () => {
      const open = btn.textContent === "Expand all";
      body.querySelectorAll("details").forEach((d) => (d.open = open));
      btn.textContent = open ? "Collapse all" : "Expand all";
    });
  }
  function renderVerifier() {
    const ok = T.assertions.filter((a) => a.ok).length;
    body.innerHTML = `
      <div class="ver">
        <div class="ver__sum">
          <div><span>task_completed_correctly</span><b class="${T.passed ? "pass" : "fail"}">${T.passed ? "1.0" : "0.0"}</b></div>
          <div><span>partial_credit</span><b>${T.partial.toFixed(2)}</b></div>
          <div><span>Assertions</span><b>${ok} / ${T.assertions.length}</b></div>
        </div>
        <p class="ver__note">The verifier reads the final state of the simulated apps directly. No LLM judge. Every assertion must hold for the task to pass.</p>
        <ul class="ver__list">
          ${T.assertions.map((a) => `<li class="${a.ok ? "ok" : "no"}"><span class="gs">${a.ok ? "check_circle" : "cancel"}</span><span class="ver__kind">${a.neg ? "negative" : "positive"}</span>${esc(a.text)}</li>`).join("")}
        </ul>
      </div>`;
  }
  function renderConfig() {
    const cfg = {
      job_name: T.jobName, trial_name: T.trialName, dataset: "zapier/AutomationBench@1.0.6", split: "private-heldout",
      task: { id: T.task.id, domain: T.task.domain, tools: T.task.tools },
      agent: { name: agentName, version: "0.42.0", model: `${P[T.model.provider].name.toLowerCase()}/${T.model.key}`, reasoning_effort: T.model.reasoning, max_steps: 50 },
      environment: { toolset: "api", tools: ["search", "execute"], search_top_k: 5, compute: "kaggle-benchmarks/cpu-standard" },
      verifier: { metric: "task_completed_correctly", llm_judge: false },
    };
    body.innerHTML = `<pre class="tr-pre">${esc(JSON.stringify(cfg, null, 2))}</pre>`;
  }
  function renderLog() {
    const t0 = T.started.getTime();
    const ts = (s) => new Date(t0 + s * 1000).toISOString().replace("T", " ").slice(0, 19);
    let at = 0; const lines = [];
    lines.push(`${ts(at)} INFO  environment: starting sandbox (toolset=api)`); at += env;
    lines.push(`${ts(at)} INFO  environment: seeded ${T.task.tools.length} simulated apps for ${T.task.id}`);
    lines.push(`${ts(at)} INFO  agent: ${agentName}@0.42.0 model=${T.model.key}`); at += setup;
    T.steps.forEach((s) => { at += s.dur || 0; (s.calls || []).forEach((c) => lines.push(`${ts(at)} DEBUG tool_call ${c.fn} ${JSON.stringify(c.args)}`)); if (s.text && s.source === "agent") lines.push(`${ts(at)} INFO  agent: final message (${s.text.length} chars)`); });
    lines.push(`${ts(at)} INFO  verifier: ${T.assertions.filter((a) => a.ok).length}/${T.assertions.length} assertions passed`);
    lines.push(`${ts(at + verify)} INFO  trial finished reward=${T.passed ? "1.0" : "0.0"}`);
    body.innerHTML = `<pre class="tr-pre tr-log">${esc(lines.join("\n"))}</pre>`;
  }
  const renderers = { trajectory: renderTrajectory, verifier: renderVerifier, config: renderConfig, log: renderLog };
  function setTab(t) {
    tab = t;
    document.querySelectorAll(".tr-tab").forEach((a) => a.classList.toggle("is-on", a.dataset.tab === t));
    history.replaceState(null, "", url({ tab: t }));
    renderers[t]();
  }
  document.querySelectorAll(".tr-tab").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); setTab(a.dataset.tab); }));
  (renderers[tab] || renderTrajectory)();

  // copy-to-clipboard on header values
  root.addEventListener("click", async (e) => {
    const el = e.target.closest(".copy, #tr-title"); if (!el) return;
    try { await navigator.clipboard.writeText(el.dataset.copy || el.textContent.trim()); } catch (err) {}
    el.classList.add("is-copied"); setTimeout(() => el.classList.remove("is-copied"), 900);
  });

  // keyboard: ←/→ trials, shift+←/→ tasks, alt+←/→ tabs, Esc back
  document.addEventListener("keydown", (e) => {
    if (/input|select|textarea/i.test(e.target.tagName)) return;
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (e.key === "Escape") { location.href = "automationbench.html#waffle-section"; return; }
    if (!dir) return;
    if (e.altKey) { const order = ["trajectory", "verifier", "config", "log"]; setTab(order[(order.indexOf(tab) + dir + 4) % 4]); }
    else if (e.shiftKey) location.href = url({ task: dir > 0 ? nextTask : prevTask, trial: 1, tab });
    else location.href = url({ trial: ((trialIdx + dir + S.TRIALS) % S.TRIALS) + 1, tab });
  });
  document.title = `${T.task.title} · ${T.model.model} | AutomationBench | Kaggle`;
})();
