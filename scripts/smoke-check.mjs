import { existsSync, readFileSync, readdirSync } from "node:fs";
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

function findChunkByPrefix(prefix) {
  const chunkDir = join(distDir, "_worker.js", "chunks");
  const match = readdirSync(chunkDir).find((file) => file.startsWith(prefix));
  return match ? join("_worker.js", "chunks", match) : null;
}

const baseLayoutChunk = findChunkByPrefix("BaseLayout_");
const structuredDataChunk = findChunkByPrefix("structuredData_");

const contentChecks = [
  {
    file: baseLayoutChunk,
    checks: [
      { pattern: 'application/ld+json', label: "JSON-LD renderer" },
      { pattern: 'BreadcrumbList', label: "breadcrumb structured data" },
      { pattern: 'Primary navigation', label: "labelled primary navigation" },
    ],
  },
  {
    file: structuredDataChunk,
    checks: [
      { pattern: '"@type": "ProfilePage"', label: "profile page schema builder" },
      { pattern: '"@type": "Article"', label: "article schema builder" },
      { pattern: '"@type": "CreativeWork"', label: "creative work schema builder" },
      { pattern: '"@type": "FAQPage"', label: "faq page schema builder" },
      { pattern: '"@type": "Product"', label: "product schema builder" },
      { pattern: '"@type": "Service"', label: "service schema builder" },
      { pattern: '"@type": "WebSite"', label: "website schema builder" },
      { pattern: '"@type": "Organization"', label: "organization schema builder" },
    ],
  },
].filter((item) => Boolean(item.file));

const missingContentChecks = [];

for (const item of contentChecks) {
  const filePath = join(distDir, item.file);
  const content = readFileSync(filePath, "utf8");

  for (const check of item.checks) {
    if (!content.includes(check.pattern)) {
      missingContentChecks.push(`${item.file}: missing ${check.label}`);
    }
  }
}

if (missingContentChecks.length > 0) {
  console.error("Smoke check failed. Missing expected structured-data or shell markers:");
  missingContentChecks.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}

console.log("Smoke check passed.");
