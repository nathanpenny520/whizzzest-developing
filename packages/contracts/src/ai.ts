// AI 响应结构
export interface IAIResponse {
  text: string
  action?: IAIAction
}

// AI 指令类型联合
export type AIActionType =
  | 'map_navigation'
  | 'open_page'
  | 'show_coupon'
  | 'trigger_firework'
  | 'show_merchant'

export interface IAIAction {
  type: AIActionType
  payload: Record<string, unknown>
}

// 前端聊天消息
export interface IChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isTyping?: boolean
}

// 发送给后端的请求
export interface IChatRequest {
  question: string
  locale: string
  sessionId?: string
}

// SSE 事件类型
export interface ISSEEvent {
  type: 'text' | 'action' | 'error' | 'done'
  data: unknown
}
