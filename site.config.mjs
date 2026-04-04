export const siteConfig = {
  site: "https://example.com",
  siteType: "personal",
  shell: {
    skipLink: true,
    announcementBar: false,
    utilityNav: false,
    serviceNav: false,
    breadcrumbs: true,
    searchModal: false,
    consentBanner: false,
  },
  i18n: {
    defaultLocale: "en",
    // Add locales such as "zh" or "ja" here when their content files are ready.
    locales: ["en"],
    meta: {
      en: { label: "English", htmlLang: "en", homeLabel: "Home" },
      zh: { label: "中文", htmlLang: "zh-CN", homeLabel: "首页" },
      ja: { label: "日本語", htmlLang: "ja", homeLabel: "ホーム" },
    },
  },
};
