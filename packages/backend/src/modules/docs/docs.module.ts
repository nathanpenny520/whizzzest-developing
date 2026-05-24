import { Module } from '@nestjs/common'
import { PrismaModule } from '../../prisma/prisma.module.js'
import { DocsController } from './docs.controller.js'
import { DocsService } from './docs.service.js'

@Module({
  imports: [PrismaModule],
  controllers: [DocsController],
  providers: [DocsService],
  exports: [DocsService],
})
export class DocsModule {}
