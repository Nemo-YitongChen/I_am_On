import { getCollection, getEntry } from "astro:content";
import { getAvailableLocales, getDefaultLocale, getLocalePrefix } from "./site.js";

export type SiteLocale = string;
export type LongformCollectionName = "posts" | "work";

export function getEnabledLocales() {
  return getAvailableLocales();
}

export function getSlugFromContentId(id: string) {
  return id.replace(/^[^/]+\//, "").replace(/\.md$/, "");
}

export function getContentFilePath(type: LongformCollectionName, locale: SiteLocale, slug: string) {
  return `src/content/${type}/${locale}/${slug}.md`;
}

export function getContentPublicPath(type: LongformCollectionName, locale: SiteLocale, slug: string) {
  const prefix = getLocalePrefix(locale);
  return `${prefix}/${type}/${slug}/`;
}

export async function getWorkList(locale: SiteLocale = getDefaultLocale()) {
  const entries = await getCollection("work", ({ id }) => id.startsWith(`${locale}/`));
  return entries.sort((a, b) => a.data.order - b.data.order);
}

export async function getPostsList(locale: SiteLocale = getDefaultLocale()) {
  const entries = await getCollection("posts", ({ id }) => id.startsWith(`${locale}/`));
  return entries.sort((a, b) => {
    if (a.data.order !== b.data.order) {
      return a.data.order - b.data.order;
    }

    return b.data.publishedAt.getTime() - a.data.publishedAt.getTime();
  });
}

export async function getBookingOptions(locale: SiteLocale) {
  const entries = await getCollection("bookingOptions", ({ data }) => data.lang === locale);
  return entries.sort((a, b) => {
    if (a.data.order !== b.data.order) {
      return a.data.order - b.data.order;
    }

    return Number(b.data.featured) - Number(a.data.featured);
  });
}

export async function getProfile() {
  const entry = await getEntry("site", "profile");
  if (!entry) {
    throw new Error("Missing site profile content");
  }
  return entry.data;
}
