import { defineConfig, passthroughImageService } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import { siteConfig } from "./site.config.mjs";

const localeConfig =
  siteConfig.i18n.locales.length > 1
    ? {
        i18n: {
          defaultLocale: siteConfig.i18n.defaultLocale,
          locales: siteConfig.i18n.locales,
          routing: "manual",
        },
      }
    : {};

export default defineConfig({
  site: siteConfig.site,
  adapter: cloudflare(),
  output: "server",
  image: {
    service: passthroughImageService(),
  },
  ...localeConfig,
});
