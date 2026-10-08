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
  domains: ["Coding", "Agentic", "Reasoning", "Multimodal", "Mathematics", "Science"],
  // Built from benchmarkCatalog at the bottom of this file.
  domainLeaderboards: {},
  exploreBenchmarks: [],
};

// ---------- Benchmark catalog ----------
// One entry per benchmark, in the order shown under Explore benchmarks. Feeds the Explore tiles,
// the Leaderboards charts (a benchmark appears under every domain in `domains`), the New Release
// Rankings widget and the model pages.
// source: "published" = numbers from a public leaderboard; "illustrative" = placeholder scores.
// Updated dates and votes are placeholders.
window.PAGE_DATA.benchmarkCatalog = [
  {
    id: "code2video", title: "Code2Video Bench", isNew: true, domains: ["Coding", "Multimodal"], source: "published",
    subtitle: "Evaluating Frontier LLMs’ Ability to Create Human-Quality Videos & Motion Graphics from Code",
    publisher: "HeyGen", avatar: "https://storage.googleapis.com/kaggle-organizations/5461/thumbnail.png?t=2026-09-15-16-28-21",
    href: `${BASE}/benchmarks/heygen/code2video`, unit: "elo", format: (v) => v.toFixed(1), more: 13, updated: ["15d ago", "15 days ago"], votes: 16,
    results: [["GPT-5.5", "openai", 1574.5], ["GPT-6 Astra", "openai", 1566.3], ["GPT-5.6 Sol", "openai", 1548.7],
      ["Claude Fable 5.1", "anthropic", 1548.5], ["Claude Opus 5", "anthropic", 1543.0], ["Qwen 3.8 Max", "qwen", 1539.3]],
  },
  {
    id: "terminal-bench-4", title: "Terminal-Bench 4.0", domains: ["Coding", "Agentic"], source: "published",
    subtitle: "Can AI agents operate a real terminal? 66 professional tasks across software engineering, ML, systems and ops",
    publisher: "Terminal-Bench", avatar: "assets/logos/terminal-bench.svg", href: "https://www.tbench.ai/news/terminal-bench-4-0",
    unit: "%", more: 10, updated: ["9d ago", "9 days ago"], votes: 112,
    // Artificial Analysis Terminal-Bench 4.0 (late Sep 2026)
    results: [["Claude Sonnet 5.5", "anthropic", 63.6], ["Claude Opus 5.5", "anthropic", 59.6], ["GPT-6 Astra", "openai", 59.1],
      ["Gemini 4 Argon", "google", 57.1], ["GPT-6.1 Sol", "openai", 56.1], ["Claude Fable 5.1", "anthropic", 52.0]],
  },
  {
    id: "harvey-lab", title: "Harvey’s Legal Agent Benchmark", domains: ["Agentic"], source: "published",
    subtitle: "1,200+ long-horizon legal tasks across 24 practice areas, graded against 75,000+ expert rubric criteria",
    publisher: "Harvey", avatar: "assets/logos/harvey.svg", href: "https://www.vals.ai/benchmarks/hlab",
    unit: "%", more: 14, updated: ["1mo ago", "a month ago"], votes: 87,
    results: [["Muse Spark 1.1", "meta", 20.0], ["Grok 4.5", "xai", 12.92], ["Claude Fable 5", "anthropic", 11.25]],
  },
  {
    id: "automationbench", title: "AutomationBench", isNew: true, domains: ["Agentic"], source: "published",
    subtitle: "End-to-end business workflows across 47 simulated SaaS tools in Sales, Marketing, Operations, Support, Finance and HR",
    publisher: "Zapier", avatar: "assets/logos/zapier.svg", href: "automationbench.html",
    unit: "%", format: (v) => v.toFixed(1) + "%", more: 45, updated: ["today", "today"], votes: 58,
    // Zapier's official leaderboard (zapier.com/benchmarks), best run per model
    results: [["Gemini 4 Argon", "google", 51.29], ["Claude Sonnet 5.5", "anthropic", 44.75], ["Claude Opus 5.5", "anthropic", 42.47],
      ["GPT-6 Astra", "openai", 41.4], ["Claude Fable 5.1", "anthropic", 31.4], ["Gemini 3.7 Flash", "google", 30.44], ["Gemini 3.8 Flash", "google", 29.68]],
  },
  {
    id: "deepsearchqa", title: "DeepSearchQA", domains: ["Agentic"], source: "illustrative",
    subtitle: "900 multi-step research questions that need exhaustive web search to answer completely",
    publisher: "Google DeepMind", avatar: "assets/logos/deepmind.svg", href: `${BASE}/benchmarks/google/dsqa`,
    unit: "%", more: 38, updated: ["6d ago", "6 days ago"], votes: 142,
    results: [["Gemini 4 Argon", "google", 78.4], ["GPT-6 Astra", "openai", 74.1], ["Claude Opus 5.5", "anthropic", 71.6],
      ["Claude Sonnet 5.5", "anthropic", 69.8], ["GPT-6.1 Sol", "openai", 67.2], ["Kimi K3", "moonshot", 63.5], ["Grok 4.7", "xai", 61.0]],
  },
  {
    id: "mls-bench-lite", title: "MLS-Bench Lite", domains: ["Coding", "Science"], source: "illustrative",
    subtitle: "Can agents invent better ML methods? 30 research tasks across 12 domains, 5-hour budget each",
    publisher: "MLS-Bench", avatar: "assets/logos/mls-bench.svg", href: "https://github.com/Imbernoulli/MLS-Bench",
    unit: "%", more: 14, updated: ["12d ago", "12 days ago"], votes: 57,
    // Kimi K3 (48.3) and Qwen3.8 Max (41.0) are published results; the rest are illustrative.
    results: [["GPT-6 Astra", "openai", 56.2], ["Claude Opus 5.5", "anthropic", 53.0], ["Gemini 4 Argon", "google", 51.4],
      ["Claude Fable 5", "anthropic", 49.9], ["Kimi K3", "moonshot", 48.3], ["Qwen3.8 Max", "qwen", 41.0]],
  },
  {
    id: "yc-bench", title: "YC-Bench", domains: ["Agentic"], source: "illustrative",
    subtitle: "Agents run a simulated AI startup for a year. Score is final funds, starting from $200K",
    publisher: "Collinear AI", avatar: "assets/logos/collinear.svg", href: "https://collinear-ai.github.io/yc-bench/",
    unit: "usd", format: (v) => "$" + v.toFixed(2) + "M", more: 18, updated: ["9d ago", "9 days ago"], votes: 88,
    // Claude Fable 5 ($1.98M) is a published result; the rest are illustrative.
    results: [["Claude Opus 5.5", "anthropic", 2.41], ["Claude Fable 5", "anthropic", 1.98], ["Gemini 4 Argon", "google", 1.62],
      ["GPT-6 Astra", "openai", 1.35], ["Grok 4.7", "xai", 1.12], ["Kimi K3", "moonshot", 0.94]],
  },
  {
    id: "gpqa-diamond", title: "GPQA Diamond", domains: ["Science", "Reasoning"], source: "published",
    subtitle: "198 graduate-level, Google-proof questions in biology, physics and chemistry",
    publisher: "Rein et al. (NYU)", avatar: "assets/logos/gpqa.svg", href: `${BASE}/benchmarks/open-benchmarks/gpqa-diamond`,
    unit: "%", more: 195, updated: ["11d ago", "11 days ago"], votes: 203,
    // Artificial Analysis GPQA Diamond (late Sep 2026)
    results: [["GPT-6 Astra", "openai", 96.1], ["Gemini 3.8 Flash", "google", 95.3], ["Grok 4.6", "xai", 94.9], ["GPT-5.6 Sol", "openai", 94.1]],
  },
  {
    id: "deepswe", title: "DeepSWE", domains: ["Coding", "Agentic"], source: "published",
    subtitle: "Long-horizon software engineering: 113 original tasks across 91 open-source repos in five languages",
    publisher: "Datacurve", avatar: "assets/logos/datacurve.svg", href: `${BASE}/benchmarks/bovard/deepswe-tasks`,
    unit: "%", more: 34, updated: ["2d ago", "2 days ago"], votes: 131,
    // DeepSWE v1.1 public results (Gemini 4 Argon as reported at launch; others from the Datacurve board, Oct 2026)
    results: [["Gemini 4 Argon", "google", 77.9], ["Muse Spark 1.3", "meta", 75.4], ["GPT-6.1 Sol", "openai", 75.2],
      ["Claude Opus 5.5", "anthropic", 74.2], ["GPT-6 Astra", "openai", 74.1], ["Claude Sonnet 5.5", "anthropic", 71.0]],
  },
  {
    id: "arc-agi-2", title: "ARC-AGI 2", domains: ["Reasoning"], source: "published",
    subtitle: "Abstract visual puzzles that are easy for people and hard for AI: fluid intelligence, not memorized skill",
    publisher: "ARC Prize Foundation", avatar: "assets/logos/arc-prize.svg", href: "https://admin.kaggle.com/benchmarks/kaggle/arc-agi-2",
    unit: "%", more: 36, updated: ["2d ago", "2 days ago"], votes: 176,
    // Public ARC-AGI-2 results (Oct 2026)
    results: [["GPT-6 Astra", "openai", 95.0], ["GPT-6.1 Sol", "openai", 94.2], ["GPT-5.6 Sol", "openai", 92.5],
      ["Claude Opus 5", "anthropic", 90.4], ["GPT-5.5", "openai", 85.0], ["Gemini 3.7 Flash", "google", 84.6]],
  },
  {
    id: "metr-time-horizon", title: "METR (THCAST)", domains: ["Agentic", "Coding"], source: "illustrative",
    subtitle: "Time Horizon 1.1: the length of software task (in human hours) an agent completes 50% of the time",
    publisher: "METR", avatar: "assets/logos/metr.svg", href: "https://admin.kaggle.com/benchmarks/open-benchmarks/metr-time-horizon-1-1",
    unit: "hours", format: (v) => v.toFixed(1) + "h", more: 22, updated: ["5d ago", "5 days ago"], votes: 164,
    // Claude Opus 4.6 (~14.5h) is METR's published estimate; the rest are illustrative.
    results: [["Claude Opus 5.5", "anthropic", 22.4], ["GPT-6 Astra", "openai", 19.8], ["Gemini 4 Argon", "google", 17.6],
      ["Claude Fable 5.1", "anthropic", 16.9], ["GPT-6.1 Sol", "openai", 15.2], ["Claude Opus 4.6", "anthropic", 14.5]],
  },
  {
    id: "senior-swe-bench", title: "Senior SWE Bench", domains: ["Coding"], source: "published",
    subtitle: "Does the agent solve it the way a senior engineer would? Tasteful solve rate on real repository work",
    publisher: "Snorkel AI", avatar: "assets/logos/snorkel.svg", href: "https://admin.kaggle.com/benchmarks/kaggle/senior-swe-bench/",
    unit: "%", more: 6, updated: ["1mo ago", "a month ago"], votes: 69,
    // Snorkel AI leaderboard, tasteful solve rate (pass@1)
    results: [["Claude Fable 5.1", "anthropic", 34.7], ["Claude Fable 5", "anthropic", 34.7], ["Claude Opus 5", "anthropic", 34.7], ["Claude Opus 4.8", "anthropic", 24.0]],
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
  D.benchmarkCatalog.forEach((b) => { if (!b.format) b.format = (v) => pct(v); b.domain = b.domains[0]; });

  // Explore tiles
  D.exploreBenchmarks = D.benchmarkCatalog.map((b) => {
    const top = b.results.slice(0, 3);
    return {
      title: b.title, subtitle: b.subtitle, href: b.href, owner: b.publisher, avatar: b.avatar, isNew: !!b.isNew,
      top: top.map(([model, org, v], i) => ({ rank: i + 1, model, org, score: b.format(v), raw: v, leader: i === 0 || v === top[0][2] })),
      more: b.more, updated: { short: b.updated[0], long: b.updated[1] }, votes: b.votes,
    };
  });

  // Leaderboards: each domain's benchmarks × its most-covered models (up to 8)
  const COLORS = ["#3D84F7", "#20D3C2", "#FF9447", "#7C6CF6", "#E5487F", "#F4B400", "#0B8043"];
  D.domains.forEach((domain) => {
    const benches = D.benchmarkCatalog.filter((b) => b.domains.includes(domain));
    if (!benches.length) return;
    const models = new Map();
    benches.forEach((b, bi) => b.results.forEach(([name, org, v], ri) => {
      if (!models.has(name)) models.set(name, { name, org, scores: benches.map(() => null), hits: 0, rankSum: 0 });
      const m = models.get(name); m.scores[bi] = v; m.hits++; m.rankSum += ri;
    }));
    const list = [...models.values()].sort((a, b) => b.hits - a.hits || a.rankSum / a.hits - b.rankSum / b.hits).slice(0, 8);
    D.domainLeaderboards[domain] = {
      title: `${domain} Leaderboard`,
      subtitle: `Top models across ${benches.length} ${domain.toLowerCase()} benchmark${benches.length > 1 ? "s" : ""} on Kaggle`,
      benchmarks: benches.map((b, i) => ({ name: b.title, href: b.href, color: COLORS[i % COLORS.length], unit: b.unit === "%" ? undefined : b.unit, format: b.unit === "%" ? undefined : b.format })),
      models: list.map(({ name, org, scores }) => ({ name, org, scores })),
      footnote: benches.some((b) => b.source === "illustrative") ? "Some scores are illustrative placeholders for this prototype." : "",
    };
  });

  // New Release Rankings: each new model's best rank on any benchmark on this page
  D.releaseRankings = D.newReleases.map(([name, org, effort]) => {
    let best = null;
    D.benchmarkCatalog.forEach((b) => {
      const sorted = [...b.results].sort((x, y) => y[2] - x[2]);
      const i = sorted.findIndex((r) => r[0] === name);
      if (i < 0) return;
      const rank = sorted.findIndex((r) => r[2] === sorted[i][2]) + 1;
      if (!best || rank < best.rank) best = { rank, benchmark: b.title, href: b.href, domain: b.domain };
    });
    return best && { name, org, effort, ...best };
  }).filter(Boolean);
})();
