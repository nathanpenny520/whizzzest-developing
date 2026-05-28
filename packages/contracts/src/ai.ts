// AI 指令类型联合
export type AIActionType =
  | 'map_navigation'
  | 'open_page'
  | 'show_coupon'
  | 'trigger_firework'
  | 'show_merchant'

// 发送给后端的请求
export interface IChatRequest {
  question: string
  locale: string
  sessionId?: string
}
