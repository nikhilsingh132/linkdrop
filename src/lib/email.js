export async function sendDigest({ webhookUrl, email, kind, payload }) {
  if (!webhookUrl) throw new Error('Webhook URL is not configured')
  if (!email) throw new Error('Recipient email is not configured')

  const body = JSON.stringify({
    to: email,
    kind,
    ...payload,
  })

  // text/plain avoids browser preflight; Apps Script still reads postData.contents
  const res = await fetch(webhookUrl.trim(), {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body,
    redirect: 'follow',
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Email webhook returned ${res.status}: ${text.slice(0, 200)}`)
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
