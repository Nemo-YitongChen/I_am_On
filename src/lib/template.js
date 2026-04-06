import { siteConfig } from "../../site.config.mjs";

const defaultShell = {
  skipLink: true,
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
    primaryNav: ["about", "work", "posts", "consult", "recruiters"],
    footerNav: ["work", "posts", "services", "recruiters", "book", "privacy"],
    booking: {
      mode: "contact-only",
    },
  },
  business: {
    homeSectionOrder: ["proof", "topics", "pathways", "writing"],
    navDepth: "medium",
    proofEmphasis: "trust-and-services",
    primaryNav: ["services", "work", "consult", "posts", "about"],
    footerNav: ["services", "work", "consult", "posts", "about", "book", "privacy"],
    booking: {
      mode: "external-link",
    },
  },
  platform: {
    homeSectionOrder: ["topics", "proof", "writing", "pathways"],
    navDepth: "deep",
    proofEmphasis: "product-and-use-cases",
    primaryNav: ["services", "work", "posts", "about"],
    footerNav: ["services", "work", "posts", "about", "privacy"],
    booking: {
      mode: "hidden",
    },
  },
};

const defaultBooking = {
  mode: "contact-only",
  externalUrl: "https://calendly.com/signup",
  externalLabel: {
    en: "Open booking link",
    zh: "打开预约入口",
  },
};

export function getSiteType() {
  return siteConfig.siteType ?? "personal";
}

export function getTemplatePreset(siteType = getSiteType()) {
  return templatePresets[siteType] ?? templatePresets.personal;
}

export function getPrimaryNavKeys(siteType = getSiteType()) {
  return [...(getTemplatePreset(siteType).primaryNav ?? templatePresets.personal.primaryNav)];
}

export function getFooterNavKeys(siteType = getSiteType()) {
  return [...(getTemplatePreset(siteType).footerNav ?? templatePresets.personal.footerNav)];
}

export function getBookingConfig(locale = "en", legacyMode = "contact-only", siteType = getSiteType()) {
  const preset = getTemplatePreset(siteType);
  const configured = siteConfig.booking ?? {};
  const merged = {
    ...defaultBooking,
    ...(preset.booking ?? {}),
    ...configured,
  };

  return {
    ...merged,
    mode: configured.mode ?? preset.booking?.mode ?? legacyMode ?? defaultBooking.mode,
    externalLabel: typeof merged.externalLabel === "string"
      ? merged.externalLabel
      : merged.externalLabel?.[locale] ?? merged.externalLabel?.en ?? defaultBooking.externalLabel.en,
  };
}

export function getShellConfig() {
  return {
    ...defaultShell,
    ...(siteConfig.shell ?? {}),
  };
}
