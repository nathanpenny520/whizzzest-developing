export interface IDocItem {
  slug: string
  title: string
  titleEn?: string | null
  content: string
  contentEn?: string | null
  coverImage?: string | null
  category: string
  order: number
  createdAt: string
}
