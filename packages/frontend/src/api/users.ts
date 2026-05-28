import { api } from './client'
import type { IApiResponse, IUser } from '@wanzai/contracts'

export async function getMyProfile(): Promise<IUser & { isMerchant?: boolean }> {
  const res = await api.get<IApiResponse<IUser & { isMerchant?: boolean }>>('/users/me')
  return res.data.data!
}

export async function updateProfile(data: {
  nickname?: string
  avatarUrl?: string
}): Promise<IUser> {
  const res = await api.put<IApiResponse<IUser>>('/users/me', data)
  return res.data.data!
}

export async function getUserStats(): Promise<{ totalUsers: number; todayNew: number }> {
  const res = await api.get<IApiResponse<{ totalUsers: number; todayNew: number }>>('/users/stats')
  return res.data.data!
}
