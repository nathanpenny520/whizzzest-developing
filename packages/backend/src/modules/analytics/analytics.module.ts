import { Module } from '@nestjs/common'
import { AnalyticsController } from './analytics.controller.js'
import { AnalyticsService } from './analytics.service.js'

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
