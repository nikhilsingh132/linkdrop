import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json' with { type: 'json' }

export default defineManifest({
  manifest_version: 3,
  name: 'linkdrop',
  version: pkg.version,
  description: 'Drop links to read or watch later. Save, organize, and come back when you are ready.',
  action: {
    default_popup: 'index.html',
    default_title: 'linkdrop',
    default_icon: {
      16: 'icons/icon-16.png',
      48: 'icons/icon-48.png',
      128: 'icons/icon-128.png',
    },
  },
  background: {
    service_worker: 'src/background/service-worker.js',
    type: 'module',
  },
  permissions: ['storage', 'activeTab', 'contextMenus', 'notifications'],
  icons: {
    16: 'icons/icon-16.png',
    48: 'icons/icon-48.png',
    128: 'icons/icon-128.png',
  },
})
