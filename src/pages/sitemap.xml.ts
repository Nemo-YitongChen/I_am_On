import type { APIRoute } from "astro";
import { siteConfig } from "../../site.config.mjs";
import { getPostsList, getSlugFromContentId, getWorkList, getEnabledLocales } from "../lib/content";

const publicSections = ["", "about", "services", "consult", "recruiters", "book", "privacy", "posts", "work"];

function toLocalePrefix(locale: string) {
  return locale === siteConfig.i18n.defaultLocale ? "" : `/${locale}`;
}

function toAbsoluteUrl(path: string) {
  return new URL(path, siteConfig.site).toString();
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const GET: APIRoute = async () => {
  const urls = [];

  for (const locale of getEnabledLocales()) {
    const prefix = toLocalePrefix(locale);

    for (const section of publicSections) {
      const path = section ? `${prefix}/${section}/` : `${prefix || "/"}`;
      urls.push(toAbsoluteUrl(path));
    }

    const posts = await getPostsList(locale);
    for (const post of posts) {
      urls.push(toAbsoluteUrl(`${prefix}/posts/${getSlugFromContentId(post.id)}/`));
    }

    const workEntries = await getWorkList(locale);
    for (const work of workEntries) {
      urls.push(toAbsoluteUrl(`${prefix}/work/${getSlugFromContentId(work.id)}/`));
    }
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`),
    "</urlset>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
