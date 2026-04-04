import { getTemplatePreset } from "./template.js";

export const HOME_SECTION_TYPES = {
  PATHWAYS: "pathways",
  PROOF: "proof",
  WRITING: "writing",
  TOPICS: "topics",
};

export function buildHomeSections({
  siteType,
  pathwayCards = [],
  proofCards = [],
  writingCards = [],
  topicCards = [],
}) {
  const preset = getTemplatePreset(siteType);
  const sectionMap = {
    [HOME_SECTION_TYPES.PATHWAYS]: {
      type: HOME_SECTION_TYPES.PATHWAYS,
      version: 1,
      items: pathwayCards,
    },
    [HOME_SECTION_TYPES.PROOF]: {
      type: HOME_SECTION_TYPES.PROOF,
      version: 1,
      items: proofCards,
    },
    [HOME_SECTION_TYPES.WRITING]: {
      type: HOME_SECTION_TYPES.WRITING,
      version: 1,
      items: writingCards,
    },
    [HOME_SECTION_TYPES.TOPICS]: {
      type: HOME_SECTION_TYPES.TOPICS,
      version: 1,
      items: topicCards,
    },
  };

  return preset.homeSectionOrder
    .map((type) => sectionMap[type])
    .filter((section) => Array.isArray(section?.items) && section.items.length > 0);
}
