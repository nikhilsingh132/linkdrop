# Chrome Web Store submission copy — linkdrop

Paste these fields directly into the developer dashboard.

---

## Item name

```
linkdrop — read & watch later, with email digest
```

(Max 75 chars. If too long, fallback: `linkdrop — read later with email digest`.)

## Summary / short description (max 132 chars)

```
Drop links to read or watch later. Get a daily email digest of your learning queue — just enter your email to start.
```

## Category

`Productivity`

## Language

`English (United States)`

---

## Detailed description

```
linkdrop turns every page you open into a learnable item you'll actually come back to.

Click the toolbar icon — or right-click any page or link — and it's saved with the title, favicon, and an auto-tag (Article · YouTube · Docs · GitHub · Social). Tomorrow morning you get a clean email digest of everything still in your queue. On Sundays, an optional weekly recap shows what you finished and what's left.

WHAT MAKES IT DIFFERENT

• No accounts. No analytics.
• Simple setup: enter your email, pick a time, done.
• Your queue syncs across devices via chrome.storage.sync.
• Mark items "done" instead of deleting them — build a learning history.

FEATURES

• One-click save of the current tab from the popup
• Right-click "Save to linkdrop" on any page or link
• Auto-categorization (Article / YouTube / Docs / GitHub / Social)
• Daily email digest at a time you choose
• Optional weekly recap with completion stats
• Queue and Done tabs with search
• Sync across browsers via chrome.storage.sync
• "Run daily digest now" button to confirm delivery without waiting for the schedule

SETUP (30 SECONDS)

1. Install the extension.
2. Open Settings and enter your email.
3. Pick a delivery time. Hit "Run daily digest now" to confirm.

That's it. Drop links all day, get your digest tomorrow morning.

PRIVACY

linkdrop only stores the links you explicitly save plus your settings. It does not track browsing, does not use analytics, and does not embed API keys in the extension. Email delivery uses a small server-side API (Resend). Full privacy policy is linked from this listing.

OPEN SOURCE

linkdrop is MIT-licensed. The full source is available on GitHub so you can audit exactly what gets sent and where.
```

---

## Single purpose (Privacy tab)

```
Save URLs the user explicitly chooses, and email them a digest of those saved links at a schedule the user picks.
```

## Permission justifications (Privacy tab)

| Permission | Paste this |
|---|---|
| `storage` | Persists the user's saved link queue and their settings (email, schedule) across devices via chrome.storage.sync. |
| `alarms` | Schedules the daily digest and optional weekly recap at the time the user chooses in Settings. |
| `activeTab` | Reads the URL and title of the current tab only when the user clicks "Drop link" in the popup. |
| `contextMenus` | Adds a right-click "Save to linkdrop" entry on pages and links so the user can save without opening the popup. |
| `notifications` | Shows a quick confirmation when a link is saved and surfaces errors if the digest email fails to send. |
| Host access to digest API domain | POSTs the user's queue to the linkdrop digest API when a scheduled digest runs or the user clicks "Run daily digest now". The extension has no other backend. |

## Remote code

```
No, I am not using remote code.
```

(All JS is bundled in the package — the only network call is a POST of JSON to the digest API.)

## Data usage declarations (Privacy tab → "What user data will this extension collect?")

Check these boxes:

- [x] **Website content** — limited to URLs and titles of pages the user explicitly saves.
- [x] **Personal communications** — the destination email address the user enters in Settings.

Do NOT check: Personally identifiable info, Health, Financial, Location, Web history, User activity, Authentication information.

Then certify:

- [x] I do not sell or transfer user data to third parties outside of the approved use cases.
- [x] I do not use or transfer user data for purposes unrelated to my item's single purpose.
- [x] I do not use or transfer user data to determine creditworthiness or for lending purposes.

## Privacy policy URL

Host `PRIVACY.md` somewhere public (see "Hosting the privacy policy" below) and paste that URL.

---

## Distribution

- Visibility: **Public** (or Unlisted for a soft launch).
- Regions: All.
- Pricing: Free.

---

## Hosting the privacy policy

The Web Store requires a public URL, not a file in a zip. Easiest options:

1. **GitHub repo (recommended)** — push `PRIVACY.md` to GitHub, then use the raw rendered URL:
   `https://github.com/<you>/linkdrop/blob/main/PRIVACY.md`
2. **GitHub Pages** — enable Pages on the repo and link to `https://<you>.github.io/linkdrop/PRIVACY`.
3. **Gist** — paste `PRIVACY.md` into a public Gist and use that URL.

---

## Required visual assets (you must create these manually)

| Asset | Size | Required? |
|---|---|---|
| Store icon | 128×128 PNG | Yes — reuse `public/icons/icon-128.png` |
| Small promo tile | 440×280 PNG/JPEG | Yes |
| Screenshot(s) | 1280×800 PNG/JPEG | Yes, at least 1, up to 5 |
| Marquee promo tile | 1400×560 PNG/JPEG | Optional (only needed for featuring) |

Suggested screenshots:
1. Popup with 4–5 queued links across categories.
2. Popup "Done" tab with a few completed items.
3. Options/Settings page with email filled in.
4. A sample digest email in Gmail.
5. The right-click context menu showing "Save to linkdrop".

Capture at exactly 1280×800. On macOS: `cmd+shift+4`, draw, then resize/pad in Preview or any image editor.

---

## Before submitting

1. Deploy the digest API — see `server/README.md`.
2. Set `VITE_DIGEST_API_URL` in `.env` to your Worker URL.
3. Run `npm run build` and upload `dist/` as the store package.
