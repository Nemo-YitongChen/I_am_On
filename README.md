# I_am_On

An English-first, content-driven Astro starter for a personal website with:

- a clear homepage
- reusable About / Services / Consult / Recruiters / Book pages
- selected work and writing collections
- a protected browser editor for page content
- a protected `/admin` area for Markdown posts and work entries
- optional multilingual support
- optional Calendly display on the booking page

## What makes this different

This template is based on a real project flow that was iterated in production first, then generalized back into a reusable starter.

That means it already includes:

- stronger typography and spacing
- recruiter-facing information architecture
- a lighter-weight content editing experience
- a practical work / writing structure
- a more professional booking page pattern

## Content model

Use one primary pattern for each kind of content:

- page blocks: `src/content-live/<locale>/*.json`
- posts: `src/content/posts/<locale>/*.md`
- work: `src/content/work/<locale>/*.md`
- site profile: `src/content/site/profile.json`
- booking options: `src/content/site/booking-options.json`

## Default language and adding more locales

Language settings live in `site.config.mjs`.

By default the template ships with:

- `defaultLocale: "en"`
- `locales: ["en"]`

That means:

- English home page is `/`
- English editor routes are `/editor/...`
- no secondary locale routes are enabled yet

Chinese starter content is already included, but it is not active until you enable it.

To turn on Chinese:

1. Update `site.config.mjs` so `locales` becomes `["en", "zh"]`.
2. Keep `defaultLocale` as `en` if you want English on `/`.
3. Deploy again.
4. Your Chinese routes will appear under `/zh/...`.

## Main routes included

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

Secondary locale pages follow the same pattern under `/<locale>/...`.

Protected editing routes:

- `/editor/home/`
- `/editor/about/`
- `/editor/services/`
- `/editor/consult/`
- `/editor/recruiters/`
- `/editor/book/`
- `/admin/`

## Optional Calendly on the booking page

The booking page supports an optional Calendly section.

How it works:

- page-level copy lives in `src/content-live/<locale>/book.json`
- booking link options live in `src/content/site/booking-options.json`
- the boolean `showCalendly` inside `book.json` controls whether the Calendly option is shown

By default:

- `showCalendly` is `false`
- the placeholder Calendly URL points to `https://calendly.com/signup`

That means the template does **not** ship with anyone's personal chat link.

To enable it for a real site:

1. set `showCalendly` to `true`
2. replace the placeholder `url` in `booking-options.json` with your real event link

## Local development

```bash
npm install
npm run dev
```

Useful files to edit first:

- `site.config.mjs`
- `src/content/site/profile.json`
- `src/content-live/en/home.json`
- `src/content-live/en/book.json`
- `src/layouts/BaseLayout.astro`

## Deploy to Cloudflare

This repo is configured for Astro + Cloudflare Worker mode.

Typical setup:

1. Fork or copy this repository.
2. In Cloudflare, create a new Worker build from your GitHub repository.
3. Keep the default build and deploy commands from this repo.
4. Let Cloudflare deploy from the branch you want to publish.

Important project files:

- `wrangler.jsonc`
- `astro.config.mjs`
- `package.json`

## Variables and secrets

Non-sensitive runtime vars already live in `wrangler.jsonc`:

- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_BRANCH`

Set the sensitive values in Cloudflare under your Worker project's runtime Variables and Secrets:

- `GITHUB_TOKEN`
- `EDITOR_SECRET`

Use runtime secrets, not build-only variables, for editor write-back.

## Browser editor

The page editor writes JSON content back to GitHub through `/api/save`.

Current page editor routes:

- `/editor/home/`
- `/editor/about/`
- `/editor/services/`
- `/editor/consult/`
- `/editor/recruiters/`
- `/editor/book/`

How it works:

1. Open an editor page.
2. Enter the editor password.
3. Click save.
4. The app sends `x-editor-secret` to `/api/save`.
5. The API updates the matching JSON or Markdown file in GitHub.
6. Cloudflare deploys the new commit.

## Admin for posts and work

`/admin/` is designed for longer-form content.

It lets you:

- unlock a protected editing area in the browser
- edit existing posts
- edit existing work entries
- save Markdown back to GitHub

The starter intentionally supports editing existing entries first. It does not try to be a full CMS.

## How to personalize this template

Start in this order:

1. Replace the placeholder identity in `src/content/site/profile.json`.
2. Rewrite `src/content-live/en/home.json`.
3. Update `about`, `services`, `consult`, `recruiters`, and `book` content files.
4. Replace the sample `posts` and `work` entries with your own.
5. Turn on Chinese or another locale only when the translated content is ready.
6. If you want booking, replace the placeholder Calendly setup link with your own event URL.

## Notes on writing quality

This template is designed to encourage:

- clearer English copy
- shorter, more readable paragraphs
- better section hierarchy
- smoother Chinese phrasing when a second locale is enabled

When shipping real content, review English for natural professional tone and Chinese for fluency and accuracy before each deploy.
