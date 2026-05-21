import { Module } from '@nestjs/common'
import { CouponController } from './coupon.controller.js'
import { CouponService } from './coupon.service.js'
import { MerchantModule } from '../merchant/merchant.module.js'

@Module({
  imports: [MerchantModule],
  controllers: [CouponController],
  providers: [CouponService],
  exports: [CouponService],
})
export class CouponModule {}
