import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common'
import { KnowledgeService } from './knowledge.service.js'
import { Public } from '../../common/decorators/public.decorator.js'
import { ErrorCode } from '@wanzai/contracts'

interface KnowledgeEntry {
  id: string
  category: string
  content: string
  contentEn?: string | null
  keywords: string[]
}

@Controller('knowledge')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Get()
  async findAll(): Promise<{ code: number; data: KnowledgeEntry[]; message: string }> {
    const data = await this.knowledgeService.findAll()
    return { code: ErrorCode.SUCCESS, data, message: 'ok' }
  }

  @Public()
  @Post()
  async create(
    @Body() body: Omit<KnowledgeEntry, 'id'>,
  ): Promise<{ code: number; data: KnowledgeEntry; message: string }> {
    const data = await this.knowledgeService.create(body)
    return { code: ErrorCode.SUCCESS, data, message: 'created' }
  }

  @Public()
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<KnowledgeEntry>,
  ): Promise<{ code: number; data: KnowledgeEntry; message: string }> {
    const data = await this.knowledgeService.update(id, body)
    return { code: ErrorCode.SUCCESS, data, message: 'updated' }
  }

  @Public()
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ code: number; data: null; message: string }> {
    await this.knowledgeService.remove(id)
    return { code: ErrorCode.SUCCESS, data: null, message: 'deleted' }
  }
}
