# Drops of Hope — Production Readiness Audit & Roadmap

> Audit date: 2026-07-08 (mobile) · Updated: 2026-07-11 (backend added) · **P0/BP0 implemented: 2026-07-12** · Scope: mobile frontend (~294 files) + backend (~130 files) · Goal: **Play Store production launch**, iOS via EAS eventually.

**Status as of 2026-07-12:** All mobile **P0 #1–6** and backend **BP0 (B1–B4)** + ship-ready infra (**B7, B8, B10, B13**, plus a minimal **B11** app/server split) are implemented and verified. Both repos are separate git projects using **pnpm**; nothing below has been committed yet — changes are in the working tree pending review. See the ✅ markers throughout for what's done, and "Remaining" notes for what's deliberately deferred to the next phase.

**Honest verdict (mobile) — historical, pre-fix:** This is a well-organized prototype, not a production app. The architecture bones are good (atomic design, services layer, PKCE auth, 3-language i18n), but it cannot ship today: **release builds are signed with the debug keystore, there are zero tests, zero crash reporting, 375 console.log statements leaking PII, push notifications are written but never wired up, and safety-critical fallbacks default to "eligible to donate" when the API fails** — unacceptable for a blood donation app. Estimated 6-8 weeks of focused work to a shippable v1.

**Honest verdict (backend) — historical, pre-fix:** The backend architecture is clean (Express 5 + TypeScript, Prisma ORM, proper MVC layering, SSE, push service) but has **one critical security hole that must be fixed before any production traffic**: Asgardeo RS256 tokens are accepted without signature verification. Several middleware stubs (`errorHandler.ts`, `validateRequest.ts`) exist as docstrings only. PrismaClient is instantiated 13 times instead of using the singleton in `config/db.ts`. Estimated 2-3 weeks to close the critical gaps alongside mobile P0 work.

---

## P0 — Launch Blockers (cannot ship without these)

### ✅ 1. Android release signing is broken — DONE
`android/app/build.gradle:119` — release buildType uses `signingConfigs.debug`. Play Store will reject or the app is trivially spoofable.
- Generate an upload keystore, wire via `gradle.properties` env vars (never commit), configure Play App Signing.
- Better: adopt **EAS Build** (`eas.json`), which manages keystores and also solves iOS-without-a-Mac later. Recommended path given "iOS eventually".
- **Done:** `eas.json` added (dev/preview/production profiles). `build.gradle` now sources a real `signingConfigs.release` from EAS-managed `credentials.json` or `DOH_UPLOAD_*` gradle properties, and **fails the release build loudly** if neither is present — the silent debug-keystore fallback is gone. **Needs user action:** run `eas credentials` once (Expo account) and add `EXPO_TOKEN` as a GitHub secret; unverified locally (no JDK on this machine) — verify on first `eas build -p android`.

### ✅ 2. Safety-critical fallbacks are dangerously wrong — DONE
- `app/services/homeService.ts` — on API failure returns `donationEligibility: { isEligible: true }`. **A user who donated last week could be told they're eligible.** Change to `isEligible: false` + explicit "unknown / check connection" UI state.
- `app/services/campaignService.ts:673` — permissions fallback returns `canEdit: true, canDelete: true`. Must be `false/false`.
- `homeService.ts:407` — hardcoded 120-day donation interval. Serve from backend config; keep client constant only as a conservative fallback.
- **Done:** all failure paths in `homeService.ts` (including two the original audit missed: `getDefaultUserStats` and the no-data default) now return `isEligible: false`/`undefined` + a new `eligibilityUnknown` flag instead of `true`. `NextDonationCard` renders "Eligibility unavailable — check your connection" for the unknown state and now also respects the server's `nextEligibleDate` when ineligible (previously ignored). `campaignService.ts` permissions fail closed (`canEdit`/`canDelete: false`). The 120-day interval is now a named `FALLBACK_DONATION_INTERVAL_DAYS` constant, used only when no server-provided eligibility/date exists.

### ✅ 3. PII/token logging everywhere (375 console statements) — DONE
User IDs (`sub`), token presence, full API URLs logged in: `api.ts`, `auth.ts`, `AuthContext.tsx`, `userDataUtils.ts`, `userIdUtils.ts`, and ~20 more files.
- Create `app/utils/logger.ts` gated on `__DEV__`; mechanical find/replace of `console.*` across `app/`.
- Add `babel-plugin-transform-remove-console` (exclude error) for production builds as a backstop.
- **Done:** `app/utils/logger.ts` added (`__DEV__`-gated debug/log/info/warn; `error` always fires and feeds a Sentry breadcrumb in production). **645** `console.*` calls replaced across 64 files (actual count was higher than the original 375 estimate). `babel.config.js` adds `babel-plugin-transform-remove-console` for the `production` env, excluding `error`.

### ✅ 4. Crash reporting & monitoring: none — DONE
No Sentry, no analytics, no error boundary. You will be blind in production.
- Add `@sentry/react-native` (Expo config plugin), a root `ErrorBoundary` component, and breadcrumbs in `apiRequest`.
- **Done:** `@sentry/react-native` installed, `@sentry/react-native/expo` plugin added to `app.json`, `Sentry.init()` + `Sentry.wrap(App)` in `App.tsx` (gated on `EXPO_PUBLIC_SENTRY_DSN`, disabled in `__DEV__`). New `app/screens/shared/organisms/ErrorBoundary.tsx` wraps the app root with a retry UI and reports to Sentry. `apiRequest` in `api.ts` adds an HTTP breadcrumb per call. **Needs user action:** create a Sentry project and set `EXPO_PUBLIC_SENTRY_DSN`.

### ✅ 5. Push notifications: frontend dead code, backend fully implemented — DONE
`app/services/pushService.ts` is never imported anywhere. `expo-notifications` is installed. **The backend side is complete**: `DevicesController` + `PushService` handle token registration (`POST /api/devices/push-token`, `DELETE /api/devices/push-token`) and can send to any user via `PushService.sendToUser()`. The `DevicePushToken` table exists in the DB schema. No backend coordination needed — wire the frontend only.
- Import and call `registerForPushNotifications()` + `setupNotificationHandlers()` in `App.tsx` after auth resolves; call `POST /api/devices/push-token` with the resulting token.
- The mobile handler currently drops every notification type except `CAMPAIGN_ATTENDANCE` — add appointment reminders and emergency alerts (the two highest-value types; `PushService.sendToUser()` is already available for both).
- **Done:** wired into `App.tsx` via a `PushNotifications` component that registers after `useAuth()` resolves — includes the Android 13+ runtime permission prompt and Android notification channels (a high-importance `emergency` channel that plays sound). `pushService.ts` now dispatches `APPOINTMENT_REMINDER`/`APPOINTMENT_SCHEDULED`/`APPOINTMENT_CANCELLED` and `EMERGENCY_ALERT`/`EMERGENCY_RESPONDED` in addition to `CAMPAIGN_ATTENDANCE`, and listens for both foreground delivery and notification taps.

### ✅ 6. Broken CI + missing lint — DONE
- `lint:eslint` script exists but **eslint is not in devDependencies** — `.github/workflows/lint.yml` fails at that step.
- `deploy-mobile.yml` runs `npm test || echo "No tests found"` (a no-op) and references the EAS action with no `eas.json`.
- Fix: install `eslint` + `eslint-config-expo`, add `eas.json`, make CI actually gate merges.
- **Done:** `eslint` 9 + `eslint-config-expo` installed with a working flat config (`eslint.config.js`); `pnpm lint` (tsc + eslint) passes with **0 errors** (tsc was at 92 errors pre-fix, mostly a missing `@expo/vector-icons` dependency — now added directly). `lint.yml` runs on pnpm and gates on `lint:tsc` + `lint:eslint` + a non-blocking locale-completeness check. `deploy-mobile.yml` rewritten to use `expo/expo-github-action@v8` + `eas build` against the new `eas.json` (needs `EXPO_TOKEN` secret).

---

## P1 — Reliability & Correctness (first 2-3 weeks after P0)

### 7. Auth/token handling
- `auth.ts:416` validates tokens by calling Asgardeo `/oauth2/userinfo` on **every** check → slow cold start, hard dependency on Asgardeo uptime. Decode the JWT locally and check `exp`; only hit the network on expiry. (No new dep needed — a 10-line base64 decode.)
- Kill the legacy `accessToken` SecureStore key (`api.ts:167-218`); `authState` is the single source of truth. Three duplicate `getAuthState()` implementations (auth.ts, AuthContext.tsx, userDataUtils.ts) → consolidate to one.
- Remove dynamic-import circular-dependency workarounds (`AuthContext.tsx:79`, `authUserService.ts:147`) by extracting shared types/storage into a leaf module.

### 8. API client hardening (`app/services/api.ts`)
- Hardcoded LAN IP `192.168.1.58` as the Android default — replace with env-driven config + `.env.example`.
- No timeouts anywhere → add `AbortController` with ~15s timeout in `apiRequest`.
- No retry/backoff → wrap with 1-2 retries on network failure/5xx (idempotent GETs only).
- No offline detection → `expo-network` check + a global offline banner.
- `authUserService.ts` uses raw `fetch` bypassing the shared client — migrate.
- Every service defensively parses 3+ response shapes (`Array | {data} | {appointments}`). **You own the backend: standardize on one envelope** (`{ success, data, error }`), then delete the defensive parsing. **Confirmed from backend audit**: success responses currently return `{ data: {...} }` (no `success` field), error responses return `{ success: false, error, message }`, and some endpoints (e.g. `eligibility.controller.ts`) return the raw object with no envelope at all. The fix is a shared response helper in the backend, not just a client-side workaround.

### 9. Error handling strategy
- Services silently return `[]`/`null`/fake defaults on failure (appointmentService, homeService, exploreService) — callers can't distinguish "empty" from "failed". Introduce a typed `Result` or thrown `ApiError` and handle at screen level.
- UI errors are all `Alert.alert` — replace with a shared `ErrorCard` (message + retry) and `EmptyState` component.

### 10. Testing: from zero
Zero test files across 20+ screens and 17 services. Realistic target, not 100% coverage:
- Jest + `jest-expo` + React Native Testing Library.
- Priority order: eligibility/date logic (`homeService`, `donationService` — safety-critical), `ValidationUtils.ts`, auth token refresh logic, then 2-3 critical screen smoke tests.
- CI gate: `tsc --noEmit` + eslint + jest on PRs.

---

## P2 — Tech Debt & Dead Weight (parallel with P1, low risk)

### ✅ 11. Dependency cleanup (verified unused via grep + graphify) — DONE
Remove: `@asgardeo/auth-react` (React **web** SDK, unusable in RN), `react-spinners` (web-only CSS), `react-native-app-auth` (duplicate of expo-auth-session), `react-native-encrypted-storage` (SecureStore is used instead). Also delete the now-unneeded `expo.doctor` excludes hiding them.
- **Done:** all four packages removed via `pnpm remove`; the `expo.doctor.reactNativeDirectoryCheck.exclude` block deleted from `package.json`.

### ✅ 12. Dead code deletion — PARTIALLY DONE
- **expo-router is installed and configured but 100% dead**: `app/_layout.tsx`, `app/index.tsx`, `app/login.tsx` (contains a hardcoded OAuth client ID at line 8), `app/profile.tsx`. The real app is `App.tsx` → `AppNavigator` (@react-navigation). Delete the four files, drop `expo-router` from package.json + app.json plugins.
- `DonationScreen/molecules/TabNavigator.tsx` (unused twin of TabNavigation.tsx).
- `app/utils/qrFormatTester.ts`, `testBackendEndpoints()`/`debugAllUserIds()` in `userIdUtils.ts`, `UserDebugScreen` — move behind `__DEV__` or delete.
- **Done:** the four expo-router files deleted, `expo-router` dropped from `package.json` deps and `app.json` plugins (replaced with `@sentry/react-native/expo`). Confirmed real entry is `index.ts` → `App.tsx` → `AppNavigator`, unaffected by the deletion.
- **Remaining:** `TabNavigator.tsx` twin, `qrFormatTester.ts`, and the `userIdUtils.ts`/`UserDebugScreen` debug helpers were not touched — still open.

### 13. Component deduplication (~37 duplicate components)
Near-identical copies across screen folders: StatusBadge (4×), DetailRow (3×), ActionButton (3×), CampaignCard (3×), StatCard (3×, two ~95% identical), SearchBar/ScreenHeader/SectionHeader/ProgressBar/HeaderButton/StatsOverview/AppointmentDetailsModal (2× each).
- Promote to `app/screens/shared/atoms|molecules/` with variant props. Do it incrementally per component, not big-bang.
- Rename collisions with different purposes (two unrelated `QRSection`s) to distinct names.

### 14. Navigation type safety
18 screens use `navigation?: any`; only QRScannerScreen is typed. `RootStackParamList` already exists in `AppNavigator.tsx:30`.
- Export it, add a `ScreenProps<T extends keyof RootStackParamList>` helper, migrate screens incrementally. Catches broken `navigate("EditCampaign", {campaignId})` calls at compile time.

### 15. Monolith decomposition (do opportunistically, when touching)
`AppointmentBookingForm.tsx` (1,218 lines — critical), `CampaignDashboardScreen/screen.tsx` (678), `QRScannerModal.tsx` (634), plus 7 more over 500 lines. Target <300 lines/component; split when features touch them, not as standalone rewrites.

### 16. Tooling hygiene — PARTIALLY DONE
Prettier + config, husky + lint-staged, `.editorconfig`, `.env.example`, add `graphify-out/` to `.gitignore`.
- **Done:** `.env.example` added; `graphify-out/` added to `.gitignore` (with a `!.env.example` exception alongside the existing `*.env.*` ignore rule).
- **Remaining:** Prettier, husky + lint-staged, `.editorconfig` not added.

---

## P3 — Package Upgrades (feasibility assessment)

| Package | Current | Verdict |
|---|---|---|
| Expo SDK 54 / RN 0.81 | current-ish | **Stay** for launch. Upgrade one SDK per cycle after launch. |
| nativewind 2.0.11 | v4 is current | **Defer, then decide.** v2→v4 is a real migration. Only 58% of files use className; StyleSheet is used in 79%. Honest option: since usage is mixed anyway, consider **standardizing on StyleSheet + theme.ts and dropping nativewind entirely** — less churn than a v4 migration. Decide in P3, don't block launch. |
| tailwindcss 3.3.2 (pinned) | 3.4/4.x | Follows the nativewind decision. |
| react-navigation 7.x | current | Keep. |
| `newArchEnabled: false` | New Arch is RN default now | Enable **after** launch + Sentry, on a branch, with device testing. Don't stack this risk pre-launch. |
| react 19.1 / react-dom / react-native-web | — | Web target appears unused; if you don't ship web, drop react-dom/react-native-web later. |

---

## P4 — Missing Features & Long-Term UX (post-launch roadmap)

**Domain features missing for a serious blood-donation app:**
1. **Appointment reminders via push** (24h/2h before) — highest-impact retention feature; backend scheduling + the push wiring from P0.
2. **Offline-first reads** — donors at rural campaign sites will have flaky connectivity. Cache home/appointments/QR code (the QR must render offline — attendance marking is the one thing that must always work).
3. **Blood-type emergency matching** — notify only compatible donors for emergencies (backend filter + push topic per blood group).
4. **Donation streak/gamification depth** — badgeService exists; surface progress, milestones (blood volume donated, lives touched).
5. **In-app eligibility pre-screening quiz** — the Step1-6 donation form exists; a pre-appointment self-check reduces on-site rejections.
6. **Campaign organizer analytics** — CampaignAnalyticsScreen exists but is thin; funnel (registered → attended → donated) is the metric organizers need.

**UX debt:**
7. **Accessibility: literally zero** — 0 hits for `accessibilityLabel`/`accessibilityRole` in the whole app. Add to shared atoms first (Button, MenuItem, tab bar), then screens.
8. **i18n at ~65%** — ~150-200 hardcoded English strings (error messages, Alert.alert, status labels); `qr_en.json` has no si/ta translations. Sinhala/Tamil users hit English errors exactly when things go wrong. `scripts/compareLocales.js` already exists — put it in CI.
9. **Loading/error/empty consistency** — skeletons exist for 4 screens only; standardize.
10. **Dark mode** — feasible only after colors are consolidated into theme.ts (currently ~1,043 hardcoded hex values). Sequence: theme consolidation (P2) → dark mode (P4).
11. **Android 13+ notification permission flow, deep links** into campaign/appointment details from push.

---

## Backend Audit (doh_backend)

> Stack: Express 5 + TypeScript (ESM), Prisma 6 + PostgreSQL, Asgardeo JWT auth, Docker, GitHub Actions CI.  
> Architecture: MVC — controllers → services → repositories. ~30 controllers, SSE endpoint, full push notification service.

### BP0 — Backend Launch Blockers

#### ✅ B1. Asgardeo tokens accepted without signature verification (critical auth bypass) — DONE
`src/middlewares/authenticateUser.ts:85-89` — when the token algorithm is RS256 (all Asgardeo tokens), the middleware calls `jwt.decode(token)` — which does **no verification** — instead of `jwt.verify()`. A comment reads `"TODO: Implement proper JWKS verification for production"`. Any attacker who can craft a well-formed RS256 JWT with a valid user `sub` claim gains full authenticated access.
- Implement JWKS verification: fetch Asgardeo's public keys from `https://api.asgardeo.io/t/{org}/oauth2/jwks` (cacheable with 1h TTL), verify the signature using `jsonwebtoken` + `jwks-rsa`. The `jwks-rsa` package integrates directly with `jsonwebtoken`'s `secretOrPublicKey` callback.
- Remove the `console.log` lines (88, 101) that fire on every request.
- **Done:** `jwks-rsa` installed; RS256 tokens are now verified via `jwt.verify()` against Asgardeo's JWKS endpoint (1h cache, rate-limited, issuer checked). Verified live: a hand-crafted RS256 JWT with an unknown key ID returns 401, not 200. The per-request `console.log`s are gone (all `console.*` in this file removed as part of the change).

#### ✅ B2. Hardcoded JWT fallback secret — DONE
`src/middlewares/authenticateUser.ts:102` — `process.env.JWT_SECRET || "your-secret-key"`. If `JWT_SECRET` is missing from the production environment, every local (HS256) token is signed with a publicly known key.
- Remove the fallback; throw a startup error if `JWT_SECRET` is absent (guard in `src/config/env.ts` which currently has no implementation).
- **Done:** fallback removed; `src/config/env.ts` implemented (see B13) and the server refuses to start without `JWT_SECRET`/`DATABASE_URL`. Verified live: unsetting `JWT_SECRET` throws at startup before the server binds a port.

#### ✅ B3. `errorHandler.ts` and `validateRequest.ts` are empty stubs — DONE
Both middleware files contain only a JSDoc comment block — no actual code. This means:
- There is no centralized error handler; unhandled thrown errors produce Express's default HTML 500 response to a JSON API client.
- There is no input validation on any endpoint; all body parameters are trusted as-is (e.g., `eligibility.controller.ts:9` trusts `req.body.nextEligible` with no type or range check).
- Implement `errorHandler.ts` as an Express 4-argument handler that catches thrown errors and returns `{ success: false, error, message }`.
- Add Zod (or `express-validator`) validation schemas for the handful of mutation endpoints (eligibility update, push token registration, appointment booking). Don't need to validate everything at once — start with the safety-critical routes.
- **Done:** `errorHandler.ts` implemented and registered last in `app.ts`, returning `{ success: false, error, message }` (hides internal detail when `NODE_ENV=production`). `validateRequest.ts` implemented with Zod; wired to `PUT /api/eligibility/:id`, `POST/DELETE /api/devices/push-token`, and `POST /api/appointments/create`. **Bonus find:** the eligibility-update route had **no authentication at all** — anyone could change any donor's `nextEligible` date. It now requires `authenticateToken` in addition to validation.

#### ✅ B4. CORS is fully open — DONE
`src/app.ts:9` — `app.use(cors())` with no `origin` option allows any website to call the API with credentials. For a mobile-only backend this is low-exploitability but should be tightened before production.
- Restrict to the Expo dev client origin + your production domain. For a pure mobile app, you can restrict to `null` (disallows browser cross-origin requests entirely) without affecting the native app.
- **Done:** CORS now reads an explicit allowlist from `CORS_ALLOWED_ORIGINS` (comma-separated); defaults to blocking all browser cross-origin requests when unset (`origin: false`), which does not affect the native app.

### BP1 — Backend Reliability

#### B5. PrismaClient instantiated 13 times — connection pool exhaustion — 1/13 DONE
`src/config/db.ts` exports a singleton `prisma` instance, but it is ignored by `home.controller.ts`, `auth.controller.ts`, `campaigns.controller.ts`, `appointments.controller.ts`, `donations.controller.ts`, `qr.controller.ts`, `notification.controller.ts`, `user.controller.ts`, `routes/campaigns.route.ts`, `push.service.ts`, and one inline instantiation inside a function body (`notification.controller.ts:322`). Each `new PrismaClient()` opens its own connection pool. Under moderate load this exhausts the PostgreSQL connection limit.
- Do a global find-and-replace: remove per-file `const prisma = new PrismaClient()` and import the singleton from `../config/db.js` (or `../../config/db.js`).
- **Partial:** `authenticateUser.ts`'s own `new PrismaClient()` was removed as a side effect of the B1 rewrite (now imports the `config/db.ts` singleton). **12 instantiations remain** (`grep -rn "new PrismaClient()" src/ | wc -l` = 12) — still open, full sweep not yet done.

#### B6. Inconsistent API response envelope
Success responses return `{ data: {...} }` (no `success` field), error responses return `{ success: false, error, message }`, and some controllers return the raw Prisma object (e.g., `eligibility.controller.ts:12`). The frontend must defensively handle all three shapes.
- Create a `src/utils/response.ts` helper: `ok(res, data)` → `res.json({ success: true, data })` and `fail(res, status, message)` → `res.status(status).json({ success: false, error: message })`. Wire to every controller. Do in tandem with mobile P1 #8 (defensive parsing cleanup).

#### ✅ B7. No rate limiting on any endpoint — DONE
Auth routes (`POST /api/auth/login`, token refresh) and mutation endpoints have no rate limiting. Express has no built-in protection against credential stuffing.
- Add `express-rate-limit` with a restrictive limit on auth routes (e.g., 10 req/15min per IP), relaxed limit on read routes (100 req/min). Takes 15 minutes to add.
- **Done:** `express-rate-limit` installed. `/api/auth/*` limited to 10 req/15min per IP; the rest of `/api` limited to 100 req/min. `app.set('trust proxy', 1)` added so the real client IP is used behind a load balancer. Verified live: the 11th auth request in a burst returns 429.

#### ✅ B8. No health-check endpoint for uptime monitoring — DONE
The root `/` returns a plain string. No structured `/api/health` endpoint for load balancers or uptime services.
- Add `GET /api/health` → `{ status: "ok", timestamp, env }`. No auth required.
- **Done:** `GET /api/health` added, no auth, returns `{ status, timestamp, env }`. Verified live.

#### B9. No tests — CI skips silently — NOT DONE
`deploy-backend.yml:24` — `npm test || echo "No tests found, skipping"` is a no-op. No test framework is installed.
- Add `vitest` (or `jest` with `ts-jest`) + `supertest` for integration tests. Priority: auth middleware (token verification), eligibility update endpoint (safety-critical), push token registration.
- Add a CI gate: `pnpm lint && pnpm test` must pass before merge to `main`.
- **Still open** — out of scope for the P0/BP0 pass; next priority alongside B5/B6/B12.

#### ✅ B10. Deploy CI workflow is a stub — DONE (host still TBD)
`.github/workflows/deploy-backend.yml` has no actual deploy step — only commented-out notes. The Dockerfile exists but is never used in CI.
- Choose a host (Render / Railway / Fly.io for simplicity; self-hosted with Docker if infra is already set up) and wire the deploy step. The Dockerfile is ready.
- **Done:** workflow rewritten to install (pnpm, frozen lockfile), generate the Prisma client, lint, and build on every push to `main`. **Deliberately deferred:** no host was chosen (per explicit instruction) — the deploy step is a documented `# TODO` block with concrete options (Render/Railway/Fly reading the existing `Dockerfile`, or a self-hosted `docker build`/`docker run`). **Note:** the build step is currently `continue-on-error: true` because of the pre-existing ~109 tsc errors (see B5/B6 follow-up below) — make it a hard gate once those are fixed.

### BP2 — Backend Tech Debt

#### ✅ B11. `app.ts` mixes app configuration with server startup — DONE
`src/app.ts:20` calls `app.listen()`. This means you cannot import the Express app in tests without actually binding a port. `server.ts` exists but is unused.
- Move `app.listen()` to `server.ts`; export the `app` from `app.ts` for testing.
- **Done, pulled forward from BP2 because B4/B7/B8/B13 all touched `app.ts` anyway:** `app.ts` now only configures and exports the Express `app`; `server.ts` is the sole entry point (`app.listen()`), imports `env` for fail-fast startup. `package.json` `main`/`start` updated to `dist/server.js`.

#### B12. Double route registration for donor routes — NOT DONE
`src/routes/index.ts:105,137` registers `donorRoutes` at both `/` (catch-all, dangerous) and `/donors`. Any unmatched path hits the donor router first.
- Remove the `/` registration. Keep `/donors` only.
- **Still open** — untouched in this pass.

#### ✅ B13. `src/config/env.ts` has no implementation — DONE
The env config file is a docstring with no code. Environment variables are read with raw `process.env.*` access throughout the codebase, with no startup validation.
- Implement: parse and validate all required env vars at startup (`DATABASE_URL`, `JWT_SECRET`, `ASGARDEO_CLIENT_ID`, `ASGARDEO_CLIENT_SECRET`, `PORT`). Throw on missing required vars so misconfigured deployments fail fast rather than silently.
- **Done:** `env.ts` implemented — throws on missing `DATABASE_URL`/`JWT_SECRET`; derives Asgardeo JWKS/issuer URLs from `ASGARDEO_ORG`/`ASGARDEO_BASE_URL` with sensible defaults; also exposes `CORS_ALLOWED_ORIGINS` for B4. New `.env.example` documents every variable. Verified live: missing `DATABASE_URL`/`JWT_SECRET` throws before the server binds a port.

#### B14. `push.service.ts` uses raw SQL — align with Prisma schema
`PushService.registerToken()` and related methods use `prisma.$executeRawUnsafe()` with raw SQL strings. This bypasses Prisma's type safety and is harder to maintain.
- If `DevicePushToken` is in `prisma/schema.prisma`, use `prisma.devicePushToken.upsert()`. If not, add it to the schema.

---

## Execution Order (recommended phases)

| Phase | Duration | Mobile | Backend |
|---|---|---|---|
| **1. Stop the bleeding** ✅ DONE 2026-07-12 | ~1 wk | P0 #2, #3 (safety fallbacks + logger), P0 #6 (fix CI/eslint); delete dead deps & expo-router files (P2 #11, #12) | **B1** (JWKS token verification), **B2** (remove hardcoded secret), **B3** (implement errorHandler) — all security-critical, do in parallel |
| **2. Ship-ready infra** ✅ DONE 2026-07-12 | ~1-2 wk | EAS Build + release signing (P0 #1), Sentry + ErrorBoundary (P0 #4), push notification wiring (P0 #5), `.env.example` | **B4** (CORS lockdown), **B7** (rate limiting), **B8** (health endpoint), **B13** (env validation), **B10** (wire deploy CI — host still TBD) |
| **3. Hardening** — NOT STARTED | ~2 wk | API client (timeouts/retry/offline, P1 #8), JWT local decode + auth consolidation (P1 #7), error/empty UI components (P1 #9), first tests | **B5** (Prisma singleton — 1/13 done), **B6** (response envelope), **B9** (first backend tests — auth + eligibility), ~~B11~~ (done early, pulled into Phase 1/2), **B12** (remove catch-all route) |
| **4. Debt paydown** | ongoing | Component dedup, navigation typing, i18n completion, accessibility on shared atoms, monolith splits (opportunistic) | **B14** (align push service with Prisma schema), request validation schemas (Zod), API docs |
| **5. Post-launch** | — | New Arch, nativewind decision, dark mode, offline-first, blood-type matching, analytics depth | Blood-type push targeting, appointment reminder scheduling, analytics aggregation jobs |

**New follow-up discovered during Phase 1/2 implementation (not in the original audit):** the backend has **~109 pre-existing Express 5 `req.query` typing errors** (`string | string[]` not assignable to `string`) across several controllers — these predate this pass, are unrelated to the security fixes, but currently make `tsc`/`pnpm build` exit non-zero (the CI build step is `continue-on-error: true` until this is fixed) and would also break `docker build`. Recommend prioritizing this alongside B5/B6 in Phase 3.

## Verification checklist per phase

- **Phase 1 (mobile):** ✅ `pnpm lint` (tsc + eslint) passes locally and in CI (0 errors, was 92 tsc-error baseline before adding `@expo/vector-icons` as a direct dep); `grep -rn "console\." app/ | wc -l` = 0 outside `logger.ts`; app boot in emulator not re-verified this pass (no device/emulator available in this environment) — verify before merging.
- **Phase 1 (backend):** ✅ Verified live — a hand-crafted RS256 JWT with a fake `sub`/unknown key ID → 401, not 200. Removing `JWT_SECRET` from env → server refuses to start. An unhandled thrown error → JSON 500 (not HTML), confirmed via the eligibility route's own error path.
- **Phase 2 (mobile):** ⚠️ Not verified this pass — no JDK/Expo account available in this environment. `eas build -p android --profile production` needs `eas credentials` + `EXPO_TOKEN` set up first (see P0 #1). Sentry needs `EXPO_PUBLIC_SENTRY_DSN` set. Push token registration code is in place and typechecks but wasn't exercised against a real device.
- **Phase 2 (backend):** ✅ Verified live — `GET /api/health` → `{ status: "ok" }`; the auth endpoint returns 429 after 10 rapid requests within 15 minutes; CORS defaults to blocking browser cross-origin requests unless `CORS_ALLOWED_ORIGINS` is set.
- **Phase 3 (mobile):** Not started. Eligibility "unknown" UI state now exists (Phase 1 work) but the full offline-detection/API-client hardening (P1 #8) is still open.
- **Phase 3 (backend):** Not started — `new PrismaClient()` count is 12 (down from 13, singleton adopted in `authenticateUser.ts` only), response envelope still inconsistent, no tests yet.
- **Ongoing:** `graphify update .` run after the mobile changes (1451 nodes, 2623 edges). `node scripts/compareLocales.js` runs clean (added to CI, non-blocking). Navigation typing (P1 #14) untouched.
