# Privacy Policy — linkdrop

_Last updated: May 24, 2026_

linkdrop is a Chrome extension that lets you save links to read or watch later and emails you a digest of your queue. This page explains what data the extension handles and where it goes.

## What linkdrop stores

When you save a link, linkdrop stores the following **locally on your device** and, if you are signed in to Chrome with sync enabled, in your own `chrome.storage.sync` bucket so it follows you across browsers:

- The URL, title, and favicon of pages you explicitly save.
- An auto-detected category (Article, YouTube, Docs, GitHub, Social).
- A "done / not done" flag and timestamps.
- Your settings: the destination email address, the digest delivery time, the weekly recap day, and the Apps Script webhook URL you paste in.

linkdrop **does not**:

- Read or transmit pages you have not explicitly saved.
- Track browsing history.
- Use cookies, analytics, advertising IDs, or any third-party SDKs.
- Send data to any server operated by the author.

## Where your email digest comes from

linkdrop has no backend. To send email, you deploy a small Google Apps Script web app into **your own Google account** (one-time setup, ~5 minutes). The extension POSTs your queue to that web app over HTTPS, and the script calls Gmail's `MailApp.sendEmail` to deliver the digest to the address you configured.

This means:

- Your queue is transmitted only to the webhook URL you paste into Settings.
- Email is sent from your Gmail to the address you choose — the author of linkdrop never sees it.
- You can revoke access at any time by deleting the Apps Script deployment.

## Data sharing

We do not sell, rent, or share any data with third parties. There is no third party — the only network endpoint the extension talks to is the Apps Script URL you configure yourself.

## Permissions and why we need them

- `storage` — persist your queue and settings across devices.
- `alarms` — fire the daily and weekly digests at the time you choose.
- `activeTab` — read the URL and title of the current tab when you click "Drop link".
- `contextMenus` — add the right-click "Save to linkdrop" entry.
- `notifications` — show a confirmation when a link is saved and surface email-send errors.
- Host access to `script.google.com` / `script.googleusercontent.com` — POST your queue to your own Apps Script webhook.

## Your choices

- Clear all data: remove the extension, or use Chrome's extension storage controls.
- Stop the email digest: clear the email field in Settings, or delete your Apps Script deployment.
- Open source: the full source is available so you can audit exactly what is sent and where.

## Contact

For questions about this policy, open an issue on the project's GitHub repository.
