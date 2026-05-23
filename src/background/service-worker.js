import { addLink } from '../lib/storage.js'
import { categorize } from '../lib/categorize.js'

const CONTEXT_MENU_ID = 'linkdrop:add-page'
const CONTEXT_MENU_LINK_ID = 'linkdrop:add-link'

chrome.runtime.onInstalled.addListener(() => {
  setupContextMenus()
})

chrome.runtime.onStartup.addListener(() => {
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
