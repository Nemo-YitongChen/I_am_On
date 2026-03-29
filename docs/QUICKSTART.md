# Quickstart

## 1. Install

```bash
npm install
```

## 2. Update core config

Edit:

- `site.config.mjs`
- `src/content/site/profile.json`

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

Without Calendly:

- keep `showCalendly: false`

With Calendly:

1. set `showCalendly: true`
2. replace the placeholder URL in `src/content/site/booking-options.json`

## 6. Validate

```bash
npm run validate
```

## 7. Deploy

Create a Cloudflare Worker deployment from this repo and add the runtime variables and secrets described in `README.md` and `docs/OPERATIONS.md`.
