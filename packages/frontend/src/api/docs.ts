import { api } from './client'
import type { IApiResponse } from '@wanzai/contracts'

export async function getAllDocs(): Promise<Record<string, unknown>[]> {
  const res = await api.get<IApiResponse>('/docs')
  return (res.data.data || []) as Record<string, unknown>[]
}

export async function getDocBySlug(slug: string): Promise<Record<string, unknown>> {
  const res = await api.get<IApiResponse>(`/docs/${slug}`)
  return res.data.data as Record<string, unknown>
}

export async function createDoc(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  const res = await api.post<IApiResponse>('/docs', data)
  return res.data.data as Record<string, unknown>
}

export async function updateDoc(
  slug: string,
  data: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const res = await api.put<IApiResponse>(`/docs/${slug}`, data)
  return res.data.data as Record<string, unknown>
}

export async function deleteDoc(slug: string): Promise<void> {
  await api.delete(`/docs/${slug}`)
}

export async function uploadDocCover(formData: FormData): Promise<{ url: string }> {
  const res = await api.post<IApiResponse<{ url: string }>>('/docs/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data.data!
}
