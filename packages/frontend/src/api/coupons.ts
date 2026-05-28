import { api } from './client'
import type { IApiResponse } from '@wanzai/contracts'
import type { ICoupon, ICouponCreate, IUserCoupon } from '@/types/coupon'

export async function createCoupon(data: ICouponCreate): Promise<ICoupon> {
  const res = await api.post<IApiResponse<ICoupon>>('/coupons', data)
  return res.data.data!
}

export async function getAllCoupons(): Promise<ICoupon[]> {
  const res = await api.get<IApiResponse<ICoupon[]>>('/coupons')
  return res.data.data!
}

export async function getMerchantCoupons(): Promise<ICoupon[]> {
  const res = await api.get<IApiResponse<ICoupon[]>>('/coupons/merchant', {
    params: { _t: Date.now() },
  })
  return res.data.data!
}

export async function getPublicCoupons(): Promise<ICoupon[]> {
  const res = await api.get<IApiResponse<ICoupon[]>>('/coupons/public')
  return res.data.data!
}

export async function claimCoupon(id: string, locale: string): Promise<IUserCoupon> {
  const res = await api.post<IApiResponse<IUserCoupon>>(`/coupons/${id}/claim`, { locale })
  return res.data.data!
}

export async function getMyCoupons(): Promise<IUserCoupon[]> {
  const res = await api.get<IApiResponse<IUserCoupon[]>>('/coupons/my')
  return res.data.data!
}

export async function redeemCoupon(redeemCode: string): Promise<IUserCoupon> {
  const res = await api.post<IApiResponse<IUserCoupon>>('/coupons/redeem', { redeemCode })
  return res.data.data!
}

export async function deleteCoupon(id: string): Promise<void> {
  await api.delete(`/coupons/${id}`)
}
