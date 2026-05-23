# Privacy Policy — linkdrop

_Last updated: May 24, 2026_

linkdrop is a Chrome extension that lets you save links to read or watch later and emails you a digest of your queue. This page explains what data the extension handles and where it goes.

## What linkdrop stores

When you save a link, linkdrop stores the following **locally on your device** and, if you are signed in to Chrome with sync enabled, in your own `chrome.storage.sync` bucket so it follows you across browsers:

- The URL, title, and favicon of pages you explicitly save.
- An auto-detected category (Article, YouTube, Docs, GitHub, Social).
- A "done / not done" flag and timestamps.
- Your settings: the destination email address, the digest delivery time, and the weekly recap day.

linkdrop **does not**:

- Read or transmit pages you have not explicitly saved.
- Track browsing history.
- Use cookies, analytics, advertising IDs, or any third-party SDKs inside the extension.

## Where your email digest comes from

When a scheduled digest runs, the extension POSTs your saved queue (URLs, titles, categories) and your destination email address to the linkdrop digest API over HTTPS. That API sends the formatted email via [Resend](https://resend.com), a transactional email provider.

This means:

- Your queue is transmitted only to send the digest you requested.
- The Resend API key is stored on the server, not in the extension.
- You can stop digests at any time by clearing your email in Settings or uninstalling the extension.

## Data sharing

We do not sell or rent user data. The only third party involved in email delivery is Resend, used solely to deliver digest emails to the address you configure. Resend's privacy policy applies to their processing of outbound email.

## Permissions and why we need them

- `storage` — persist your queue and settings across devices.
- `alarms` — fire the daily and weekly digests at the time you choose.
- `activeTab` — read the URL and title of the current tab when you click "Drop link".
- `contextMenus` — add the right-click "Save to linkdrop" entry.
- `notifications` — show a confirmation when a link is saved and surface email-send errors.
- Host access to the digest API domain — POST your queue when a digest is due or you click "Run daily digest now".

## Your choices

- Clear all data: remove the extension, or use Chrome's extension storage controls.
- Stop the email digest: clear the email field in Settings.
- Open source: the full source is available so you can audit exactly what is sent and where.

## Contact

For questions about this policy, open an issue on the project's GitHub repository.
