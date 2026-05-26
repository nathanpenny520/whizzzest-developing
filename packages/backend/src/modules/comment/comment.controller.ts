import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common'
import type { Request } from 'express'
import { CommentService } from './comment.service.js'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { OptionalAuthGuard } from '../../common/guards/optional-auth.guard.js'

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  async findByPage(@Query('page') page: string, @Req() req: Request & { user?: { id: string } }) {
    const data = await this.commentService.findByPage(page, req.user?.id)
    return { code: 0, data, message: 'ok' }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() body: { page: string; content: string; parentId?: string },
    @Req() req: Request & { user: { id: string } },
  ) {
    const data = await this.commentService.create({ ...body, authorId: req.user.id })
    return { code: 0, data, message: 'ok' }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: string,
    @Req() req: Request & { user: { id: string; role: string } },
  ) {
    await this.commentService.remove(id, req.user.id, req.user.role === 'ADMIN')
    return { code: 0, message: 'deleted' }
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async like(@Param('id') id: string, @Req() req: Request & { user: { id: string } }) {
    const data = await this.commentService.like(id, req.user.id)
    return { code: 0, data, message: 'ok' }
  }
}
