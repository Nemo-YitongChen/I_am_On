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

const defaultNavLabels = {
  personal: {
    en: {
      about: "About",
      work: "Work",
      consult: "Consult",
      recruiters: "For Recruiters",
      posts: "Writing",
      services: "Services",
      book: "Book",
      privacy: "Privacy",
    },
    zh: {
      about: "关于",
      work: "案例",
      consult: "咨询",
      recruiters: "招聘摘要",
      posts: "文章",
      services: "服务",
      book: "预约",
      privacy: "隐私",
    },
  },
  business: {
    en: {
      about: "About",
      work: "Case Studies",
      consult: "Fit",
      recruiters: "Proof",
      posts: "Insights",
      services: "Services",
      book: "Contact",
      privacy: "Privacy",
    },
    zh: {
      about: "关于",
      work: "案例",
      consult: "匹配判断",
      recruiters: "证明",
      posts: "洞察",
      services: "服务",
      book: "联系",
      privacy: "隐私",
    },
  },
  platform: {
    en: {
      about: "About",
      work: "Use Cases",
      consult: "Solutions",
      recruiters: "Trust",
      posts: "Updates",
      services: "Product",
      book: "Contact",
      privacy: "Privacy",
    },
    zh: {
      about: "关于",
      work: "使用案例",
      consult: "解决方案",
      recruiters: "信任",
      posts: "更新",
      services: "产品",
      book: "联系",
      privacy: "隐私",
    },
  },
};

const defaultAnnouncementBars = {
  personal: {
    en: {
      label: "Start with work, writing, or the recruiter summary.",
      key: "work",
    },
    zh: {
      label: "先看案例、文章，或招聘摘要。",
      key: "work",
    },
  },
  business: {
    en: {
      label: "Start with services or case studies.",
      key: "services",
    },
    zh: {
      label: "先看服务页或案例页。",
      key: "services",
    },
  },
  platform: {
    en: {
      label: "Start with product pages, use cases, or updates.",
      key: "services",
    },
    zh: {
      label: "先看产品页、使用案例或更新。",
      key: "services",
    },
  },
};

const defaultUtilityNav = {
  personal: ["posts", "privacy"],
  business: ["posts", "about", "privacy"],
  platform: ["posts", "about", "privacy"],
};

const defaultServiceNav = {
  personal: {
    about: ["about", "work", "posts"],
    services: ["services", "consult", "book"],
    consult: ["consult", "work", "book"],
    recruiters: ["recruiters", "work", "book"],
    book: ["book", "recruiters", "about"],
    posts: ["posts", "work", "book"],
    work: ["work", "recruiters", "book"],
  },
  business: {
    about: ["about", "services", "work"],
    services: ["services", "work", "consult", "book"],
    consult: ["consult", "services", "book"],
    recruiters: ["recruiters", "work", "book"],
    book: ["book", "services", "work"],
    posts: ["posts", "work", "services"],
    work: ["work", "services", "book"],
  },
  platform: {
    about: ["about", "services", "posts"],
    services: ["services", "work", "posts"],
    consult: ["consult", "services", "about"],
    recruiters: ["recruiters", "services", "about"],
    book: ["book", "services", "about"],
    posts: ["posts", "services", "work"],
    work: ["work", "services", "posts"],
  },
};

function getLocalizedConfigValue(value, locale = "en") {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "object" && "label" in value && ("href" in value || "key" in value)) {
    return value;
  }

  if (typeof value === "object") {
    return value[locale] ?? value.en ?? value.default ?? null;
  }

  return value;
}

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

export function getNavLabels(locale = "en", siteType = getSiteType()) {
  const presetLabels = defaultNavLabels[siteType] ?? defaultNavLabels.personal;
  const localeLabels = presetLabels[locale] ?? presetLabels.en;
  const configured = siteConfig.navigationLabels?.[locale] ?? {};

  return {
    ...localeLabels,
    ...configured,
  };
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

export function getAnnouncementBar(locale = "en", siteType = getSiteType()) {
  const configured = getLocalizedConfigValue(siteConfig.announcementBar, locale);
  const preset = defaultAnnouncementBars[siteType] ?? defaultAnnouncementBars.personal;
  return configured ?? preset[locale] ?? preset.en ?? null;
}

export function getUtilityNavItems(locale = "en", siteType = getSiteType()) {
  const configured = getLocalizedConfigValue(siteConfig.utilityNavigation, locale);
  return configured ?? defaultUtilityNav[siteType] ?? defaultUtilityNav.personal;
}

export function getServiceNavItems(sectionKey, locale = "en", siteType = getSiteType()) {
  if (!sectionKey) {
    return [];
  }

  const configured = siteConfig.serviceNavigation?.[sectionKey] ?? siteConfig.serviceNavigation?.default ?? null;
  const configuredItems = getLocalizedConfigValue(configured, locale);

  if (configuredItems) {
    return configuredItems;
  }

  const preset = defaultServiceNav[siteType] ?? defaultServiceNav.personal;
  return preset[sectionKey] ?? [];
}
