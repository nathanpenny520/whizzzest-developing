/** 花傩 AI 错误消息 — 统一管理，避免硬编码散落 */

const MESSAGES: Record<string, Record<string, string>> = {
  noApiKey: {
    'zh-CN': '花傩正在充电中～配置 API 密钥后我就能醒过来啦！🔋',
    en: 'Hua Nuo is charging up~ Configure the API key to wake me! 🔋',
  },
  timeout: {
    'zh-CN': '花傩想得有点久……稍后再问一次吧～⏳',
    en: 'Hua Nuo is thinking a bit slowly... Please try again later~ ⏳',
  },
  genericError: {
    'zh-CN': '花傩跑去看烟花了，暂时不在～请稍后再试！🎆',
    en: 'Hua Nuo went to watch the fireworks and is temporarily away~ Please try again later! 🎆',
  },
}

export function getHuaNuoMessage(code: keyof typeof MESSAGES, locale: string): string {
  const entry = MESSAGES[code]
  if (!entry) return ''
  return entry[locale] || entry['zh-CN']
}
