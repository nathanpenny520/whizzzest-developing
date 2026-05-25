// AI聊天API调用 — 接入 NestJS /api/v1
import axios from 'axios'
import type { AIResponse, ChatRequest } from '@/types/aiChat'
import { getHuaNuoError } from '@/constants/huaNuo'

const API_BASE = '/api/v1'

interface NestResponse {
  code: number
  data: {
    text: string
    action?: AIResponse['action']
  } | null
  message: string
}

export async function sendChatMessage(question: string, locale: string): Promise<AIResponse> {
  try {
    const request: ChatRequest = { question, locale }

    const response = await axios.post<NestResponse>(`${API_BASE}/ai/chat`, request, {
      timeout: 60000,
      headers: { 'Content-Type': 'application/json' },
    })

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

    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        return { success: false, message: getHuaNuoError('timeout', locale) }
      }
      if (error.response?.status === 500) {
        return { success: false, message: getHuaNuoError('serverError', locale) }
      }
    }

    return { success: false, message: getHuaNuoError('generic', locale) }
  }
}
