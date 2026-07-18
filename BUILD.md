# Building & Installing an APK

How to produce an installable Android APK for this project and get it onto a device.

## Prerequisites

- `pnpm` installed, project dependencies installed (`pnpm install` from this directory)
- Logged into EAS: `npx eas-cli@21.0.2 login` (check with `npx eas-cli@21.0.2 whoami`)
- Android device connected via USB with USB debugging enabled, or an emulator running
  - Verify with `adb devices` — it should list your device/emulator as `device`

> **Note on `eas-cli`:** the globally pnpm-installed `eas-cli` has a known bug (`Cannot find module 'fast-glob'`) caused by a phantom dependency that breaks under pnpm's strict `node_modules` linking. Always invoke it via `npx eas-cli@21.0.2 ...` instead of a global `eas` install, until upstream fixes it.

## Option A — Cloud build (recommended)

Builds on Expo's servers and produces a signed, standalone release APK (no dev server needed).

```bash
npx eas-cli@21.0.2 build --platform android --profile preview --non-interactive
```

- Uses the `preview` profile in [eas.json](eas.json) (`:app:assembleRelease`, internal distribution)
- Takes ~5-10 minutes. Prints a build page URL with a QR code when done.
- Get the direct `.apk` download link any time via:

  ```bash
  npx eas-cli@21.0.2 build:view <build-id> --json
  ```

  Look at `artifacts.buildUrl` in the output.

### Installing the cloud-built APK

- **On device, easiest:** open the build page URL (or scan the QR code) on the Android phone and tap install.
- **Via adb**, if you've downloaded the `.apk` locally:

  ```bash
  adb install -r /path/to/downloaded.apk
  ```

## Option B — Local build (faster iteration, no cloud queue)

Build directly with Gradle and push straight to a connected device via adb. Useful when iterating on native/build config issues without burning cloud build minutes.

```bash
cd android
./gradlew :app:assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell monkey -p com.dropsofhope.mobile -c android.intent.category.LAUNCHER 1
```

- `assembleDebug` produces a dev-client build (needs `expo-dev-client`, already installed) — requires Metro running separately: `npx expo start --dev-client`
- To locally build the **release** variant (matching what EAS produces), you need real signing credentials. EAS injects these automatically in the cloud; locally you'd need to supply your own via `-PDOH_UPLOAD_STORE_FILE=... -PDOH_UPLOAD_STORE_PASSWORD=... -PDOH_UPLOAD_KEY_ALIAS=... -PDOH_UPLOAD_KEY_PASSWORD=...` (see `android/app/build.gradle`). Never ship a debug-signed release.

### Reproducing an EAS cloud build fully locally (for debugging build failures)

If a cloud build fails and the dashboard logs aren't useful, run the exact same build recipe on your machine to see the real error live:

```bash
npx eas-cli@21.0.2 build --platform android --profile preview --local --non-interactive
```

This runs the full EAS build pipeline (fetches your managed credentials, bundles JS, runs Gradle) locally and streams unfiltered output — much easier to debug than pulling encrypted logs off the dashboard.

## Build profiles ([eas.json](eas.json))

| Profile | Gradle task | Use |
|---|---|---|
| `development` | `:app:assembleDebug` | Dev-client build, needs Metro running |
| `preview` | `:app:assembleRelease` | Standalone signed APK, internal distribution — **this is the "deployed" build for installing on a device** |
| `production` | `:app:bundleRelease` | AAB bundle for Play Store submission |

## Known gotchas

- **`expo-dev-client` version:** if you ever reinstall it, use `npx expo install expo-dev-client` (not plain `pnpm add`), which pins the version compatible with this project's Expo SDK (currently SDK 54 → `expo-dev-client ~6.0.21`). Installing the latest major version directly causes Kotlin compile errors (`Unresolved reference 'OptimizedRecord'`, etc.) from an expo-dev-menu/expo-modules-core mismatch.
- **`babel-preset-expo` must be a direct dependency.** `babel.config.js` requires it directly, but pnpm only symlinks direct dependencies into the top-level `node_modules`. If it's ever removed from `package.json`, release builds fail bundling JS with `Cannot find module 'babel-preset-expo'` even though debug builds work fine (debug loads JS from the Metro dev server at runtime instead of bundling it at build time).
