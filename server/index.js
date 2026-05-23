import { renderEmail, subjectFor } from './email-template.js'

const MAX_ITEMS = 50
const MAX_BODY_BYTES = 64_000

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return cors(new Response(null, { status: 204 }))
    }

    if (request.method === 'GET') {
      return json({ ok: true, service: 'linkdrop digest api' })
    }

    if (request.method !== 'POST') {
      return json({ ok: false, error: 'Method not allowed' }, 405)
    }

    try {
      const contentLength = Number(request.headers.get('content-length') || 0)
      if (contentLength > MAX_BODY_BYTES) {
        return json({ ok: false, error: 'Payload too large' }, 413)
      }

      const body = await request.json()
      const { to, kind, subject, items = [], activeCount, completedCount, completedThisWeek } =
        body

      if (!to || !isValidEmail(to)) {
        return json({ ok: false, error: 'Valid recipient email is required' }, 400)
      }

      if (!['daily', 'weekly', 'test'].includes(kind)) {
        return json({ ok: false, error: 'Invalid digest kind' }, 400)
      }

      if (!Array.isArray(items) || items.length > MAX_ITEMS) {
        return json({ ok: false, error: `At most ${MAX_ITEMS} items allowed` }, 400)
      }

      if (!env.RESEND_API_KEY) {
        return json({ ok: false, error: 'Email service is not configured' }, 503)
      }

      const from = env.FROM_EMAIL || 'linkdrop <onboarding@resend.dev>'
      const html = renderEmail({
        kind,
        items,
        activeCount,
        completedCount,
        completedThisWeek,
      })
      const finalSubject = subject || subjectFor(kind, items.length)

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject: finalSubject,
          html,
        }),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => '')
        console.error('[linkdrop] Resend error:', res.status, text)
        let detail = 'Failed to send email'
        try {
          const parsed = JSON.parse(text)
          if (parsed?.message) detail = parsed.message
        } catch {
          // keep default
        }
        return json({ ok: false, error: detail }, 502)
      }

      return json({ ok: true, sent: items.length })
    } catch (err) {
      console.error('[linkdrop] digest api error:', err)
      return json({ ok: false, error: 'Invalid request' }, 400)
    }
  },
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())
}

function json(obj, status = 200) {
  return cors(
    new Response(JSON.stringify(obj), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  )
}

function cors(response) {
  const headers = new Headers(response.headers)
  headers.set('Access-Control-Allow-Origin', '*')
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Content-Type')
  return new Response(response.body, { status: response.status, headers })
}
