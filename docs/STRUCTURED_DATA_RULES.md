# Structured Data Rules

This file defines when `I_am_On` should emit structured data and when it should not.

The template rule is simple:

- only emit schema when the page genuinely matches the page type
- do not emit richer schema just because a component happens to exist
- keep page content, page preset, and schema type aligned

## Current baseline

The template is moving toward a shared structured-data renderer.

Current implementation priority:

1. personal preset pages
2. long-form article and case-study pages
3. business and platform-specific schema on current core pages (`home`, `about`, `recruiters`, `services`, `consult`, `book`)

This means the template should treat structured data as a conditional capability, not as a blanket default.

## Rule set

### Personal preset

Use these mappings when the site is clearly centered on one person:

- home page: `Person`
- about / profile page: `ProfilePage` with nested `Person`
- article detail page: `Article`
- work / case-study detail page: `CreativeWork`

Do not emit `Organization` on a personal preset unless the site is genuinely representing an organization rather than an individual.

### Business preset

Use these mappings only when the content and site config clearly represent a business:

- home / company page: `Organization` or a more specific organization subtype
- services / consult / book pages: `Service`
- FAQ page: `FAQPage` only when the page is primarily a real FAQ
- case-study detail page: `CreativeWork` or a more specific subtype if justified

### Platform preset

Use these mappings only when the product model is real and specific:

- site root: `WebSite`, and optionally `SearchAction` when site search is actually enabled
- about / recruiters pages: `Organization`
- services / consult / book pages: `Service`
- site search: `WebSite` with `SearchAction`, only if site search exists
- product detail page: `Product`, only when the page represents a concrete product or plan
- documentation article: `TechArticle` or `Article` if the page is genuinely article-like

## Breadcrumb rule

Emit `BreadcrumbList` only when:

- the page renders a breadcrumb trail
- the breadcrumb reflects the real navigation hierarchy
- the current page is the terminal item

Do not emit breadcrumb schema on flat pages that do not render breadcrumbs.

## FAQ rule

Emit `FAQPage` only when:

- the page is primarily a FAQ page
- each item is a real question-and-answer pair
- the visible content matches the JSON-LD content

Do not emit `FAQPage` for a short FAQ block inside a larger marketing page unless the page is genuinely FAQ-shaped.

## Product rule

Emit `Product` only when:

- the page represents a real product, plan, or service offer
- title, description, availability, and pricing are grounded in visible content

Do not use `Product` for generic booking, profile, or content pages.

## Authoring guardrails

- Keep titles, descriptions, and URLs identical to the visible page meaning.
- Do not emit placeholder names, fake organizations, or fake ratings.
- Do not emit schema on editor, admin, preview, or noindex utility pages.
- Keep locale and language tags aligned with the rendered page locale.

## Validation

Template work should validate structured data in two ways:

1. repo-level smoke and build checks
2. external inspection on representative pages after major schema changes

This rule set is the source of truth for future structured-data renderer work.
