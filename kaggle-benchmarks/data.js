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
  // Source: Artificial Analysis evaluations (artificialanalysis.ai/evaluations), read via search
  // snapshots dated late Sep – early Oct 2026. null = no published Artificial Analysis score for
  // that model on that benchmark (shown as "–"). Elo / index metrics are drawn scaled to the best
  // model on that benchmark; their labels show the raw value.
  domainLeaderboards: {
    Coding: {
      title: "Coding Benchmark Scores",
      subtitle: "Frontier models on Artificial Analysis coding evaluations",
      benchmarks: [
        { name: "Terminal-Bench 4.0", href: "https://artificialanalysis.ai/evaluations/terminalbench-4-0", color: "#3D84F7" },
        { name: "SciCode", href: "https://artificialanalysis.ai/evaluations/scicode", color: "#20D3C2" },
        { name: "Coding Agent Index", href: "https://artificialanalysis.ai/agents/coding-agents", color: "#FF9447", note: "best harness for the model" },
      ],
      models: [
        { name: "Claude Sonnet 5.5", org: "anthropic", scores: [63.6, 61.0, 68.4] },
        { name: "Claude Opus 5.5", org: "anthropic", scores: [59.6, 66.9, 66.0] },
        { name: "GPT-6 Astra", org: "openai", scores: [59.1, null, null] },
        { name: "Gemini 4 Argon", org: "google", scores: [57.1, 61.8, 63.8] },
        { name: "GPT-6.1 Sol", org: "openai", scores: [56.1, null, null] },
        { name: "Claude Fable 5.1", org: "anthropic", scores: [52.0, 63.1, null] },
        { name: "Kimi K3", org: "moonshot", scores: [null, 59.5, null] },
        { name: "GPT-6 Sol", org: "openai", scores: [43.9, null, null] },
      ],
    },
    Agentic: {
      title: "Agentic Benchmark Scores",
      subtitle: "Frontier models on Artificial Analysis agentic evaluations",
      benchmarks: [
        { name: "AutomationBench-AA", href: "https://artificialanalysis.ai/evaluations/automationbench-aa", color: "#3D84F7" },
        { name: "GDPval-AA v2.1", href: "https://artificialanalysis.ai/evaluations/gdpval-aa", color: "#20D3C2", unit: "elo" },
        { name: "AA-Briefcase v1.1", href: "https://artificialanalysis.ai/articles/aa-briefcase", color: "#FF9447", unit: "elo" },
      ],
      models: [
        { name: "Gemini 4 Argon", org: "google", scores: [77.5, null, 1494] },
        { name: "Claude Sonnet 5.5", org: "anthropic", scores: [71.8, 1839, 1811] },
        { name: "Claude Opus 5.5", org: "anthropic", scores: [69.5, 1866, 1822] },
        { name: "DeepSeek V4.1 Flash", org: "deepseek", scores: [68.9, 1600, null] },
        { name: "GPT-6 Astra", org: "openai", scores: [68.5, null, null] },
        { name: "Grok 4.6", org: "xai", scores: [66.7, null, null] },
        { name: "Grok 4.7", org: "xai", scores: [65.6, null, 1657] },
        { name: "GPT-6.1 Sol", org: "openai", scores: [64.9, null, null] },
      ],
    },
    Reasoning: {
      title: "Reasoning Benchmark Scores",
      subtitle: "Frontier models on Artificial Analysis reasoning evaluations",
      benchmarks: [
        { name: "Humanity's Last Exam", href: "https://artificialanalysis.ai/evaluations/humanitys-last-exam", color: "#3D84F7" },
        { name: "CritPt", href: "https://artificialanalysis.ai/evaluations/critpt", color: "#20D3C2" },
        { name: "AA-LCR v1.1", href: "https://artificialanalysis.ai/evaluations/artificial-analysis-long-context-reasoning", color: "#FF9447" },
      ],
      models: [
        { name: "Claude Opus 5.5", org: "anthropic", scores: [61.4, 31.7, 84.7] },
        { name: "Claude Fable 5.1", org: "anthropic", scores: [59.1, null, 85.3] },
        { name: "Gemini 4 Argon", org: "google", scores: [57.1, null, null] },
        { name: "Claude Sonnet 5.5", org: "anthropic", scores: [55.0, 31.4, null] },
        { name: "GPT-6 Astra", org: "openai", scores: [54.7, 31.7, null] },
        { name: "GPT-5.6 Sol", org: "openai", scores: [null, 32.3, null] },
        { name: "Kimi K3", org: "moonshot", scores: [null, null, 88.7] },
        { name: "Step 5 Preview", org: "stepfun", scores: [null, null, 88.3] },
      ],
    },
    Multimodal: {
      title: "Multimodal Benchmark Scores",
      subtitle: "Image understanding on Artificial Analysis MMMU-Pro",
      benchmarks: [
        { name: "MMMU-Pro", href: "https://artificialanalysis.ai/evaluations/mmmu-pro", color: "#3D84F7" },
      ],
      models: [
        { name: "Claude Opus 5.5", org: "anthropic", scores: [88.0] },
        { name: "GPT-6 Astra", org: "openai", scores: [87.0] },
        { name: "Claude Opus 5", org: "anthropic", scores: [84.7] },
        { name: "Gemini 3.5 Flash", org: "google", scores: [84.3] },
        { name: "GPT-5.6 Sol", org: "openai", scores: [83.4] },
      ],
      footnote: "Claude Opus 5.5 and GPT-6 Astra are from the current MMMU-Pro page; the other rows are from Artificial Analysis's August 2026 snapshot.",
    },
    Mathematics: {
      title: "Mathematics Benchmark Scores",
      subtitle: "Competition math on Artificial Analysis AIME 2025",
      benchmarks: [
        { name: "AIME 2025", href: "https://artificialanalysis.ai/evaluations/aime-2025", color: "#3D84F7" },
      ],
      models: [
        { name: "GPT-5.2 Pro", org: "openai", scores: [99.0] },
        { name: "GPT-5 Codex", org: "openai", scores: [98.7] },
        { name: "Gemini 3 Flash Preview", org: "google", scores: [97.0] },
        { name: "gpt-oss-120B", org: "openai", scores: [93.4] },
      ],
      footnote: "Artificial Analysis no longer runs AIME on new models, so newer frontier models aren't listed here.",
    },
    Knowledge: {
      title: "Knowledge Benchmark Scores",
      subtitle: "Frontier models on Artificial Analysis knowledge evaluations",
      benchmarks: [
        { name: "AA-Omniscience Accuracy", href: "https://artificialanalysis.ai/evaluations/omniscience", color: "#3D84F7" },
        { name: "AA-Omniscience Index", href: "https://artificialanalysis.ai/evaluations/omniscience", color: "#20D3C2", unit: "index" },
        { name: "GPQA Diamond", href: "https://artificialanalysis.ai/evaluations/gpqa-diamond", color: "#FF9447" },
      ],
      models: [
        { name: "Claude Fable 5.1", org: "anthropic", scores: [67.2, 43, null] },
        { name: "Claude Opus 5.5", org: "anthropic", scores: [66.0, 46, null] },
        { name: "Claude Fable 5", org: "anthropic", scores: [65.4, null, null] },
        { name: "GPT-6 Astra", org: "openai", scores: [62.6, 44, 96.1] },
        { name: "Gemini 3.8 Flash", org: "google", scores: [null, null, 95.3] },
        { name: "Grok 4.6", org: "xai", scores: [null, null, 94.9] },
        { name: "GPT-5.6 Sol", org: "openai", scores: [null, null, 94.1] },
      ],
      footnote: "AA-Omniscience Index runs from −100 to 100 and penalises wrong answers; its bars are scaled to the best model.",
    },
  },

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
  newModelsHref: `${BASE}/benchmarks/index?models=165,170,168,164,161`,
  newModels: [
    { id: 165, name: "Grok 4.6", org: "xai", family: "Grok", firstEvaluated: "09/15/2026",
      scores: { Coding: null, Agentic: 61, Reasoning: null, Multimodal: 61, Mathematics: 97, Knowledge: null } },
    { id: 170, name: "GPT-6 Astra", org: "openai", family: "OpenAI", firstEvaluated: null,
      scores: { Coding: 61, Agentic: 79, Reasoning: 91, Multimodal: 87, Mathematics: 100, Knowledge: 79 } },
    { id: 168, name: "Gemini 3.8 Flash", org: "google", family: "Google", firstEvaluated: null,
      scores: { Coding: 60, Agentic: 68, Reasoning: 88, Multimodal: 85, Mathematics: 96, Knowledge: 72 } },
    { id: 164, name: "Gemini 3.7 Flash", org: "google", family: "Google", firstEvaluated: null,
      scores: { Coding: 63, Agentic: 85, Reasoning: 90, Multimodal: 86, Mathematics: 96, Knowledge: 72 } },
    { id: 161, name: "Claude Opus 5", org: "anthropic", family: "Anthropic", firstEvaluated: null,
      scores: { Coding: 60, Agentic: 69, Reasoning: 90, Multimodal: 69, Mathematics: 99, Knowledge: 63 } },
  ],

  // ---------- Score progression chart ----------
  // Exact geometry from the saved page (viewBox 0 0 960 300). x = time, y = composite score.
  progression: {
    title: "Score progression",
    subtitle: "Composite score (mean across domains) by when each model was first evaluated on Kaggle, versus leading frontier models",
    endX: 887.0448752576207, // "today"
    yTicks: [[40, 268], [50, 220.8], [60, 173.6], [70, 126.4], [80, 79.2], [90, 32]],
    xTicks: [["Jul 25", 176.2696882817467], ["Oct 25", 324.22867239143454], ["Jan 26", 472.25466691059233],
             ["Apr 26", 616.9301409562518], ["Jul 26", 763.2808752386603], ["Oct 26", 911.2398593483481]],
    series: [
      { family: "Google", color: "#3D84F7", points: [
        ["Gemini 1.5 Pro", 45.3, "May 2025", 88.95512474237931, 242.7930952907901],
        ["Gemini 2.0 Flash", 46.3, "May 2025", 88.95512474237931, 238.4137426491679],
        ["Gemini 2.5 Flash Preview", 49.7, "May 2025", 113.07887215156754, 222.34030767128644],
        ["Gemini 2.5 Pro Preview", 63.0, "Jun 2025", 135.59436973347658, 159.42572624152686],
        ["Gemini 2.5 Pro", 73.8, "Jul 2025", 200.06079639060607, 108.56666009747602],
        ["Gemini 3 Pro Preview", 83.1, "Nov 2025", 392.914342098151, 64.347866089394],
      ] },
      { family: "OpenAI", color: "#20D3C2", points: [
        ["o4 mini", 65.3, "May 2025", 88.95512474237931, 148.8092344540764],
        ["o3", 72.5, "May 2025", 88.95512474237931, 114.83155041432661],
        ["GPT-5", 74.1, "Aug 2025", 254.6048569521385, 106.82794327051776],
        ["GPT-5.5", 81.5, "May 2026", 696.2485518942901, 71.91586676901385],
        ["GPT-6 Astra", 82.8, "Sep 2026", 877.0250140606395, 65.96013778164536],
      ] },
      { family: "Anthropic", color: "#FF9447", points: [
        ["Claude 3.7 Sonnet", 49.4, "May 2025", 88.95512474237931, 223.65537505512248],
        ["Claude Sonnet 4", 59.9, "May 2025", 113.07887215156754, 173.92757340842869],
        ["Claude Opus 4.5", 64.1, "Sep 2025", 277.1203545340475, 154.29756931493478],
        ["Claude Opus 4.8", 72.7, "May 2026", 710.6347911575276, 113.4516039220175],
        ["Claude Opus 5", 75.0, "Jul 2026", 804.4239979228009, 102.70644255205563],
      ] },
      { family: "DeepSeek", color: "#7C6CF6", points: [
        ["DeepSeek-V3", 58.3, "May 2025", 88.95512474237931, 181.39939459684857],
        ["DeepSeek-R1", 62.5, "May 2025", 122.72837111524284, 161.77036028564012],
      ] },
      { family: "Grok", color: "#E5487F", points: [
        ["Grok 2", 46.6, "May 2025", 88.95512474237931, 236.91505090234799],
        ["Grok 3", 56.4, "May 2025", 117.9036216334052, 190.43457384618716],
        ["Grok 4", 72.7, "Jul 2025", 225.65636006111262, 113.60282282385246],
        ["Grok 4.5", 58.0, "Jul 2026", 784.9013067400299, 183.053162090207],
        ["Grok 4.6", 72.6, "Sep 2026", 887.0448752576207, 114.02349739280952],
      ] },
    ],
  },

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
