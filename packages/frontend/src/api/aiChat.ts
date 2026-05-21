// AI聊天API调用 — 接入 NestJS /api/v1
import axios from 'axios'
import type { AIResponse, ChatRequest } from '@/types/aiChat'

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

    const isEn = locale === 'en'

    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        return {
          success: false,
          message: isEn
            ? 'Hua Nuo is thinking a bit slowly... Please try again~ ⏳'
            : '花傩想得有点久……稍后再问一次吧～⏳',
        }
      }
      if (error.response?.status === 500) {
        return {
          success: false,
          message: isEn
            ? 'Hua Nuo went to watch the fireworks~ Please try again later! 🎆'
            : '花傩跑去看烟花了，暂时不在～请稍后再试！🎆',
        }
      }
    }

    return {
      success: false,
      message: isEn
        ? 'Hua Nuo is temporarily away~ Please try again later!'
        : '花傩暂时离开了～请稍后再试！',
    }
  }
}
