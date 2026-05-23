# linkdrop · Apps Script webhook

This tiny Google Apps Script is what powers the daily/weekly email digest.
It is the only piece of "backend" linkdrop needs — no server, no database, no API keys baked into the extension.

## Deploy in 5 minutes

1. Open [script.google.com](https://script.google.com) and click **New project**.
2. Replace the default `Code.gs` content with the contents of [`Code.gs`](./Code.gs) in this folder.
3. Click the floppy-disk **Save** icon and name the project `linkdrop-webhook`.
4. Click **Deploy → New deployment**.
5. Click the gear icon next to "Select type" and pick **Web app**.
6. Configure:
   - **Description**: `linkdrop email digest`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: `Anyone`
7. Click **Deploy**. The first time you'll be prompted to authorize the script — accept the Gmail send-email permission.
8. Copy the **Web app URL** (it ends with `/exec`).
9. Open the linkdrop extension → click the gear icon → paste the URL into **Webhook URL**, add your email, and hit **Send test email**.

## Redeploy after code changes

Saving alone does **not** update the live web app. After editing `Code.gs`:

1. **Deploy → Manage deployments**
2. Click the **pencil** on your existing deployment
3. **Version → New version → Deploy**

Your `/exec` URL stays the same — you do **not** need to paste it into the extension again.

The email logo is served from `{your-exec-url}?logo=1` (Gmail blocks embedded `data:` images).

## How it works

- Emails are sent **from your own Gmail address** using `MailApp.sendEmail`.
- Free Gmail accounts get ~100 outbound recipients/day. Personal use will never come close.
- Nothing about your links ever leaves your control — the script lives in *your* Google account.

## If you publish linkdrop to the Chrome Web Store

For a multi-user rollout, replace `MailApp.sendEmail` with a transactional email provider (Resend, Postmark, SendGrid) and store its API key in Apps Script's **Script Properties** so it stays outside the extension bundle.
