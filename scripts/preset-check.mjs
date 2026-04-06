import assert from "node:assert/strict";

import { getHomePresetCopy, getSectionPresetCopy } from "../src/lib/presetCopy.js";
import { getPrimaryNavKeys, getTemplatePreset } from "../src/lib/template.js";

const personalPreset = getTemplatePreset("personal");
const businessPreset = getTemplatePreset("business");
const platformPreset = getTemplatePreset("platform");

assert.deepEqual(
  getPrimaryNavKeys("personal"),
  ["about", "work", "posts", "consult", "recruiters"],
  "personal preset primary nav should match the personal starter order",
);

assert.deepEqual(
  getPrimaryNavKeys("business"),
  ["services", "work", "consult", "posts", "about"],
  "business preset primary nav should prioritize services and proof",
);

assert.deepEqual(
  getPrimaryNavKeys("platform"),
  ["services", "work", "posts", "about"],
  "platform preset primary nav should prioritize product and updates",
);

assert.equal(personalPreset.booking.mode, "contact-only", "personal preset should default to contact-only booking");
assert.equal(businessPreset.booking.mode, "external-link", "business preset should default to external-link booking");
assert.equal(platformPreset.booking.mode, "hidden", "platform preset should default to hidden booking");

assert.equal(
  getHomePresetCopy("business", "en").heroEyebrow,
  "Business website",
  "business preset should expose business-oriented starter hero copy",
);

assert.equal(
  getHomePresetCopy("platform", "zh").heroEyebrow,
  "平台网站",
  "platform preset should expose localized platform hero copy",
);

assert.equal(
  getSectionPresetCopy("business", "en").proof.heading,
  "Show the evidence before the pitch",
  "business preset should use trust-oriented proof copy",
);

assert.equal(
  getSectionPresetCopy("platform", "en").topics.heading,
  "What the platform covers",
  "platform preset should use product-scope copy for topics",
);

console.log("Preset check passed.");
