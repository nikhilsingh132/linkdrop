import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json' with { type: 'json' }

function digestApiHostPermission() {
  const url = process.env.VITE_DIGEST_API_URL?.trim()
  if (!url) return null
  try {
    return `${new URL(url).origin}/*`
  } catch {
    return null
  }
}

const digestHost = digestApiHostPermission()

export default defineManifest({
  manifest_version: 3,
  name: 'linkdrop',
  version: pkg.version,
  description:
    'Drop links to read or watch later. Get a daily email digest of your learning queue.',
  action: {
    default_popup: 'index.html',
    default_title: 'linkdrop',
    default_icon: {
      16: 'icons/icon-16.png',
      48: 'icons/icon-48.png',
      128: 'icons/icon-128.png',
    },
  },
  options_ui: {
    page: 'options.html',
    open_in_tab: true,
  },
  background: {
    service_worker: 'src/background/service-worker.js',
    type: 'module',
  },
  permissions: ['storage', 'alarms', 'activeTab', 'contextMenus', 'notifications'],
  host_permissions: [
    ...(digestHost ? [digestHost] : []),
    'https://script.google.com/*',
    'https://script.googleusercontent.com/*',
  ],
  icons: {
    16: 'icons/icon-16.png',
    48: 'icons/icon-48.png',
    128: 'icons/icon-128.png',
  },
})
