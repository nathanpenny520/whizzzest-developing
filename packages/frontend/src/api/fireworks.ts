import { api } from './client'
import type {
  IApiResponse,
  IFireworkRecipe,
  IFireworkRecipeCreate,
  IFireworkRecipeUpdate,
  IFireworkRecipeSummary,
} from '@wanzai/contracts'

export async function createRecipe(data: IFireworkRecipeCreate): Promise<IFireworkRecipe> {
  const res = await api.post<IApiResponse<IFireworkRecipe>>('/fireworks', data)
  return res.data.data!
}

export async function updateRecipe(
  id: string,
  data: IFireworkRecipeUpdate,
): Promise<IFireworkRecipe> {
  const res = await api.put<IApiResponse<IFireworkRecipe>>(`/fireworks/${id}`, data)
  return res.data.data!
}

export async function likeFirework(slug: string): Promise<{ likeCount: number }> {
  const res = await api.post<IApiResponse<{ likeCount: number }>>('/fireworks/like', { slug })
  return res.data.data!
}

export async function getPopularRecipes(params?: {
  sort?: string
  search?: string
  limit?: number
}): Promise<IFireworkRecipeSummary[]> {
  const res = await api.get<IApiResponse<IFireworkRecipeSummary[]>>('/fireworks/popular', {
    params,
  })
  return res.data.data!
}

export async function getMyRecipes(): Promise<IFireworkRecipeSummary[]> {
  const res = await api.get<IApiResponse<IFireworkRecipeSummary[]>>('/fireworks/mine')
  return res.data.data!
}

export async function getRecipeBySlug(slug: string): Promise<IFireworkRecipe> {
  const res = await api.get<IApiResponse<IFireworkRecipe>>(`/fireworks/${slug}`)
  return res.data.data!
}

export async function deleteRecipe(id: string): Promise<void> {
  await api.delete(`/fireworks/${id}`)
}
