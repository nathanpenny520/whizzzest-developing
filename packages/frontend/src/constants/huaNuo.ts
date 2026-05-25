/** 花傩 AI 助手全局常量 — localStorage key、错误消息、配置参数 */

// ---- localStorage Keys ----
export const STORAGE_KEYS = {
  user: 'huanuo_user',
  chatHistory: 'huanuo_chat_history',
  conversations: 'huanuo_conversations',
} as const

// ---- 错误消息（中英双语，供 api/aiChat 等纯函数使用） ----
const ERROR_MSGS: Record<string, Record<string, string>> = {
  timeout: {
    'zh-CN': '花傩想得有点久……稍后再问一次吧～⏳',
    en: 'Hua Nuo is thinking a bit slowly... Please try again~ ⏳',
  },
  serverError: {
    'zh-CN': '花傩跑去看烟花了，暂时不在～请稍后再试！🎆',
    en: 'Hua Nuo went to watch the fireworks~ Please try again later! 🎆',
  },
  generic: {
    'zh-CN': '花傩暂时离开了～请稍后再试！',
    en: 'Hua Nuo is temporarily away~ Please try again later!',
  },
}

export function getHuaNuoError(code: keyof typeof ERROR_MSGS, locale: string): string {
  return ERROR_MSGS[code]?.[locale] || ERROR_MSGS[code]?.['zh-CN'] || ''
}

// ---- UI 配置 ----
export const HUANUO_CONFIG = {
  /** 夜间模式起始小时（22 点） */
  nightStartHour: 22,
  /** 夜间模式结束小时（6 点） */
  nightEndHour: 6,
  /** 日夜状态检查间隔 (ms) */
  dayNightCheckInterval: 60_000,
  /** speaking 状态持续多久后回到 idle (ms) */
  speakingDuration: 3000,
  /** 主动问候气泡延迟 (ms) */
  greetingDelay: 15_000,
  /** 打字机效果基础速度 (ms/tick) */
  typewriterSpeed: 25,
  /** 短回复阈值（低于此字数不启用打字机效果） */
  typewriterThreshold: 40,
  /** 聊天记录最大保存条数 */
  maxChatHistory: 20,
  /** 对话标题截断长度 */
  conversationTitleMax: 30,
} as const
