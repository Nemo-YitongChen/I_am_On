# I_am_On

An English-first, content-driven Astro starter for a personal site, selected work, writing, and lightweight booking flows.

## What this template gives you

- default English home page without a locale prefix
- optional extra locales such as `zh` or `ja`
- page-section content stored in JSON for browser editing
- optional long-form content in Markdown for posts and case studies
- a protected in-browser editor that writes changes back to GitHub
- Cloudflare Worker deployment with Git-triggered rebuilds

## Content model

Use one primary pattern for each kind of content:

- page blocks: `src/content-live/<locale>/*.json`
- posts: `src/content/posts/**/*.md`
- work / case studies: `src/content/work/**/*.md`

The starter home page already reads from:

- `src/content-live/en/home.json`
- `src/content-live/zh/home.json` when Chinese is enabled

## Default language and adding more locales

Language settings live in `site.config.mjs`.

By default the template ships with:

- `defaultLocale: "en"`
- `locales: ["en"]`

That means:

- English home page is `/`
- English editor is `/editor/home`
- no other locale routes are enabled yet

To add Chinese later:

1. Update `site.config.mjs` so `locales` becomes `["en", "zh"]`.
2. Keep `defaultLocale` as `en` if you still want English on `/`.
3. Add `src/content-live/zh/home.json`.
4. Visit `/zh/` and `/zh/editor/home`.

To add another locale such as Japanese, repeat the same pattern with its JSON content file and locale metadata.

## Local development

```bash
npm install
npm run dev
```

Useful files to edit first:

- `site.config.mjs`
- `src/content-live/en/home.json`
- `src/layouts/BaseLayout.astro`
- `src/components/HomePage.astro`

## Deploy to Cloudflare

This repo is configured for the Cloudflare Astro adapter in Worker mode.

Typical setup:

1. Fork or copy this repository.
2. In Cloudflare, create a new Worker build from your GitHub repository.
3. Let Cloudflare install dependencies and run the repo build/deploy commands.
4. Keep `wrangler.jsonc` in sync with your Worker name and deployment settings.

Important project files:

- `wrangler.jsonc`
- `astro.config.mjs`
- `package.json`

## Variables and secrets

Non-sensitive repo settings are already stored in `wrangler.jsonc`:

- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_BRANCH`

Set the sensitive values in Cloudflare under your Worker project's runtime Variables and Secrets:

- `GITHUB_TOKEN`
- `EDITOR_SECRET`

Use runtime secrets, not build-only variables, for editor write-back.

## Enable the editor

The starter editor writes JSON content back to GitHub through `/api/save`.

Current editor routes:

- English: `/editor/home`
- Secondary locale: `/<locale>/editor/home`

How it works:

1. Open the editor page.
2. Enter the editor password.
3. Click save.
4. The app sends `x-editor-secret` to `/api/save`.
5. The API updates the matching JSON file in GitHub.
6. Cloudflare deploys the new commit.

## Use it as a personal or booking site

A common first pass is:

1. Replace the default copy in `src/content-live/en/home.json`.
2. Update branding and navigation in `src/layouts/BaseLayout.astro`.
3. Change CTA links to your booking, contact, or recruiter page.
4. Add `src/content/work/` or `src/content/posts/` only when you are ready for longer content.

## Current scope

This starter is optimized for:

- homepage editing in the browser
- lightweight bilingual setup
- simple Git-backed publishing

Good next extensions after the home page:

- about
- services
- consult / booking pages
- recruiter summary pages
- an `/admin` surface for longer-form content later
