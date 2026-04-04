import { getSiteType } from "./template.js";

function getLanguage(locale) {
  return locale === "zh" ? "zh-CN" : "en";
}

function getSameAs(profile) {
  return [profile.linkedin, profile.github].filter(Boolean);
}

export function buildPersonStructuredData({ profile, url, description, locale }) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.ownerName,
    url,
    description,
    email: profile.email,
    sameAs: getSameAs(profile),
    inLanguage: getLanguage(locale),
  };
}

export function buildProfilePageStructuredData({ profile, url, title, description, locale }) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: title,
    url,
    description,
    inLanguage: getLanguage(locale),
    mainEntity: buildPersonStructuredData({ profile, url, description, locale }),
  };
}

export function buildOrganizationStructuredData({ profile, url, description, locale }) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: profile.brand,
    url,
    description,
    email: profile.email,
    sameAs: getSameAs(profile),
    inLanguage: getLanguage(locale),
  };
}

export function buildWebSiteStructuredData({ profile, url, description, locale }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: profile.brand,
    url,
    description,
    inLanguage: getLanguage(locale),
  };
}

export function buildArticleStructuredData({ profile, url, title, description, publishedAt, locale }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: publishedAt.toISOString(),
    mainEntityOfPage: url,
    inLanguage: getLanguage(locale),
    author: {
      "@type": "Person",
      name: profile.ownerName,
      url: profile.linkedin,
    },
  };
}

export function buildCreativeWorkStructuredData({ profile, url, title, description, locale }) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description,
    url,
    inLanguage: getLanguage(locale),
    author: {
      "@type": "Person",
      name: profile.ownerName,
      url: profile.linkedin,
    },
  };
}

export function buildStructuredDataForPage({
  siteType = getSiteType(),
  pageType,
  profile,
  url,
  title,
  description,
  locale,
  publishedAt,
}) {
  if (!profile || !url || !pageType) {
    return [];
  }

  if (pageType === "post" && publishedAt) {
    return [
      buildArticleStructuredData({
        profile,
        url,
        title,
        description,
        publishedAt,
        locale,
      }),
    ];
  }

  if (pageType === "work") {
    return [
      buildCreativeWorkStructuredData({
        profile,
        url,
        title,
        description,
        locale,
      }),
    ];
  }

  if (siteType === "personal") {
    if (pageType === "home") {
      return [
        buildPersonStructuredData({
          profile,
          url,
          description,
          locale,
        }),
      ];
    }

    if (pageType === "about" || pageType === "recruiters") {
      return [
        buildProfilePageStructuredData({
          profile,
          url,
          title,
          description,
          locale,
        }),
      ];
    }
  }

  if (siteType === "business") {
    if (pageType === "home" || pageType === "about" || pageType === "recruiters") {
      return [
        buildOrganizationStructuredData({
          profile,
          url,
          description,
          locale,
        }),
      ];
    }
  }

  if (siteType === "platform") {
    if (pageType === "home") {
      return [
        buildWebSiteStructuredData({
          profile,
          url,
          description,
          locale,
        }),
      ];
    }

    if (pageType === "about" || pageType === "recruiters") {
      return [
        buildOrganizationStructuredData({
          profile,
          url,
          description,
          locale,
        }),
      ];
    }
  }

  return [];
}
