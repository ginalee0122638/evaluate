// Builds the model index used by models.html and model.html from data already on the site:
// data.js (benchmark catalog, Explore tiles, New Benchmarks) and ab-data.js (AutomationBench).
// SPECS below come from public model cards and pricing pages (via the modelspec dataset);
// Gemini 4 Argon's are from its launch page.
(function () {
  const D = window.PAGE_DATA, AB = window.AB;
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const PROVIDERS = {
    openai: { name: "OpenAI", logo: "assets/logos/openai-light.svg", color: "#20D3C2", country: "United States", flag: "🇺🇸" },
    anthropic: { name: "Anthropic", logo: "assets/logos/anthropic-dark.svg", color: "#FF9447", country: "United States", flag: "🇺🇸" },
    google: { name: "Google", logo: "assets/logos/google.svg", color: "#3D84F7", country: "United States", flag: "🇺🇸" },
    xai: { name: "xAI", logo: "assets/logos/xai.svg", color: "#E5487F", country: "United States", flag: "🇺🇸" },
    deepseek: { name: "DeepSeek", logo: "assets/logos/deepseek.svg", color: "#4D6BFE", country: "China", flag: "🇨🇳" },
    moonshot: { name: "Moonshot AI", logo: "assets/logos/moonshot.svg", color: "#7A3FE0", country: "China", flag: "🇨🇳" },
    qwen: { name: "Alibaba (Qwen)", logo: "assets/logos/qwen.svg", color: "#6F69F7", country: "China", flag: "🇨🇳" },
    meta: { name: "Meta", logo: "assets/logos/meta.svg", color: "#0866FF", country: "United States", flag: "🇺🇸" },
    stepfun: { name: "StepFun", logo: "assets/logos/stepfun.svg", color: "#1C64F2", country: "China", flag: "🇨🇳" },
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
    if (n.startsWith("step")) return "stepfun";
    return "openai";
  }

  // release, context window, max output tokens, price [in, out] per 1M tokens, input modalities, open weights
  const T = ["text", "image", "pdf"], TV = ["text", "image", "video", "pdf"], ALL = ["text", "image", "video", "audio", "pdf"];
  const SPECS = {
    "gemini-4-argon": ["2026-09-30", 1000000, 262000, [4, 20], ["text", "image", "video", "pdf"]],
    "claude-opus-5-5": ["2026-09-22", 1000000, 128000, [4, 20], T],
    "claude-sonnet-5-5": ["2026-09-28", 1000000, 128000, [2, 10], ["text", "image"]],
    "claude-fable-5-1": ["2026-09-01", 1000000, 128000, [10, 50], T],
    "claude-fable-5": ["2026-06-07", 1000000, 128000, [10, 50], T],
    "claude-opus-5": ["2026-07-24", 1000000, 128000, [5, 25], T],
    "claude-opus-4-8": ["2026-05-28", 1000000, 128000, null, T],
    "gpt-6-astra": ["2026-09-03", 1050000, 128000, [10, 50], T],
    "gpt-6-sol": ["2026-09-22", 1050000, 128000, null, T],
    "gpt-5-6-sol": ["2026-07-09", 1050000, 128000, [4, 20], T],
    "gpt-5-5": ["2026-04-23", 1050000, 128000, null, T],
    "gemini-3-8-flash": ["2026-09-02", 1048576, 65536, [0.75, 3.75], ALL],
    "gemini-3-7-flash": ["2026-08-13", 1048576, 65536, [0.75, 3.75], ALL],
    "gemini-3-5-flash": ["2026-05-19", 1048576, 65536, [1.5, 9], ALL],
    "kimi-k3": ["2026-07-16", 1048576, 131072, null, ["text", "image", "video"], true],
    "grok-4-7": ["2026-09-21", 500000, 500000, [2, 6], T],
    "grok-4-6": ["2026-08-12", 500000, 500000, null, T],
    "deepseek-v4-1-flash": ["2026-09-10", 1000000, 384000, [0.3, 1.2], ["text", "image"], true],
    "qwen3-8-max": ["2026-08-03", 1000000, 131072, null, TV],
    "muse-spark-1-3": ["2026-09-02", 1048576, 131072, [1.25, 4.25], ALL],
  };
  const OPEN = new Set(["gemma-4-31b", "deepseek-v4-flash", "deepseek-v4-1-flash", "deepseek-v3", "deepseek-r1", "kimi-k3", "gpt-oss-120b"]);

  const models = new Map();
  function get(name) {
    const key = slug(name);
    if (!models.has(key)) {
      const s = SPECS[key] || [];
      models.set(key, {
        key, name: name.replace(/^GPT (\d)/, "GPT-$1"), provider: providerOf(name),
        weights: OPEN.has(key) || s[5] ? "Open" : "Proprietary",
        results: [], runs: [],
        specs: { released: s[0] || null, context: s[1] || null, maxOut: s[2] || null, price: s[3] || null, modalities: s[4] || ["text"] },
      });
    }
    return models.get(key);
  }
  function addResult(name, r) {
    const m = get(name);
    const existing = m.results.find((x) => x.benchmark === r.benchmark);
    if (!existing || existing.rank > r.rank) { if (existing) m.results.splice(m.results.indexOf(existing), 1); m.results.push(r); }
  }
  // rank a list of [name, value] (higher is better); ties share a rank
  function rankList(rows, meta) {
    const sorted = [...rows].sort((a, b) => b[1] - a[1]);
    const of = Math.max(meta.of || 0, sorted.length);
    sorted.forEach(([name, v, extra]) => {
      const rank = sorted.findIndex((x) => x[1] === v) + 1;
      addResult(name, { ...meta, value: v, display: meta.fmt(v), rank, of, max: sorted[0][1], ...(extra || {}) });
    });
  }
  const pct = (v) => v.toFixed(1) + "%";

  /* ---- AutomationBench (best run per model; keeps cost, latency, ±) ---- */
  const abBest = new Map();
  AB.rows.forEach((r) => {
    const m = get(r.model);
    m.runs.push({ benchmark: "AutomationBench", reasoning: r.reasoning, score: r.score, cost: r.cost, est: r.est, lat: r.lat });
    m.weights = r.weights === "open-source" ? "Open" : m.weights;
    if (!m.specs.price) m.specs.price = r.price;
    if (!abBest.has(r.model) || abBest.get(r.model).score < r.score) abBest.set(r.model, r);
  });
  rankList([...abBest.values()].map((r) => [r.model, r.score, { ci: r.ci, cost: r.cost, costEst: r.est, lat: r.lat }]),
    { benchmark: "AutomationBench", href: "automationbench.html", domain: "Agentic", of: AB.meta.modelsBenchmarked, fmt: (v) => v.toFixed(2) + "%", unit: "%" });

  /* ---- Benchmark catalog (the benchmarks on the home page) ---- */
  D.benchmarkCatalog.forEach((b) => {
    rankList(b.results.map((r) => [r[0], r[2]]), { benchmark: b.title, href: b.href, domain: b.domain, of: b.results.length + b.more, fmt: b.format, unit: b.unit });
  });

  /* ---- Other Explore tiles + New Benchmarks ---- */
  const DOMAIN_OF = { "Code2Video Bench": "Multimodal", "Terminal-Bench 4.0": "Coding", "Harvey’s Legal Agent Benchmark": "Agentic" };
  const seen = new Set(["AutomationBench", ...D.benchmarkCatalog.map((b) => b.title)]);
  const ofCount = {};
  D.exploreBenchmarks.forEach((b) => (ofCount[b.title] = b.top.length + b.more));
  D.newBenchmarks.forEach((b) => {
    if (seen.has(b.title)) return; seen.add(b.title);
    rankList(b.rows.map((r) => [r[0], r[2]]), { benchmark: b.title, href: b.href, domain: DOMAIN_OF[b.title] || "Multimodal", of: ofCount[b.title], fmt: b.format, unit: "" });
  });
  D.exploreBenchmarks.forEach((b) => {
    if (seen.has(b.title)) return; seen.add(b.title);
    b.top.forEach((t) => addResult(t.model, { benchmark: b.title, href: b.href, domain: DOMAIN_OF[b.title] || "Agentic", value: t.raw, display: t.score, rank: t.rank, of: ofCount[b.title], max: b.top[0].raw, unit: /%$/.test(t.score) ? "%" : "" }));
  });

  const list = [...models.values()];
  list.forEach((m) => {
    m.results.sort((a, b) => a.rank / a.of - b.rank / b.of || b.of - a.of);
    m.best = m.results[0] || null;
  });

  window.MODELS = { list, byKey: (k) => models.get(k), PROVIDERS, slug };
})();
