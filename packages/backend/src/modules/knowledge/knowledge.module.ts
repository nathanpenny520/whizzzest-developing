import { Module } from '@nestjs/common'
import { KnowledgeController } from './knowledge.controller.js'
import { KnowledgeService } from './knowledge.service.js'

@Module({
  controllers: [KnowledgeController],
  providers: [KnowledgeService],
  exports: [KnowledgeService],
})
export class KnowledgeModule {}
