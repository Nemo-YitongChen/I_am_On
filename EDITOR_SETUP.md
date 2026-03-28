# Editor and deployment setup

## What this file is for

This file explains how the browser editor and long-form admin work in this repository, and what must be configured before save actions can update GitHub and trigger Cloudflare deployment.

## Public routes

Default English routes:

- `/`
- `/about/`
- `/services/`
- `/consult/`
- `/recruiters/`
- `/book/`
- `/posts/`
- `/work/`

If you enable a secondary locale such as Chinese, the same pages appear under `/<locale>/...`.

## Editor routes

Page block editor:

- `/editor/home/`
- `/editor/about/`
- `/editor/services/`
- `/editor/consult/`
- `/editor/recruiters/`
- `/editor/book/`

Long-form admin:

- `/admin/`

## How the save flow works

1. A user opens an editor or admin route.
2. The page loads JSON or Markdown content from the repository.
3. The user enters the editor password in the browser.
4. Clicking **Save** sends a POST request to `/api/save`.
5. The save API reads the current file from GitHub, gets its `sha`, updates the file, and creates a commit.
6. Cloudflare rebuilds and republishes the site from GitHub.

## Paths allowed by the save API

The save API allows only these write targets:

- `src/content-live/**/*.json`
- `src/content/site/profile.json`
- `src/content/site/booking-options.json`
- `src/content/posts/**/*.md`
- `src/content/work/**/*.md`

It does not allow arbitrary writes outside those paths.

## Required Cloudflare runtime variables and secrets

Set these in **Workers & Pages -> your project -> Settings -> Variables and Secrets**.

Vars:

- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_BRANCH`

Secrets:

- `GITHUB_TOKEN`
- `EDITOR_SECRET`

## Booking page and Calendly

The booking page is intentionally flexible:

- page copy lives in `src/content-live/<locale>/book.json`
- booking link data lives in `src/content/site/booking-options.json`
- `showCalendly` inside `book.json` controls whether the booking option appears

The starter placeholder URL points to `https://calendly.com/signup`, not to any personal event link.

## Recommended setup order

1. Confirm the site deploys normally from GitHub.
2. Add `GITHUB_TOKEN` and `EDITOR_SECRET`.
3. Test `/editor/home/`.
4. Test `/editor/about/` and `/editor/book/`.
5. Test `/admin/` for posts and work.
6. Replace placeholder identity, URLs, and booking links before publishing a real site.
