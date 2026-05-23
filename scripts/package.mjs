import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, statSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import pkg from '../package.json' with { type: 'json' }

const root = new URL('..', import.meta.url).pathname
const distDir = join(root, 'dist')
const releaseDir = join(root, 'release')
const zipName = `linkdrop-v${pkg.version}.zip`
const zipPath = join(releaseDir, zipName)

console.log('Building extension…')
execSync('npm run build', { cwd: root, stdio: 'inherit' })

const manifestPath = join(distDir, 'manifest.json')
if (!existsSync(manifestPath)) {
  console.error('Build failed: dist/manifest.json not found')
  process.exit(1)
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
console.log(`Manifest OK · v${manifest.version} · MV${manifest.manifest_version}`)

mkdirSync(releaseDir, { recursive: true })
if (existsSync(zipPath)) unlinkSync(zipPath)

execSync(`zip -r "${zipPath}" .`, { cwd: distDir, stdio: 'inherit' })

const sizeKb = Math.round(statSync(zipPath).size / 1024)
console.log(`\nStore upload ready:`)
console.log(`  ${zipPath}`)
console.log(`  ${sizeKb} KB · manifest.json at zip root ✓`)
console.log(`\nNext: upload this zip at https://chrome.google.com/webstore/devconsole`)
