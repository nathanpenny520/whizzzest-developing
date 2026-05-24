/**
 * Sitemap 生成脚本 - 构建时自动生成 sitemap.xml
 *
 * 从路由配置生成包含 hreflang 语言标记的完整 sitemap，
 * 输出到 public/ 目录，由 Vite 构建时复制到 dist/。
 *
 * 使用：npm run build 时自动执行（在 vite build 之前）
 */

import { writeFileSync } from 'fs'
import { resolve } from 'path'

const BASE_URL = 'https://www.whizzzest-yanjingwanzai.top'
const publicDir = resolve(import.meta.dirname, '../packages/frontend/public')
const today = new Date().toISOString().split('T')[0]

const publicRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/culture', changefreq: 'monthly', priority: '0.9' },
  { path: '/food', changefreq: 'monthly', priority: '0.9' },
  { path: '/industry', changefreq: 'monthly', priority: '0.9' },
  { path: '/routes', changefreq: 'monthly', priority: '0.8' },
  { path: '/viewing-spots', changefreq: 'monthly', priority: '0.8' },
  { path: '/map', changefreq: 'monthly', priority: '0.8' },
  { path: '/merchant', changefreq: 'monthly', priority: '0.8' },
  { path: '/firework', changefreq: 'monthly', priority: '0.8' },
  { path: '/docs', changefreq: 'monthly', priority: '0.7' },
  { path: '/games', changefreq: 'monthly', priority: '0.7' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/en', changefreq: 'weekly', priority: '0.9' },
  { path: '/en/culture', changefreq: 'monthly', priority: '0.8' },
  { path: '/en/food', changefreq: 'monthly', priority: '0.8' },
  { path: '/en/industry', changefreq: 'monthly', priority: '0.8' },
  { path: '/en/routes', changefreq: 'monthly', priority: '0.7' },
  { path: '/en/viewing-spots', changefreq: 'monthly', priority: '0.7' },
  { path: '/en/map', changefreq: 'monthly', priority: '0.7' },
  { path: '/en/merchant', changefreq: 'monthly', priority: '0.7' },
  { path: '/en/firework', changefreq: 'monthly', priority: '0.7' },
  { path: '/en/docs', changefreq: 'monthly', priority: '0.6' },
  { path: '/en/games', changefreq: 'monthly', priority: '0.6' },
  { path: '/en/about', changefreq: 'monthly', priority: '0.6' },
]

function getLocalePaths(routePath) {
  const isEn = routePath.startsWith('/en')
  const zhPath = isEn ? (routePath.slice(3) || '/') : routePath
  const enPath = isEn ? routePath : (routePath === '/' ? '/en' : `/en${routePath}`)
  return { zhPath, enPath }
}

function generateUrlEntry(route) {
  const { zhPath, enPath } = getLocalePaths(route.path)
  const loc = route.path === '/' ? BASE_URL : `${BASE_URL}${route.path}`

  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${BASE_URL}${zhPath === '/' ? '' : zhPath}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${enPath}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${zhPath === '/' ? '' : zhPath}"/>
  </url>`
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${publicRoutes.map(generateUrlEntry).join('\n')}
</urlset>
`

writeFileSync(resolve(publicDir, 'sitemap.xml'), sitemap, 'utf-8')
console.log(`✅ Sitemap 生成完成！共 ${publicRoutes.length} 个 URL`)
