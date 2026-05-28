import type { UserRole } from '@wanzai/contracts'

export interface IUser {
  id: string
  phone?: string
  openId?: string
  nickname: string
  avatarUrl?: string
  role: UserRole
  createdAt: Date
}
