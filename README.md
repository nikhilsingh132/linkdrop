# linkdrop

> Drop links to read or watch later. Get a daily email digest of your learning queue.

A minimal Chrome extension that turns every page you open into a learnable item you'll actually come back to. Built with **React + Vite + Tailwind v4** and Manifest V3.

## Features

- **Drop current tab** — one click from the popup, or right-click anywhere to send a page/link.
- **Auto metadata** — captures the page title, favicon, and auto-tags as YouTube · Article · Docs · GitHub · Social.
- **Queue & Done tabs** — mark items complete instead of deleting; build a learning history.
- **Daily digest email** — at a time you pick, of links still in your queue.
- **Weekly recap** — what you finished, what's left.
- **Syncs across devices** via `chrome.storage.sync`.
- **No keys in the extension bundle** — emails ship through a Google Apps Script web app you own.

## Stack

| Concern        | Choice                                                   |
| -------------- | -------------------------------------------------------- |
| UI             | React 19, Tailwind CSS v4                                |
| Build          | Vite 8 + `@crxjs/vite-plugin` (Manifest V3, HMR)         |
| Storage        | `chrome.storage.sync`                                    |
| Scheduling     | `chrome.alarms` (daily + weekly)                         |
| Email delivery | Google Apps Script web app → `MailApp.sendEmail`         |

## Project layout

```
linkdrop/
├── manifest.config.js          MV3 manifest (consumed by crxjs)
├── index.html                  popup entry
├── options.html                settings page entry
├── public/icons/               16/48/128 PNGs (generated)
├── apps-script/Code.gs         email webhook (deploy once to your Google account)
├── scripts/build-icons.mjs     regenerate icons from inline SVG
└── src/
    ├── popup/                  popup React app
    ├── options/                settings React app
    ├── background/             MV3 service worker (alarms, context menu, email dispatch)
    ├── components/             shared UI (LinkItem)
    └── lib/                    storage, categorize, email, alarms helpers
```

## Develop locally

```bash
npm install
npm run dev          # crxjs dev server with HMR for the popup & options
```

For a production build:

```bash
npm run build        # output goes to dist/
```

### Load it into Chrome

1. Run `npm run build`.
2. Visit `chrome://extensions/`.
3. Toggle **Developer mode** (top right).
4. Click **Load unpacked** and select the `dist/` folder.
5. Pin the linkdrop icon from the puzzle-piece menu.

After any code change, re-run `npm run build` and hit the refresh icon for linkdrop on the extensions page.

## Hooking up the email digest

The extension never holds an API key — instead it POSTs to a Google Apps Script web app that *you* deploy. Setup takes ~5 minutes and uses your own Gmail to send.

Follow [`apps-script/README.md`](./apps-script/README.md), then in the extension:

1. Click the gear icon → opens **Settings** page.
2. Paste the Apps Script `/exec` URL into **Webhook URL**.
3. Enter the email address you want digests delivered to.
4. Pick a time and (optionally) a weekly day.
5. Hit **Send test email** to confirm — your inbox should ding within seconds.

## Roadmap

- Snooze a link for N days (re-surfaces in the daily digest)
- Notes / tags per link
- Drag-to-reorder priority
- Import from Pocket / Raindrop
- Multi-user backend swap (Resend/Postmark) for Web Store distribution

## License

MIT
