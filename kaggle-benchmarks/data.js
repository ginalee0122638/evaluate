// All page content that repeats (charts, cards) lives here.
// Edit values below and the page re-renders on save (when running `node dev-server.js`).

const BASE = "https://www.kaggle.com";

window.PAGE_DATA = {
  // org key -> logo + chart color
  orgs: {
    google: { name: "Google", logo: "assets/logos/google.svg", color: "#3D84F7" },
    openai: { name: "OpenAI", logo: "assets/logos/openai.svg", color: "#20D3C2" },
    anthropic: { name: "Anthropic", logo: "assets/logos/anthropic.svg", color: "#FF9447" },
    xai: { name: "xAI", logo: "assets/logos/xai.svg", color: "#E5487F" },
    deepseek: { name: "DeepSeek", logo: "assets/logos/deepseek.svg", color: "#7C6CF6" },
    qwen: { name: "Qwen", logo: "assets/logos/qwen.svg", color: "#7C6CF6" },
    meta: { name: "Meta", logo: "assets/logos/meta.svg", color: "#0866FF" },
    moonshot: { name: "Moonshot AI", logo: "assets/logos/moonshot.svg", color: "#111111" },
    stepfun: { name: "StepFun", logo: "assets/logos/stepfun.svg", color: "#1C64F2" },
  },

  hero: {
    stats: [
      { value: 1083, label: "Benchmarks" },
      { value: 123, label: "Models" },
    ],
  },

  // ---------- Leaderboards by domain ----------
  domains: ["Coding", "Agentic", "Reasoning", "Multimodal", "Mathematics", "Knowledge"],
  // Built from benchmarkCatalog at the bottom of this file.
  domainLeaderboards: {},

  // ---------- Explore benchmarks ----------
  exploreBenchmarks: [
    {
      title: "Code2Video Bench",
      subtitle: "Evaluating Frontier LLMs’ Ability to Create Human-Quality Videos & Motion Graphics from Code",
      href: `${BASE}/benchmarks/heygen/code2video`,
      owner: "HeyGen",
      avatar: "https://storage.googleapis.com/kaggle-organizations/5461/thumbnail.png?t=2026-09-15-16-28-21",
      top: [
        { rank: 1, model: "GPT-5.5", score: "1574", raw: 1574, org: "openai", leader: true },
        { rank: 2, model: "GPT-6 Astra", score: "1566", raw: 1566, org: "openai" },
        { rank: 3, model: "GPT-5.6 Sol", score: "1548", raw: 1548, org: "openai" },
      ],
      more: 13,
      updated: { short: "15d ago", long: "15 days ago" },
      votes: 16,
    },
    // Leaderboard snapshots below are from public sources (Sep 2026); dates and votes are placeholders.
    {
      title: "Terminal-Bench 4.0",
      subtitle: "Can AI agents operate a real terminal? 66 professional tasks across software engineering, ML, systems and ops",
      href: "https://www.tbench.ai/news/terminal-bench-4-0",
      owner: "Terminal-Bench",
      avatar: "assets/logos/terminal-bench.svg",
      top: [
        { rank: 1, model: "GPT-6 Astra", score: "59%", raw: 59.1, org: "openai", leader: true },
        { rank: 2, model: "Claude Fable 5.1", score: "52%", raw: 52.0, org: "anthropic" },
        { rank: 3, model: "Claude Opus 5", score: "49%", raw: 49.0, org: "anthropic" },
      ],
      more: 10,
      updated: { short: "26d ago", long: "26 days ago" },
      votes: 112,
    },
    {
      title: "Harvey’s Legal Agent Benchmark",
      subtitle: "1,200+ long-horizon legal tasks across 24 practice areas, graded against 75,000+ expert rubric criteria",
      href: "https://www.vals.ai/benchmarks/hlab",
      owner: "Harvey",
      avatar: "assets/logos/harvey.svg",
      top: [
        { rank: 1, model: "Muse Spark 1.1", score: "20.0%", raw: 20.0, org: "meta", leader: true },
        { rank: 2, model: "Grok 4.5", score: "12.9%", raw: 12.92, org: "xai" },
        { rank: 3, model: "Claude Fable 5", score: "11.3%", raw: 11.25, org: "anthropic" },
      ],
      more: 14,
      updated: { short: "1mo ago", long: "a month ago" },
      votes: 87,
    },
    {
      title: "AutomationBench",
      subtitle: "End-to-end business workflows across 47 simulated SaaS tools in Sales, Marketing, Operations, Support, Finance and HR",
      href: "automationbench.html",
      owner: "Zapier",
      avatar: "assets/logos/zapier.svg",
      // Zapier's official leaderboard (zapier.com/benchmarks)
      top: [
        { rank: 1, model: "Gemini 4 Argon", score: "51.3%", raw: 51.29, org: "google", leader: true },
        { rank: 2, model: "Claude Sonnet 5.5", score: "44.8%", raw: 44.75, org: "anthropic" },
        { rank: 3, model: "Claude Opus 5.5", score: "42.5%", raw: 42.47, org: "anthropic" },
      ],
      more: 49,
      updated: { short: "today", long: "today" },
      votes: 58,
    },
  ],

  // ---------- New models ----------
  // ---------- New Benchmarks ----------
  newBenchmarks: [
    { title: "Code2Video Bench", href: `${BASE}/benchmarks/heygen/code2video/versions/1`, released: "09/21/2026",
      rows: [["GPT-5.5", "openai", 1574.5], ["GPT-6 Astra", "openai", 1566.3], ["GPT-5.6 Sol", "openai", 1548.7],
             ["Claude Fable 5.1", "anthropic", 1548.5], ["Claude Opus 5", "anthropic", 1543.0], ["Qwen 3.8 Max", "qwen", 1539.3]],
      format: (v) => v.toFixed(1) },
    { title: "ExtractBench", href: `${BASE}/benchmarks/llamaindex-org/extractbench-leaderboard/versions/1`, released: null,
      rows: [["GPT-5.6 Sol", "openai", 91.0], ["GPT-5.6 Terra", "openai", 90.0], ["GPT-5.5", "openai", 89.1],
             ["Gemini 3 Flash Preview", "google", 89.0], ["GPT-5.6 Luna", "openai", 89.0], ["Claude Opus 5", "anthropic", 88.8]],
      format: (v) => v.toFixed(1) + "%" },
    { title: "Adversarial Customer Service", href: `${BASE}/benchmarks/gert-labs/adversarial-customer-service/versions/1`, released: null,
      rows: [["Claude Opus 4.8", "anthropic", 78.3], ["Gemini 3.6 Flash", "google", 78.3], ["Gemini 3.5 Flash", "google", 76.7],
             ["Claude Opus 5", "anthropic", 75.8], ["GPT-5.6 Luna", "openai", 75.0], ["GPT-5.6 Sol", "openai", 75.0]],
      format: (v) => v.toFixed(1) + "%" },
    { title: "ExtractBench", href: `${BASE}/benchmarks/llamaindex-org/extractbench/versions/1`, released: null,
      rows: [["GPT-5.6 Sol", "openai", 0.91], ["GPT-5.6 Terra", "openai", 0.90], ["GPT-5.5", "openai", 0.89],
             ["Gemini 3 Flash Preview", "google", 0.89], ["GPT-5.6 Luna", "openai", 0.89], ["Claude Opus 5", "anthropic", 0.89]],
      format: (v) => v.toFixed(2) },
  ],
};

// ---------- Benchmark catalog ----------
// One entry per benchmark. Feeds the Explore benchmarks tiles, the "Leaderboards by domain"
// charts, the New Release Rankings widget and the model pages.
// source: "published" = numbers from the benchmark's public leaderboard (or Artificial Analysis);
//         "illustrative" = placeholder scores for this prototype; replace with real results.
window.PAGE_DATA.benchmarkCatalog = [
  {
    id: "deepsearchqa", title: "DeepSearchQA", domain: "Agentic", source: "illustrative",
    subtitle: "900 multi-step research questions that need exhaustive web search to answer completely",
    publisher: "Google DeepMind", avatar: "assets/logos/deepmind.svg", href: `${BASE}/benchmarks/google/dsqa`,
    metric: "Fully correct", unit: "%", more: 38, updated: ["6d ago", "6 days ago"], votes: 142,
    results: [["Gemini 4 Argon", "google", 78.4], ["GPT-6 Astra", "openai", 74.1], ["Claude Opus 5.5", "anthropic", 71.6],
      ["Claude Sonnet 5.5", "anthropic", 69.8], ["GPT-6.1 Sol", "openai", 67.2], ["Kimi K3", "moonshot", 63.5], ["Grok 4.7", "xai", 61.0]],
  },
  {
    id: "mls-bench-lite", title: "MLS-Bench Lite", domain: "Coding", source: "illustrative",
    subtitle: "Can agents invent better ML methods? 30 research tasks across 12 domains, 5-hour budget each",
    publisher: "MLS-Bench", avatar: "assets/logos/mls-bench.svg", href: "https://github.com/Imbernoulli/MLS-Bench",
    metric: "Score", unit: "%", more: 14, updated: ["12d ago", "12 days ago"], votes: 57,
    // Kimi K3 (48.3) and Qwen3.8 Max (41.0) are published results; the rest are illustrative.
    results: [["GPT-6 Astra", "openai", 56.2], ["Claude Opus 5.5", "anthropic", 53.0], ["Gemini 4 Argon", "google", 51.4],
      ["Claude Fable 5", "anthropic", 49.9], ["Kimi K3", "moonshot", 48.3], ["Qwen3.8 Max", "qwen", 41.0]],
  },
  {
    id: "yc-bench", title: "YC-Bench", domain: "Agentic", source: "illustrative",
    subtitle: "Agents run a simulated AI startup for a year. Score is final funds, starting from $200K",
    publisher: "Collinear AI", avatar: "assets/logos/collinear.svg", href: "https://collinear-ai.github.io/yc-bench/",
    metric: "Final funds", unit: "usd", format: (v) => "$" + v.toFixed(2) + "M", more: 18, updated: ["9d ago", "9 days ago"], votes: 88,
    // Claude Fable 5 ($1.98M) is a published result; the rest are illustrative.
    results: [["Claude Opus 5.5", "anthropic", 2.41], ["Claude Fable 5", "anthropic", 1.98], ["Gemini 4 Argon", "google", 1.62],
      ["GPT-6 Astra", "openai", 1.35], ["Grok 4.7", "xai", 1.12], ["Kimi K3", "moonshot", 0.94]],
  },
  {
    id: "gpqa-diamond", title: "GPQA Diamond", domain: "Reasoning", source: "published",
    subtitle: "198 graduate-level, Google-proof questions in biology, physics and chemistry",
    publisher: "Rein et al. (NYU)", avatar: "assets/logos/gpqa.svg", href: `${BASE}/benchmarks/open-benchmarks/gpqa-diamond`,
    metric: "Accuracy", unit: "%", more: 195, updated: ["11d ago", "11 days ago"], votes: 203,
    // Artificial Analysis GPQA Diamond results (late Sep 2026)
    results: [["GPT-6 Astra", "openai", 96.1], ["Gemini 3.8 Flash", "google", 95.3], ["Grok 4.6", "xai", 94.9], ["GPT-5.6 Sol", "openai", 94.1]],
  },
  {
    id: "scicode", title: "SciCode", domain: "Coding", source: "published",
    subtitle: "Research-grade scientific coding across 16 subfields of physics, math, chemistry and biology",
    publisher: "SciCode (Princeton et al.)", avatar: "assets/logos/scicode.svg", href: `${BASE}/benchmarks/open-benchmarks/scicode/versions/1`,
    metric: "Subproblems solved", unit: "%", more: 105, updated: ["5d ago", "5 days ago"], votes: 96,
    // Artificial Analysis SciCode results (early Oct 2026)
    results: [["Claude Opus 5.5", "anthropic", 66.9], ["Claude Fable 5.1", "anthropic", 63.1], ["Gemini 4 Argon", "google", 61.8],
      ["Claude Fable 5", "anthropic", 61.0], ["Claude Sonnet 5.5", "anthropic", 61.0], ["Kimi K3", "moonshot", 59.5]],
  },
  {
    id: "facts-search", title: "FACTS Search", domain: "Knowledge", source: "illustrative",
    subtitle: "Search off factuality and grounding: can a model use search to find and state facts correctly?",
    publisher: "Google DeepMind", avatar: "assets/logos/deepmind.svg", href: `${BASE}/benchmarks/google/facts`,
    metric: "Accuracy", unit: "%", more: 31, updated: ["4d ago", "4 days ago"], votes: 118,
    results: [["Gemini 4 Argon", "google", 84.7], ["GPT-6 Astra", "openai", 81.2], ["Claude Opus 5.5", "anthropic", 79.5],
      ["Claude Sonnet 5.5", "anthropic", 77.0], ["Grok 4.7", "xai", 74.3], ["GPT-6.1 Sol", "openai", 73.8]],
  },
  {
    id: "extractbench", title: "ExtractBench", domain: "Multimodal", source: "published",
    subtitle: "A Benchmark for Schema-Guided Enterprise Document Extraction",
    publisher: "LlamaIndex", avatar: "https://storage.googleapis.com/kaggle-organizations/5318/thumbnail.png?t=2026-04-17-23-01-04",
    href: `${BASE}/benchmarks/llamaindex-org/extractbench-leaderboard`,
    metric: "Accuracy", unit: "%", more: 12, updated: ["19d ago", "19 days ago"], votes: 43,
    results: [["GPT-5.6 Sol", "openai", 91.0], ["GPT-5.6 Terra", "openai", 90.0], ["GPT-5.5", "openai", 89.1],
      ["Gemini 3 Flash Preview", "google", 89.0], ["GPT-5.6 Luna", "openai", 89.0], ["Claude Opus 5", "anthropic", 88.8]],
  },
  {
    id: "parsebench", title: "ParseBench", domain: "Multimodal", source: "illustrative",
    subtitle: "~2,000 human-verified enterprise pages: tables, charts, faithfulness, formatting and grounding",
    publisher: "LlamaIndex", avatar: "https://storage.googleapis.com/kaggle-organizations/5318/thumbnail.png?t=2026-04-17-23-01-04",
    href: `${BASE}/datasets/llamaindex-org/parsebench`,
    metric: "Overall", unit: "%", more: 11, updated: ["8d ago", "8 days ago"], votes: 64,
    results: [["Gemini 4 Argon", "google", 81.3], ["GPT-6 Astra", "openai", 78.9], ["Claude Opus 5.5", "anthropic", 77.2],
      ["Gemini 3.8 Flash", "google", 75.0], ["Claude Sonnet 5.5", "anthropic", 74.1], ["Qwen3.8 Max", "qwen", 70.4]],
  },
  {
    id: "1h-video-qa", title: "1H Video QA", domain: "Multimodal", source: "illustrative",
    subtitle: "Five-way questions over 40–90 minute videos testing long-context temporal reasoning",
    publisher: "Google DeepMind", avatar: "assets/logos/deepmind.svg", href: `${BASE}/benchmarks/deepmind/video-qa`,
    metric: "Top-1 accuracy", unit: "%", more: 17, updated: ["3d ago", "3 days ago"], votes: 75,
    results: [["Gemini 4 Argon", "google", 88.1], ["Gemini 3.8 Flash", "google", 82.2], ["GPT-6 Astra", "openai", 79.2],
      ["Claude Opus 5.5", "anthropic", 71.3], ["GPT-6.1 Sol", "openai", 70.5], ["Qwen3.8 Max", "qwen", 66.0]],
  },
];

// Recently released models shown in the New Release Rankings widget (with the reasoning level they ran at).
window.PAGE_DATA.newReleases = [
  ["Gemini 4 Argon", "google", "High"], ["Claude Sonnet 5.5", "anthropic", "Max"], ["Claude Opus 5.5", "anthropic", "Max"],
  ["Grok 4.7", "xai", ""], ["GPT-6.1 Sol", "openai", "Max"], ["GPT-6 Astra", "openai", "Max"],
  ["Gemini 3.8 Flash", "google", "High"], ["Claude Fable 5.1", "anthropic", "Max"], ["Kimi K3", "moonshot", ""],
];

// ---------- Derived data (built from the catalog) ----------
(function () {
  const D = window.PAGE_DATA;
  const pct = (v) => (v >= 99.95 ? "100" : v.toFixed(1).replace(/\.0$/, "")) + "%";
  D.benchmarkCatalog.forEach((b) => { if (!b.format) b.format = (v) => pct(v); });

  // Explore tiles
  D.benchmarkCatalog.forEach((b) => {
    const top = b.results.slice(0, 3);
    D.exploreBenchmarks.push({
      title: b.title, subtitle: b.subtitle, href: b.href, owner: b.publisher, avatar: b.avatar,
      top: top.map(([model, org, v], i) => ({ rank: i + 1, model, org, score: b.format(v), raw: v, leader: i === 0 || v === top[0][2] })),
      more: b.more, updated: { short: b.updated[0], long: b.updated[1] }, votes: b.votes,
    });
  });

  // Domain leaderboards: each domain's benchmarks × its most-covered models (up to 8)
  const COLORS = ["#3D84F7", "#20D3C2", "#FF9447"];
  D.domains.forEach((domain) => {
    const benches = D.benchmarkCatalog.filter((b) => b.domain === domain);
    if (!benches.length) return;
    const models = new Map();
    benches.forEach((b, bi) => b.results.forEach(([name, org, v], ri) => {
      if (!models.has(name)) models.set(name, { name, org, scores: benches.map(() => null), hits: 0, rankSum: 0 });
      const m = models.get(name); m.scores[bi] = v; m.hits++; m.rankSum += ri;
    }));
    const list = [...models.values()].sort((a, b) => b.hits - a.hits || a.rankSum / a.hits - b.rankSum / b.hits).slice(0, 8);
    D.domainLeaderboards[domain] = {
      title: `${domain} Benchmark Scores`,
      subtitle: `Top models across ${benches.length} ${domain.toLowerCase()} benchmark${benches.length > 1 ? "s" : ""} on Kaggle`,
      benchmarks: benches.map((b, i) => ({ name: b.title, href: b.href, color: COLORS[i % COLORS.length], unit: b.unit === "%" ? undefined : b.unit, format: b.unit === "%" ? undefined : b.format })),
      models: list.map(({ name, org, scores }) => ({ name, org, scores })),
      footnote: benches.some((b) => b.source === "illustrative") ? "Some scores are illustrative placeholders for this prototype." : "",
    };
  });

  // New Release Rankings: each new model's best rank on any benchmark on this page
  const boards = [
    ...D.benchmarkCatalog.map((b) => ({ title: b.title, href: b.href, domain: b.domain, rows: b.results.map((r) => [r[0], r[2]]) })),
    ...D.exploreBenchmarks.filter((b) => !D.benchmarkCatalog.some((c) => c.title === b.title))
      .map((b) => ({ title: b.title, href: b.href, domain: b.title === "AutomationBench" || b.title === "Harvey’s Legal Agent Benchmark" ? "Agentic" : b.title === "Terminal-Bench 4.0" ? "Coding" : "Multimodal", rows: b.top.map((t) => [t.model, t.raw]) })),
  ];
  D.releaseRankings = D.newReleases.map(([name, org, effort]) => {
    let best = null;
    boards.forEach((bd) => {
      const sorted = [...bd.rows].sort((a, b) => b[1] - a[1]);
      const i = sorted.findIndex((r) => r[0] === name);
      if (i < 0) return;
      const rank = sorted.findIndex((r) => r[1] === sorted[i][1]) + 1;
      if (!best || rank < best.rank) best = { rank, benchmark: bd.title, href: bd.href, domain: bd.domain };
    });
    return best && { name, org, effort, ...best };
  }).filter(Boolean);
})();
