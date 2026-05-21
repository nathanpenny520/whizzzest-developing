export interface IMerchant {
  id: string
  userId: string
  name: string
  category: MerchantCategory
  mapLng: number
  mapLat: number
  isVerified: boolean
  coverImage?: string
  businessHours?: string
  phone?: string
  description?: string
  createdAt: Date
}

export type MerchantCategory = 'dining' | 'lodging' | 'firework' | 'specialty'

export interface ICoupon {
  id: string
  merchantId: string
  title: string
  discount: number
  totalStock: number
  usedStock: number
  expiresAt: Date
  createdAt: Date
}

export interface ICouponCreate {
  title: string
  discount: number
  totalStock: number
  expiresAt: Date
}

export interface IUserCoupon {
  id: string
  couponId: string
  userId: string
  redeemCode: string
  isRedeemed: boolean
  claimedAt: Date
  redeemedAt?: Date
}
