// Vue I18n — 按需加载语言包（zh-CN.json / en.json），减少首屏 JS ~40KB
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': {},
    en: {},
  },
})

const loadedLocales = new Set<string>()

export async function loadLocale(locale: 'zh-CN' | 'en') {
  if (loadedLocales.has(locale)) return
  const mod = locale === 'zh-CN' ? await import('./zh-CN.json') : await import('./en.json')
  i18n.global.setLocaleMessage(locale, mod.default)
  loadedLocales.add(locale)
}

export default i18n
