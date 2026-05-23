# Chrome Web Store listing — linkdrop

Draft copy for the store submission. Update before publishing.

## Title

linkdrop — read & watch later

## Short description (132 chars max)

Drop links to read or watch later. Save pages in a queue, mark them done, and filter by type — all synced across your Chrome browsers.

## Detailed description

Click the toolbar icon — or right-click any page or link — and it's saved with the title, favicon, and an auto-tag (Article · YouTube · Docs · GitHub · Social). Come back anytime from the popup to open what you saved, mark items done, or delete them.

**Features**

• Drop current tab with one click
• Right-click any page or link to save it
• Queue and Done tabs
• Auto-categorization (YouTube, Article, Docs, GitHub, Social)
• Category filters
• Syncs across Chrome browsers via chrome.storage.sync

**How to use**

1. Pin linkdrop from the extensions menu.
2. Browse normally — when you find something worth saving, click the icon or right-click the page.
3. Open the popup anytime to read, mark done, or remove links.

No account. No backend. Your links stay in your browser.

## Category

Productivity

## Single purpose

Save URLs the user explicitly chooses into a personal reading queue they can manage from the extension popup.

## Permission justifications

| Permission      | Why                                                                 |
| --------------- | ------------------------------------------------------------------- |
| `storage`       | Persists the user's saved link queue across devices via sync.       |
| `activeTab`     | Reads the URL and title when the user clicks "Drop current tab".    |
| `contextMenus`  | Adds the right-click "Drop this page/link into linkdrop" entry.     |
| `notifications` | Confirms when a link is saved via the context menu.                 |

No host permissions. No network calls. All data stays local / in Chrome sync.

## Privacy

- No data is sent to any server.
- No analytics or third-party SDKs.
- See `PRIVACY.md` in the repo for the full policy URL.

## Screenshots to capture

1. Empty queue state with "Drop current tab" button.
2. Queue with several saved links and category filters.
3. Done tab with completed links.
4. Right-click context menu on a page.

## Build checklist

1. `npm run build`
2. Zip the `dist/` folder (or use Chrome Web Store developer dashboard upload).
3. Host `PRIVACY.md` at a public URL for the privacy policy field.
