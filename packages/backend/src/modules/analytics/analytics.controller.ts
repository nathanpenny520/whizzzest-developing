import { Controller, Post, Get, Body, Query, UseGuards, Req } from '@nestjs/common'
import type { Request } from 'express'
import { AnalyticsService } from './analytics.service.js'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { RolesGuard } from '../../common/guards/roles.guard.js'
import { Roles } from '../../common/decorators/roles.decorator.js'

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('pageview')
  async record(
    @Body() body: { path: string; referrer?: string; title?: string },
    @Req() req: Request,
  ) {
    const userAgent = (req.headers['user-agent'] as string) || undefined
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress

    await this.analyticsService.recordPageView({
      path: body.path,
      referrer: body.referrer,
      title: body.title,
      userAgent,
      ip,
    })

    return { code: 0, message: 'ok' }
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async stats(@Query('days') days = '7') {
    const data = await this.analyticsService.getStats(Number(days))
    return { code: 0, data, message: 'ok' }
  }
}
