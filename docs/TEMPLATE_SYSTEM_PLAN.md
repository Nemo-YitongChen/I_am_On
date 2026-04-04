# Template System Plan

This file turns the shared design spec into an implementation plan for `I_am_On`.

Status:

- repo role: reusable template
- target role: shared kernel for personal, business, and platform site presets
- current state: strong personal-site starter, not yet a true multi-preset system
- progress:
  - 2026-04-04: Phase 1 foundation completed with `siteType`, preset helper, and home section registry
  - 2026-04-04: Phase 2 baseline started with section-driven `StructuredPage` and optional shell modules (`SkipLink`, `Breadcrumb`)

## Goal

Turn `I_am_On` into a shared template kernel with:

- one shell system
- one section rendering model
- one content contract
- multiple site presets

The template should not assume one profession, one audience, or one booking flow.

## Core split

The design spec should be implemented in two layers.

### Core spec

Always shared:

- shell regions
- navigation primitives
- section registry
- content and SEO contracts
- structured data mapping rules
- accessibility and performance baseline
- editor and admin framework

### Preset spec

Varies by `siteType`:

- homepage section order
- default navigation labels and depth
- preferred proof modules
- recruiter or lead-generation emphasis
- booking and contact emphasis
- optional shell modules such as service nav or search

## Current gap

The repo already has:

- strong page shell
- generic bilingual content
- reusable page editor and admin
- home page entry cards, proof cards, and writing cards

But it still lacks:

- explicit `siteType`
- formal section registry
- optional shell modules
- documented token contract
- preset-aware structured data strategy

## Implementation phases

### Phase 1: Introduce preset scaffolding

Deliverables:

- `siteType` in `site.config.mjs`
- template preset helper in `src/lib/template.js`
- shell feature flags in config
- homepage section registry foundation

Notes:

- this phase should preserve current routes and current content files
- this phase is about architecture, not visual redesign

### Phase 2: Move home page to section registry

Deliverables:

- shared `SectionRenderer`
- registry-driven section ordering
- compatibility layer from legacy home JSON to section blocks

Constraints:

- existing `home.json` files must keep working
- template starter content must stay simple and generic

### Phase 3: Expand registry beyond home

Deliverables:

- shared section contracts for:
  - proof
  - feature grid
  - CTA section
  - FAQ
  - article list
  - case study teasers
- page JSON that supports `hero + sections[] + seo`

### Phase 4: Shell modules

Deliverables:

- `SkipLink`
- optional breadcrumb
- optional service nav
- optional search entry point
- optional announcement and consent shell slots

### Phase 5: Structured data renderer

Deliverables:

- `Person` / `ProfilePage`
- `Organization`
- `WebSite`
- `Article`
- `FAQPage`
- conditional `Product`

Rule:

Structured data must only render when the page genuinely matches the schema shape.

### Phase 6: Editor and admin alignment

Deliverables:

- schema-aware editor field grouping
- schema-aware preview sections
- stable `/api/save` contract maintained

## First implementation target

The immediate implementation target is:

1. add `siteType`
2. add preset helper
3. add home section registry foundation

This is the minimum change that starts the shift from "personal-site template" to "shared system kernel".

## Site type intent

### `personal`

Bias:

- identity first
- proof early
- work and writing visible
- simple navigation

### `business`

Bias:

- value proposition first
- trust and services early
- FAQ and case studies more prominent
- stronger contact / quote flow

### `platform`

Bias:

- product explanation first
- feature and use-case structure
- deeper navigation
- search, docs, and trust modules

## What this repo should not do

Do not hardcode:

- real personal identity
- real recruiter claims
- real Calendly event URLs
- one narrow profession
- one visual tone as the only valid option

## Validation standard

Each phase should keep the repo passing:

- `npm run build`
- `npm run smoke`
- `npm run validate`

And when relevant:

- basic keyboard navigation checks
- basic structured data validation
- content checks for natural English and clear neutral Chinese
