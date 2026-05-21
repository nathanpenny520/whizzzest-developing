import { Module } from '@nestjs/common'
import { FireworkController } from './firework.controller.js'
import { FireworkService } from './firework.service.js'

@Module({
  controllers: [FireworkController],
  providers: [FireworkService],
  exports: [FireworkService],
})
export class FireworkModule {}
