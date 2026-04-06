import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const validTypes = new Set(["business", "platform"]);
const requiredPages = ["home", "about", "services", "consult", "recruiters", "book"];

function readArg(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

const type = readArg("--type");

if (!type || !validTypes.has(type)) {
  console.error("Usage: npm run preset:apply -- --type business|platform");
  process.exit(1);
}

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = dirname(scriptDir);
const presetDir = join(rootDir, "src", "presets", type);
const sourceContentDir = join(presetDir, "content-live", "en");
const sourceBookingFile = join(presetDir, "content", "site", "booking-options.json");
const targetContentDir = join(rootDir, "src", "content-live", "en");
const targetBookingFile = join(rootDir, "src", "content", "site", "booking-options.json");

if (!existsSync(sourceContentDir) || !existsSync(sourceBookingFile)) {
  console.error(`Missing preset source files for ${type}.`);
  process.exit(1);
}

for (const page of requiredPages) {
  const sourcePage = join(sourceContentDir, `${page}.json`);
  if (!existsSync(sourcePage)) {
    console.error(`Missing preset page file: ${resolve(sourcePage)}`);
    process.exit(1);
  }
}

mkdirSync(targetContentDir, { recursive: true });

for (const file of readdirSync(sourceContentDir)) {
  copyFileSync(join(sourceContentDir, file), join(targetContentDir, file));
}

copyFileSync(sourceBookingFile, targetBookingFile);

console.log(`Applied ${type} preset content to src/content-live/en and src/content/site/booking-options.json`);
