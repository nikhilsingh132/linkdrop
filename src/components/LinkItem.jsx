import { CATEGORY_META } from '../lib/categorize.js'

function formatRelative(ts) {
  if (!ts) return ''
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d ago`
  const w = Math.floor(d / 7)
  return `${w}w ago`
}

export default function LinkItem({ link, onComplete, onRestore, onDelete }) {
  const meta = CATEGORY_META[link.category] || CATEGORY_META.other
  const isActive = link.status === 'active'

  return (
    <li className="group flex items-start gap-2.5 px-3 py-2.5 hover:bg-surface-soft transition-colors">
      <div className="mt-0.5 size-4 shrink-0 overflow-hidden rounded">
        {link.favIconUrl ? (
          <img
            src={link.favIconUrl}
            alt=""
            className="size-4 object-contain"
            onError={(e) => {
              e.currentTarget.style.visibility = 'hidden'
            }}
          />
        ) : (
          <div className="size-4 rounded bg-line" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <a
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="block truncate text-[13px] font-medium text-ink hover:text-accent"
          title={link.title}
        >
          {link.title}
        </a>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-mute">
          <span
            className={`rounded px-1.5 py-px font-medium ${meta.color}`}
            style={{ fontSize: '10px' }}
          >
            {meta.label}
          </span>
          <span>·</span>
          <span>{formatRelative(isActive ? link.addedAt : link.completedAt)}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {isActive ? (
          <button
            type="button"
            onClick={() => onComplete(link.id)}
            title="Mark as done"
            className="rounded-md p-1.5 text-mute hover:bg-success-soft hover:text-success"
          >
            <svg viewBox="0 0 20 20" className="size-3.5" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4L8.5 12 15.3 5.3a1 1 0 0 1 1.4 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onRestore(link.id)}
            title="Move back to queue"
            className="rounded-md p-1.5 text-mute hover:bg-accent-soft hover:text-accent"
          >
            <svg viewBox="0 0 20 20" className="size-3.5" fill="currentColor">
              <path d="M10 3a7 7 0 1 0 6.32 4a1 1 0 1 0-1.79.9A5 5 0 1 1 10 5v2l4-3-4-3v2z" />
            </svg>
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(link.id)}
          title="Delete"
          className="rounded-md p-1.5 text-mute hover:bg-danger-soft hover:text-danger"
        >
          <svg viewBox="0 0 20 20" className="size-3.5" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M8 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h3a1 1 0 1 1 0 2h-.6l-.6 9.1A2 2 0 0 1 11.8 18H8.2a2 2 0 0 1-2-1.9L5.6 7H5a1 1 0 1 1 0-2h3V4zm1 3h2v8H9V7z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </li>
  )
}
