import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service.js'

@Injectable()
export class MerchantService {
  constructor(private readonly prisma: PrismaService) {}

  async apply(
    userId: string,
    data: {
      name: string
      category: string
      mapLng: number
      mapLat: number
      businessHours?: string
      phone?: string
      description?: string
      coverImage?: string
    },
  ) {
    const existing = await this.prisma.merchant.findUnique({ where: { userId } })
    if (existing) throw new ForbiddenException('已申请过商户，请勿重复申请')

    const merchant = await this.prisma.merchant.create({ data: { userId, ...data } })
    // 自动提升用户角色为 MERCHANT（但不覆盖 ADMIN）
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (user && user.role !== 'ADMIN') {
      await this.prisma.user.update({
        where: { id: userId },
        data: { role: 'MERCHANT', nickname: data.name },
      })
    } else {
      await this.prisma.user.update({ where: { id: userId }, data: { nickname: data.name } })
    }
    return merchant
  }

  async findByUserId(userId: string) {
    const m = await this.prisma.merchant.findUnique({ where: { userId } })
    if (!m) throw new NotFoundException('未找到商户资料')
    return m
  }

  async update(
    userId: string,
    data: {
      name?: string
      category?: string
      mapLng?: number
      mapLat?: number
      businessHours?: string
      phone?: string
      description?: string
      coverImage?: string
    },
  ) {
    await this.findByUserId(userId)
    const merchant = await this.prisma.merchant.update({ where: { userId }, data })
    // 同步更新用户昵称
    if (data.name) {
      await this.prisma.user.update({ where: { id: userId }, data: { nickname: data.name } })
    }
    return merchant
  }

  async findAll(verifiedOnly = true) {
    return this.prisma.merchant.findMany({
      where: verifiedOnly ? { isVerified: true } : {},
      include: { coupons: { where: { expiresAt: { gt: new Date() } } } },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string) {
    const m = await this.prisma.merchant.findUnique({
      where: { id },
      include: { coupons: { where: { expiresAt: { gt: new Date() } } } },
    })
    if (!m) throw new NotFoundException('商户不存在')
    return m
  }

  async verify(id: string, isVerified: boolean) {
    return this.prisma.merchant.update({ where: { id }, data: { isVerified } })
  }
}
