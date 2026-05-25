// 批量：JPEG/PNG → WebP，保留原分辨率，原图不动
// PNG: quality 85, 几乎总是收益巨大
// JPEG: quality 80, 只保留体积更小的结果（已高压缩的跳过）
import sharp from 'sharp'
import { readdirSync, statSync, existsSync, mkdirSync, unlinkSync } from 'fs'
import { resolve, extname, basename, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const srcDir = resolve(__dirname, '../src/assets/images')
const publicDir = resolve(__dirname, '../public/optimized')

if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true })

const files = readdirSync(srcDir).filter(f =>
  /\.(jpe?g|png)$/i.test(f) && !f.startsWith('.')
)

const results = []
let skippedCount = 0

for (const file of files) {
  const input = resolve(srcDir, file)
  const ext = extname(file).toLowerCase()
  const output = resolve(publicDir, basename(file, ext) + '.webp')
  const originalSize = statSync(input).size

  const quality = ext === '.png' ? 85 : 80

  await sharp(input)
    .webp({ quality })
    .toFile(output)

  const optimizedSize = statSync(output).size

  if (optimizedSize >= originalSize) {
    // WebP 没变小，丢弃，保留原格式
    unlinkSync(output)
    skippedCount++
    results.push({ file, originalSize, optimizedSize: originalSize, saved: 0, skipped: true })
  } else {
    const saved = ((1 - optimizedSize / originalSize) * 100).toFixed(0)
    results.push({ file, originalSize, optimizedSize, saved, skipped: false })
  }
}

// 排序并输出
results.sort((a, b) => b.originalSize - a.originalSize)

console.log('')
console.log('Image optimization complete:')
console.log('─'.repeat(72))
for (const r of results) {
  if (r.skipped) {
    console.log(
      `  ${r.file.padEnd(36)} ${(r.originalSize / 1024).toFixed(1).padStart(7)}KB →  kept as-is (WebP larger, skipped)`
    )
  } else {
    console.log(
      `  ${r.file.padEnd(36)} ${(r.originalSize / 1024).toFixed(1).padStart(7)}KB → ${(r.optimizedSize / 1024).toFixed(1).padStart(7)}KB  (${r.saved}% saved)`
    )
  }
}

const totalOriginal = results.reduce((s, r) => s + r.originalSize, 0)
const totalOptimized = results.reduce((s, r) => s + r.optimizedSize, 0)
const totalSaved = ((1 - totalOptimized / totalOriginal) * 100).toFixed(0)
const converted = results.filter(r => !r.skipped).length
const skipped = results.filter(r => r.skipped).length
console.log('─'.repeat(72))
console.log(
  `  TOTAL: ${(totalOriginal / 1024 / 1024).toFixed(1)}MB → ${(totalOptimized / 1024 / 1024).toFixed(1)}MB (${totalSaved}% saved, ${converted} converted, ${skipped} skipped)`
)
console.log('')
