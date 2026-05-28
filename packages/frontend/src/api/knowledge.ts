import { api } from './client'
import type { IApiResponse } from '@wanzai/contracts'

export async function getAllKnowledge(): Promise<Record<string, unknown>[]> {
  const res = await api.get<IApiResponse>('/knowledge')
  return (res.data.data || []) as Record<string, unknown>[]
}

export async function createKnowledge(
  data: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const res = await api.post<IApiResponse>('/knowledge', data)
  return res.data.data as Record<string, unknown>
}

export async function deleteKnowledge(id: string): Promise<void> {
  await api.delete(`/knowledge/${id}`)
}
