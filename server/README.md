# linkdrop · digest API

Small Cloudflare Worker that sends daily/weekly digest emails via [Resend](https://resend.com). Users of the Chrome extension only enter their email — no Apps Script setup.

## One-time deploy (extension author)

1. Create a free [Resend](https://resend.com) account and add/verify your sending domain (or use `onboarding@resend.dev` for testing).
2. Copy `.dev.vars.example` → `.dev.vars` and fill in your keys.
3. Install and deploy:

```bash
cd server
npm install
npx wrangler login
npx wrangler secret put RESEND_API_KEY
npm run deploy
```

4. Copy the Worker URL (e.g. `https://linkdrop-digest.your-subdomain.workers.dev`).
5. In the extension repo root, create `.env`:

```
VITE_DIGEST_API_URL=https://linkdrop-digest.your-subdomain.workers.dev
```

6. Rebuild the extension: `npm run build`.

## Local dev

```bash
cd server
cp .dev.vars.example .dev.vars   # fill in RESEND_API_KEY
npm run dev
```

Set `VITE_DIGEST_API_URL=http://127.0.0.1:8787` in the root `.env` while developing.

## Cost

- Cloudflare Workers free tier: 100k requests/day
- Resend free tier: 3,000 emails/month

More than enough for a personal or small public extension.

## Abuse protection

The Worker validates email format and caps payload size/item count. For a public launch, also add a Cloudflare rate-limiting rule on the Worker route (e.g. 10 POSTs/hour per IP).
