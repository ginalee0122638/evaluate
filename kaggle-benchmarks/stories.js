// Customer stories shown on build.html (tiles) and at the bottom of each story page.
// `href: null` means the story page doesn't exist yet; the tile shows "Story coming soon".
// Only HeyGen's facts come from its launch post. Treat the other tiles as draft copy and check them before sharing.
window.STORIES = [
  {
    id: "heygen",
    name: "HeyGen",
    industry: "AI video",
    benchmark: "Code2Video Bench",
    summary: "HeyGen built Code2Video to test whether AI agents can turn a creative brief into launch-quality motion graphics, and launched it with Kaggle so every new model is ranked as it ships.",
    stat: { value: "168", label: "motion-design briefs, each with a human-made reference" },
    href: "heygen.html",
    theme: "heygen",
    logo: '<img src="https://storage.googleapis.com/kaggle-organizations/5461/thumbnail.png?t=2026-09-15-16-28-21" alt="" class="wm-heygen__mark"><span class="wm-heygen__word">HeyGen</span>',
    featured: true,
  },
  {
    id: "quadrillion",
    name: "Quadrillion",
    industry: "Research intelligence",
    benchmark: "Benchmark name TBD",
    summary: "A frontier lab building general research intelligence that shares its benchmarks and findings openly with the research community.",
    stat: { value: "Open", label: "benchmarks and findings shared with the community" },
    href: null,
    theme: "quadrillion",
    logo: '<span class="wm-quadrillion">quadrillion</span>',
  },
  {
    id: "linqalpha",
    name: "LinqAlpha",
    industry: "Financial services",
    benchmark: "FinAgentBench",
    summary: "LinqAlpha’s AI Lab measures how foundation models behave in investment analysis, so investment teams can evaluate a model before they deploy it.",
    stat: { value: "70+", label: "financial institutions use LinqAlpha" },
    href: null,
    theme: "linqalpha",
    logo: '<span class="wm-linqalpha">Linq<b>Alpha</b></span>',
  },
  {
    id: "cais",
    name: "Center for AI Safety",
    industry: "AI safety research",
    benchmark: "Humanity’s Last Exam",
    summary: "CAIS co-created Humanity’s Last Exam: expert-level, multi-step questions at the frontier of human knowledge, designed so models can’t guess or memorize their way through.",
    stat: { value: "2,500", label: "public expert-written questions" },
    href: null,
    theme: "cais",
    logo: '<span class="wm-cais"><b>CAIS</b><small>Center for AI Safety</small></span>',
  },
  {
    id: "zapier",
    name: "Zapier",
    industry: "Automation",
    benchmark: "AutomationBench",
    summary: "AutomationBench tests agents on end-to-end business workflows across 47 real tools in sales, marketing, ops, support, finance and HR, scored on final state with no LLM judge.",
    stat: { value: "<10%", label: "success rate for the best model at launch" },
    href: null,
    theme: "zapier",
    logo: '<span class="wm-zapier"><i>_</i>zapier</span>',
  },
];

// Renders story tiles into `el`. Options: { exclude: id, compact: bool, cta: bool }
window.renderStoryTiles = function (el, opts = {}) {
  const tiles = window.STORIES.filter((s) => s.id !== opts.exclude).map((s) => {
    const tag = s.href ? "a" : "div";
    const attrs = s.href ? `href="${s.href}"` : 'tabindex="0"';
    const big = s.featured && !opts.compact;
    return `
      <${tag} ${attrs} class="story-tile story-tile--${s.theme}${big ? " story-tile--featured" : ""}" aria-label="${s.name} customer story">
        <span class="story-tile__industry">${s.industry}</span>
        <div class="story-tile__logo">${s.logo}</div>
        <div class="story-tile__body">
          <div class="story-tile__stat"><b>${s.stat.value}</b><span>${s.stat.label}</span></div>
          <p class="story-tile__summary">${s.summary}</p>
          <span class="story-tile__more">${s.href ? `Read ${s.name}’s story<span class="gs">arrow_forward</span>` : "Story coming soon"}</span>
        </div>
      </${tag}>`;
  });
  if (opts.cta) {
    tiles.push(`
      <a href="#start" class="story-tile story-tile--cta">
        <span class="gs story-tile__plus">add</span>
        <div class="story-tile__cta-title">Your benchmark here</div>
        <p class="story-tile__cta-text">Bring your tasks. We’ll run every frontier model on them.</p>
      </a>`);
  }
  el.innerHTML = tiles.join("");
};
