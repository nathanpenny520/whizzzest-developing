import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service.js'
import type {
  IFireworkRecipe,
  IFireworkRecipeCreate,
  IFireworkRecipeUpdate,
  IFireworkRecipeSummary,
  IFireworkListParams,
} from '@wanzai/contracts'

@Injectable()
export class FireworkService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: IFireworkRecipeCreate, userId: string): Promise<IFireworkRecipe> {
    const slug = this.generateSlug(data.title)
    const recipe = await this.prisma.fireworkRecipe.create({
      data: {
        userId,
        title: data.title,
        config: data.config as unknown as object,
        shareSlug: slug,
      },
    })
    return {
      id: recipe.id,
      userId: recipe.userId,
      title: recipe.title,
      config: recipe.config as unknown as IFireworkRecipe['config'],
      shareSlug: recipe.shareSlug,
      viewCount: recipe.viewCount,
      likeCount: recipe.likeCount,
      createdAt: recipe.createdAt,
    }
  }

  async update(id: string, userId: string, data: IFireworkRecipeUpdate): Promise<IFireworkRecipe> {
    const recipe = await this.prisma.fireworkRecipe.findUnique({ where: { id } })
    if (!recipe) throw new NotFoundException('配方不存在')
    if (recipe.userId !== userId) throw new ForbiddenException('无权修改')

    const updated = await this.prisma.fireworkRecipe.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.config !== undefined && { config: data.config as unknown as object }),
      },
    })
    return {
      id: updated.id,
      userId: updated.userId,
      title: updated.title,
      config: updated.config as unknown as IFireworkRecipe['config'],
      shareSlug: updated.shareSlug,
      viewCount: updated.viewCount,
      likeCount: updated.likeCount,
      createdAt: updated.createdAt,
    }
  }

  async findBySlug(slug: string): Promise<IFireworkRecipe | null> {
    const recipe = await this.prisma.fireworkRecipe.findUnique({
      where: { shareSlug: slug },
      include: { user: { select: { id: true, nickname: true } } },
    })
    if (!recipe) return null

    this.incrementViewCount(slug).catch(() => {})

    return {
      id: recipe.id,
      userId: recipe.userId,
      title: recipe.title,
      config: recipe.config as unknown as IFireworkRecipe['config'],
      shareSlug: recipe.shareSlug,
      viewCount: recipe.viewCount + 1,
      likeCount: recipe.likeCount,
      createdAt: recipe.createdAt,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authorName: (recipe as any).user?.nickname,
    }
  }

  async findBySlugOrThrow(slug: string): Promise<IFireworkRecipe> {
    const recipe = await this.findBySlug(slug)
    if (!recipe) throw new NotFoundException('配方不存在')
    return recipe
  }

  async like(slug: string): Promise<{ likeCount: number }> {
    const recipe = await this.prisma.fireworkRecipe.findUnique({
      where: { shareSlug: slug },
    })
    if (!recipe) throw new NotFoundException('配方不存在')

    const updated = await this.prisma.fireworkRecipe.update({
      where: { shareSlug: slug },
      data: { likeCount: { increment: 1 } },
    })
    return { likeCount: updated.likeCount }
  }

  async popular(params?: IFireworkListParams): Promise<IFireworkRecipeSummary[]> {
    const limit = params?.limit ?? 10
    const sort = params?.sort ?? 'views'

    const orderBy =
      sort === 'likes'
        ? { likeCount: 'desc' as const }
        : sort === 'newest'
          ? { createdAt: 'desc' as const }
          : { viewCount: 'desc' as const }

    const where = params?.search ? { title: { contains: params.search } } : {}

    const recipes = await this.prisma.fireworkRecipe.findMany({
      orderBy,
      take: limit,
      where,
      include: { user: { select: { nickname: true } } },
    })
    return recipes.map((r) => ({
      id: r.id,
      title: r.title,
      shareSlug: r.shareSlug,
      viewCount: r.viewCount,
      likeCount: r.likeCount,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authorName: (r as any).user?.nickname ?? '游客',
      createdAt: r.createdAt,
    }))
  }

  async findByUser(userId: string): Promise<IFireworkRecipeSummary[]> {
    const recipes = await this.prisma.fireworkRecipe.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
    return recipes.map((r) => ({
      id: r.id,
      title: r.title,
      shareSlug: r.shareSlug,
      viewCount: r.viewCount,
      likeCount: r.likeCount,
      authorName: '',
      createdAt: r.createdAt,
    }))
  }

  async delete(id: string, userId: string): Promise<void> {
    const recipe = await this.prisma.fireworkRecipe.findUnique({ where: { id } })
    if (!recipe) throw new NotFoundException('配方不存在')
    if (recipe.userId !== userId) throw new ForbiddenException('无权删除')
    await this.prisma.fireworkRecipe.delete({ where: { id } })
  }

  private async incrementViewCount(slug: string): Promise<void> {
    await this.prisma.fireworkRecipe.update({
      where: { shareSlug: slug },
      data: { viewCount: { increment: 1 } },
    })
  }

  private generateSlug(title: string): string {
    const base = title
      .toLowerCase()
      .replace(/[^a-z0-9一-鿿]+/g, '-')
      .replace(/^-|-$/g, '')
    return `${base}-${Date.now().toString(36)}`
  }
}
