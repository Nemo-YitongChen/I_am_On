# Operations

## Local validation

Run before pushing:

```bash
npm run validate
```

This runs:

1. build
2. smoke check for key output files

## Worker runtime variables

Configure these in Cloudflare before enabling browser save:

- `GITHUB_TOKEN`
- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_BRANCH`
- `EDITOR_SECRET`

## Release checklist

Before pushing:

1. build passes
2. smoke check passes
3. template copy stays generic
4. no personal links or real identity leak into starter content
5. English and Chinese starter text both read naturally

After pushing:

1. Worker build starts
2. public home loads
3. editor loads
4. admin loads
5. `_worker.js` output exists in the build artifact

## Cloudflare notes

If a build ever fails with a Rollup native package error, regenerate the lockfile and confirm the Linux Rollup package still exists in `package-lock.json`.

If deploy output complains about `SESSION`, add the expected KV binding or remove the feature that requires Astro sessions.
