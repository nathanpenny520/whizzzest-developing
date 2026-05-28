// AI聊天相关类型定义
// 共享类型从 @wanzai/contracts 导入，前端专用类型在此定义

import type { IChatMessage, IChatRequest, AIActionType } from '@wanzai/contracts'

// 向后兼容别名（新代码请直接用 contracts 的 I 前缀类型）
export type ChatMessage = IChatMessage
export type ChatRequest = IChatRequest
export type { AIActionType }

export interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  isOpen: boolean
  isMinimized: boolean
}

// 前端专有 AI 响应格式（比 contracts IAIResponse 多了 success/sources/兼容字段）
export interface AIResponse {
  success: boolean
  message: string
  text?: string
  sources?: string[]
  action?: {
    type: AIActionType
    payload: Record<string, unknown>
  }
}
