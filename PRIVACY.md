# Privacy Policy — linkdrop

_Last updated: May 24, 2026_

linkdrop is a Chrome extension that lets you save links to read or watch later. This page explains what data the extension handles and where it goes.

## What linkdrop stores

When you save a link, linkdrop stores the following **locally on your device** and, if you are signed in to Chrome with sync enabled, in your own `chrome.storage.sync` bucket so it follows you across browsers:

- The URL, title, and favicon of pages you explicitly save.
- An auto-detected category (Article, YouTube, Docs, GitHub, Social).
- A "done / not done" flag and timestamps.

linkdrop **does not**:

- Read or transmit pages you have not explicitly saved.
- Track browsing history.
- Send data to any server or third-party service.
- Use cookies, analytics, advertising IDs, or any third-party SDKs.

## Data sharing

We do not sell or rent user data. All saved links stay in your browser's Chrome sync storage.

## Permissions and why we need them

- `storage` — persist your queue across devices.
- `activeTab` — read the URL and title of the current tab when you click "Drop current tab".
- `contextMenus` — add the right-click "Drop this page/link into linkdrop" entry.
- `notifications` — show a confirmation when a link is saved via the context menu.

## Your choices

- Clear all data: remove the extension, or use Chrome's extension storage controls.
- Open source: the full source is available so you can audit exactly what is stored.

## Contact

For questions about this policy, open an issue on the project's GitHub repository.
