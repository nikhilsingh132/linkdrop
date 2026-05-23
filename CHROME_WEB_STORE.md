# Chrome Web Store submission — linkdrop

Everything below is ready to copy into the [Developer Dashboard](https://chrome.google.com/webstore/devconsole).

---

## Already done (in this repo)

- [x] Production build script (`npm run build`)
- [x] Store upload zip script (`npm run package` → `release/linkdrop-v1.0.0.zip`)
- [x] Privacy policy at `PRIVACY.md` (public on GitHub)
- [x] Store listing copy in this file
- [x] Permission justifications written
- [x] No host permissions, no backend, no data collection
- [x] Icons at 16 / 48 / 128 in `public/icons/`

---

## You do next (cannot be automated)

1. **Pay the one-time $5** developer registration at https://chrome.google.com/webstore/devconsole
2. **Run locally:** `npm run package` (creates the zip if you haven't already)
3. **Take 1–4 screenshots** (1280×800 or 640×400) — see list below
4. **Upload** `release/linkdrop-v1.0.0.zip` in the dashboard
5. **Paste** the fields below into the listing
6. **Submit for review** (usually 1–3 business days)

---

## Upload file

After running `npm run package`:

```
release/linkdrop-v1.0.0.zip
```

Upload this in **Package → Upload new package**. The zip root must contain `manifest.json` directly (the script handles this).

---

## Store listing — copy & paste

### Title
```
linkdrop — read & watch later
```

### Summary (132 chars max)
```
Drop links to read or watch later. Save pages in a queue, mark them done, and filter by type — all synced across your Chrome browsers.
```

### Description
```
Click the toolbar icon — or right-click any page or link — and it's saved with the title, favicon, and an auto-tag (Article · YouTube · Docs · GitHub · Social). Come back anytime from the popup to open what you saved, mark items done, or delete them.

Features
• Drop current tab with one click
• Right-click any page or link to save it
• Queue and Done tabs
• Auto-categorization (YouTube, Article, Docs, GitHub, Social)
• Category filters
• Syncs across Chrome browsers via chrome.storage.sync

How to use
1. Pin linkdrop from the extensions menu.
2. Browse normally — when you find something worth saving, click the icon or right-click the page.
3. Open the popup anytime to read, mark done, or remove links.

No account. No backend. Your links stay in your browser.
```

### Category
```
Productivity
```

### Store icon (128×128)
Upload: `public/icons/icon-128.png`

---

## Privacy tab — copy & paste

### Privacy policy URL
```
https://github.com/nikhilsingh132/linkdrop/blob/main/PRIVACY.md
```

### Single purpose description
```
Save URLs the user explicitly chooses into a personal reading queue they can manage from the extension popup.
```

### Data usage (questionnaire answers)

| Question | Answer |
|----------|--------|
| Does your extension collect user data? | **No** — data stays in the user's browser via chrome.storage.sync |
| Is data sold to third parties? | **No** |
| Is data used for purposes unrelated to the extension? | **No** |
| Certify compliance with Developer Program Policies | **Yes** |

---

## Permission justifications — copy & paste

| Permission | Justification |
|------------|---------------|
| `storage` | Saves the user's link queue locally and syncs it across Chrome browsers via chrome.storage.sync. |
| `activeTab` | Reads the current tab's URL and title only when the user clicks "Drop current tab". |
| `contextMenus` | Adds right-click menu items so users can save a page or link without opening the popup. |
| `notifications` | Shows a brief confirmation when a link is saved via the context menu. |

**Host permissions:** None. The extension does not make network requests.

---

## Screenshots to capture

Capture at **1280×800** (recommended) or **640×400**:

1. Empty queue with "Drop current tab" button visible
2. Queue with several saved links and category filter pills
3. Done tab showing completed links
4. Right-click context menu on a webpage showing "Drop this page into linkdrop"

**How to capture the popup:**
1. Load the extension from `dist/` in `chrome://extensions`
2. Open the popup, use a screenshot tool
3. Or open DevTools on the popup (right-click popup → Inspect) and capture at fixed dimensions

---

## Distribution settings

| Setting | Value |
|---------|-------|
| Visibility | Public (or Unlisted for a private test first) |
| Regions | All regions |
| Pricing | Free |

---

## After approval

1. Copy your store URL (looks like `https://chromewebstore.google.com/detail/linkdrop/...`)
2. Add it to your GitHub README
3. Test the installed-from-store version once

---

## Future updates

1. Bump `version` in `package.json` (e.g. `1.0.0` → `1.0.1`)
2. Run `npm run package`
3. Upload the new zip in the dashboard
4. Submit for review
