import { useEffect, useMemo, useState } from 'react'
import { categorize, ALL_CATEGORIES, CATEGORY_META } from '../lib/categorize.js'
import {
  getLinks,
  setLinks as persistLinks,
  bumpCompletedThisWeek,
  getSettings,
} from '../lib/storage.js'
import LinkItem from '../components/LinkItem.jsx'
import Logo from '../components/Logo.jsx'

export default function Popup() {
  const [links, setLinks] = useState([])
  const [tab, setTab] = useState('active')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [needsSetup, setNeedsSetup] = useState(false)

  useEffect(() => {
    ;(async () => {
      const [savedLinks, settings] = await Promise.all([getLinks(), getSettings()])
      setLinks(savedLinks)
      setNeedsSetup(!settings.email || !settings.webhookUrl)
      setLoading(false)
    })()

    const onChanged = (changes, area) => {
      if (area !== 'sync') return
      if (changes.links) setLinks(changes.links.newValue || [])
      if (changes.settings) {
        const s = changes.settings.newValue || {}
        setNeedsSetup(!s.email || !s.webhookUrl)
      }
    }
    chrome.storage.onChanged.addListener(onChanged)
    return () => chrome.storage.onChanged.removeListener(onChanged)
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 1800)
  }

  const save = async (next) => {
    setLinks(next)
    await persistLinks(next)
  }

  const dropCurrentTab = async () => {
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!activeTab?.url || !/^https?:\/\//i.test(activeTab.url)) {
      showToast('Open a website to drop it')
      return
    }
    if (links.some((l) => l.url === activeTab.url && l.status === 'active')) {
      showToast('Already in your queue')
      return
    }
    const link = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      url: activeTab.url,
      title: activeTab.title || activeTab.url,
      favIconUrl: activeTab.favIconUrl || faviconFor(activeTab.url),
      category: categorize(activeTab.url),
      status: 'active',
      addedAt: Date.now(),
      completedAt: null,
    }
    await save([link, ...links])
    showToast('Dropped')
  }

  const onComplete = async (id) => {
    const next = links.map((l) =>
      l.id === id ? { ...l, status: 'completed', completedAt: Date.now() } : l,
    )
    await save(next)
    await bumpCompletedThisWeek()
    showToast('Marked done')
  }

  const onRestore = async (id) => {
    const next = links.map((l) =>
      l.id === id ? { ...l, status: 'active', completedAt: null } : l,
    )
    await save(next)
  }

  const onDelete = async (id) => {
    await save(links.filter((l) => l.id !== id))
  }

  const visible = useMemo(() => {
    return links
      .filter((l) => l.status === tab)
      .filter((l) => (filter === 'all' ? true : l.category === filter))
      .sort((a, b) => {
        if (tab === 'active') return b.addedAt - a.addedAt
        return (b.completedAt || 0) - (a.completedAt || 0)
      })
  }, [links, tab, filter])

  const counts = useMemo(() => {
    return {
      active: links.filter((l) => l.status === 'active').length,
      completed: links.filter((l) => l.status === 'completed').length,
    }
  }, [links])

  const categoriesInView = useMemo(() => {
    const present = new Set(links.filter((l) => l.status === tab).map((l) => l.category))
    return ALL_CATEGORIES.filter((c) => c === 'all' || present.has(c))
  }, [links, tab])

  return (
    <div className="relative flex h-[520px] w-[360px] flex-col bg-surface text-ink">
      <header className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Logo size={24} />
          <h1 className="text-[15px] font-semibold tracking-tight">linkdrop</h1>
        </div>
        <button
          type="button"
          onClick={() => chrome.runtime.openOptionsPage()}
          title="Settings"
          className="rounded-md p-1.5 text-mute hover:bg-surface-soft hover:text-ink"
        >
          <svg viewBox="0 0 20 20" className="size-4" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M11.5 2.4a1 1 0 0 0-1 .9l-.2 1.7a6 6 0 0 0-1.3.5L7.6 4.4a1 1 0 0 0-1.3.1L5 5.8a1 1 0 0 0-.1 1.3l1.1 1.4a6 6 0 0 0-.5 1.3l-1.7.2a1 1 0 0 0-.9 1v2c0 .5.4.9.9 1l1.7.2c.1.5.3.9.5 1.3L4.9 16a1 1 0 0 0 .1 1.3l1.4 1.3c.4.4 1 .4 1.3.1l1.4-1.1c.4.2.8.4 1.3.5l.2 1.7c0 .5.5.9 1 .9h2c.5 0 .9-.4 1-.9l.2-1.7c.5-.1.9-.3 1.3-.5l1.4 1.1c.4.3 1 .3 1.3-.1l1.3-1.4c.4-.3.4-.9.1-1.3l-1.1-1.4c.2-.4.4-.8.5-1.3l1.7-.2c.5-.1.9-.5.9-1v-2c0-.5-.4-.9-.9-1l-1.7-.2a6 6 0 0 0-.5-1.3l1.1-1.4a1 1 0 0 0-.1-1.3L17 4.5a1 1 0 0 0-1.3-.1l-1.4 1.1c-.4-.2-.8-.4-1.3-.5l-.2-1.7a1 1 0 0 0-1-.9h-2zM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </header>

      {needsSetup && (
        <button
          type="button"
          onClick={() => chrome.runtime.openOptionsPage()}
          className="flex items-center justify-between border-b border-warn/40 bg-warn/10 px-4 py-2 text-left text-[12px] text-ink hover:bg-warn/15"
        >
          <span>
            <strong>Finish setup</strong> · add email & webhook to get daily digests
          </span>
          <span className="text-mute">→</span>
        </button>
      )}

      <div className="border-b border-line px-3 pt-2.5">
        <button
          type="button"
          onClick={dropCurrentTab}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink py-2.5 text-[13px] font-medium text-white hover:bg-ink-soft active:scale-[0.99]"
        >
          <svg viewBox="0 0 20 20" className="size-4" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1z"
              clipRule="evenodd"
            />
          </svg>
          Drop current tab
        </button>

        <div className="mt-3 flex gap-1">
          <TabButton active={tab === 'active'} onClick={() => setTab('active')}>
            Queue
            <span className="ml-1.5 rounded bg-line px-1.5 text-[10px] font-semibold text-ink-soft">
              {counts.active}
            </span>
          </TabButton>
          <TabButton active={tab === 'completed'} onClick={() => setTab('completed')}>
            Done
            <span className="ml-1.5 rounded bg-line px-1.5 text-[10px] font-semibold text-ink-soft">
              {counts.completed}
            </span>
          </TabButton>
        </div>

        {categoriesInView.length > 1 && (
          <div className="-mx-3 mt-2 flex gap-1 overflow-x-auto px-3 pb-2 scrollbar-none">
            {categoriesInView.map((c) => {
              const meta = c === 'all' ? { label: 'All' } : CATEGORY_META[c]
              const isOn = filter === c
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFilter(c)}
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    isOn
                      ? 'border-ink bg-ink text-white'
                      : 'border-line text-ink-soft hover:border-ink-soft'
                  }`}
                >
                  {meta.label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <main className="flex-1 overflow-y-auto">
        {loading ? null : visible.length === 0 ? (
          <EmptyState tab={tab} filter={filter} />
        ) : (
          <ul className="divide-y divide-line">
            {visible.map((link) => (
              <LinkItem
                key={link.id}
                link={link}
                onComplete={onComplete}
                onRestore={onRestore}
                onDelete={onDelete}
              />
            ))}
          </ul>
        )}
      </main>

      {toast && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
          <div className="rounded-full bg-ink px-3 py-1.5 text-[12px] font-medium text-white shadow-lg">
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${
        active ? 'bg-surface-soft text-ink' : 'text-mute hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

function EmptyState({ tab, filter }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-surface-soft text-mute">
        <svg viewBox="0 0 20 20" className="size-6" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M9 2a7 7 0 1 0 4.4 12.4l3.6 3.6a1 1 0 0 0 1.4-1.4l-3.6-3.6A7 7 0 0 0 9 2zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <p className="text-[13px] font-medium text-ink">
        {tab === 'active'
          ? filter === 'all'
            ? 'Your queue is empty'
            : 'No links in this filter'
          : 'Nothing finished yet'}
      </p>
      <p className="mt-1 text-[12px] text-mute">
        {tab === 'active'
          ? 'Hit “Drop current tab” to save what you’re looking at.'
          : 'Mark links done from the Queue to build your history.'}
      </p>
    </div>
  )
}

function faviconFor(url) {
  try {
    return `https://www.google.com/s2/favicons?sz=64&domain=${new URL(url).hostname}`
  } catch {
    return ''
  }
}
