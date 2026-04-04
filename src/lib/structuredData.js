import { getSiteType } from "./template.js";
import { siteConfig } from "../../site.config.mjs";

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
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: profile.brand,
    url,
    description,
    inLanguage: getLanguage(locale),
  };

  if (siteConfig.search?.enabled && siteConfig.search?.path) {
    data.potentialAction = {
      "@type": "SearchAction",
      target: new URL(siteConfig.search.path, url).toString(),
      "query-input": "required name=search_term_string",
    };
  }

  return data;
}

export function buildFAQPageStructuredData({ url, locale, items = [] }) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url,
    inLanguage: getLanguage(locale),
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildServiceStructuredData({ profile, url, title, description, locale }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    description,
    url,
    inLanguage: getLanguage(locale),
    provider: {
      "@type": "Organization",
      name: profile.brand,
      url: profile.website ?? url,
    },
  };
}

export function buildProductStructuredData({ profile, url, locale, product }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    url: product.url ?? url,
    image: product.image,
    category: product.category,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand ?? profile.brand,
    },
    inLanguage: getLanguage(locale),
  };

  if (product.offers) {
    data.offers = {
      "@type": "Offer",
      priceCurrency: product.offers.priceCurrency,
      price: product.offers.price,
      availability: product.offers.availability,
      url: product.offers.url ?? product.url ?? url,
    };
  }

  return data;
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
  faqItems = [],
  faqStructuredData = false,
  product = null,
}) {
  if (!profile || !url || !pageType) {
    return [];
  }

  const schemas = [];

  if (pageType === "post" && publishedAt) {
    schemas.push(
      buildArticleStructuredData({
        profile,
        url,
        title,
        description,
        publishedAt,
        locale,
      }),
    );
  }

  if (pageType === "work") {
    schemas.push(
      buildCreativeWorkStructuredData({
        profile,
        url,
        title,
        description,
        locale,
      }),
    );
  }

  if (siteType === "personal") {
    if (pageType === "home") {
      schemas.push(
        buildPersonStructuredData({
          profile,
          url,
          description,
          locale,
        }),
      );
    }

    if (pageType === "about" || pageType === "recruiters") {
      schemas.push(
        buildProfilePageStructuredData({
          profile,
          url,
          title,
          description,
          locale,
        }),
      );
    }
  }

  if (siteType === "business") {
    if (pageType === "home" || pageType === "about" || pageType === "recruiters") {
      schemas.push(
        buildOrganizationStructuredData({
          profile,
          url,
          description,
          locale,
        }),
      );
    }

    if (pageType === "services" || pageType === "book" || pageType === "consult") {
      schemas.push(
        buildServiceStructuredData({
          profile,
          url,
          title,
          description,
          locale,
        }),
      );
    }
  }

  if (siteType === "platform") {
    if (pageType === "home") {
      schemas.push(
        buildWebSiteStructuredData({
          profile,
          url,
          description,
          locale,
        }),
      );
      schemas.push(
        buildOrganizationStructuredData({
          profile,
          url,
          description,
          locale,
        }),
      );
    }

    if (pageType === "about" || pageType === "recruiters") {
      schemas.push(
        buildOrganizationStructuredData({
          profile,
          url,
          description,
          locale,
        }),
      );
    }

    if (pageType === "services" || pageType === "book" || pageType === "consult") {
      schemas.push(
        buildServiceStructuredData({
          profile,
          url,
          title,
          description,
          locale,
        }),
      );
    }
  }

  if (pageType === "faq" && Array.isArray(faqItems) && faqItems.length > 0) {
    schemas.push(
      buildFAQPageStructuredData({
        url,
        locale,
        items: faqItems,
      }),
    );
  }

  if (faqStructuredData && Array.isArray(faqItems) && faqItems.length > 0) {
    schemas.push(
      buildFAQPageStructuredData({
        url,
        locale,
        items: faqItems,
      }),
    );
  }

  if (product?.name && product?.description) {
    schemas.push(
      buildProductStructuredData({
        profile,
        url,
        locale,
        product,
      }),
    );
  }

  return schemas;
}
