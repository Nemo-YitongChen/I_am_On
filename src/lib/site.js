import { siteConfig } from "../../site.config.mjs";
import { getNavLabels, getSiteType } from "./template.js";

const pageModules = import.meta.glob("../content-live/*/*.json", { eager: true });

const pagesByLocale = {};
for (const [modulePath, module] of Object.entries(pageModules)) {
  const match = modulePath.match(/\.\.\/content-live\/([^/]+)\/([^/]+)\.json$/);
  if (!match) {
    continue;
  }

  const [, locale, pageKey] = match;
  pagesByLocale[locale] ??= {};
  pagesByLocale[locale][pageKey] = module.default;
}

export const editablePageKeys = ["home", "about", "services", "consult", "recruiters", "book"];
export const publicPageKeys = [...editablePageKeys, "privacy"];

export function getDefaultLocale() {
  return siteConfig.i18n.defaultLocale;
}

export function getConfiguredLocales() {
  return Array.from(new Set(siteConfig.i18n.locales));
}

export function getAvailableLocales() {
  return getConfiguredLocales().filter((locale) => pagesByLocale[locale]?.home);
}

export function getSecondaryLocales() {
  return getAvailableLocales().filter((locale) => locale !== getDefaultLocale());
}

export function isSecondaryLocaleEnabled(locale) {
  return getSecondaryLocales().includes(locale);
}

export function isLocaleEnabled(locale) {
  return getAvailableLocales().includes(locale);
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

export function getLocalePrefix(locale = getDefaultLocale()) {
  return locale === getDefaultLocale() ? "" : `/${locale}`;
}

export function getPage(locale = getDefaultLocale(), pageKey = "home") {
  return pagesByLocale[locale]?.[pageKey] ?? pagesByLocale[getDefaultLocale()]?.[pageKey] ?? null;
}

export function getPageContentPath(locale = getDefaultLocale(), pageKey = "home") {
  return `src/content-live/${locale}/${pageKey}.json`;
}

export function getPublicPath(locale = getDefaultLocale(), pageKey = "home") {
  const prefix = getLocalePrefix(locale);

  if (pageKey === "home") {
    return prefix ? `${prefix}/` : "/";
  }

  return `${prefix}/${pageKey}/`;
}

export function getEditorPath(locale = getDefaultLocale(), pageKey = "home") {
  const prefix = getLocalePrefix(locale);
  return `${prefix}/editor/${pageKey}/`;
}

export function getPageLabel(locale = getDefaultLocale(), pageKey = "home") {
  if (pageKey === "home") {
    return getLocaleMeta(locale).homeLabel;
  }

  const labels = getNavLabels(locale, getSiteType());
  return labels[pageKey] ?? pageKey;
}

export function getEditablePages(locale = getDefaultLocale()) {
  return editablePageKeys
    .filter((pageKey) => Boolean(getPage(locale, pageKey)))
    .map((pageKey) => ({
      key: pageKey,
      label: getPageLabel(locale, pageKey),
      href: getEditorPath(locale, pageKey),
      liveHref: getPublicPath(locale, pageKey),
    }));
}
