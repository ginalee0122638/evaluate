# Kaggle "Find Benchmarks" replica

A static, editable rebuild of the saved `Find Benchmarks | Kaggle` page.

## Run it

```bash
cd kaggle-benchmarks
npm run dev          # or: node dev-server.js
```

Open http://localhost:5173. The page reloads by itself whenever you save a file in this folder. You need Node 18 or newer. Nothing to install.

## What to edit

| File | What's in it |
| --- | --- |
| `index.html` | Benchmarks home page: hero, section headings, call to action |
| `build.html` | Build Benchmarks page: value props, customer story tiles, how it works |
| `heygen.html` | HeyGen customer story. Copy this file to add another story, then set that story's `href` in `stories.js` |
| `chrome.js` | Side nav, top bar and cookie bar shared by every page |
| `stories.js` | Customer story tiles (text, stats, logos, links) |
| `pages.css` | Styles for the Build Benchmarks and story pages |
| `styles.css` | All styling. Design tokens (colors, fonts, radii, sidebar width) are at the top in `:root` |
| `data.js` | Everything data-driven: hero counts, coding leaderboard scores, speed and cost, benchmark cards, new models, score-progression points, new benchmarks |
| `app.js` | Rendering and interactions: tabs, number counters, upvotes, card expanding, chart highlighting |
| `assets/logos/` | Organization logos used next to model names |

## Interactions

- **Domain tabs** switch the leaderboard. Only Coding data was in the saved page. Add other domains under `domainLeaderboards` in `data.js`.
- **New models**: hovering a card expands it into its per-domain breakdown. It also highlights that model's family in the Score progression chart, where the highlighted family shows actual scores and the others show "best so far".
- **Legend buttons** and the chart lines switch the highlighted family too.
- **New Benchmarks**: hovering a card expands it to show values and model names.
- **Upvote** toggles the count. **OK, Got it.** closes the cookie bar.

## Notes on accuracy

- The saved HTML had no styles. Kaggle adds its CSS with JavaScript when the page loads, so none of it was saved, and the `_files` folder (logos, `app.css`) wasn't included. The styling is rebuilt to match Kaggle's design (Inter, Material Symbols, pill buttons, 16px-radius cards).
- The text, numbers, links, ranking order and Score progression chart positions come straight from the saved page.
- The logos in `assets/logos/` are stand-ins. To use the real ones, copy them from your saved `Find Benchmarks _ Kaggle_files/` folder:
  `thumbnail.png` → `google`, `thumbnail(1).png` → `openai`, `thumbnail.jpg` → `anthropic`, `thumbnail(2).png` → `xai`, `thumbnail(3).jpg` → `qwen`. Then update the `logo` paths in `data.js`.
- Benchmark owner avatars load live from `storage.googleapis.com`, the same addresses the original page used.
