import { api } from './client'
import type { IApiResponse, IMerchant } from '@wanzai/contracts'

export async function applyMerchant(data: Record<string, unknown>): Promise<IMerchant> {
  const res = await api.post<IApiResponse<IMerchant>>('/merchants/apply', data)
  return res.data.data!
}

export async function getMyMerchant(): Promise<IMerchant> {
  const res = await api.get<IApiResponse<IMerchant>>('/merchants/me')
  return res.data.data!
}

export async function updateMyMerchant(data: Record<string, unknown>): Promise<IMerchant> {
  const res = await api.put<IApiResponse<IMerchant>>('/merchants/me', data)
  return res.data.data!
}

export async function getAllMerchants(showAll = false): Promise<IMerchant[]> {
  const res = await api.get<IApiResponse<IMerchant[]>>('/merchants', {
    params: showAll ? { all: 'true' } : {},
  })
  return res.data.data!
}

export async function getMerchantById(id: string): Promise<IMerchant> {
  const res = await api.get<IApiResponse<IMerchant>>(`/merchants/${id}`)
  return res.data.data!
}

export async function verifyMerchant(id: string, isVerified: boolean): Promise<IMerchant> {
  const res = await api.put<IApiResponse<IMerchant>>(`/merchants/${id}/verify`, { isVerified })
  return res.data.data!
}
