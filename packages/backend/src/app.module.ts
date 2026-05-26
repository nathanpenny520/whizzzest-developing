import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import { AiModule } from './modules/ai/ai.module.js'
import { AuthModule } from './modules/auth/auth.module.js'
import { UserModule } from './modules/user/user.module.js'
import { FireworkModule } from './modules/firework/firework.module.js'
import { KnowledgeModule } from './modules/knowledge/knowledge.module.js'
import { MerchantModule } from './modules/merchant/merchant.module.js'
import { CouponModule } from './modules/coupon/coupon.module.js'
import { DocsModule } from './modules/docs/docs.module.js'
import { AnalyticsModule } from './modules/analytics/analytics.module.js'
import { CommentModule } from './modules/comment/comment.module.js'
import { PrismaModule } from './prisma/prisma.module.js'
import { RedisModule } from './redis/redis.module.js'
import { CacheControlInterceptor } from './common/interceptors/cache.interceptor.js'
import { RolesGuard } from './common/guards/roles.guard.js'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RedisModule,
    AiModule,
    AuthModule,
    UserModule,
    FireworkModule,
    KnowledgeModule,
    MerchantModule,
    CouponModule,
    DocsModule,
    AnalyticsModule,
    CommentModule,
  ],
  providers: [{ provide: APP_INTERCEPTOR, useClass: CacheControlInterceptor }, RolesGuard],
})
export class AppModule {}
