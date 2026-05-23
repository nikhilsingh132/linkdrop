/**
 * linkdrop · email digest webhook
 *
 * Deploy this Google Apps Script as a web app, then paste the resulting URL
 * into the linkdrop extension Options page.
 *
 * Setup (one-time):
 * 1. Go to https://script.google.com and create a new project.
 * 2. Replace the default Code.gs with this entire file.
 * 3. Click "Deploy" → "New deployment" → Select type "Web app".
 * 4. Configuration:
 *      Execute as:    Me (your Gmail account)
 *      Who has access: Anyone
 * 5. Click "Deploy" and copy the generated /exec URL.
 * 6. Paste it into the linkdrop extension under Settings → Webhook URL.
 *
 * Emails are sent FROM your own Gmail address (the one that owns this script).
 * Free Gmail quota is ~100 recipients/day, which is more than enough for personal use.
 */

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const { to, kind, subject, items = [], activeCount, completedCount, completedThisWeek } = body;

    if (!to) throw new Error('Missing "to" email');

    const html = renderEmail({ kind, items, activeCount, completedCount, completedThisWeek });
    const finalSubject = subject || subjectFor(kind, items.length);

    MailApp.sendEmail({
      to,
      subject: finalSubject,
      htmlBody: html,
      name: 'linkdrop',
    });

    return json({ ok: true, sent: items.length });
  } catch (err) {
    return json({ ok: false, error: String(err && err.message || err) }, 500);
  }
}

function doGet() {
  return json({ ok: true, service: 'linkdrop digest webhook' });
}

function subjectFor(kind, count) {
  if (kind === 'weekly') return `linkdrop · weekly recap`;
  if (kind === 'test') return `linkdrop · test email`;
  return `linkdrop · ${count} link${count === 1 ? '' : 's'} in your queue`;
}

function renderEmail({ kind, items, activeCount, completedCount, completedThisWeek }) {
  const intro = kind === 'weekly'
    ? `<p style="margin:0;color:#525252;font-size:14px;line-height:1.6;">
         You finished <strong style="color:#16a34a;">${completedThisWeek || 0}</strong> link${completedThisWeek === 1 ? '' : 's'} this week.
         <strong style="color:#0a0a0a;">${activeCount || 0}</strong> still in your queue.
       </p>`
    : kind === 'test'
      ? `<p style="margin:0;color:#525252;font-size:14px;line-height:1.6;">
           This is a test email from linkdrop. Setup is working.
         </p>`
      : `<p style="margin:0;color:#525252;font-size:14px;line-height:1.6;">
           <strong style="color:#0a0a0a;">${activeCount || items.length}</strong> link${(activeCount || items.length) === 1 ? '' : 's'} waiting in your queue.
         </p>`;

  const rows = items.length
    ? items.map(function(item) {
        const cat = categoryBadge(item.category);
        const safeTitle = escapeHtml(item.title || item.url);
        const safeUrl = escapeHtml(item.url);
        return [
          '<tr>',
            '<td style="padding:14px 0;border-bottom:1px solid #f0f0f0;">',
              '<a href="', safeUrl, '" style="color:#0a0a0a;text-decoration:none;font-size:14px;font-weight:600;display:block;line-height:1.45;">',
                safeTitle,
              '</a>',
              '<div style="margin-top:6px;font-size:11px;color:#737373;">',
                cat, ' · ', escapeHtml(domainOf(item.url)),
              '</div>',
            '</td>',
          '</tr>'
        ].join('');
      }).join('')
    : '<tr><td style="padding:16px 0;color:#737373;font-size:13px;">Your queue is empty. Nice work.</td></tr>';

  return [
    '<div style="background:#f5f5f5;padding:24px 12px;">',
      '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;margin:0 auto;">',
        '<tr><td>',
          '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#ffffff;border:1px solid #e5e5e5;border-radius:16px;overflow:hidden;">',
            '<tr><td style="padding:24px 24px 0;">',
              emailHeaderHtml(),
            '</td></tr>',
            '<tr><td style="padding:16px 24px 0;">', intro, '</td></tr>',
            '<tr><td style="padding:8px 24px 0;">',
              '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">',
                rows,
              '</table>',
            '</td></tr>',
            '<tr><td style="padding:20px 24px 24px;">',
              '<p style="margin:0;font-size:12px;color:#a3a3a3;line-height:1.5;">Open the extension to mark items as done or remove them.</p>',
            '</td></tr>',
          '</table>',
        '</td></tr>',
      '</table>',
    '</div>'
  ].join('');
}

// Public URL for the email logo (same droplet as the extension icon).
// Served from GitHub raw — Gmail trusts and caches it via its image proxy.
var EMAIL_LOGO_URL = 'https://raw.githubusercontent.com/nikhilsingh132/linkdrop/main/public/icons/icon-128.png';

function emailHeaderHtml() {
  return [
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0">',
      '<tr>',
        '<td style="padding-right:12px;vertical-align:middle;width:44px;">',
          '<img src="', EMAIL_LOGO_URL, '" width="40" height="40" alt="linkdrop" style="display:block;border:0;border-radius:10px;outline:none;text-decoration:none;" />',
        '</td>',
        '<td style="vertical-align:middle;">',
          '<div style="font-size:20px;font-weight:700;color:#0a0a0a;letter-spacing:-0.4px;line-height:1.2;">linkdrop</div>',
          '<div style="font-size:12px;color:#737373;margin-top:2px;">your learning queue</div>',
        '</td>',
      '</tr>',
    '</table>'
  ].join('');
}

function categoryBadge(cat) {
  const map = {
    youtube: { bg: '#fee2e2', fg: '#dc2626', label: 'YouTube' },
    article: { bg: '#eef2ff', fg: '#4f46e5', label: 'Article' },
    docs:    { bg: '#e0f2fe', fg: '#0284c7', label: 'Docs' },
    github:  { bg: '#f4f4f5', fg: '#18181b', label: 'GitHub' },
    social:  { bg: '#fce7f3', fg: '#db2777', label: 'Social' },
    other:   { bg: '#f5f5f5', fg: '#525252', label: 'Link' },
  };
  const m = map[cat] || map.other;
  return '<span style="background:' + m.bg + ';color:' + m.fg +
    ';padding:1px 6px;border-radius:4px;font-size:10px;font-weight:600;">' + m.label + '</span>';
}

function domainOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch (_) { return ''; }
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function json(obj, status) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
