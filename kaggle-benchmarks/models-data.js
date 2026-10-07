// Builds the model index used by models.html and model.html from data already on the site:
// data.js (home page leaderboards, new models, score progression), ab-data.js (AutomationBench),
// plus EXTRA_RESULTS below (public leaderboard snapshots for benchmarks on the home page).
(function () {
  const D = window.PAGE_DATA, AB = window.AB;
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const PROVIDERS = {
    openai: { name: "OpenAI", logo: "assets/logos/openai-light.svg", color: "#20D3C2", country: "United States" },
    anthropic: { name: "Anthropic", logo: "assets/logos/anthropic-dark.svg", color: "#FF9447", country: "United States" },
    google: { name: "Google", logo: "assets/logos/google.svg", color: "#3D84F7", country: "United States" },
    xai: { name: "xAI", logo: "assets/logos/xai.svg", color: "#E5487F", country: "United States" },
    deepseek: { name: "DeepSeek", logo: "assets/logos/deepseek.svg", color: "#4D6BFE", country: "China" },
    moonshot: { name: "Moonshot AI", logo: "assets/logos/moonshot.svg", color: "#7A3FE0", country: "China" },
    qwen: { name: "Alibaba (Qwen)", logo: "assets/logos/qwen.svg", color: "#6F69F7", country: "China" },
    meta: { name: "Meta", logo: "assets/logos/meta.svg", color: "#0866FF", country: "United States" },
  };
  function providerOf(name) {
    const n = name.toLowerCase();
    if (/^(gpt|o3|o4)/.test(n)) return "openai";
    if (n.startsWith("claude")) return "anthropic";
    if (/^(gemini|gemma)/.test(n)) return "google";
    if (n.startsWith("grok")) return "xai";
    if (n.startsWith("deepseek")) return "deepseek";
    if (n.startsWith("kimi")) return "moonshot";
    if (n.startsWith("qwen")) return "qwen";
    if (n.startsWith("muse")) return "meta";
    return "openai";
  }
  const OPEN = new Set(["gemma-4-31b", "deepseek-v4-flash", "deepseek-v3", "deepseek-r1", "kimi-k3"]);

  const models = new Map();
  function get(name) {
    const key = slug(name);
    if (!models.has(key)) {
      const prov = providerOf(name);
      models.set(key, { key, name: name.replace(/^GPT (\d)/, "GPT-$1"), provider: prov, weights: OPEN.has(key) ? "Open" : "Proprietary", results: [], runs: [], specs: {} });
    }
    return models.get(key);
  }
  function addResult(name, r) {
    const m = get(name);
    const existing = m.results.find((x) => x.benchmark === r.benchmark);
    if (!existing || existing.rank > r.rank) { if (existing) m.results.splice(m.results.indexOf(existing), 1); m.results.push(r); }
  }
  // rank a list of [name, value] (higher is better unless lowerBetter)
  function rankList(list, benchmark, href, of, fmt, lowerBetter, unit) {
    const sorted = [...list].sort((a, b) => (lowerBetter ? a[1] - b[1] : b[1] - a[1]));
    sorted.forEach(([name, v], i) => {
      const rank = sorted.findIndex((x) => x[1] === v) + 1; // ties share a rank
      addResult(name, { benchmark, href, value: v, display: fmt(v), rank, of: Math.max(of || 0, sorted.length), unit: unit || "%" });
    });
  }

  /* ---- AutomationBench (best run per model) ---- */
  const abBest = new Map();
  AB.rows.forEach((r) => {
    const m = get(r.model);
    m.runs.push({ benchmark: "AutomationBench", reasoning: r.reasoning, score: r.score, cost: r.cost, est: r.est });
    m.weights = r.weights === "open-source" ? "Open" : "Proprietary";
    m.specs.price = r.price;
    m.specs.abLatency = r.lat;
    if (!abBest.has(r.model) || abBest.get(r.model) < r.score) abBest.set(r.model, r.score);
  });
  rankList([...abBest], "AutomationBench", "automationbench.html", AB.meta.modelsBenchmarked, (v) => v.toFixed(2) + "%");

  /* ---- Home page: coding leaderboards ---- */
  const C = D.domainLeaderboards.Coding;
  C.benchmarks.forEach((b, i) => rankList(C.models.map((m) => [m.name, m.scores[i]]), b.name, b.href, 0, (v) => v.toFixed(1) + "%"));
  C.speed.rows.forEach((r) => (get(r.model).specs.speed = r.label + " tok/s"));
  C.cost.rows.forEach((r) => (get(r.model).specs.codingCost = r.label));

  /* ---- Home page: new benchmarks (top 6 shown) + explore cards ---- */
  const ofCount = {};
  D.exploreBenchmarks.forEach((b) => (ofCount[b.title] = b.top.length + b.more));
  const seen = new Set();
  D.newBenchmarks.forEach((b) => {
    if (seen.has(b.title)) return; seen.add(b.title);
    rankList(b.rows.map((r) => [r[0], r[2]]), b.title, b.href, ofCount[b.title], b.format, false, "");
  });
  D.exploreBenchmarks.forEach((b) => {
    if (seen.has(b.title)) return; seen.add(b.title);
    b.top.forEach((t) => addResult(t.model, { benchmark: b.title, href: b.href, value: t.raw, display: t.score, rank: t.rank, of: ofCount[b.title] }));
  });

  /* ---- Kaggle composite + first evaluated (score progression) ---- */
  D.progression.series.forEach((s) => s.points.forEach(([name, v, when]) => {
    const m = get(name);
    m.composite = v; m.firstEvaluated = when;
  }));
  D.newModels.forEach((nm) => {
    const m = get(nm.name);
    m.domains = nm.scores;
    if (nm.firstEvaluated) m.firstEvaluatedExact = nm.firstEvaluated;
    if (m.composite == null) {
      const vals = Object.values(nm.scores).filter((v) => v != null);
      m.composite = vals.reduce((a, b) => a + b, 0) / vals.length;
    }
  });

  const list = [...models.values()];
  // composite rank
  const withComp = list.filter((m) => m.composite != null).sort((a, b) => b.composite - a.composite);
  withComp.forEach((m, i) => {
    m.compositeRank = i + 1; m.compositeOf = withComp.length;
    m.results.push({ benchmark: "Kaggle composite", href: "index.html", value: m.composite, display: m.composite.toFixed(1) + "%", rank: i + 1, of: withComp.length, unit: "%" });
  });
  list.forEach((m) => {
    m.results.sort((a, b) => a.rank / a.of - b.rank / b.of);
    m.best = m.results[0] || null;
  });

  window.MODELS = { list, byKey: (k) => models.get(k), PROVIDERS, slug };
})();
