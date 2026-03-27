import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://example.com",
  i18n: {
    locales: ["zh", "en"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
