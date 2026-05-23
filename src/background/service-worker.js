import {
  getLinks,
  addLink,
  getSettings,
  setSettings,
  getStats,
  resetWeeklyStats,
} from '../lib/storage.js'
import { categorize } from '../lib/categorize.js'
import { sendDigest, buildDailyPayload, buildWeeklyPayload } from '../lib/email.js'
import { rescheduleAll, DAILY_ALARM, WEEKLY_ALARM } from '../lib/alarms.js'

const CONTEXT_MENU_ID = 'linkdrop:add-page'
const CONTEXT_MENU_LINK_ID = 'linkdrop:add-link'

chrome.runtime.onInstalled.addListener(async () => {
  const settings = await getSettings()
  await rescheduleAll(settings)
  setupContextMenus()
})

chrome.runtime.onStartup.addListener(async () => {
  const settings = await getSettings()
  await rescheduleAll(settings)
  setupContextMenus()
})

function setupContextMenus() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: CONTEXT_MENU_ID,
      title: 'Drop this page into linkdrop',
      contexts: ['page', 'action'],
    })
    chrome.contextMenus.create({
      id: CONTEXT_MENU_LINK_ID,
      title: 'Drop this link into linkdrop',
      contexts: ['link'],
    })
  })
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === CONTEXT_MENU_ID && tab) {
    await dropTab(tab)
  } else if (info.menuItemId === CONTEXT_MENU_LINK_ID && info.linkUrl) {
    await dropUrl(info.linkUrl, { title: info.selectionText || info.linkUrl })
  }
})

async function dropTab(tab) {
  if (!tab?.url || !isCapturable(tab.url)) {
    return notify('Cannot drop this page', 'Browser pages and extensions are not supported.')
  }
  const link = makeLink({
    url: tab.url,
    title: tab.title || tab.url,
    favIconUrl: tab.favIconUrl,
  })
  const result = await addLink(link)
  if (!result.added) {
    notify('Already in your queue', tab.title || tab.url)
  } else {
    notify('Dropped into linkdrop', tab.title || tab.url)
  }
}

async function dropUrl(url, { title, favIconUrl } = {}) {
  if (!isCapturable(url)) return
  const link = makeLink({ url, title: title || url, favIconUrl })
  const result = await addLink(link)
  notify(result.added ? 'Dropped into linkdrop' : 'Already in your queue', link.title)
}

function makeLink({ url, title, favIconUrl }) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    url,
    title: (title || url).slice(0, 200),
    favIconUrl: favIconUrl || faviconFromUrl(url),
    category: categorize(url),
    status: 'active',
    addedAt: Date.now(),
    completedAt: null,
  }
}

function faviconFromUrl(url) {
  try {
    const u = new URL(url)
    return `https://www.google.com/s2/favicons?sz=64&domain=${u.hostname}`
  } catch {
    return ''
  }
}

function isCapturable(url) {
  return /^https?:\/\//i.test(url)
}

function notify(title, message) {
  try {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: chrome.runtime.getURL('icons/icon-128.png'),
      title,
      message: message || '',
      priority: 0,
    })
  } catch {
    // Notification API may be unavailable; ignore.
  }
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === DAILY_ALARM) await runDailyDigest()
  if (alarm.name === WEEKLY_ALARM) await runWeeklyDigest()
})

async function runDailyDigest() {
  const settings = await getSettings()
  if (!settings.dailyEnabled || !settings.email || !settings.webhookUrl) return
  const links = await getLinks()
  const active = links.filter((l) => l.status === 'active')
  if (active.length === 0) return
  try {
    await sendDigest({
      webhookUrl: settings.webhookUrl,
      email: settings.email,
      kind: 'daily',
      payload: buildDailyPayload(links),
    })
    await setSettings({ lastDailySentAt: Date.now() })
  } catch (err) {
    console.error('[linkdrop] daily digest failed:', err)
  }
}

async function runWeeklyDigest() {
  const settings = await getSettings()
  if (!settings.weeklyEnabled || !settings.email || !settings.webhookUrl) return
  const links = await getLinks()
  const stats = await getStats()
  try {
    await sendDigest({
      webhookUrl: settings.webhookUrl,
      email: settings.email,
      kind: 'weekly',
      payload: buildWeeklyPayload(links, stats),
    })
    await setSettings({ lastWeeklySentAt: Date.now() })
    await resetWeeklyStats()
  } catch (err) {
    console.error('[linkdrop] weekly digest failed:', err)
  }
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  ;(async () => {
    try {
      if (msg?.type === 'reschedule') {
        const settings = await getSettings()
        await rescheduleAll(settings)
        sendResponse({ ok: true })
      } else if (msg?.type === 'sendTest') {
        const settings = await getSettings()
        const links = await getLinks()
        await sendDigest({
          webhookUrl: settings.webhookUrl,
          email: settings.email,
          kind: 'test',
          payload: {
            subject: 'linkdrop · test email',
            activeCount: links.filter((l) => l.status === 'active').length,
            items: links
              .filter((l) => l.status === 'active')
              .slice(0, 5)
              .map((l) => ({
                title: l.title,
                url: l.url,
                category: l.category,
                addedAt: l.addedAt,
              })),
          },
        })
        sendResponse({ ok: true })
      } else if (msg?.type === 'runDaily') {
        await runDailyDigest()
        sendResponse({ ok: true })
      } else {
        sendResponse({ ok: false, error: 'unknown message' })
      }
    } catch (err) {
      sendResponse({ ok: false, error: String(err?.message || err) })
    }
  })()
  return true
})
