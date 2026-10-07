// Zero-dependency static server with live reload.
// Usage: node dev-server.js [port]   ->  http://localhost:5173
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = Number(process.argv[2] || process.env.PORT || 5173);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".ico": "image/x-icon", ".json": "application/json", ".woff2": "font/woff2",
};
const RELOAD_SNIPPET = `<script>(() => { const es = new EventSource("/__reload"); es.onmessage = () => location.reload(); })();</script>`;
const clients = new Set();

http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  if (url === "/__reload") {
    res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
    res.write(": connected\n\n");
    clients.add(res);
    req.on("close", () => clients.delete(res));
    return;
  }
  let file = path.join(ROOT, url === "/" ? "index.html" : url);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, { "Content-Type": TYPES[ext] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(ext === ".html" ? buf.toString().replace("</body>", RELOAD_SNIPPET + "</body>") : buf);
  });
}).listen(PORT, () => console.log(`Serving ${ROOT}\n→ http://localhost:${PORT}  (auto-reloads on save)`));

let timer;
fs.watch(ROOT, { recursive: true }, (_evt, name) => {
  if (!name || name.startsWith(".") || name.includes("node_modules")) return;
  clearTimeout(timer);
  timer = setTimeout(() => clients.forEach((c) => c.write("data: reload\n\n")), 80);
});
