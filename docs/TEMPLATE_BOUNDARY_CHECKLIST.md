# Template Boundary Checklist

This file defines the long-term maintenance boundary between:

- `I_am_On`
- `booking_site`

The goal is to keep `I_am_On` reusable as a public template while allowing `booking_site` to keep evolving as a real personal website.

## Core principle

Use `I_am_On` for reusable structure.

Use `booking_site` for real identity, real positioning, and real content.

Anything that depends on a specific person, audience, recruiting context, booking flow, CV, or tone of voice should stay in `booking_site` unless it can be generalized cleanly.

## What belongs in `I_am_On`

These should be treated as template-owned and reusable:

- content architecture
  - `src/content-live/<locale>/*.json`
  - `src/content/posts/<locale>/*.md`
  - `src/content/work/<locale>/*.md`
  - `src/content/site/profile.json`
  - `src/content/site/booking-options.json`
- generic page routes
  - home
  - about
  - services
  - consult
  - recruiters
  - book
  - posts
  - work
  - privacy
- shared UI systems
  - typography scale
  - spacing rhythm
  - card treatment
  - navigation and footer structure
  - editor layout
  - admin layout
- editing infrastructure
  - `/api/save`
  - page editor
  - `/admin`
  - GitHub write-back rules
  - deployment status flow
- reusable SEO and deployment scaffolding
  - canonical
  - `hreflang`
  - `robots.txt`
  - `sitemap.xml`
  - Cloudflare Worker deployment wiring
- safe default content patterns
  - placeholder profile
  - generic recruiter page
  - generic posts and work starter entries
  - optional Calendly support

## What belongs in `booking_site`

These should be treated as site-owned and should not flow back into the template unless generalized first:

- real identity
  - name
  - email
  - phone
  - LinkedIn
  - GitHub
  - CV / resume files
- personal positioning
  - recruiter-facing claims
  - work history framing
  - consult framing
  - biography and tone
- real booking setup
  - actual Calendly event URLs
  - which booking options are enabled
  - direct contact preference
- real public content
  - posts
  - work entries
  - recruiter summaries
  - work proof
- language polish tied to the person and audience
  - English professional tone for this site
  - Chinese wording tuned to this site
- business decisions
  - what should be public
  - what should be editor-only
  - what should be admin-only

## What can flow from `booking_site` back into `I_am_On`

Move a change back into the template only if all of these are true:

1. It solves a structural problem, not just a personal branding problem.
2. It still makes sense with placeholder content.
3. It does not leak personal identity or private links.
4. It improves the default starter for most users.
5. It does not force one narrow use case.

Typical examples:

- better mobile layout
- better card hierarchy
- stronger navigation structure
- clearer editor UI
- safer save API logic
- optional booking patterns
- more reusable long-form admin flow

## What must never be copied back to `I_am_On` directly

- real email addresses
- real phone numbers
- real LinkedIn URLs
- real GitHub profile URLs
- CV or resume PDFs
- personal Calendly event links
- personal work history
- personal recruiter copy
- any copy written only for one person

## Booking boundary

`I_am_On`:

- may include booking page structure
- may include `showCalendly`
- may include placeholder booking options
- must use neutral or setup-oriented links such as `https://calendly.com/signup`

`booking_site`:

- may enable or disable real booking behavior
- may use the actual event link
- may tune FAQ and contact expectations to the real workflow

## Editor and admin boundary

Keep these in sync across both repos when possible:

- toolbar structure
- save status flow
- preview behavior
- path allowlist behavior
- password-header pattern
- long-form admin unlock pattern

Do not force exact copy if `booking_site` needs site-specific behavior.

## Deployment boundary

The two repos do not need to use the same Cloudflare product to collaborate well.

Current accepted split:

- `booking_site`: Cloudflare Pages plus Pages Functions
- `I_am_On`: Cloudflare Workers plus Astro Cloudflare adapter

What must stay aligned is the product contract:

- content schema
- editor flow
- admin flow
- save API payload and response shape
- writable path allowlist
- environment variable names

What may differ:

- deployment commands
- routing adapters
- runtime env access details
- platform-specific config files

See `docs/PAGES_WORKERS_SYNC_CHECKLIST.md` for the practical sync rules.

## Language review standard before every `commit + push`

For `booking_site`:

- English content should sound natural, professional, and typical of a polished English-language personal or recruiter-facing site.
- Chinese content should read smoothly, avoid literal translation, and preserve the intended meaning accurately.

For `I_am_On`:

- English content should stay generic, reusable, and free of personal specifics.
- Chinese content should stay clear, neutral, and suitable as starter copy.

## Recommended workflow

When improving `booking_site`:

1. Solve the real problem in `booking_site`.
2. Verify the result in context.
3. Decide whether the improvement is structural or personal.
4. If structural, generalize it before moving it into `I_am_On`.
5. Keep the placeholder content in `I_am_On` generic and non-personal.

When improving `I_am_On`:

1. Protect generality first.
2. Avoid assuming one profession, one market, or one booking flow.
3. Keep content editable and safe by default.
4. Treat `booking_site` as one implementation, not as the template itself.

## Current stable split

At the current stage:

- `I_am_On` is the reusable template source of truth for structure and generic editing flows.
- `booking_site` is the live personal website source of truth for identity, actual content, and production-specific decisions.
