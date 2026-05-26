import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { KnowledgeService } from './knowledge.service.js'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { RolesGuard } from '../../common/guards/roles.guard.js'
import { Roles } from '../../common/decorators/roles.decorator.js'
import { UserRole } from '@prisma/client'

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
    return { code: 0, data, message: 'ok' }
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(
    @Body() body: Omit<KnowledgeEntry, 'id'>,
  ): Promise<{ code: number; data: KnowledgeEntry; message: string }> {
    const data = await this.knowledgeService.create(body)
    return { code: 0, data, message: 'created' }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() body: Partial<KnowledgeEntry>,
  ): Promise<{ code: number; data: KnowledgeEntry; message: string }> {
    const data = await this.knowledgeService.update(id, body)
    return { code: 0, data, message: 'updated' }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string): Promise<{ code: number; data: null; message: string }> {
    await this.knowledgeService.remove(id)
    return { code: 0, data: null, message: 'deleted' }
  }
}
