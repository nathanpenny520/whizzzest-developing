import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service.js'
import type { Request } from 'express'

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  recordPageViewFromRequest(
    body: { path: string; referrer?: string; title?: string },
    req: Request,
  ) {
    const userAgent = (req.headers['user-agent'] as string) || undefined
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress

    return this.prisma.pageView.create({
      data: { path: body.path, referrer: body.referrer, title: body.title, userAgent, ip },
    })
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
