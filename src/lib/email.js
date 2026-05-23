import { DIGEST_API_URL } from './config.js'
import { getSettings } from './storage.js'

export async function sendDigest({ email, kind, payload }) {
  if (!email) throw new Error('Recipient email is not configured')

  const { webhookUrl } = await getSettings()
  const endpoint = webhookUrl?.trim() || DIGEST_API_URL?.trim()

  if (!endpoint) {
    throw new Error(
      'Email delivery is not configured. Paste a webhook URL in Settings or rebuild with VITE_DIGEST_API_URL.',
    )
  }

  const body = JSON.stringify({ to: email, kind, ...payload })
  const usingWebhook = Boolean(webhookUrl?.trim())

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: usingWebhook
      ? { 'Content-Type': 'text/plain;charset=utf-8' }
      : { 'Content-Type': 'application/json' },
    body,
    ...(usingWebhook ? { redirect: 'follow' } : {}),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    let message = text.slice(0, 200)
    try {
      const parsed = JSON.parse(text)
      if (parsed?.error) message = parsed.error
    } catch {
      // keep raw text
    }
    throw new Error(`${usingWebhook ? 'Webhook' : 'Digest API'} returned ${res.status}: ${message}`)
  }

  return res.json().catch(() => ({ ok: true }))
}

export function buildDailyPayload(links) {
  const active = links.filter((l) => l.status === 'active')
  return {
    subject: `linkdrop · ${active.length} link${active.length === 1 ? '' : 's'} in your queue`,
    activeCount: active.length,
    items: active.map((l) => ({
      title: l.title,
      url: l.url,
      category: l.category,
      addedAt: l.addedAt,
    })),
  }
}

export function buildWeeklyPayload(links, stats) {
  const active = links.filter((l) => l.status === 'active')
  const completed = links.filter((l) => l.status === 'completed')
  const completedThisWeek = stats?.completedThisWeek || 0
  return {
    subject: `linkdrop · ${completedThisWeek} done this week, ${active.length} to go`,
    activeCount: active.length,
    completedCount: completed.length,
    completedThisWeek,
    items: active.slice(0, 10).map((l) => ({
      title: l.title,
      url: l.url,
      category: l.category,
      addedAt: l.addedAt,
    })),
  }
}
