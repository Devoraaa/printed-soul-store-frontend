import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join, extname, basename } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

const images = [
  'hero.png', 'small.png', 'costers.png', 'glass.png', 'metal.png',
  'mug.png', 'premium-mockup.png'
]

for (const img of images) {
  const input = join(publicDir, img)
  const output = join(publicDir, img.replace(/\.png$/i, '.webp'))
  try {
    const info = await sharp(input)
      .webp({ quality: 82, effort: 6 })
      .toFile(output)
    const { size: orig } = await stat(input)
    console.log(`✅ ${img} → ${basename(output)} | ${(orig/1024).toFixed(0)}KB → ${(info.size/1024).toFixed(0)}KB`)
  } catch(e) {
    console.error(`❌ ${img}: ${e.message}`)
  }
}
console.log('\nDone! All WebP images created in /public/')
