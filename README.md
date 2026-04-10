# I_am_On

An English-first, content-driven Astro starter for a personal site that can also support:

- recruiter-facing pages
- selected work and writing
- protected browser editing
- protected long-form admin editing
- optional multilingual routes
- optional booking with or without Calendly

This repo is the reusable template.

Use it for structure, not for real identity.

## Five-minute quickstart

1. Install dependencies.
2. Update `site.config.mjs`.
3. Replace the placeholder identity in `src/content/site/profile.json`.
4. Rewrite `src/content-live/en/home.json`.
5. Run `npm run validate`.
6. Deploy to Cloudflare Workers.

## What this template includes

Public pages:

- `/`
- `/about/`
- `/services/`
- `/consult/`
- `/recruiters/`
- `/book/`
- `/posts/`
- `/work/`
- `/privacy/`
- `/404`

Homepage structure:

- hero with clear CTA
- start-here entry cards
- selected proof cards
- recent writing cards
- focus-area topic cards

Protected editing:

- `/editor/home/`
- `/editor/about/`
- `/editor/services/`
- `/editor/consult/`
- `/editor/recruiters/`
- `/editor/book/`
- `/admin/`

## Content model

- page blocks: `src/content-live/<locale>/*.json`
- posts: `src/content/posts/<locale>/*.md`
- work: `src/content/work/<locale>/*.md`
- profile: `src/content/site/profile.json`
- booking options: `src/content/site/booking-options.json`

## Template modes already supported

You can already run this starter in a few practical modes without changing the code structure:

- single-language site
- bilingual site
- booking page with Calendly
- booking page without Calendly
- public site with editor/admin enabled
- public site where you simply do not configure save secrets yet

Main toggles:

- locales: `site.config.mjs`
- booking mode: `site.config.mjs`
- navigation labels: `site.config.mjs`
- shell modules: `site.config.mjs`
- real booking link: `src/content/site/booking-options.json`

Optional shell modules now render with preset-aware defaults when enabled:

- `shell.announcementBar`
- `shell.utilityNav`
- `shell.serviceNav`

Preset defaults now include:

- `personal`: breadcrumb on, other optional shell modules off
- `business`: announcement bar, utility nav, service nav, and breadcrumb on
- `platform`: announcement bar, utility nav, service nav, and breadcrumb on

You can override the default shell content with:

- `announcementBar`
- `utilityNavigation`
- `serviceNavigation`

Starter preset content:

- `npm run preset:apply -- --type business`
- `npm run preset:apply -- --type platform`
- `npm run preset:apply -- --type business --locales en,zh`

These preset seeds include:

- public page JSON
- booking options
- starter posts
- starter work entries

## Local development

```bash
npm install
npm run dev
```

Validation commands:

- `npm run build`
- `npm run smoke`
- `npm run validate`

## Cloudflare Worker deployment

This repo is configured for Astro + Cloudflare Worker mode.

Important files:

- `astro.config.mjs`
- `wrangler.jsonc`
- `site.config.mjs`
- `src/pages/api/save.js`

Before enabling browser save, configure runtime secrets and vars in Cloudflare:

- `GITHUB_TOKEN`
- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_BRANCH`
- `EDITOR_SECRET`

The template no longer hardcodes a personal GitHub owner or repository into the Worker config.

## Custom domain

After the Worker is deployed and working:

1. add your custom domain in Cloudflare
2. update `siteConfig.site` in `site.config.mjs`
3. deploy again so canonical URLs and sitemap output match the real domain

## Browser editor and admin

The editor writes content back through `/api/save`.

Security is intentionally lightweight:

- password header: `x-editor-secret`
- file allowlist in the save API
- admin unlock stored for the current tab session

This is meant for low-friction ownership, not for multi-user CMS security.

The public pages also include reusable next-step handoff sections, so visitors can move between work, writing, recruiter context, and booking without needing to restart from the homepage.

This repo is currently moving from a strong personal-site starter toward a multi-preset template kernel. The current implementation foundation is tracked in:

- `docs/TEMPLATE_SYSTEM_PLAN.md`

## Documentation index

- `docs/QUICKSTART.md`
- `docs/OPERATIONS.md`
- `docs/TEMPLATE_SYSTEM_PLAN.md`
- `docs/STRUCTURED_DATA_RULES.md`
- `docs/TEMPLATE_BOUNDARY_CHECKLIST.md`
- `docs/PAGES_WORKERS_SYNC_CHECKLIST.md`

## Writing quality standard

Before each push:

- English should sound natural, clear, and reusable
- Chinese should be fluent, neutral, and not read like a literal translation
