# linkdrop

> Drop links to read or watch later. Save them in a queue and come back when you're ready.

A minimal Chrome extension for saving pages you want to read or watch later. Built with **React + Vite + Tailwind v4** and Manifest V3.

## Features

- **Drop current tab** — one click from the popup, or right-click any page or link.
- **Auto metadata** — captures the page title, favicon, and auto-tags as YouTube · Article · Docs · GitHub · Social.
- **Queue & Done tabs** — mark items complete instead of deleting; build a reading history.
- **Category filters** — filter your queue by type.
- **Syncs across devices** via `chrome.storage.sync`.

## Stack

| Concern | Choice                                           |
| ------- | ------------------------------------------------ |
| UI      | React 19, Tailwind CSS v4                        |
| Build   | Vite 8 + `@crxjs/vite-plugin` (Manifest V3, HMR) |
| Storage | `chrome.storage.sync`                          |

## Project layout

```
linkdrop/
├── manifest.config.js     MV3 manifest (consumed by crxjs)
├── index.html             popup entry
├── public/icons/          16/48/128 PNGs
├── scripts/build-icons.mjs
└── src/
    ├── popup/             popup React app
    ├── background/        MV3 service worker (context menu)
    ├── components/        shared UI (LinkItem)
    └── lib/               storage, categorize helpers
```

## Develop locally

```bash
npm install
npm run dev     # crxjs dev server with HMR
```

For a production build:

```bash
npm run build   # output goes to dist/
```

### Load it into Chrome

1. Run `npm run build`.
2. Visit `chrome://extensions/`.
3. Toggle **Developer mode** (top right).
4. Click **Load unpacked** and select the `dist/` folder.
5. Pin the linkdrop icon from the puzzle-piece menu.

After any code change, re-run `npm run build` and hit the refresh icon for linkdrop on the extensions page.

## License

MIT
