export interface IFireworkRecipe {
  id: string
  userId: string
  title: string
  config: Record<string, unknown>
  shareSlug: string
  viewCount: number
  likeCount: number
  authorName?: string
  createdAt: Date
}

export interface IFireworkRecipeCreate {
  title: string
  config: Record<string, unknown>
}

export interface IFireworkRecipeUpdate {
  title?: string
  config?: Record<string, unknown>
}

export interface IFireworkRecipeSummary {
  id: string
  title: string
  shareSlug: string
  viewCount: number
  likeCount: number
  authorName: string
  createdAt: Date
}
