import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AiController } from './ai.controller.js'
import { AiService } from './ai.service.js'
import { KnowledgeModule } from '../knowledge/knowledge.module.js'

@Module({
  imports: [ConfigModule, KnowledgeModule],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
