# Editor and deployment setup

## What this file is for

This file explains how the browser-based editor works in this repository, and what needs to be configured before the save flow can update content and publish through Cloudflare Pages.

## Current editor routes

- `/editor/en/home`
- `/editor/zh/home`

## Current public routes

- `/en/`
- `/zh/`

## How the flow works

1. A user opens the editor route.
2. The editor loads JSON content from `src/content-live/...`.
3. The user edits fields in the browser.
4. Clicking **Save** sends a POST request to `/api/save`.
5. `functions/api/save.js` writes the updated file back to GitHub.
6. Cloudflare Pages Git integration rebuilds and redeploys the site after the commit lands on the configured branch.

Cloudflare Pages Functions run from the `/functions` directory, and Git-integrated Pages projects automatically deploy after changes are pushed to the connected repository branch.

## Required Cloudflare Pages environment variables

Set these in **Workers & Pages -> your project -> Settings -> Variables and Secrets**:

- `GITHUB_TOKEN`
- `GITHUB_REPO`
- `GITHUB_BRANCH`

### Expected values

- `GITHUB_TOKEN`: a GitHub token with permission to update repository contents
- `GITHUB_REPO`: for example `Nemo-YitongChen/I_am_On`
- `GITHUB_BRANCH`: usually `main`

## Required repository / project conditions

- Cloudflare Pages project must be connected to the GitHub repository through Git integration.
- The repository branch used by the save API must match the production or preview deployment branch you want to update.
- The token used in `GITHUB_TOKEN` must be allowed to modify repository contents.

## Current limitations

- The editor currently supports only home page editing.
- The editor is not yet protected by authentication.
- The allowed save paths are limited to `src/content-live/`.
- `src/site.config.json` now exists as the place to define default locale and whether multilingual mode is enabled, but the runtime wiring still needs to be completed in the next implementation step.

## Recommended next implementation step

1. Wire `src/site.config.json` into Astro config / routing decisions.
2. Add editor routes for About.
3. Add access protection to `/editor`.
4. Expand public pages beyond the home page.
5. Add preview / draft behavior if required.
