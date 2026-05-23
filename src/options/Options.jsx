import { useEffect, useState } from 'react'
import { DEFAULT_SETTINGS, getSettings, setSettings } from '../lib/storage.js'
import Logo from '../components/Logo.jsx'

const DAYS = [
  { v: 0, label: 'Sun' },
  { v: 1, label: 'Mon' },
  { v: 2, label: 'Tue' },
  { v: 3, label: 'Wed' },
  { v: 4, label: 'Thu' },
  { v: 5, label: 'Fri' },
  { v: 6, label: 'Sat' },
]

export default function Options() {
  const [form, setForm] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    getSettings().then((s) => {
      setForm(s)
      setLoading(false)
    })
  }, [])

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  const save = async () => {
    setSaving(true)
    setMessage(null)
    try {
      await setSettings(form)
      await chrome.runtime.sendMessage({ type: 'reschedule' })
      setMessage({ kind: 'success', text: 'Settings saved · reminders rescheduled' })
    } catch (err) {
      setMessage({ kind: 'error', text: String(err?.message || err) })
    } finally {
      setSaving(false)
    }
  }

  const runDaily = async () => {
    setMessage(null)
    try {
      const res = await chrome.runtime.sendMessage({ type: 'runDaily' })
      if (res?.ok) setMessage({ kind: 'success', text: 'Daily digest triggered' })
      else throw new Error(res?.error || 'Unknown error')
    } catch (err) {
      setMessage({ kind: 'error', text: String(err?.message || err) })
    }
  }

  if (loading) return null

  const canSave = form.email && form.webhookUrl

  return (
    <div className="mx-auto max-w-xl px-6 py-10 text-ink">
      <header className="mb-8 flex items-center gap-3">
        <Logo size={36} />
        <div>
          <h1 className="text-xl font-semibold tracking-tight">linkdrop settings</h1>
          <p className="text-[13px] text-mute">
            Configure where and when your learning digest is delivered.
          </p>
        </div>
      </header>

      <Section title="Delivery" subtitle="Where should the digest emails go?">
        <Field label="Your email">
          <input
            type="email"
            value={form.email}
            onChange={(e) => set({ email: e.target.value })}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-[13px] outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </Field>

        <Field
          label="Webhook URL"
          hint="Paste your Google Apps Script web app URL. See README for setup."
        >
          <input
            type="url"
            value={form.webhookUrl}
            onChange={(e) => set({ webhookUrl: e.target.value })}
            placeholder="https://script.google.com/macros/s/.../exec"
            className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-[13px] outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </Field>
      </Section>

      <Section title="Daily reminder" subtitle="A digest of links still in your queue.">
        <Toggle
          checked={form.dailyEnabled}
          onChange={(v) => set({ dailyEnabled: v })}
          label="Send daily digest"
        />
        <Field label="Time">
          <input
            type="time"
            value={form.dailyTime}
            onChange={(e) => set({ dailyTime: e.target.value })}
            disabled={!form.dailyEnabled}
            className="rounded-lg border border-line bg-surface px-3 py-2 text-[13px] outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-40"
          />
        </Field>
      </Section>

      <Section title="Weekly summary" subtitle="A recap of what you finished plus what’s left.">
        <Toggle
          checked={form.weeklyEnabled}
          onChange={(v) => set({ weeklyEnabled: v })}
          label="Send weekly summary"
        />
        <Field label="Day">
          <div className="flex flex-wrap gap-1.5">
            {DAYS.map((d) => {
              const on = form.weeklyDay === d.v
              return (
                <button
                  key={d.v}
                  type="button"
                  disabled={!form.weeklyEnabled}
                  onClick={() => set({ weeklyDay: d.v })}
                  className={`rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors disabled:opacity-40 ${
                    on
                      ? 'border-ink bg-ink text-white'
                      : 'border-line text-ink-soft hover:border-ink-soft'
                  }`}
                >
                  {d.label}
                </button>
              )
            })}
          </div>
        </Field>
      </Section>

      {message && (
        <div
          className={`mb-4 rounded-lg border px-3 py-2 text-[13px] ${
            message.kind === 'success'
              ? 'border-success/30 bg-success-soft text-success'
              : 'border-danger/30 bg-danger-soft text-danger'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={save}
          disabled={!canSave || saving}
          className="rounded-lg bg-ink px-4 py-2 text-[13px] font-medium text-white hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save settings'}
        </button>
        <button
          type="button"
          onClick={runDaily}
          disabled={!canSave}
          className="rounded-lg border border-line px-4 py-2 text-[13px] font-medium text-ink hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          Run daily digest now
        </button>
      </div>

      <DigestInfo settings={form} />
    </div>
  )
}

function Section({ title, subtitle, children }) {
  return (
    <section className="mb-7 rounded-xl border border-line bg-surface p-5">
      <h2 className="text-[14px] font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-0.5 text-[12px] text-mute">{subtitle}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  )
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-ink-soft">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-mute">{hint}</span>}
    </label>
  )
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span className="text-[13px] text-ink">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-0 p-0.5 transition-colors ${
          checked ? 'justify-end bg-accent' : 'justify-start bg-line'
        }`}
      >
        <span className="block size-4 shrink-0 rounded-full bg-white shadow" />
      </button>
    </label>
  )
}

function DigestInfo({ settings }) {
  const last = (ts) => (ts ? new Date(ts).toLocaleString() : '—')
  return (
    <div className="mt-8 rounded-xl border border-dashed border-line p-4 text-[12px] text-mute">
      <p>
        <span className="font-semibold text-ink-soft">Last daily sent:</span>{' '}
        {last(settings.lastDailySentAt)}
      </p>
      <p className="mt-0.5">
        <span className="font-semibold text-ink-soft">Last weekly sent:</span>{' '}
        {last(settings.lastWeeklySentAt)}
      </p>
    </div>
  )
}
