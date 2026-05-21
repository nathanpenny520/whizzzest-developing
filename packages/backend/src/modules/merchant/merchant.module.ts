import { Module } from '@nestjs/common'
import { MerchantController } from './merchant.controller.js'
import { MerchantService } from './merchant.service.js'

@Module({
  controllers: [MerchantController],
  providers: [MerchantService],
  exports: [MerchantService],
})
export class MerchantModule {}
