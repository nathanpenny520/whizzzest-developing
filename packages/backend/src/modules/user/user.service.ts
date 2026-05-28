import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service.js'
import { UserRole } from '@wanzai/contracts'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id }, include: { merchant: true } })
  }

  async findByPhone(phone: string) {
    return this.prisma.user.findUnique({ where: { phone } })
  }

  async create(data: { phone: string; nickname: string }) {
    return this.prisma.user.create({
      data: {
        phone: data.phone,
        nickname: data.nickname,
      },
    })
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } })
  }

  async findOrCreateByEmail(
    email: string,
    locale = 'zh',
  ): Promise<{ id: string; email: string; nickname: string; role: string; isNew: boolean }> {
    const existing = await this.findByEmail(email)
    if (existing) {
      return {
        id: existing.id,
        email: existing.email!,
        nickname: existing.nickname,
        role: existing.role,
        isNew: false,
      }
    }
    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const isAdmin = adminEmails.includes(email)
    const isEn = locale === 'en'
    const nickname = isAdmin ? (isEn ? 'Admin' : '管理员') : isEn ? 'Visitor' : '游客'
    const created = await this.prisma.user.create({
      data: { email, nickname, role: isAdmin ? 'ADMIN' : undefined },
    })
    return {
      id: created.id,
      email: created.email!,
      nickname: created.nickname,
      role: created.role,
      isNew: true,
    }
  }

  async findOrCreateByPhone(
    phone: string,
    locale = 'zh',
  ): Promise<{ id: string; phone: string; nickname: string; role: string; isNew: boolean }> {
    const existing = await this.findByPhone(phone)
    if (existing) {
      return {
        id: existing.id,
        phone: existing.phone!,
        nickname: existing.nickname,
        role: existing.role,
        isNew: false,
      }
    }
    const adminPhones = (process.env.ADMIN_PHONES || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const isAdmin = adminPhones.includes(phone)
    const isEn = locale === 'en'
    const nickname = isAdmin ? (isEn ? 'Admin' : '管理员') : isEn ? 'Visitor' : '游客'
    const created = await this.prisma.user.create({
      data: { phone, nickname, role: isAdmin ? 'ADMIN' : undefined },
    })
    return {
      id: created.id,
      phone: created.phone!,
      nickname: created.nickname,
      role: created.role,
      isNew: true,
    }
  }

  async getStats() {
    const total = await this.prisma.user.count()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayNew = await this.prisma.user.count({ where: { createdAt: { gte: today } } })
    return { totalUsers: total, todayNew }
  }

  async updateProfile(id: string, data: { nickname?: string; avatarUrl?: string }) {
    return this.prisma.user.update({ where: { id }, data })
  }

  /** Strip sensitive fields from user response */
  sanitizeUserResponse(
    user: { phone?: string | null; merchant?: unknown; [key: string]: unknown },
    includeIsMerchant = false,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { phone, merchant, ...safe } = user
    if (includeIsMerchant) {
      return { ...safe, isMerchant: !!merchant }
    }
    return safe
  }

  /** Promote user to MERCHANT role (does not override ADMIN) and set nickname */
  async promoteToMerchant(userId: string, name: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new NotFoundException('用户不存在')
    if (user.role !== UserRole.ADMIN) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { role: 'MERCHANT', nickname: name },
      })
    } else {
      await this.prisma.user.update({
        where: { id: userId },
        data: { nickname: name },
      })
    }
  }
}
