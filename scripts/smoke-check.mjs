import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = dirname(scriptDir);
const distDir = join(rootDir, "dist");

const requiredFiles = [
  "_worker.js/index.js",
  "_worker.js/pages/index.astro.mjs",
  "_worker.js/pages/404.astro.mjs",
  "_worker.js/pages/about.astro.mjs",
  "_worker.js/pages/book.astro.mjs",
  "_worker.js/pages/posts.astro.mjs",
  "_worker.js/pages/work.astro.mjs",
  "_worker.js/pages/admin.astro.mjs",
  "_routes.json",
  "editor/home/index.html",
  "robots.txt",
];

const missing = requiredFiles.filter((file) => !existsSync(join(distDir, file)));

if (missing.length > 0) {
  console.error("Smoke check failed. Missing build outputs:");
  missing.forEach((file) => console.error(`- ${file}`));
  process.exit(1);
}

console.log("Smoke check passed.");
