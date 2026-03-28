# Pages and Workers Sync Checklist

This file defines how to keep `booking_site` and `I_am_On` collaborative even when they do not use the same Cloudflare deployment mode.

Current state:

- `booking_site` is maintained as a Cloudflare Pages site with Pages Functions.
- `I_am_On` is maintained as a Cloudflare Workers site using the Astro Cloudflare adapter.

This is acceptable.

The goal is not to force identical deployment wiring.

The goal is to keep the reusable product layer aligned while allowing the deployment layer to differ.

## Short answer

Mixed deployment modes do **not** block collaboration if these stay aligned:

- content schema
- route structure
- editor UX
- admin UX
- save API request and response contract
- allowed editable path rules
- environment variable names

If those stay aligned, the deployment mode can differ without creating major drift.

## Current deployment split

### `booking_site`

- platform shape: Cloudflare Pages
- public routes: Astro page routes
- save endpoint: `functions/api/save.js`
- runtime bindings: Cloudflare Pages Variables and Secrets
- public site config: `astro.config.mjs`

### `I_am_On`

- platform shape: Cloudflare Workers
- public routes: Astro page routes
- save endpoint: `src/pages/api/save.js`
- runtime bindings: Worker vars and secrets via `wrangler.jsonc` plus dashboard secrets
- public site config: `astro.config.mjs`
- deploy config: `wrangler.jsonc`

## What must stay shared

These should be treated as the collaboration contract between the two projects.

### 1. Content model

Keep these structures compatible:

- `src/content-live/<locale>/*.json`
- `src/content/posts/<locale>/*.md`
- `src/content/work/<locale>/*.md`
- `src/content/site/profile.json`
- `src/content/site/booking-options.json`

If a page gains a new content field in one repo, decide whether it is structural.

If yes, port the field shape to the other repo before too much content depends on it.

### 2. Page keys and route semantics

Keep the meaning of these keys aligned:

- `home`
- `about`
- `services`
- `consult`
- `recruiters`
- `book`
- `posts`
- `work`

The exact deployment platform may differ, but public page intent should not drift.

### 3. Editor contract

Keep the browser editor behavior compatible:

- page switcher logic
- save button placement
- preview structure
- save status vocabulary
- live-page link behavior
- locale switching behavior

The current status flow should stay consistent:

- `Saving`
- `Commit created`
- `Deploying`
- `Live`

### 4. Save API contract

The frontend should be able to assume the same API behavior in both repos.

Keep these aligned:

- request path: `/api/save`
- method: `POST`
- auth header: `x-editor-secret`
- request body:
  - `path`
  - `content`
  - `message`
- success response:
  - `ok`
  - `commit`
  - `content`
- error response:
  - top-level `error`
  - optional detail fields

### 5. Allowed writable paths

The allowlist should stay conceptually the same:

- `src/content-live/**/*.json`
- `src/content/site/profile.json`
- `src/content/site/booking-options.json`
- `src/content/posts/**/*.md`
- `src/content/work/**/*.md`

If one repo expands writable scope, explicitly decide whether the other repo should match.

### 6. Environment variable names

Keep names consistent even if the platform UI differs:

- `GITHUB_TOKEN`
- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_BRANCH`
- `EDITOR_SECRET`

This reduces editor troubleshooting drift.

## What may differ safely

These are allowed to differ without harming collaboration.

### Deployment entrypoints

- `booking_site`: `functions/api/save.js`
- `I_am_On`: `src/pages/api/save.js`

### Cloudflare project wiring

- Pages dashboard setup
- `wrangler.jsonc`
- Worker asset config
- compatibility flags
- Pages-specific or Worker-specific build commands

### Runtime access details

- `context.env` in Pages Functions
- `context.locals.runtime.env` or Worker runtime env in Astro Worker mode

As long as both expose the same logical bindings, the implementation may differ.

## Recommended sync workflow

When a change starts in `booking_site`:

1. Decide whether it is structural or personal.
2. If personal, keep it only in `booking_site`.
3. If structural, first confirm it works in the live site context.
4. Then port the reusable version into `I_am_On`.
5. Remove any identity, links, or audience assumptions during the port.

When a change starts in `I_am_On`:

1. Keep it generic first.
2. Confirm it works with placeholder content.
3. Pull it into `booking_site` only if it improves the real site.
4. Re-check English and Chinese content tone after integrating it into the real site.

## When not to sync

Do **not** sync changes automatically when they are tied to:

- real personal identity
- recruiter-specific positioning
- real booking links
- real contact methods
- personal CV content
- audience-specific tone
- production-only SEO wording

## Drift risks to watch

These are the most likely ways the two repos drift in a harmful way:

- page JSON gains new fields in one repo only
- editor UI supports a new section in one repo only
- `/api/save` returns different success or error shapes
- writable path rules differ silently
- locale routing helpers diverge
- booking behavior becomes mandatory in the template

## Lightweight verification before syncing

Before moving a structural change across repos, check:

1. Does the same content field exist in both schemas?
2. Does the editor still save to `/api/save` with the same payload?
3. Does the save response still support the same UI state flow?
4. Did any personal link or personal copy leak into the template?
5. Does the translated Chinese still sound native after the move?

## Practical rule

Treat deployment mode as an implementation detail.

Treat content schema, editing workflow, and public information architecture as the real shared product surface.
