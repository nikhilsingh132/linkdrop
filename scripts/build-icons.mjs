import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import sharp from 'sharp'

const sizes = [16, 48, 128]
const outDir = resolve('public/icons')

const svg = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="${size}" height="${size}">
  <defs>
    <linearGradient id="bg" x1="16" y1="8" x2="112" y2="120" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#3b82f6"/>
      <stop offset="1" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="drop" x1="64" y1="30" x2="64" y2="96" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#bfdbfe"/>
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="30" fill="url(#bg)"/>
  <path
    d="M64 30 C51 52 40 67 40 82 a24 24 0 0 0 48 0 C88 67 77 52 64 30 Z"
    fill="url(#drop)"
  />
  <ellipse cx="56" cy="62" rx="5" ry="7" fill="#ffffff" opacity="0.55"/>
</svg>`

await mkdir(outDir, { recursive: true })

for (const size of sizes) {
  const out = resolve(outDir, `icon-${size}.png`)
  const png = await sharp(Buffer.from(svg(128))).resize(size, size).png().toBuffer()
  await writeFile(out, png)
  console.log(`wrote ${out}`)
}
