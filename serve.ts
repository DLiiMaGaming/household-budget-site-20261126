// RumahAnggaran — server statis kecil untuk pengujian lokal saja.
// Menayangkan app/ di http://localhost:8080 (atau --port <n>).
// Bukan bagian dari entri: situsnya sendiri file statis biasa.

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "app");
const port = Number(process.argv[process.argv.indexOf("--port") + 1] || 8080);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};

createServer(async (req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  const file = join(root, urlPath === "/" ? "index.html" : urlPath);
  if (!file.startsWith(root)) { res.writeHead(403); res.end(); return; }
  try {
    const body = await readFile(file);
    res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found");
  }
}).listen(port, () => console.log("RumahAnggaran at http://localhost:" + port + "/"));
