/**
 * 预渲染脚本 - 为 SEO 生成每个路由的静态 HTML
 * 
 * 原理：为每个路由生成一个独立的 index.html，
 * 包含该页面的中文 meta 标签和 noscript 内容描述。
 * 百度爬虫抓到的是有内容的 HTML，现代浏览器照常跑 SPA。
 * 
 * 使用：npm run build 后自动执行，或手动 node scripts/prerender.js
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'

const distDir = resolve(import.meta.dirname, '../packages/frontend/dist')

// 路由配置：每个路由对应一个页面及其 SEO 信息
const routes = [
  {
    path: '/',
    dir: '',
    title: '焰境·万载 - 花炮之乡 | 江西万载文旅宣传网站',
    description: '焰境·万载 - 探索江西省万载县千年烟花文化、非遗传承、美食特产和旅游风光。万载是中国花炮之乡，拥有1400多年烟花生产历史。',
    keywords: '万载,烟花,非遗,旅游,江西,万载古城,烟花之乡,万载花炮,得胜鼓,开口傩,万载美食,万载旅游',
    h1: '焰境·万载',
    noscript: '欢迎访问焰境·万载！本站介绍江西省万载县的千年烟花文化、非物质文化遗产、特色美食和旅游线路。请启用 JavaScript 以获得最佳体验。'
  },
  {
    path: '/culture',
    dir: 'culture',
    title: '焰境·万载 - 非遗文化 | 万载得胜鼓、开口傩、花炮制作技艺',
    description: '探索万载县丰富的非物质文化遗产：得胜鼓、开口傩、夏布织造、花炮制作技艺。千年传承，匠心独运。',
    keywords: '万载非遗,得胜鼓,开口傩,夏布织造,花炮制作,万载传统文化,万载非物质文化遗产',
    h1: '非遗文化',
    noscript: '万载非物质文化遗产页面：得胜鼓、开口傩、夏布织造、花炮制作技艺等千年传承的非遗项目。请启用 JavaScript 以获得最佳体验。'
  },
  {
    path: '/food',
    dir: 'food',
    title: '焰境·万载 - 美食特产 | 万载百合、扎肉、万载古城小吃',
    description: '品味万载特色美食：万载百合、万载扎肉、古城小吃、传统糕点。舌尖上的万载，道道都是乡愁。',
    keywords: '万载美食,万载百合,万载扎肉,万载小吃,万载特产,万载古城美食,江西美食',
    h1: '美食特产',
    noscript: '万载美食特产页面：万载百合、扎肉、古城小吃、传统糕点等特色美食。请启用 JavaScript 以获得最佳体验。'
  },
  {
    path: '/industry',
    dir: 'industry',
    title: '焰境·万载 - 烟花产业 | 中国花炮之乡的千年产业',
    description: '万载花炮产业拥有1400多年历史，是中国花炮之乡。了解万载烟花的生产工艺、产业发展和文化传承。',
    keywords: '万载花炮,万载烟花,花炮产业,烟花制作,烟花历史,中国花炮之乡,万载产业',
    h1: '烟花产业',
    noscript: '万载烟花产业页面：了解万载1400多年花炮生产历史、制作工艺和产业发展。请启用 JavaScript 以获得最佳体验。'
  },
  {
    path: '/routes',
    dir: 'routes',
    title: '焰境·万载 - 旅游线路 | 万载精品旅游攻略',
    description: '万载精品旅游线路推荐：烟花观赏之旅、非遗文化体验、古城漫步、美食探店。带你玩转万载。',
    keywords: '万载旅游,万载旅游线路,万载旅游攻略,万载景点,万载一日游,万载古城游',
    h1: '旅游线路',
    noscript: '万载旅游线路推荐：烟花观赏之旅、非遗文化体验、古城漫步、美食探店。请启用 JavaScript 以获得最佳体验。'
  },
  {
    path: '/viewing-spots',
    dir: 'viewing-spots',
    title: '焰境·万载 - 赏烟地点 | 万载最佳烟花观赏地',
    description: '万载最佳烟花观赏地点推荐：从古城到湖畔，发现万载最美的烟花观赏位置。',
    keywords: '万载烟花观赏,赏烟花地点,万载观赏点,烟花最佳观赏地',
    h1: '赏烟地点',
    noscript: '万载最佳烟花观赏地点推荐页面。请启用 JavaScript 以获得最佳体验。'
  },
  {
    path: '/map',
    dir: 'map',
    title: '焰境·万载 - 地图导览 | 万载文旅全景地图',
    description: '万载文旅全景地图：景点、美食、非遗体验点一目了然。交互式地图带你探索万载。',
    keywords: '万载地图,万载旅游地图,万载导览,万载景点地图',
    h1: '地图导览',
    noscript: '万载文旅全景地图页面。请启用 JavaScript 以获得最佳体验。'
  },
  {
    path: '/merchant',
    dir: 'merchant',
    title: '焰境·万载 - 商家展示 | 万载优质商家推荐',
    description: '万载优质商家展示：烟花店铺、特色餐饮、民宿客栈、文创商店。万载好商家，一网打尽。',
    keywords: '万载商家,万载店铺,万载餐饮,万载民宿,万载购物',
    h1: '商家展示',
    noscript: '万载优质商家展示页面。请启用 JavaScript 以获得最佳体验。'
  },
  {
    path: '/firework',
    dir: 'firework',
    title: '焰境·万载 - 数字烟花 | 在线烟花体验',
    description: '焰境·万载数字烟花体验：在线欣赏万载烟花，感受花炮之乡的绚丽光彩。',
    keywords: '数字烟花,在线烟花,万载烟花体验,虚拟烟花',
    h1: '数字烟花',
    noscript: '焰境·万载数字烟花在线体验页面。请启用 JavaScript 以获得最佳体验。'
  },
  {
    path: '/about',
    dir: 'about',
    title: '焰境·万载 - 关于我们 | 团队介绍与项目背景',
    description: '焰境·万载团队介绍：了解我们的使命愿景、发展历程、合作伙伴，探索万载文旅数字化背后的故事。',
    keywords: '关于我们,焰境万载团队,万载文旅,项目背景,使命愿景',
    h1: '关于我们',
    noscript: '焰境·万载团队介绍页面：了解我们的使命愿景、发展历程和合作伙伴。请启用 JavaScript 以获得最佳体验。'
  },
  // 英文版
  {
    path: '/en',
    dir: 'en',
    title: 'WhizzZest Wanzai - Home | Jiangxi Wanzai Tourism',
    description: 'Explore Wanzai County in Jiangxi Province - home of Chinese fireworks with over 1,400 years of history. Discover intangible cultural heritage, local cuisine, and scenic spots.',
    keywords: 'Wanzai,fireworks,China,culture,tourism,Jiangxi,heritage',
    h1: 'WhizzZest Wanzai',
    noscript: 'Welcome to WhizzZest Wanzai! This site showcases Wanzai County\'s fireworks culture, heritage, cuisine, and tourism. Please enable JavaScript for the best experience.'
  },
  {
    path: '/en/culture',
    dir: 'en/culture',
    title: 'WhizzZest Wanzai - Culture & Heritage',
    description: 'Discover Wanzai\'s intangible cultural heritage: Desheng Drum, Kai Kou Nuo, grass cloth weaving, and traditional firework crafting.',
    keywords: 'Wanzai heritage,Desheng Drum,Kai Kou Nuo,Chinese culture,intangible heritage',
    h1: 'Culture & Heritage',
    noscript: 'Wanzai intangible cultural heritage page. Please enable JavaScript for the best experience.'
  },
  {
    path: '/en/food',
    dir: 'en/food',
    title: 'WhizzZest Wanzai - Food & Specialties',
    description: 'Taste Wanzai\'s local cuisine: Wanzai lily, traditional dishes, ancient town snacks, and local specialties.',
    keywords: 'Wanzai food,Chinese cuisine,local specialties,Wanzai lily',
    h1: 'Food & Specialties',
    noscript: 'Wanzai food and specialties page. Please enable JavaScript for the best experience.'
  },
  {
    path: '/en/industry',
    dir: 'en/industry',
    title: 'WhizzZest Wanzai - Fireworks Industry',
    description: 'Wanzai fireworks industry with over 1,400 years of history. Learn about traditional craftsmanship and modern development.',
    keywords: 'Wanzai fireworks,fireworks industry,Chinese fireworks,fireworks history',
    h1: 'Fireworks Industry',
    noscript: 'Wanzai fireworks industry page. Please enable JavaScript for the best experience.'
  },
  {
    path: '/en/routes',
    dir: 'en/routes',
    title: 'WhizzZest Wanzai - Travel Routes',
    description: 'Recommended travel routes in Wanzai: fireworks viewing, cultural experiences, ancient town walks, and food tours.',
    keywords: 'Wanzai travel,travel routes,Wanzai tourism,Jiangxi travel',
    h1: 'Travel Routes',
    noscript: 'Wanzai travel routes page. Please enable JavaScript for the best experience.'
  },
  {
    path: '/en/viewing-spots',
    dir: 'en/viewing-spots',
    title: 'WhizzZest Wanzai - Viewing Spots',
    description: 'Best spots to enjoy fireworks in Wanzai. From the ancient town to lakeside locations.',
    keywords: 'Wanzai fireworks viewing,viewing spots,Wanzai scenery',
    h1: 'Viewing Spots',
    noscript: 'Wanzai fireworks viewing spots page. Please enable JavaScript for the best experience.'
  },
  {
    path: '/en/map',
    dir: 'en/map',
    title: 'WhizzZest Wanzai - Map',
    description: 'Interactive tourism map of Wanzai. Explore attractions, dining, heritage sites and more.',
    keywords: 'Wanzai map,tourism map,Wanzai attractions',
    h1: 'Map',
    noscript: 'Wanzai interactive tourism map page. Please enable JavaScript for the best experience.'
  },
  {
    path: '/en/merchant',
    dir: 'en/merchant',
    title: 'WhizzZest Wanzai - Merchants',
    description: 'Featured merchants in Wanzai: firework shops, restaurants, guesthouses, and creative stores.',
    keywords: 'Wanzai merchants,Wanzai shops,Wanzai restaurants,Wanzai guesthouses',
    h1: 'Merchants',
    noscript: 'Wanzai featured merchants page. Please enable JavaScript for the best experience.'
  },
  {
    path: '/en/firework',
    dir: 'en/firework',
    title: 'WhizzZest Wanzai - Digital Fireworks',
    description: 'Experience Wanzai\'s fireworks digitally. Enjoy the brilliance of China\'s fireworks capital online.',
    keywords: 'digital fireworks,online fireworks,Wanzai experience',
    h1: 'Digital Fireworks',
    noscript: 'WhizzZest Wanzai digital fireworks experience. Please enable JavaScript for the best experience.'
  },
  {
    path: '/en/about',
    dir: 'en/about',
    title: 'WhizzZest Wanzai - About Us',
    description: 'Learn about the WhizzZest team: our mission, vision, development timeline, and partners. Discover the story behind Wanzai\'s digital tourism platform.',
    keywords: 'about us,WhizzZest team,Wanzai tourism,mission,vision',
    h1: 'About Us',
    noscript: 'WhizzZest Wanzai team introduction page. Please enable JavaScript for the best experience.'
  }
]

// 读取构建后的 index.html 作为模板
const templateHtml = readFileSync(resolve(distDir, 'index.html'), 'utf-8')

// 读取打包后的 JS 文件名
const jsMatch = templateHtml.match(/\/assets\/index-[^"]+\.js/)
const cssMatch = templateHtml.match(/href="\/assets\/index-[^"]+\.css"/)

routes.forEach(route => {
  // 为每个路由生成定制化的 HTML
  let html = templateHtml
  
  // 替换 title
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${route.title}</title>`)
  
  // 替换 description
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${route.description}"`
  )
  
  // 替换 keywords
  html = html.replace(
    /<meta name="keywords" content="[^"]*"/,
    `<meta name="keywords" content="${route.keywords}"`
  )
  
  // 替换 og:title
  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${route.title}"`
  )
  
  // 替换 og:description
  html = html.replace(
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${route.description}"`
  )
  
  // 替换 twitter:title
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"/,
    `<meta name="twitter:title" content="${route.title}"`
  )
  
  // 替换 twitter:description
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"/,
    `<meta name="twitter:description" content="${route.description}"`
  )
  
  // 替换 JSON-LD
  html = html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      "name": "${route.h1}",
      "description": "${route.description}",
      "url": "https://www.whizzzest-yanjingwanzai.top${route.path}",
      "image": "https://www.whizzzest-yanjingwanzai.top/assets/yzxf_bswz-in8l3d1G.jpeg",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "万载县",
        "addressRegion": "江西省",
        "addressCountry": "CN"
      }
    }
  </script>`
  )
  
  // 在 <div id="app"></div> 后面添加 noscript 内容
  html = html.replace(
    '<div id="app"></div>',
    `<div id="app"></div>
    <noscript>
      <div style="padding:20px;font-family:system-ui,sans-serif;max-width:800px;margin:0 auto;color:#333;line-height:1.8">
        <h1 style="color:#dc2626;font-size:1.8em">${route.h1}</h1>
        <p style="font-size:1.1em">${route.noscript}</p>
        <p><a href="/">返回首页</a></p>
      </div>
    </noscript>`
  )

  // 确定输出路径
  if (route.dir === '') {
    // 首页直接覆盖 dist/index.html
    writeFileSync(resolve(distDir, 'index.html'), html, 'utf-8')
  } else {
    // 子路由在 dist 下创建对应目录
    const outDir = resolve(distDir, route.dir)
    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true })
    }
    writeFileSync(resolve(outDir, 'index.html'), html, 'utf-8')
  }
})

console.log('✅ 预渲染完成！共生成', routes.length, '个页面的静态 HTML')
console.log('路由列表：')
routes.forEach(r => console.log(`  ${r.path}`))
