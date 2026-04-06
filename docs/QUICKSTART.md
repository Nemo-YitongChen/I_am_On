# Quickstart

## 1. Install

```bash
npm install
```

## 2. Update core config

Edit:

- `site.config.mjs`
- `src/content/site/profile.json`

At minimum, set:

- `site`
- `siteType`
- `i18n.locales`
- `booking.mode`

Recommended preset choices:

- `personal`: portfolio, personal site, recruiter-facing profile
- `business`: service business, consulting site, agency-style site
- `platform`: product or platform marketing site

If you want the starter content to match the preset immediately:

```bash
npm run preset:apply -- --type business
```

or:

```bash
npm run preset:apply -- --type platform
```

## 3. Rewrite starter content

Start with:

- `src/content-live/en/home.json`
- `src/content-live/en/about.json`
- `src/content-live/en/book.json`

Then replace:

- starter posts
- starter work entries

## 4. Choose your language mode

Default:

- English only

To enable Chinese too:

1. update `site.config.mjs`
2. set `locales` to `["en", "zh"]`
3. keep translated content files in place

## 5. Choose your booking mode

Available modes in `site.config.mjs`:

- `contact-only`
- `calendly`
- `external-link`
- `hidden`

Recommended defaults:

- personal: `contact-only`
- business: `external-link`
- platform: `hidden`

If you use `calendly`:

1. set `booking.mode` to `calendly`
2. replace the placeholder URL in `src/content/site/booking-options.json`

If you use `external-link`:

1. set `booking.mode` to `external-link`
2. replace `booking.externalUrl`
3. optionally replace `booking.externalLabel`

## 6. Check preset defaults before rewriting content

Run:

```bash
npm run preset:check
```

This verifies that preset navigation, booking defaults, and starter copy remain internally consistent.

## 7. Validate

```bash
npm run validate
```

## 8. Deploy

Create a Cloudflare Worker deployment from this repo and add the runtime variables and secrets described in `README.md` and `docs/OPERATIONS.md`.
