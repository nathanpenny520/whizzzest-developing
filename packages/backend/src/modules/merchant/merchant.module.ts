import { Module } from '@nestjs/common'
import { MerchantController } from './merchant.controller.js'
import { MerchantService } from './merchant.service.js'
import { UserModule } from '../user/user.module.js'

@Module({
  imports: [UserModule],
  controllers: [MerchantController],
  providers: [MerchantService],
  exports: [MerchantService],
})
export class MerchantModule {}
