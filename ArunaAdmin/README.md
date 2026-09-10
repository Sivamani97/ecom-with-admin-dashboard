# ArunaAdmin — Android WebView App

An Android application that wraps the **Aruna Electronics** web application
([ecom-with-admin-dashboard.vercel.app](https://ecom-with-admin-dashboard.vercel.app))
inside a WebView so it can be distributed as a native app.

---

## Project structure

```
ArunaAdmin/
├── app/
│   ├── build.gradle.kts              # App-level Gradle config
│   └── src/main/
│       ├── AndroidManifest.xml       # Permissions & activity config
│       ├── java/com/aruna/arunaadmin/
│       │   ├── MainActivity.kt       # ← Main file — WebView + file picker
│       │   └── ui/theme/             # Compose theme (unchanged)
│       └── res/                      # Icons, drawables, values
├── build.gradle.kts                  # Root Gradle config
└── settings.gradle.kts               # Project settings
```

The Android app does **not** contain a local copy of the website.
Any change deployed to the Vercel URL is immediately reflected in the app.

---

## How the Android app connects to the web app

`MainActivity.kt` creates a `WebView` and loads:

```
https://ecom-with-admin-dashboard.vercel.app/admin/login
```

The WebView is configured with:

| Setting | Value | Why |
|---|---|---|
| `javaScriptEnabled` | `true` | Required for React app to run |
| `domStorageEnabled` | `true` | Required for `localStorage` / session |
| `allowFileAccess` | `true` | Allows the WebView to read file URIs |
| `allowContentAccess` | `true` | Allows the WebView to read `content://` URIs |
| `loadsImagesAutomatically` | `true` | Shows images without user action |
| `mixedContentMode` | `COMPATIBILITY` | Allows HTTPS pages to load HTTP sub-resources |
| Cookies | Accepted (incl. third-party) | Required for Supabase auth sessions |

---

## What caused the upload button to not work

### Root cause — wrong `ActivityResultContracts` contract

The original code used:

```kotlin
// BROKEN — causes silent upload failure
ActivityResultContracts.OpenDocument()
```

`OpenDocument` is designed for **persistent, bookmarked document access**.
It returns a `content://` URI that is only readable if the app explicitly calls:

```kotlin
contentResolver.takePersistableUriPermission(uri, Intent.FLAG_GRANT_READ_URI_PERMISSION)
```

Without that call, **the WebView process cannot read the URI** and the upload
silently fails — no error is shown, the file picker closes normally, and the
upload button appears to do nothing.

### Secondary issues in the original code

| Issue | Original code | Fixed code |
|---|---|---|
| Wrong contract | `OpenDocument` | `GetContent` / `GetMultipleContents` |
| Hardcoded MIME type | `arrayOf("image/*")` always | Reads `acceptTypes` from `FileChooserParams` |
| Multiple-file support | Not implemented | `GetMultipleContents` for `[multiple]` inputs |
| URI permission | Not granted | Not needed — `GetContent` handles this |

---

## Which files were changed

| File | Action | Reason |
|---|---|---|
| `app/src/main/java/com/aruna/arunaadmin/MainActivity.kt` | **REPLACED** | Complete fix for file-picker flow |
| `app/src/main/AndroidManifest.xml` | **Unchanged** | Already correct — has `INTERNET` permission |
| `app/build.gradle.kts` | **Unchanged** | No dependency changes needed |

---

## How the WebView file picker works (after the fix)

```
User taps upload button on website
        |
        v
WebView triggers onShowFileChooser()
        |
        +-- Reads acceptTypes from FileChooserParams
        |     e.g. ["image/*", "image/jpeg", ...]
        |
        +-- Reads mode from FileChooserParams
        |     MODE_OPEN            -> single file
        |     MODE_OPEN_MULTIPLE   -> multiple files
        |
        v
Android native file picker opens
  (Gallery / Files / Google Drive etc.)
        |
        +-- User selects file(s)  -> deliverResult(arrayOf(uri, ...))
        |
        +-- User cancels          -> deliverResult(null)
                |
                v
        callback?.onReceiveValue(result)
                |
                v
        WebView receives the file URI(s)
                |
                v
        Website onChange / onFileChange fires
                |
                v
        Upload proceeds normally
```

### Why `GetContent` instead of `OpenDocument`

`ActivityResultContracts.GetContent()` returns a `content://` URI that is
**automatically readable** by the calling app for the lifetime of the process.
No extra permission grant is needed. This is the correct contract for
"give me a file to use right now" scenarios such as WebView file uploads.

---

## Required Android configuration

### AndroidManifest.xml (no changes needed)

The manifest already contains everything required:

```xml
<uses-permission android:name="android.permission.INTERNET" />

<activity
    android:name=".MainActivity"
    android:exported="true"
    android:windowSoftInputMode="adjustResize">
```

- `INTERNET` — required for the WebView to load the online site.
- `adjustResize` — ensures the keyboard does not cover input fields.
- No `READ_EXTERNAL_STORAGE` or `WRITE_EXTERNAL_STORAGE` is needed —
  `GetContent` handles file access without storage permissions.

---

## How to build the application

### Prerequisites

- Android Studio Hedgehog or newer
- JDK 11 (configured in `build.gradle.kts`)
- Android SDK 37 installed
- Internet connection for Gradle dependencies

### Build steps

1. Open Android Studio.
2. Select **File > Open** and choose the `ArunaAdmin` folder.
3. Let Gradle sync finish.
4. Connect a physical Android device (API 23+) or start an emulator.
5. Click Run (or press Shift+F10).

### Command-line build

```bash
# Debug APK
./gradlew assembleDebug

# Release APK (requires signing config)
./gradlew assembleRelease
```

The debug APK will be at:
```
app/build/outputs/apk/debug/app-debug.apk
```

---

## How to test file uploads

1. Install and open the app on a physical Android device.
2. Log in at the admin login page that loads automatically.
3. **Test 1 — Product image upload:**
   - Go to Admin > Products > Add/Edit Product.
   - Tap the image upload area.
   - The Android native file picker (Gallery/Files) should open.
   - Select an image.
   - Confirm the image preview appears in the app.
4. **Test 2 — Customer review photo:**
   - Go to any product review section.
   - Tap the photo upload button.
   - The file picker should open.
   - Select an image, confirm preview appears.
5. **Test 3 — Cancellation:**
   - Open the file picker and press Back without selecting a file.
   - The upload button should remain clickable (no hang).
6. **Test 4 — Repeated upload:**
   - Open the picker twice in a row.
   - Confirm only one callback fires and no hang occurs.

> Physical device strongly recommended. Emulators sometimes have
> incomplete Gallery/Files apps which can cause the picker to not open.

---

## Troubleshooting

### Upload button still does nothing

1. **Check the WebChromeClient is set.**
   Without a `WebChromeClient`, `onShowFileChooser` is never called and
   the file input is completely ignored by Android WebView.
   Confirmed set in `MainActivity.kt`.

2. **Rebuild the project after the fix.**
   Android Studio sometimes uses a cached build. Do:
   Build > Clean Project, then Build > Rebuild Project.

3. **Test on a physical device, not an emulator.**
   Emulator may not have a working file picker app.

4. **Confirm the website is not programmatically blocking the input.**
   Some React upload components set `display:none` or `visibility:hidden`
   on the `<input>`. WebView can still trigger `onShowFileChooser` for
   these, but they must still be present in the DOM.

### File picker opens but selected file is not used

This was caused by the `OpenDocument` bug. After the fix it should not occur.
If it does, check Logcat for `SecurityException` related to URI permissions.

### MIME type mismatch / picker shows wrong file types

The fix reads `fileChooserParams.acceptTypes` and passes the first MIME type
to the picker. If the accept attribute is unusual (e.g. `image/heic` only),
some devices may not support it. The website uses:

```jsx
accept="image/*,image/jpeg,image/png,image/webp,image/heic,image/heif"
```

The first entry (`image/*`) is used as the primary MIME type — this covers
all images on all devices.

### App shows blank white screen

- Check internet connectivity on the device.
- Check Vercel deployment status at https://ecom-with-admin-dashboard.vercel.app
- Check Logcat for WebView errors.

### Keyboard covers input fields

The manifest sets `android:windowSoftInputMode="adjustResize"` which should
prevent this. If it still occurs, the issue is in the website CSS viewport handling.

---

## Important limitations

- The app requires an active internet connection — it loads a live Vercel URL.
- There is no offline mode.
- All website changes deploy automatically via Vercel; no app update is needed
  for website-only changes.
- A new APK release is only needed when Android-side code changes
  (MainActivity.kt or AndroidManifest.xml).
