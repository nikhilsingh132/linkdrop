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
- **Simple setup** — users only enter their email; digests are sent via a managed API (Resend).

## Stack

| Concern        | Choice                                                   |
| -------------- | -------------------------------------------------------- |
| UI             | React 19, Tailwind CSS v4                                |
| Build          | Vite 8 + `@crxjs/vite-plugin` (Manifest V3, HMR)         |
| Storage        | `chrome.storage.sync`                                    |
| Scheduling     | `chrome.alarms` (daily + weekly)                         |
| Email delivery | Cloudflare Worker + Resend (API key stays on the server) |

## Project layout

```
linkdrop/
├── manifest.config.js          MV3 manifest (consumed by crxjs)
├── index.html                  popup entry
├── options.html                settings page entry
├── public/icons/               16/48/128 PNGs (generated)
├── server/                     Cloudflare Worker digest API (deploy once)
├── apps-script/                legacy self-hosted option (optional)
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
cp .env.example .env            # set VITE_DIGEST_API_URL (see server/README.md)
npm run dev                       # crxjs dev server with HMR for the popup & options
```

For a production build:

```bash
npm run build                     # output goes to dist/
```

### Load it into Chrome

1. Run `npm run build`.
2. Visit `chrome://extensions/`.
3. Toggle **Developer mode** (top right).
4. Click **Load unpacked** and select the `dist/` folder.
5. Pin the linkdrop icon from the puzzle-piece menu.

After any code change, re-run `npm run build` and hit the refresh icon for linkdrop on the extensions page.

## Email digest setup

**For extension users (Chrome Web Store):** install, open Settings, enter your email, pick a schedule, and hit **Run daily digest now**. No Apps Script or API keys required.

**For extension authors:** deploy the digest API once — see [`server/README.md`](./server/README.md). Set `VITE_DIGEST_API_URL` in `.env` before building the extension zip for the Web Store.

## Roadmap

- Snooze a link for N days (re-surfaces in the daily digest)
- Notes / tags per link
- Drag-to-reorder priority
- Import from Pocket / Raindrop

## License

MIT
