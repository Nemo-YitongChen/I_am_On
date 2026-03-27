import { siteConfig } from "../../site.config.mjs";

const homePageModules = import.meta.glob("../content-live/*/home.json", { eager: true });

const homePagesByLocale = {};
for (const [modulePath, module] of Object.entries(homePageModules)) {
  const match = modulePath.match(/\.\.\/content-live\/([^/]+)\/home\.json$/);
  if (match) {
    homePagesByLocale[match[1]] = module.default;
  }
}

export function getDefaultLocale() {
  return siteConfig.i18n.defaultLocale;
}

export function getConfiguredLocales() {
  return Array.from(new Set(siteConfig.i18n.locales));
}

export function getAvailableLocales() {
  return getConfiguredLocales().filter((locale) => homePagesByLocale[locale]);
}

export function getSecondaryLocales() {
  return getAvailableLocales().filter((locale) => locale !== getDefaultLocale());
}

export function isSecondaryLocaleEnabled(locale) {
  return getSecondaryLocales().includes(locale);
}

export function getHomePage(locale = getDefaultLocale()) {
  return homePagesByLocale[locale] ?? homePagesByLocale[getDefaultLocale()];
}

export function getHomeContentPath(locale = getDefaultLocale()) {
  return `src/content-live/${locale}/home.json`;
}

export function getLocaleMeta(locale = getDefaultLocale()) {
  const defaultMeta = siteConfig.i18n.meta[getDefaultLocale()] ?? {
    label: getDefaultLocale().toUpperCase(),
    htmlLang: getDefaultLocale(),
    homeLabel: "Home",
  };
  const localeMeta = siteConfig.i18n.meta[locale] ?? {};

  return {
    label: localeMeta.label ?? locale.toUpperCase(),
    htmlLang: localeMeta.htmlLang ?? locale,
    homeLabel: localeMeta.homeLabel ?? defaultMeta.homeLabel,
  };
}
