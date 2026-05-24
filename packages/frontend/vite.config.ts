import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import compression from 'vite-plugin-compression'
import { resolve } from 'path'
import type { ServerResponse } from 'node:http'

// 游戏文件 CSP 插件：游戏 HTML 需要 data: 和 blob: 用于 WASM 加载，
// 但它内联了所有资源（不访问外部 API），放宽 connect-src 不会引入安全风险。
function patchCSPForGames(url: string, res: ServerResponse) {
  if (url.startsWith('/games/') && url.endsWith('.html')) {
    const origSetHeader = res.setHeader.bind(res)
    res.setHeader = function (name: string, value: string | string[] | number) {
      if (name.toLowerCase() === 'content-security-policy') {
        if (!value.includes('connect-src') || value.includes("connect-src 'self' data: blob:")) {
          // 已包含或无需处理
        } else {
          value = value.replace(/connect-src\s+'self'/, "connect-src 'self' data: blob:")
        }
      }
      return origSetHeader(name, value)
    }
  }
}

function gameFilesCSPPlugin() {
  return {
    name: 'game-files-csp',
    configureServer(server) {
      server.middlewares.use((_req, res, next) => {
        patchCSPForGames(_req.url || '', res)
        next()
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((_req, res, next) => {
        patchCSPForGames(_req.url || '', res)
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [
    vue(),
    gameFilesCSPPlugin(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'robots.txt', 'sitemap.xml', 'icons/*.svg'],
      manifest: {
        lang: 'zh-CN',
        name: '焰境·万载 - 花炮之乡',
        short_name: '焰境万载',
        description: '江西万载文旅宣传网站 - 探索千年烟花文化、美食与风光',
        theme_color: '#dc2626',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        clientsClaim: true,
        maximumFileSizeToCacheInBytes: 150 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,svg,png,jpg,jpeg,mp3,mp4,webp,ico,woff2,glb}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/webapi\.amap\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'amap-webapi-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: /^https:\/\/cache\.amap\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'amap-asset-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 60,
              },
              cacheableResponse: {
                statuses: [200],
              },
            },
          },
        ],
      },
    }),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
      deleteOriginFile: false,
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginFile: false,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-vue': ['vue', 'vue-router', 'pinia', 'vue-i18n'],
          'vendor-chart': ['chart.js'],
          'vendor-amap': ['@amap/amap-jsapi-loader'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    allowedHosts: ['executively-prosupport-particia.ngrok-free.dev'],
    proxy: {
      '/api/amap': {
        target: 'https://restapi.amap.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/amap/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Referer', 'https://lbs.amap.com/')
          })
        },
      },
      '/api/ai': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ai/, '/api'),
      },
      '/api/v1': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
    },
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy':
        "default-src 'self' blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://webapi.amap.com https://cache.amap.com https://restapi.amap.com https://jsapi-service.amap.com https://*.amap.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://cache.amap.com; img-src 'self' data: blob: https:; media-src 'self' blob: data: https:; connect-src 'self' data: blob: http://localhost:3001 http://localhost:3002 https://whizzzest-yanjingwanzai.top https://restapi.amap.com https://webapi.amap.com https://lbs.amap.com https://jsapi-service.amap.com https://*.amap.com https://www.gstatic.com; font-src 'self' data:; worker-src 'self' blob:; frame-src 'self' https://player.bilibili.com; frame-ancestors 'self';",
    },
  },
  preview: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy':
        "default-src 'self' blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://webapi.amap.com https://cache.amap.com https://restapi.amap.com https://www.gstatic.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; media-src 'self' blob: data: https:; connect-src 'self' data: blob: https://whizzzest-yanjingwanzai.top https://restapi.amap.com https://webapi.amap.com https://lbs.amap.com https://*.amap.com https://www.gstatic.com; font-src 'self' data:; worker-src 'self' blob:; frame-src 'self' https://player.bilibili.com; frame-ancestors 'self';",
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
    },
  },
})
