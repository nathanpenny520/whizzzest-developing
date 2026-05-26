import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service.js'

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  findByPage(page: string, currentUserId?: string) {
    const likedByFilter = currentUserId
      ? { where: { userId: currentUserId }, select: { id: true } as const }
      : (false as const)

    return this.prisma.comment.findMany({
      where: { page, parentId: null },
      include: {
        author: { select: { id: true, nickname: true, avatarUrl: true } },
        replies: {
          include: {
            author: { select: { id: true, nickname: true, avatarUrl: true } },
            likedBy: likedByFilter,
          },
          orderBy: { createdAt: 'asc' },
        },
        likedBy: likedByFilter,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  create(data: { page: string; content: string; authorId: string; parentId?: string }) {
    return this.prisma.comment.create({
      data,
      include: {
        author: { select: { id: true, nickname: true, avatarUrl: true } },
      },
    })
  }

  async remove(id: string, userId: string, isAdmin: boolean) {
    const comment = await this.prisma.comment.findUnique({ where: { id } })
    if (!comment) throw new NotFoundException('Comment not found')
    if (!isAdmin && comment.authorId !== userId) throw new ForbiddenException('Not authorized')

    // Recursively collect all descendant IDs to handle nested replies
    const collectDescendants = async (parentId: string): Promise<string[]> => {
      const children = await this.prisma.comment.findMany({
        where: { parentId },
        select: { id: true },
      })
      const ids = children.map((c) => c.id)
      for (const childId of ids) {
        ids.push(...(await collectDescendants(childId)))
      }
      return ids
    }

    const replyIds = await collectDescendants(id)
    const allIds = [id, ...replyIds]

    await this.prisma.$transaction([
      this.prisma.commentLike.deleteMany({ where: { commentId: { in: allIds } } }),
      this.prisma.comment.deleteMany({ where: { id: { in: replyIds } } }),
      this.prisma.comment.delete({ where: { id } }),
    ])
  }

  async like(commentId: string, userId: string) {
    const existing = await this.prisma.commentLike.findUnique({
      where: { userId_commentId: { userId, commentId } },
    })

    if (existing) {
      await this.prisma.$transaction([
        this.prisma.commentLike.delete({ where: { id: existing.id } }),
        this.prisma.comment.update({
          where: { id: commentId },
          data: { likes: { decrement: 1 } },
        }),
      ])
      return { liked: false }
    }

    await this.prisma.$transaction([
      this.prisma.commentLike.create({ data: { userId, commentId } }),
      this.prisma.comment.update({
        where: { id: commentId },
        data: { likes: { increment: 1 } },
      }),
    ])
    return { liked: true }
  }
}
