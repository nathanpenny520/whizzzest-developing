// AI聊天相关类型定义
// 与 @wanzai/contracts 对齐

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isTyping?: boolean
}

export interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  isOpen: boolean
  isMinimized: boolean
}

// 与 contracts IAIResponse 对齐
export interface AIResponse {
  success: boolean
  message: string       // AI 回复文本（兼容旧格式）
  text?: string         // 新版 contracts 字段
  sources?: string[]
  action?: {
    type: AIActionType
    payload: Record<string, unknown>
  }
}

export type AIActionType =
  | 'map_navigation'
  | 'open_page'
  | 'show_coupon'
  | 'trigger_firework'
  | 'show_merchant'

export interface ChatRequest {
  question: string
  locale: string
  sessionId?: string
}
