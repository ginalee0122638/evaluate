// AutomationBench page data.
//
// Sources
// - score + cost: Zapier's official leaderboard (zapier.com/benchmarks, dataset 1.0.6).
//   Rows up to Sep 23 2026 as copied in github.com/turbobeest/modelspec/pull/174, plus the
//   Gemini 4 Argon / Claude 5.5 rows reported after the Gemini 4 Argon launch.
//   `est: true` marks a cost that Zapier doesn't publish for that row; ours is an estimate.
// - ci (±), tokens and latency are illustrative (Zapier doesn't publish them).
// - pass@3 / pass@5 are modelled from pass@1 (Zapier's official runs are single-attempt).
// - Reasoning level is simplified to max / high / max with fallback ("default fallbacks" runs).
//   Kimi K3's row prints no effort on Zapier's board; it's shown as "high".
window.AB = {
  meta: {
    name: "AutomationBench",
    org: "Zapier",
    updated: "Updated today",
    released: "2026-04-21",
    categories: ["Agentic", "Business", "Web + Computer Use"],
    modelsBenchmarked: 52,
    leaderboardTasks: 657, // private held-out set (dataset 1.0.6); Total Cost = cost per task × this
    topModel: "Gemini 4 Argon",
    resultsUpdated: "Updated Oct 6, 2026",
    description:
      "AutomationBench tests AI agents on end-to-end workflow execution across 47 real tools in six business functions: Sales, Marketing, Operations, Support, Finance, and HR. Each task drops the agent into a fresh simulated company — CRM records, inbox threads, spreadsheets, cases — and grades the world it leaves behind, not the agent's self-report. Scores come from a held-out private task set; the 600-task public set is open source.",
    links: [
      { icon: "article", label: "Paper", href: "https://arxiv.org/abs/2604.18934" },
      { icon: "link", label: "GitHub", href: "https://github.com/zapier/AutomationBench" },
      { icon: "table", label: "Dataset", href: "https://github.com/zapier/AutomationBench" },
      { icon: "terminal", label: "Notebook", href: "#" },
    ],
  },

  providers: {
    google: { name: "Google", sub: "Google DeepMind", color: "#3B78F2", logo: "assets/logos/google.svg" },
    openai: { name: "OpenAI", sub: "OpenAI", color: "#5FD3C9", logo: "assets/logos/openai-light.svg" },
    anthropic: { name: "Anthropic", sub: "Anthropic", color: "#F0954F", logo: "assets/logos/anthropic-dark.svg" },
    moonshot: { name: "Moonshot (Kimi)", sub: "Moonshot AI", color: "#7A3FE0", logo: "assets/logos/moonshot.svg" },
    deepseek: { name: "DeepSeek", sub: "DeepSeek", color: "#2D4FCF", logo: "assets/logos/deepseek.svg" },
  },

  harnesses: ["Codex", "ClaudeCode", "mini-SWE-agent", "OpenCode", "kimi-code"],

  // model, provider, weights, reasoning, score(pass@1 %), ci, cost/task, est?, $in/$out per 1M, tokens in/out, latency (s)
  rows: [
    { model: "Gemini 4 Argon", provider: "google", weights: "proprietary", reasoning: "high", score: 51.29, ci: 0.6, cost: 1.70, price: [5, 25], tok: ["16.1B", "151M"], lat: 151 },
    { model: "Claude Sonnet 5.5", provider: "anthropic", weights: "proprietary", reasoning: "max with fallback", score: 44.75, ci: 0.6, cost: 1.14, price: [3, 15], tok: ["13.9B", "131M"], lat: 132 },
    { model: "Claude Opus 5.5", provider: "anthropic", weights: "proprietary", reasoning: "max with fallback", score: 42.47, ci: 0.6, cost: 1.44, price: [5, 25], tok: ["14.2B", "133M"], lat: 141 },
    { model: "GPT 6 Astra", provider: "openai", weights: "proprietary", reasoning: "max", score: 41.40, ci: 0.6, cost: 1.73, price: [10, 50], tok: ["15.2B", "142M"], lat: 157 },
    { model: "GPT 6 Astra", provider: "openai", weights: "proprietary", reasoning: "high", score: 37.14, ci: 0.7, cost: 1.44, price: [10, 50], tok: ["10.4B", "107M"], lat: 81 },
    { model: "Claude Fable 5.1", provider: "anthropic", weights: "proprietary", reasoning: "max with fallback", score: 31.40, ci: 0.7, cost: 2.45, price: [8, 40], tok: ["14.6B", "135M"], lat: 147 },
    { model: "Gemini 3.7 Flash", provider: "google", weights: "proprietary", reasoning: "high", score: 30.44, ci: 0.9, cost: 0.61, price: [1.5, 7.5], tok: ["11.2B", "99M"], lat: 76 },
    { model: "Gemini 3.8 Flash", provider: "google", weights: "proprietary", reasoning: "high", score: 29.68, ci: 0.9, cost: 0.62, price: [1.5, 7.5], tok: ["10.7B", "105M"], lat: 80 },
    { model: "GPT-5.6 Sol", provider: "openai", weights: "proprietary", reasoning: "max", score: 28.77, ci: 0.9, cost: 0.91, price: [4, 20], tok: ["12.1B", "119M"], lat: 133 },
    { model: "Claude Opus 5", provider: "anthropic", weights: "proprietary", reasoning: "max", score: 26.94, ci: 1.0, cost: 1.27, price: [5, 25], tok: ["13.8B", "128M"], lat: 139 },
    { model: "GPT-5.6 Sol", provider: "openai", weights: "proprietary", reasoning: "high", score: 24.81, ci: 1.0, cost: 0.64, price: [4, 20], tok: ["8.7B", "82M"], lat: 70 },
    { model: "GPT-5.6 Terra", provider: "openai", weights: "proprietary", reasoning: "max", score: 23.60, ci: 1.1, cost: 0.48, est: true, price: [2, 10], tok: ["11.4B", "108M"], lat: 118 },
    { model: "Kimi K3", provider: "moonshot", weights: "open-source", reasoning: "high", score: 22.68, ci: 1.1, cost: 0.29, est: true, price: [0.6, 2.5], tok: ["12.6B", "121M"], lat: 162 },
    { model: "Claude Fable 5.1", provider: "anthropic", weights: "proprietary", reasoning: "max", score: 22.40, ci: 1.1, cost: 2.21, est: true, price: [8, 40], tok: ["13.1B", "126M"], lat: 141 },
    { model: "Claude Opus 5", provider: "anthropic", weights: "proprietary", reasoning: "high", score: 20.60, ci: 1.2, cost: 0.98, est: true, price: [5, 25], tok: ["10.2B", "94M"], lat: 96 },
    { model: "DeepSeek V4 Flash", provider: "deepseek", weights: "open-source", reasoning: "max", score: 18.11, ci: 1.3, cost: 0.12, est: true, price: [0.27, 1.1], tok: ["13.4B", "139M"], lat: 171 },
    { model: "GPT-5.6 Luna", provider: "openai", weights: "proprietary", reasoning: "max", score: 17.10, ci: 1.3, cost: 0.21, est: true, price: [0.5, 2], tok: ["10.9B", "104M"], lat: 97 },
    { model: "Gemini 3.6 Flash", provider: "google", weights: "proprietary", reasoning: "high", score: 17.10, ci: 1.3, cost: 0.44, est: true, price: [1.25, 6], tok: ["9.8B", "92M"], lat: 74 },
    { model: "Claude Opus 4.7", provider: "anthropic", weights: "proprietary", reasoning: "max", score: 13.39, ci: 1.4, cost: 1.31, est: true, price: [5, 25], tok: ["12.9B", "117M"], lat: 128 },
  ],

  trust: [
    { title: "Unsaturated Leaderboard", points: "auto" },
    { title: "Verified & Independently Executed", points: "auto" },
    {
      title: "Private Test Split",
      points: [
        "Benchmark ships with an open-source 600-task development set across six business domains.",
        "The official leaderboard runs against a harder, unreleased held-out set.",
      ],
    },
  ],

  methodology: [
    ["Anatomy of a task", [
      "Each task seeds a fresh simulated company — CRM records, inbox threads, spreadsheets, support cases — with the ambiguity that makes real work hard: stale rows, near-duplicate names, policies buried in an inbox. One trigger message kicks the agent off. It works alone, discovers what it needs by looking, and stops when it thinks it's done. When the agent halts, the world it left behind is what gets graded.",
    ]],
    ["The metric", [
      "The headline score is task_completed_correctly — strict pass/fail. Every scored assertion must hold; mostly-right is still wrong. Run-to-run variance is typically within 1%.",
      "A diagnostic partial_credit score reports the fraction of assertions passed. Useful for debugging and as a dense reward when the benchmark is used as an RL environment, but it isn't part of the leaderboard.",
    ]],
    ["Tools the agent gets", [
      "Two tools, nothing else. search runs BM25 keyword search over API schemas and returns the top 5 candidates. execute mimics a curl/fetch with method, URL, and body. Discovering the right endpoints is part of the challenge — the schemas aren't handed over up front.",
      "Behind the simulated apps, Pydantic models are the source of truth: schemas, pagination, required fields, and 4xx errors all behave like the real APIs. State lives locally, so runs are reproducible. Agents get up to 50 steps per task (rarely hit).",
    ]],
    ["How grading resists reward hacking", [
      "Grading runs against the final state of the environment, not the agent's trace or self-report. No LLM-as-judge. No vibes. The verifier reads records, sheets, and inboxes directly.",
      "Every task carries both positive assertions (the right thing happened) and negative assertions (the wrong thing did not). Negatives exist specifically to catch shotgun behavior — an agent that emails everyone in the company instead of the specified recipients fails the negatives, even if the positive assertions accidentally pass.",
    ]],
    ["Public set vs. leaderboard set", [
      "The public 600-task set at github.com/zapier/AutomationBench is for research and experimentation — you can clone it, run it locally, and export results. The official leaderboard runs against a separate held-out private set per domain, so local scores won't match the leaderboard 1:1. Expect directional agreement: improvements on the public set generally carry over.",
    ]],
  ],

  citation: `@misc{shepard2026automationbench,
  author       = {Shepard, Daniel and Salimans, Robin},
  title        = {{AutomationBench} (Version 1)},
  howpublished = {Kaggle Benchmarks},
  year         = {2026},
  note         = {arXiv:2604.18934},
  url          = {https://www.kaggle.com/benchmarks/zapier/automationbench}
}`,

  citationApa: "Shepard, D., & Salimans, R. (2026). AutomationBench (Version 1) [Benchmark]. Kaggle Benchmarks. arXiv:2604.18934. https://www.kaggle.com/benchmarks/zapier/automationbench",

  // Task IDs and descriptions come from the public set (zapier/AutomationBench, domains/*/tasks.py).
  // Avg. score and top models per task are illustrative.
  taskCount: 600,
  tasks: {
    Sales: [
      ["Multi-Hop Contact Update", "sales/sales.multi_hop_lookup", "Close a won deal and route the win notice per the latest routing policy, resolving the account tier from a sheet before notifying the right team.", 41],
      ["Negative Selection", "sales/sales.negative_selection", "Enroll Director-level contacts in an executive campaign while applying multi-level exclusion rules from the enrollment guidelines.", 38],
      ["Recency Selection", "sales/sales.recency_selection", "Update a contact's phone number from the most recent valid email, then document the source and message ID on the record.", 46],
      ["Priority Selection", "sales/sales.priority_selection", "Route a security advisory to the right person at an account, applying recent guidance on title hierarchy and tie-breakers.", 35],
    ],
    Marketing: [
      ["Social Engagement Response", "marketing/marketing.social_engagement_response", "Work through recent Twitter mentions and respond per the social engagement SOP, following the latest guidelines.", 33],
      ["Lead Enrichment", "marketing/marketing.lead_enrichment", "Add webinar leads from a sheet to HubSpot with the right lead-source tag, following current processing rules.", 44],
      ["Contact Data Cleanup", "marketing/marketing.contact_data_cleanup", "Clean up messy HubSpot contacts when cleanup policies conflict, applying the most recent instruction.", 29],
      ["Ad Performance Review", "marketing/marketing.ad_performance_review", "Review Google Ads performance from a sheet, pause underperforming campaigns and send a spend summary.", 37],
    ],
    Operations: [
      ["Asana Fire Drill", "operations/operations.asana_fire_drill", "Add fire-drill details from the facilities team to the right Asana project and section, using the latest unread update.", 62],
      ["Trello–Basecamp Compliance", "operations/operations.trello_basecamp_compliance", "Mirror a contract compliance item between Trello and Basecamp, keeping owners and due dates in sync.", 55],
      ["Monday Email Update", "operations/operations.monday_email_update", "Sync an IT cutover update from email into Monday and confirm back to the sender, ignoring unrelated threads.", 58],
      ["Jira–Confluence Incident", "operations/operations.jira_confluence_incident", "Find the most urgent open facilities incident, escalate it to Jira and document it in Confluence.", 49],
    ],
    Support: [
      ["Zendesk → Salesforce Case Sync", "support/support.zendesk_sf_case_sync", "Sync new Zendesk tickets to Salesforce cases using blocklist, SLA-tier and config sheets, then post a summary to Slack.", 31],
      ["HelpScout Bug Triage", "support/support.helpscout_jira_bugs", "Triage HelpScout bug reports into Jira per a policy sheet, tag conversations and note the Jira reference.", 36],
      ["Gorgias Order Lookup", "support/support.gorgias_order_lookup", "Answer order-inquiry tickets by looking up tracking and VIP status in sheets before replying.", 42],
      ["Zoho CRM Enrichment", "support/support.zoho_sf_enrichment", "Enrich Zoho Desk tickets with CRM context, following an enrichment policy with exclusions and special cases.", 27],
    ],
    Finance: [
      ["Invoice Email Extract", "finance/finance.invoice_email_extract", "Extract vendor invoice details from email and log each one to the invoice tracker sheet.", 52],
      ["Expense Anomaly Detection", "finance/finance.expense_anomaly_detection", "Run the monthly anomaly check, flag unusual expenses with explanations, and follow updated procedures.", 34],
      ["Overdue Invoice Follow-up", "finance/finance.overdue_invoice_followup", "Email billing contacts about overdue AR invoices and update each row's follow-up status.", 47],
      ["Weekly Expense Summary", "finance/finance.weekly_expense_summary", "Send the weekly expense summary with exact source values, including a note on any budget overage.", 39],
    ],
    HR: [
      ["Offboarding Automation", "hr/hr.offboarding_automation", "Process employee separations with the right offboarding procedure and notifications — without paying unapproved severance.", 18],
      ["Training Compliance", "hr/hr.training_compliance", "Audit quarterly training compliance, notify managers and auto-enroll overdue employees in the next session.", 24],
      ["Performance Feedback Logging", "hr/hr.performance_feedback_logging", "Extract structured manager feedback from Slack and log it to the performance spreadsheet.", 27],
      ["Job Posting Distribution", "hr/hr.job_posting_distribution", "Post only approved requisitions to Recruitee, announce on Slack and email the careers list.", 21],
    ],
  },
};
