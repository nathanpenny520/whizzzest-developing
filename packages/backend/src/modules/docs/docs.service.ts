import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service.js'

@Injectable()
export class DocsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.doc.findMany({
      select: {
        slug: true,
        title: true,
        titleEn: true,
        content: true,
        contentEn: true,
        coverImage: true,
        category: true,
        order: true,
        createdAt: true,
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
  }

  findBySlug(slug: string) {
    return this.prisma.doc.findUnique({ where: { slug } })
  }

  create(data: {
    slug: string
    title: string
    titleEn?: string
    content: string
    contentEn?: string
    coverImage?: string
    category?: string
    order?: number
  }) {
    if (!data.slug?.trim()) throw new BadRequestException('slug is required')
    return this.prisma.doc.create({ data })
  }

  update(
    slug: string,
    data: {
      title?: string
      titleEn?: string
      content?: string
      contentEn?: string
      coverImage?: string
      category?: string
      order?: number
    },
  ) {
    return this.prisma.doc.update({ where: { slug }, data })
  }

  async remove(slug: string) {
    const doc = await this.prisma.doc.findUnique({ where: { slug } })
    if (!doc) throw new NotFoundException('文档不存在')
    return this.prisma.doc.delete({ where: { slug } })
  }
}
