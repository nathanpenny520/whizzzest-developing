// AI聊天API调用 — 接入 NestJS /api/v1
import { api } from './client'
import type { AIResponse } from '@/types/aiChat'
import type { IChatRequest } from '@wanzai/contracts'
import { getHuaNuoError } from '@/constants/huaNuo'
import type { IApiResponse } from '@wanzai/contracts'

export async function sendChatMessage(question: string, locale: string): Promise<AIResponse> {
  try {
    const request: IChatRequest = { question, locale }

    const response = await api.post<IApiResponse<{ text: string; action?: AIResponse['action'] }>>(
      '/ai/chat',
      request,
      { timeout: 60000 },
    )

    const body = response.data

    if (body.code === 0 && body.data) {
      return {
        success: true,
        message: body.data.text,
        text: body.data.text,
        action: body.data.action,
      }
    }

    return {
      success: false,
      message: body.message || 'Unknown error',
    }
  } catch (error) {
    console.error('AI Chat error:', error)

    if (error && typeof error === 'object' && 'code' in error) {
      const axiosError = error as { code?: string; response?: { status?: number } }
      if (axiosError.code === 'ECONNABORTED') {
        return { success: false, message: getHuaNuoError('timeout', locale) }
      }
      if (axiosError.response?.status === 500) {
        return { success: false, message: getHuaNuoError('serverError', locale) }
      }
    }

    return { success: false, message: getHuaNuoError('generic', locale) }
  }
}
