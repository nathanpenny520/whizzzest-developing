import { api } from './client'
import type { IApiResponse } from '@wanzai/contracts'
import type { ICommentItem } from '@/types/comment'

export async function getCommentsByPage(page: string): Promise<ICommentItem[]> {
  const res = await api.get<IApiResponse<ICommentItem[]>>('/comments', { params: { page } })
  return res.data.data!
}

export async function createComment(data: {
  page: string
  content: string
  parentId?: string
}): Promise<ICommentItem> {
  const res = await api.post<IApiResponse<ICommentItem>>('/comments', data)
  return res.data.data!
}

export async function deleteComment(id: string): Promise<void> {
  await api.delete(`/comments/${id}`)
}

export async function likeComment(id: string): Promise<ICommentItem> {
  const res = await api.post<IApiResponse<ICommentItem>>(`/comments/${id}/like`)
  return res.data.data!
}
