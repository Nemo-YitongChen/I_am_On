import { siteConfig } from "../../site.config.mjs";

const defaultShell = {
  announcementBar: false,
  utilityNav: false,
  serviceNav: false,
  breadcrumbs: false,
  searchModal: false,
  consentBanner: false,
};

const templatePresets = {
  personal: {
    homeSectionOrder: ["pathways", "proof", "writing", "topics"],
    navDepth: "shallow",
    proofEmphasis: "selected-work",
  },
  business: {
    homeSectionOrder: ["proof", "topics", "pathways", "writing"],
    navDepth: "medium",
    proofEmphasis: "trust-and-services",
  },
  platform: {
    homeSectionOrder: ["topics", "proof", "writing", "pathways"],
    navDepth: "deep",
    proofEmphasis: "product-and-use-cases",
  },
};

export function getSiteType() {
  return siteConfig.siteType ?? "personal";
}

export function getTemplatePreset(siteType = getSiteType()) {
  return templatePresets[siteType] ?? templatePresets.personal;
}

export function getShellConfig() {
  return {
    ...defaultShell,
    ...(siteConfig.shell ?? {}),
  };
}
