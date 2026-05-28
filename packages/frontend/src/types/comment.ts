export interface ICommentAuthor {
  id: string
  nickname: string
  avatarUrl?: string
}

export interface ICommentItem {
  id: string
  page: string
  content: string
  author: ICommentAuthor
  parentId?: string | null
  likes: number
  createdAt: string
  likedBy?: { id: string }[]
}
