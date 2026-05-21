export enum UserRole {
  TOURIST = 'TOURIST',
  MERCHANT = 'MERCHANT',
  ADMIN = 'ADMIN',
}

export interface IUser {
  id: string
  phone?: string
  openId?: string
  nickname: string
  avatarUrl?: string
  role: UserRole
  createdAt: Date
}

export interface IUserProfile {
  id: string
  nickname: string
  avatarUrl?: string
  role: UserRole
  fireworkCount?: number
  couponCount?: number
}
