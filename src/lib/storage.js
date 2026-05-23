const DEFAULT_SETTINGS = {
  email: '',
  webhookUrl: '',
  dailyEnabled: true,
  dailyTime: '08:00',
  weeklyEnabled: true,
  weeklyDay: 1,
  lastDailySentAt: null,
  lastWeeklySentAt: null,
}

const STATS_DEFAULTS = {
  completedThisWeek: 0,
  weekStartAt: null,
}

export async function getLinks() {
  const { links = [] } = await chrome.storage.sync.get('links')
  return links
}

export async function setLinks(links) {
  await chrome.storage.sync.set({ links })
}

export async function addLink(link) {
  const links = await getLinks()
  if (links.some((l) => l.url === link.url && l.status === 'active')) {
    return { added: false, reason: 'duplicate', links }
  }
  const next = [link, ...links]
  await setLinks(next)
  return { added: true, links: next }
}

export async function updateLink(id, patch) {
  const links = await getLinks()
  const next = links.map((l) => (l.id === id ? { ...l, ...patch } : l))
  await setLinks(next)
  return next
}

export async function removeLink(id) {
  const links = await getLinks()
  const next = links.filter((l) => l.id !== id)
  await setLinks(next)
  return next
}

export async function getSettings() {
  const { settings = {} } = await chrome.storage.sync.get('settings')
  return { ...DEFAULT_SETTINGS, ...settings }
}

export async function setSettings(patch) {
  const current = await getSettings()
  const next = { ...current, ...patch }
  await chrome.storage.sync.set({ settings: next })
  return next
}

export async function getStats() {
  const { stats = {} } = await chrome.storage.sync.get('stats')
  return { ...STATS_DEFAULTS, ...stats }
}

export async function setStats(patch) {
  const current = await getStats()
  const next = { ...current, ...patch }
  await chrome.storage.sync.set({ stats: next })
  return next
}

export async function bumpCompletedThisWeek() {
  const stats = await getStats()
  return setStats({ completedThisWeek: (stats.completedThisWeek || 0) + 1 })
}

export async function resetWeeklyStats() {
  return setStats({ completedThisWeek: 0, weekStartAt: Date.now() })
}

export { DEFAULT_SETTINGS }
