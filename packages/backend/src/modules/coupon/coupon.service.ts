import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service.js'
import { RedisService } from '../../redis/redis.service.js'

const L = (locale: string, zh: string, en: string) => (locale === 'en' ? en : zh)

@Injectable()
export class CouponService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async create(
    merchantId: string,
    data: {
      title: string
      titleEn?: string
      discount: number
      totalStock: number
      expiresAt: Date
    },
  ) {
    const coupon = await this.prisma.coupon.create({
      data: { merchantId, ...data },
    })
    await this.redis.set(`coupon:stock:${coupon.id}`, String(data.totalStock))
    return coupon
  }

  async findByMerchant(merchantId: string) {
    return this.prisma.coupon.findMany({ where: { merchantId }, orderBy: { createdAt: 'desc' } })
  }

  async findPublic() {
    return this.prisma.coupon.findMany({
      where: { expiresAt: { gt: new Date() } },
      include: { merchant: { select: { id: true, name: true, nameEn: true, category: true } } },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findMyCoupons(userId: string) {
    return this.prisma.userCoupon.findMany({
      where: { userId },
      include: { coupon: { include: { merchant: { select: { name: true } } } } },
      orderBy: { claimedAt: 'desc' },
    })
  }

  async claim(couponId: string, userId: string, locale = 'zh') {
    const coupon = await this.prisma.coupon.findUnique({ where: { id: couponId } })
    if (!coupon) throw new BadRequestException(L(locale, '优惠券不存在', 'Coupon not found'))
    if (new Date(coupon.expiresAt) < new Date())
      throw new BadRequestException(L(locale, '优惠券已过期', 'Coupon expired'))
    if (coupon.totalStock - coupon.usedStock <= 0)
      throw new BadRequestException(L(locale, '优惠券已领完', 'Coupon sold out'))

    const existing = await this.prisma.userCoupon.findFirst({ where: { couponId, userId } })
    if (existing) throw new BadRequestException(L(locale, '已领取过该优惠券', 'Already claimed'))

    // 懒初始化/修复：Redis key 不存在或异常时从 DB 恢复
    const stockKey = `coupon:stock:${couponId}`
    const existingStock = await this.redis.get(stockKey)
    const dbRemaining = coupon.totalStock - coupon.usedStock
    if (existingStock === null || (parseInt(existingStock) <= 0 && dbRemaining > 0)) {
      await this.redis.set(stockKey, String(Math.max(0, dbRemaining)))
    }

    const stock = await this.redis.decr(stockKey)
    if (stock < 0) {
      await this.redis.incr(`coupon:stock:${couponId}`)
      throw new BadRequestException(L(locale, '优惠券已领完', 'Coupon sold out'))
    }

    const redeemCode = this.generateRedeemCode()
    const userCoupon = await this.prisma.userCoupon.create({
      data: { couponId, userId, redeemCode },
    })

    await this.prisma.coupon.update({
      where: { id: couponId },
      data: { usedStock: { increment: 1 } },
    })
    return userCoupon
  }

  async redeem(redeemCode: string, userId: string, locale = 'zh') {
    const uc = await this.prisma.userCoupon.findUnique({
      where: { redeemCode },
      include: { coupon: true },
    })
    if (!uc) throw new NotFoundException(L(locale, '核销码无效', 'Invalid redeem code'))
    if (uc.isRedeemed) throw new BadRequestException(L(locale, '已核销过', 'Already redeemed'))

    const merchant = await this.prisma.merchant.findUnique({ where: { userId } })
    if (!merchant || merchant.id !== uc.coupon.merchantId) {
      throw new ForbiddenException(
        L(locale, '无权核销此券', 'Not authorized to redeem this coupon'),
      )
    }

    return this.prisma.userCoupon.update({
      where: { id: uc.id },
      data: { isRedeemed: true, redeemedAt: new Date() },
    })
  }

  async remove(couponId: string, userId: string, isAdmin: boolean) {
    // Ownership check: only admin or the coupon's merchant can delete
    if (!isAdmin) {
      const merchant = await this.prisma.merchant.findUnique({ where: { userId } })
      if (!merchant) throw new ForbiddenException('Not a merchant')
      const coupon = await this.prisma.coupon.findUnique({ where: { id: couponId } })
      if (!coupon) throw new NotFoundException('Coupon not found')
      if (coupon.merchantId !== merchant.id)
        throw new ForbiddenException('Not authorized to delete this coupon')
    }

    await this.redis.del(`coupon:stock:${couponId}`)
    await this.prisma.userCoupon.deleteMany({ where: { couponId } })
    await this.prisma.coupon.delete({ where: { id: couponId } })
  }

  private generateRedeemCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase()
  }
}
