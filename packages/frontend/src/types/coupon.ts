import type { ICoupon } from '@wanzai/contracts'

/** Coupon with nested merchant info (used in list displays) */
export interface ICouponWithMerchant extends ICoupon {
  merchant?: { name: string; nameEn?: string | null }
  titleEn?: string | null
}

export type { ICoupon, ICouponCreate, IUserCoupon } from '@wanzai/contracts'
