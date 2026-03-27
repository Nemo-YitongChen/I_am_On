# I_am_On — Template Status and Plan

Last updated: 2026-03-27

## 1. Goal

Turn `I_am_On` into a reusable Astro starter for:

- personal introduction sites
- portfolio / selected work
- writing / notes
- booking / consultation pages
- browser-based content editing
- Git-based publishing to Cloudflare Pages

The template should be English-first by default, with multilingual support as an option that can be enabled later.

## 2. What has already been done

### Repository initialization
- The repository was initialized from empty.
- Basic Astro package setup was added.
- Basic Astro config was added.
- Base layout and starter styles were added.

### Template foundation added
Added files include:
- `README.md`
- `package.json`
- `astro.config.mjs`
- `src/content.config.ts`
- `src/layouts/BaseLayout.astro`
- `public/styles/global.css`
- `src/pages/index.astro`

### Live content prototype added
Added a minimal editable home-page system:
- `src/content-live/en/home.json`
- `src/content-live/zh/home.json`
- `src/components/HomePage.astro`
- `src/pages/en/index.astro`
- `src/pages/zh/index.astro`
- `src/pages/editor/en/home.astro`
- `src/pages/editor/zh/home.astro`
- `functions/api/save.js`

This means the template already demonstrates:
- reading page content from JSON files
- rendering the public page from that content
- editing the page in the browser
- saving content back to GitHub through an API endpoint
- relying on Cloudflare Pages Git deployment to publish updates

## 3. What is planned

### Product direction
`I_am_On` should become the parent template for other repositories such as `booking_site`.

### Template priorities
- English as default out of the box
- multilingual support optional
- browser-based editing experience
- content-driven pages instead of hard-coded copy
- reusable layout / section / card components
- optional booking and recruiter pages

### Long-term structure
Planned content split:
- JSON for page blocks that should be easy to edit inline
- Markdown / MDX for longer posts and case studies
- site config file for brand name, links, and locale settings

## 4. What is not finished yet

### English-only default is not fully finalized
The project is intended to be English-first with optional multilingual support, but configuration still needs to be cleaned up so that:
- English works as the default mode
- additional locales can be turned on by configuration
- multilingual pages are optional instead of always assumed

### More template pages still need to be added
Still needed:
- About
- Work / case-study listing
- Post listing and post template
- Consult / booking page
- Recruiter page
- Contact page

### Editor is still only first-pass
The editor currently covers only the home page.

Still needed:
- more editable sections
- richer field types
- content validation
- access protection
- optional preview / publish workflow

### Template docs still need to be improved
README still needs:
- setup instructions
- Cloudflare Pages deployment steps
- environment variables for the save API
- how to enable multilingual mode
- how to turn booking pages on or off

## 5. Immediate next steps

1. Finalize `astro.config.mjs` so English is the true default mode.
2. Add a `site.config.json` or similar file to control locales and template features.
3. Add About and Work pages using the same content-driven pattern.
4. Expand the editor to cover at least About.
5. Add setup instructions to README.
6. Test the save API with a real Cloudflare Pages deployment.

## 6. Recommended order of implementation

### Phase 1
- stabilize the home page flow
- confirm save API and Pages deployment loop
- make English-only mode the default behavior

### Phase 2
- add optional multilingual switch
- add reusable sections and more pages

### Phase 3
- add Markdown / MDX posts and case-study structure
- improve documentation and starter onboarding

### Phase 4
- harden editor access
- optionally add a second admin workflow for non-inline editing

## 7. Risks / constraints

- The current implementation proves the workflow, but it is not yet a finished starter.
- The editor should not be exposed publicly without authentication / access control.
- Template quality depends on keeping configuration and content clearly separated.

## 8. Update rule for this file

Update this file whenever any of the following changes:
- template structure
- default language behavior
- editor workflow
- save / deployment logic
- content model
- completed milestones
- blockers / risks
- next-step priorities

If a pull request changes any of those, update this file in the same pull request.
