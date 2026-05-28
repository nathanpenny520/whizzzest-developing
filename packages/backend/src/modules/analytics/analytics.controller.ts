import { Controller, Post, Get, Body, Query, Req } from '@nestjs/common'
import type { Request } from 'express'
import { AnalyticsService } from './analytics.service.js'
import { Public } from '../../common/decorators/public.decorator.js'
import { ErrorCode } from '@wanzai/contracts'

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('pageview')
  async record(
    @Body() body: { path: string; referrer?: string; title?: string },
    @Req() req: Request,
  ) {
    await this.analyticsService.recordPageViewFromRequest(body, req)
    return { code: ErrorCode.SUCCESS, message: 'ok' }
  }

  @Public()
  @Get('stats')
  async stats(@Query('days') days = '7') {
    const data = await this.analyticsService.getStats(Number(days))
    return { code: ErrorCode.SUCCESS, data, message: 'ok' }
  }
}
