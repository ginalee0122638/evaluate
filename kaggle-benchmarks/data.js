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
    deepseek: { name: "DeepSeek", logo: null, color: "#7C6CF6" },
    qwen: { name: "Qwen", logo: "assets/logos/qwen.svg", color: "#7C6CF6" },
  },

  hero: {
    stats: [
      { value: 1083, label: "Benchmarks" },
      { value: 123, label: "Models" },
      { value: 1948, label: "Tasks" },
    ],
  },

  // ---------- Leaderboards by domain ----------
  domains: ["Coding", "Agentic", "Reasoning", "Multimodal", "Mathematics", "Knowledge"],
  domainLeaderboards: {
    Coding: {
      title: "Coding Benchmark Scores",
      subtitle: "Top models across 5 coding benchmarks",
      benchmarks: [
        { name: "SciCode", href: `${BASE}/benchmarks/open-benchmarks/scicode/versions/1`, color: "#3D84F7" },
        { name: "SciCode Main Standard", href: `${BASE}/benchmarks/open-benchmarks/scicode-main-standard/versions/1`, color: "#9DC0FB" },
        { name: "LiveCodeBench", href: `${BASE}/benchmarks/open-benchmarks/livecodebench/versions/1`, color: "#20D3C2" },
        { name: "LiveCodeBench V6", href: `${BASE}/benchmarks/open-benchmarks/livecodebench-release-v6/versions/1`, color: "#8FE9E0" },
        { name: "LiveCodeBench V1", href: `${BASE}/benchmarks/open-benchmarks/livecodebench-release-v1/versions/1`, color: "#FF9447" },
      ],
      // scores in benchmark order above
      models: [
        { name: "Gemini 3.5 Flash", org: "google", scores: [12.3, 12.3, 93.0, 93.0, 95.7] },
        { name: "o3", org: "openai", scores: [9.2, 9.2, 85.5, 85.5, 92.6] },
        { name: "o4 mini", org: "openai", scores: [10.8, 10.8, 82.6, 82.6, 92.4] },
        { name: "Gemma 4 31B", org: "google", scores: [8.9, 8.9, 84.8, 84.8, 89.6] },
        { name: "GPT-5", org: "openai", scores: [0.0, 0.0, 89.6, 89.6, 93.7] },
        { name: "Gemini 2.5 Pro Preview", org: "google", scores: [7.7, 7.7, 80.1, 80.1, 90.9] },
        { name: "Claude Opus 4.8", org: "anthropic", scores: [12.3, 12.3, 74.2, 74.2, 84.0] },
        { name: "o3 mini", org: "openai", scores: [7.7, 7.7, 76.4, 76.4, 86.3] },
      ],
      speed: {
        title: "Speed",
        subtitle: "Output tokens per second · higher is better",
        rows: [
          { model: "o3 mini", org: "openai", value: 196, label: "~196", estimate: true },
          { model: "Gemma 4 31B", org: "google", value: 170, label: "~170", estimate: true },
          { model: "Gemini 3.5 Flash", org: "google", value: 165, label: "~165", estimate: true },
          { model: "o4 mini", org: "openai", value: 158, label: "~158", estimate: true },
          { model: "o3", org: "openai", value: 125, label: "~125", estimate: true },
          { model: "GPT-5", org: "openai", value: 113, label: "~113", estimate: true },
          { model: "Claude Opus 4.8", org: "anthropic", value: 64.7, label: "~64.7", estimate: true },
          { model: "Gemini 2.5 Pro Preview", org: "google", value: 42.6, label: "~42.6", estimate: true },
        ],
      },
      cost: {
        title: "Cost per Task",
        subtitle: "USD per task · lower is better",
        rows: [
          { model: "o3 mini", org: "openai", value: 0.006, label: "~$0.006", estimate: true },
          { model: "Gemma 4 31B", org: "google", value: 0.007, label: "~$0.007", estimate: true },
          { model: "Gemini 3.5 Flash", org: "google", value: 0.007, label: "~$0.007", estimate: true },
          { model: "o4 mini", org: "openai", value: 0.007, label: "~$0.007", estimate: true },
          { model: "o3", org: "openai", value: 0.03, label: "~$0.03", estimate: true },
          { model: "GPT-5", org: "openai", value: 0.03, label: "~$0.03", estimate: true },
          { model: "Claude Opus 4.8", org: "anthropic", value: 0.1, label: "~$0.10", estimate: true },
          { model: "Gemini 2.5 Pro Preview", org: "google", value: 0.15, label: "~$0.15", estimate: true },
        ],
      },
    },
    // The saved page only contained Coding data. Add the other domains here in the same shape.
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
    {
      title: "Word Art",
      subtitle: "Draw and Guess ASCII Art",
      href: `${BASE}/benchmarks/kaggle/word-art`,
      owner: "Kaggle",
      avatar: "https://storage.googleapis.com/kaggle-organizations/4/thumbnail.png",
      top: [
        { rank: 1, model: "Gemini 3.8 Flash", score: "1239", raw: 1239, org: "google", leader: true },
        { rank: 2, model: "Gemini 3.1 Pro Preview", score: "1116", raw: 1116, org: "google" },
        { rank: 3, model: "GPT-5.6 Sol", score: "1079", raw: 1079, org: "openai" },
      ],
      more: 23,
      updated: { short: "1mo ago", long: "a month ago" },
      votes: 40,
    },
    {
      title: "ExtractBench",
      subtitle: "A Benchmark for Schema-Guided Enterprise Document Extraction",
      href: `${BASE}/benchmarks/llamaindex-org/extractbench-leaderboard`,
      owner: "LlamaIndex",
      avatar: "https://storage.googleapis.com/kaggle-organizations/5318/thumbnail.png?t=2026-04-17-23-01-04",
      top: [
        { rank: 1, model: "GPT-5.6 Sol", score: "91%", raw: 91, org: "openai", leader: true },
        { rank: 2, model: "GPT-5.6 Terra", score: "89%", raw: 89, org: "openai" },
        { rank: 3, model: "GPT-5.5", score: "89%", raw: 89, org: "openai" },
      ],
      more: 15,
      updated: { short: "19d ago", long: "19 days ago" },
      votes: 43,
    },
    {
      title: "Adversarial Customer Service",
      subtitle: "Agents compete in a hidden information customer service simulator using natural language.",
      href: `${BASE}/benchmarks/gert-labs/adversarial-customer-service`,
      owner: "Gert Labs",
      avatar: "https://storage.googleapis.com/kaggle-organizations/5401/thumbnail.jpg?t=2026-07-24-17-15-09",
      top: [
        { rank: 1, model: "Claude Opus 4.8", score: "78%", raw: 78, org: "anthropic", leader: true },
        { rank: 2, model: "Gemini 3.6 Flash", score: "78%", raw: 78, org: "google", leader: true },
        { rank: 3, model: "Gemini 3.5 Flash", score: "76%", raw: 76, org: "google" },
      ],
      more: 6,
      updated: { short: "20d ago", long: "20 days ago" },
      votes: 79,
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
