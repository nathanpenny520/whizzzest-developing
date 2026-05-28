import { api } from './client'
import type { IApiResponse } from '@wanzai/contracts'
import { ErrorCode } from '@wanzai/contracts'

export async function sendCode(email: string): Promise<{ success: boolean; message?: string }> {
  const res = await api.post<IApiResponse>('/auth/send-code', { email })
  if (res.data.code === ErrorCode.SUCCESS) return { success: true }
  return { success: false, message: res.data.message }
}

export async function login(email: string, code: string, locale: string) {
  const res = await api.post<IApiResponse>('/auth/login', { email, code, locale })
  return res.data
}

export async function refresh(refreshToken: string) {
  const res = await api.post<IApiResponse<{ accessToken: string }>>('/auth/refresh', {
    refreshToken,
  })
  return res.data
}
