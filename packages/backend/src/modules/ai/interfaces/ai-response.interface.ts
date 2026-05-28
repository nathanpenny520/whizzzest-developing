import type { AIActionType } from '@wanzai/contracts'

export interface IAIAction {
  type: AIActionType
  payload: Record<string, unknown>
}

export interface IAIResponse {
  text: string
  action?: IAIAction
}
