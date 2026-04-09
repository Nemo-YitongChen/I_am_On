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
const localesArg = readArg("--locales");

if (!type || !validTypes.has(type)) {
  console.error("Usage: npm run preset:apply -- --type business|platform [--locales en,zh]");
  process.exit(1);
}

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = dirname(scriptDir);
const presetDir = join(rootDir, "src", "presets", type);
const sourceContentRoot = join(presetDir, "content-live");
const sourceBookingFile = join(presetDir, "content", "site", "booking-options.json");
const targetBookingFile = join(rootDir, "src", "content", "site", "booking-options.json");
const longformCollections = ["posts", "work"];

if (!existsSync(sourceContentRoot) || !existsSync(sourceBookingFile)) {
  console.error(`Missing preset source files for ${type}.`);
  process.exit(1);
}

const availableLocales = readdirSync(sourceContentRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

const selectedLocales = localesArg
  ? localesArg.split(",").map((value) => value.trim()).filter(Boolean)
  : availableLocales;

if (selectedLocales.length === 0) {
  console.error(`No locales available for ${type}.`);
  process.exit(1);
}

for (const locale of selectedLocales) {
  if (!availableLocales.includes(locale)) {
    console.error(`Preset ${type} does not provide locale "${locale}".`);
    process.exit(1);
  }

  const sourceContentDir = join(sourceContentRoot, locale);

  for (const page of requiredPages) {
    const sourcePage = join(sourceContentDir, `${page}.json`);
    if (!existsSync(sourcePage)) {
      console.error(`Missing preset page file: ${resolve(sourcePage)}`);
      process.exit(1);
    }
  }
}

function copyLocaleFiles(sourceDir, targetDir) {
  if (!existsSync(sourceDir)) {
    return;
  }

  mkdirSync(targetDir, { recursive: true });

  for (const file of readdirSync(sourceDir)) {
    copyFileSync(join(sourceDir, file), join(targetDir, file));
  }
}

for (const locale of selectedLocales) {
  const sourceContentDir = join(sourceContentRoot, locale);
  const targetContentDir = join(rootDir, "src", "content-live", locale);

  copyLocaleFiles(sourceContentDir, targetContentDir);

  for (const collection of longformCollections) {
    const sourceLongformDir = join(presetDir, "content", collection, locale);
    const targetLongformDir = join(rootDir, "src", "content", collection, locale);
    copyLocaleFiles(sourceLongformDir, targetLongformDir);
  }
}

copyFileSync(sourceBookingFile, targetBookingFile);

console.log(`Applied ${type} preset content for locales [${selectedLocales.join(", ")}], including longform starter content and booking options.`);
