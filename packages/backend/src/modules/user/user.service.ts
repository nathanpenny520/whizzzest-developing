import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service.js'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } })
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

  async findOrCreateByPhone(phone: string, locale = 'zh'): Promise<{ id: string; phone: string; nickname: string; role: string; isNew: boolean }> {
    const existing = await this.findByPhone(phone)
    if (existing) {
      return { id: existing.id, phone: existing.phone!, nickname: existing.nickname, role: existing.role, isNew: false }
    }
    const adminPhones = (process.env.ADMIN_PHONES || 'ADMIN_PHONE_PLACEHOLDER').split(',').map(s => s.trim())
    const isAdmin = adminPhones.includes(phone)
    const isEn = locale === 'en'
    const nickname = isAdmin ? (isEn ? 'Admin' : '管理员') : (isEn ? 'Visitor' : '游客')
    const created = await this.prisma.user.create({
      data: { phone, nickname, role: isAdmin ? 'ADMIN' : undefined },
    })
    return { id: created.id, phone: created.phone!, nickname: created.nickname, role: created.role, isNew: true }
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
}
