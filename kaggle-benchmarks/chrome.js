// Shared page chrome: side nav, top bar and cookie bar.
// Each page has <div class="app" data-page="home|build|story|models"> and a <div class="main"> inside it.
(function () {
  const app = document.querySelector(".app");
  const page = app.dataset.page || "home";
  const onBuild = page === "build" || page === "story";

  const navItem = ({ icon, label, href, active, dense, fill }) => `
    <a class="navitem${dense ? " navitem--dense" : ""}${active ? " is-active" : ""}"${active ? ' aria-current="page"' : ""} href="${href}">
      ${icon ? `<span class="gs${fill ? " gs--fill" : ""}">${icon}</span>` : ""}<span class="navitem__label">${label}</span>
    </a>`;

  const sidenav = `
    <nav class="sidenav" aria-label="Main Kaggle page navigation" id="sidenav">
      <div class="sidenav__brand">
        <button class="icon-btn" aria-label="Navigation menu" title="Navigation menu" data-toggle-nav><span class="gs">menu</span></button>
        <a href="#site-content" class="skip-link">Skip to<br>content</a>
        <a href="index.html" class="logo" aria-label="Return to Kaggle home page"><span class="logo__word">kaggle</span></a>
      </div>
      <div class="sidenav__create">
        <button class="create-btn">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <path d="M20 30L20 16L16 20L16 30L20 30Z" fill="#20BEFF"/>
            <path d="M20 20L30 20L30 16L20 16L20 20Z" fill="#20BEFF"/>
            <path d="M16 20L20 16L15.937 16L6 16L6 20L16 20Z" fill="#20BEFF"/>
            <rect x="16" y="6" width="4" height="10" fill="#20BEFF"/>
          </svg>
          <span>Create</span>
        </button>
      </div>
      <div class="sidenav__search search search--mobile">
        <span class="gs">search</span><input type="text" placeholder="Search">
      </div>
      <ul class="navlist" role="list">
        <li>${navItem({ icon: "explore", label: "Home", href: "#" })}</li>
        <li>${navItem({ icon: "emoji_events", label: "Competitions", href: "#" })}</li>
        <li class="navgroup">
          ${navItem({ icon: "leaderboard", label: "Benchmarks <span>🪿🥣</span>", href: "index.html", active: page === "home", fill: true })}
          <ul class="navlist navlist--sub" role="list">
            <li>${navItem({ label: "Build Benchmarks", href: "build.html", active: onBuild, dense: true })}</li>
          </ul>
        </li>
        <li>${navItem({ icon: "deployed_code", label: "Models", href: "models.html", active: page === "models", fill: page === "models" })}</li>
        <li>${navItem({ icon: "smart_toy", label: "Game Arena", href: "#" })}</li>
      </ul>
      <ul class="navlist" role="list">
        <li class="navitem-row">
          ${navItem({ icon: "code", label: "Data Hub", href: "#" })}
          <button class="icon-btn icon-btn--sm" aria-label="Expand" title="Expand"><span class="gs">expand_more</span></button>
        </li>
      </ul>
      <ul class="navlist" role="list">
        <li class="navitem-row">
          ${navItem({ icon: "format_list_bulleted", label: "More", href: "#" })}
          <button class="icon-btn icon-btn--sm" aria-label="Expand" title="Expand"><span class="gs">expand_more</span></button>
        </li>
      </ul>
    </nav>
    <div class="scrim" data-toggle-nav></div>`;

  const topbar = `
    <nav class="topbar" aria-label="Main menu, search and your account">
      <div class="topbar__brand">
        <button class="icon-btn" aria-label="Navigation menu" title="Navigation menu" data-toggle-nav><span class="gs">menu</span></button>
        <a href="index.html" class="logo" aria-label="Return to Kaggle home page"><span class="logo__word">kaggle</span></a>
      </div>
      <div class="search">
        <span class="gs">search</span><input type="text" placeholder="Search">
      </div>
      <div class="topbar__account">
        <a href="#" class="btn btn--text">Sign In</a>
        <a href="#" class="btn btn--outlined">Register</a>
      </div>
    </nav>`;

  const cookieBar = `
    <div class="cookie-bar" id="cookie-bar">
      <div class="cookie-bar__text">Kaggle uses cookies from Google to deliver and enhance the quality of its services and to analyze traffic.</div>
      <div class="cookie-bar__actions">
        <a href="#" class="cookie-bar__btn">Learn more</a>
        <button class="cookie-bar__btn" data-dismiss-cookies>OK, Got it.</button>
      </div>
    </div>`;

  app.insertAdjacentHTML("afterbegin", sidenav + topbar);
  const main = app.querySelector(".main");
  let cookiesOk = false;
  try { cookiesOk = localStorage.getItem("cookies-ok") === "1"; } catch (e) {}
  if (!cookiesOk) main.insertAdjacentHTML("afterbegin", cookieBar);

  document.querySelectorAll("[data-toggle-nav]").forEach((el) =>
    el.addEventListener("click", () => document.body.classList.toggle("nav-open")));
  const cookieBtn = document.querySelector("[data-dismiss-cookies]");
  cookieBtn && cookieBtn.addEventListener("click", () => {
    document.getElementById("cookie-bar").remove();
    try { localStorage.setItem("cookies-ok", "1"); } catch (e) {}
  });
})();
