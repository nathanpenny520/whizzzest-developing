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

/** Coupon with nested merchant info (used in list displays) */
export interface ICouponWithMerchant extends ICoupon {
  merchant?: { name: string; nameEn?: string | null }
  titleEn?: string | null
}
