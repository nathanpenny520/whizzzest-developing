import { Controller, Get, Post, Put, Delete, Param, Body, Req, Query, UseGuards } from '@nestjs/common'
import type { IFireworkRecipe, IFireworkRecipeCreate, IFireworkRecipeUpdate, IFireworkRecipeSummary } from '@wanzai/contracts'
import { FireworkService } from './firework.service.js'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { Public } from '../../common/decorators/public.decorator.js'

@Controller('fireworks')
export class FireworkController {
  constructor(private readonly fireworkService: FireworkService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() body: IFireworkRecipeCreate,
    @Req() req: { user: { id: string } },
  ): Promise<{ code: number; data: IFireworkRecipe | null; message: string }> {
    const recipe = await this.fireworkService.create(body, req.user.id)
    return { code: 0, data: recipe, message: 'ok' }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: IFireworkRecipeUpdate,
    @Req() req: { user: { id: string } },
  ): Promise<{ code: number; data: IFireworkRecipe | null; message: string }> {
    const recipe = await this.fireworkService.update(id, req.user.id, body)
    return { code: 0, data: recipe, message: 'ok' }
  }

  @Public()
  @Post('like')
  async like(@Body('slug') slug: string): Promise<{ code: number; data: { likeCount: number } | null; message: string }> {
    const result = await this.fireworkService.like(slug)
    return { code: 0, data: result, message: 'ok' }
  }

  @Public()
  @Get('popular')
  async popular(
    @Query('sort') sort?: string,
    @Query('search') search?: string,
    @Query('limit') limit?: string,
  ): Promise<{ code: number; data: IFireworkRecipeSummary[]; message: string }> {
    const recipes = await this.fireworkService.popular({
      sort: sort as 'views' | 'likes' | 'newest',
      search,
      limit: limit ? parseInt(limit) : undefined,
    })
    return { code: 0, data: recipes, message: 'ok' }
  }

  @UseGuards(JwtAuthGuard)
  @Get('mine')
  async mine(@Req() req: { user: { id: string } }): Promise<{ code: number; data: IFireworkRecipeSummary[]; message: string }> {
    const recipes = await this.fireworkService.findByUser(req.user.id)
    return { code: 0, data: recipes, message: 'ok' }
  }

  @Public()
  @Get(':slug')
  async findBySlug(@Param('slug') slug: string): Promise<{ code: number; data: IFireworkRecipe | null; message: string }> {
    const recipe = await this.fireworkService.findBySlug(slug)
    if (!recipe) {
      return { code: 40400, data: null, message: '配方不存在' }
    }
    return { code: 0, data: recipe, message: 'ok' }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
  ): Promise<{ code: number; data: null; message: string }> {
    await this.fireworkService.delete(id, req.user.id)
    return { code: 0, data: null, message: 'deleted' }
  }
}
