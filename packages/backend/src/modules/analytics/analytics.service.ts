import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service.js'

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  recordPageView(data: {
    path: string
    referrer?: string
    title?: string
    userAgent?: string
    ip?: string
  }) {
    return this.prisma.pageView.create({ data })
  }

  async getStats(days: number) {
    const since = new Date()
    since.setDate(since.getDate() - days)

    const [total, views, topPages] = await Promise.all([
      this.prisma.pageView.count(),
      this.prisma.pageView.count({ where: { createdAt: { gte: since } } }),
      this.prisma.pageView.groupBy({
        by: ['path'],
        _count: { path: true },
        orderBy: { _count: { path: 'desc' } },
        take: 20,
        where: { createdAt: { gte: since } },
      }),
    ])

    return { total, recentViews: views, topPages }
  }
}
