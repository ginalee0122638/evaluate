// Per-task results and trajectories for the AutomationBench prototype.
//
// Zapier publishes overall scores, not per-task runs. This file generates illustrative per-task
// results so the waffle chart and trajectory pages have something to show. Everything is
// deterministic (seeded by model + task + trial), so a square always opens the same trajectory.
// Overall pass rates track each model's real leaderboard score.
(function () {
  const AB = window.AB, TASKS = window.AB_TASKS;

  function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { return function () { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const logit = (p) => Math.log(p / (1 - p));
  const sigmoid = (x) => 1 / (1 + Math.exp(-x));

  // Domain difficulty follows Zapier's domain table (HR hardest, Operations easiest).
  const DOMAIN_SHIFT = { sales: 0, marketing: 0.1, operations: -0.9, support: 0.15, finance: 0.05, hr: 0.8 };
  const difficulty = (t) => DOMAIN_SHIFT[t.domain] + (rng(hash(t.id))() * 3.2 - 1.6);

  // One leaderboard row per model (its best run), ranked by score.
  const models = (() => {
    const best = new Map();
    AB.rows.forEach((r) => { if (!best.has(r.model) || best.get(r.model).score < r.score) best.set(r.model, r); });
    return [...best.values()].sort((a, b) => b.score - a.score).map((r) => ({ ...r, key: slug(r.model + "-" + r.reasoning) }));
  })();
  const modelByKey = (k) => models.find((m) => m.key === k) || AB.rows.map((r) => ({ ...r, key: slug(r.model + "-" + r.reasoning) })).find((m) => m.key === k);

  const TRIALS = 5;
  function trials(model, task) {
    const p = sigmoid(logit(model.score / 100) - difficulty(task) * 1.25);
    const r = rng(hash(model.key + "|" + task.id));
    return Array.from({ length: TRIALS }, () => r() < p);
  }

  /* ---------------- trajectory ---------------- */
  const APP_NAMES = { google_sheets: "Google Sheets", google_ads: "Google Ads", google_drive: "Google Drive", google_calendar: "Google Calendar", zoho_desk: "Zoho Desk" };
  function toolToHttp(tool) {
    const parts = tool.split("_");
    let app = parts[0], rest = parts.slice(1);
    if (["google", "zoho"].includes(app)) { app = parts[0] + "_" + parts[1]; rest = parts.slice(2); }
    const verb = rest[0];
    const method = /^(create|add|send|post|like)$/.test(verb) ? "POST" : /^(update|set|move|mark)$/.test(verb) ? "PATCH" : /^(delete|remove)$/.test(verb) ? "DELETE" : "GET";
    const resource = rest.filter((w) => !["find", "get", "list", "create", "update", "add", "send", "set", "many", "all", "by", "id", "lookup", "post", "like", "detailed"].includes(w)).join("_") || "records";
    return { app, appName: APP_NAMES[app] || app[0].toUpperCase() + app.slice(1), method, path: `/${app.replace("_", "-")}/v1/${resource.replace(/_/g, "-")}${method === "GET" ? "s" : ""}` };
  }

  function trajectory(modelKey, taskId, trialIdx) {
    const model = modelByKey(modelKey), task = TASKS.find((t) => t.id === taskId);
    if (!model || !task) return null;
    const passed = trials(model, task)[trialIdx];
    const r = rng(hash(`${model.key}|${task.id}|${trialIdx}|traj`));
    const steps = [];
    let t = 0, cost = 0, tin = 0, tout = 0;
    const push = (s) => { t += s.dur; steps.push({ ...s, id: steps.length + 1, at: t }); };
    push({ source: "system", dur: 0, text: "You are a workflow automation agent. Execute the requested tasks using the available tools. Do not ask clarifying questions - use the information provided and make reasonable assumptions when needed. You have a budget of ~50 tool-using turns — favor parallel tool calls and avoid duplicate searches." });
    push({ source: "user", dur: 0.2, text: task.prompt });

    const tools = task.tools;
    const nCalls = Math.min(tools.length, 4 + Math.floor(r() * 5));
    for (let i = 0; i < nCalls; i++) {
      const tool = tools[i], h = toolToHttp(tool);
      const pin = Math.round(6000 + r() * 22000), pout = Math.round(120 + r() * 900), cached = Math.round(pin * (0.4 + r() * 0.5));
      const c = (pin - cached) / 1e6 * model.price[0] + cached / 1e6 * model.price[0] * 0.1 + pout / 1e6 * model.price[1];
      cost += c; tin += pin; tout += pout;
      const thought = i === 0
        ? `I need to understand the current state before changing anything. Let me find the ${h.appName} endpoints that match this request.`
        : i === nCalls - 1 && passed
          ? `I have everything I need. Applying the change in ${h.appName} and following the policy I found earlier.`
          : `Next I'll check ${h.appName} for the records this policy refers to.`;
      push({
        source: "agent", dur: +(2 + r() * 14).toFixed(1), reasoning: thought,
        calls: [
          { fn: "search", args: { query: tool.replace(/_/g, " "), top_k: 5 }, obs: [tool, ...tools.filter((x) => x !== tool).slice(0, 2)].map((x) => `${x}  (${toolToHttp(x).method} ${toolToHttp(x).path})`).join("\n") },
          { fn: "execute", args: { method: h.method, url: `https://api.sim.automationbench${h.path}`, ...(h.method !== "GET" ? { body: { source: "automation-agent" } } : {}) },
            obs: h.method === "GET"
              ? JSON.stringify({ status: 200, data: { results: Math.ceil(r() * 6), next_cursor: null } }, null, 2)
              : JSON.stringify({ status: h.method === "POST" ? 201 : 200, data: { id: `${h.app.slice(0, 3)}_${Math.floor(r() * 9e5 + 1e5)}`, updated: true } }, null, 2) },
        ],
        metrics: { cost: c, in: pin, cached, out: pout },
      });
    }
    push({ source: "agent", dur: +(1 + r() * 4).toFixed(1), text: passed
      ? "Done. I completed the workflow, followed the most recent policy and logged what I changed."
      : "Done. I've completed the requested updates and sent the notifications.", metrics: { cost: 0.0004, in: 900, cached: 600, out: 60 } });

    // verifier: positive + negative assertions
    const nA = 5 + Math.floor(r() * 4);
    const assertions = Array.from({ length: nA }, (_, i) => {
      const neg = i >= nA - 2;
      const tool = tools[i % tools.length], h = toolToHttp(tool);
      return { neg, text: neg ? `No ${h.appName} records outside the requested scope were modified` : `${h.appName}: expected ${h.method === "GET" ? "record was read and used" : "record state matches the policy"} (${tool})`, ok: true };
    });
    if (!passed) { const k = Math.floor(r() * nA); assertions[k].ok = false; if (r() < 0.4) assertions[(k + 2) % nA].ok = false; }
    const partial = assertions.filter((a) => a.ok).length / nA;

    return {
      model, task, trialIdx, passed, steps, assertions, partial,
      totals: { duration: t, cost, tin, tout },
      trialName: `${task.id.replace(".", "__")}__${model.key}__t${trialIdx + 1}`,
      jobName: `automationbench-1.0.6__${model.key}`,
      started: new Date(Date.UTC(2026, 9, 6, 8, 0, 0) + (hash(model.key + task.id) % 36000) * 1000),
    };
  }

  window.ABSIM = { models, modelByKey, trials, trajectory, TRIALS, slug, hash };
})();
