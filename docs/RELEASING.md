# Releasing travelmate_web

## Branches

| Branch | What it is | How it changes |
|---|---|---|
| `development` | Where all work lands and is tested. Deploys to the Vercel **Preview** URL. | Pull requests from feature branches (`feature/…`, `fix/…`). |
| `production` | What customers see. Deploys to **travelmateglo.com**. | Only a pull request from `development`, after the preview is tested. |
| `main` | Backup: the last release known to work. | Only from `production`, once a release has been live and stable. Never worked on. |

Each release on `production` gets a tag (`v1.0.0`, `v1.1.0`, …), so any earlier version can be redeployed.

## Products and switches

Unfinished products ship switched off, so `development` can always be promoted. See `src/config/features.ts`.

| Setting | Production (today) | Preview / local |
|---|---|---|
| `VITE_FEATURE_STAYS` | not set (off) | `on` |
| `VITE_FEATURE_TRANSFERS` | not set (off) | `on` |
| `VITE_FEATURE_FLIGHTS` | not set (off) | `on` |
| `VITE_FEATURE_APP_PROMO` | not set (off) | `on` |
| `VITE_FLIGHTS_API_MODE` | not set (live) | `mock` until the flights backend is ready |
| `VITE_FLIGHTS_EXTRAS` | not set (off) | `on` |

A build with no product settings is the hotels-only site. Launching a product later is setting its switch to `on` for Production in Vercel and redeploying; no code change.

Other settings, per environment: `VITE_API_BASE_URL` (that environment's backend), `VITE_WS_BASE_URL`, `VITE_GOOGLE_CLIENT_ID`, `VITE_HOTELS_API_KEY`, `VITE_HOTELS_API_BASE` (optional).

## One-time setup

**Vercel** (Project → Settings):
1. Git → Production Branch: `production`.
2. Environment Variables: set the Production values above under *Production* only, and the Preview values under *Preview*. Leave the product switches out of Production.
3. Domains: `travelmateglo.com` on Production. (Preview URLs are not indexed by search engines.)

**GitHub** (Settings → Branches → rules for `production` and `main`):
1. Require a pull request before merging, with at least 1 approval.
2. Require status checks to pass: `CI / build-and-test`.
3. Block force pushes and deletion.
4. `development`: require the `CI / build-and-test` check.

## Releasing

1. Merge feature branches into `development` by pull request; CI must pass.
2. Test on the Preview URL (see the checklist below).
3. Open a pull request `development` → `production`. Approve and merge; Vercel deploys.
4. Check the live site (home, a hotel search, Check price signed in and out, sign-up).
5. Tag the release on `production`: `git tag v1.x.y && git push origin v1.x.y`.
6. After it has been stable for a few days: fast-forward `main` to `production` (pull request `production` → `main`).

**Rollback:** in Vercel, promote the previous production deployment (instant), or redeploy from `main` / a tag.

## Release checklist

- [ ] CI green; `npm run build` with no product switches shows hotels only (nav, footer, home).
- [ ] Hotel search, results, hotel page; Check price signed out → sign-up → back to the same page; signed in → booking page.
- [ ] Sign up, log in, Google sign-in, password reset on the production backend.
- [ ] Policy pages read correctly (Privacy and Terms text is edited in the dashboard).
- [ ] Link preview (share the home URL in WhatsApp) shows the hotels image and text.
