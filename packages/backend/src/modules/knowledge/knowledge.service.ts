import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service.js'
import { getDefaultPrompt } from './prompts.js'

interface KnowledgeEntry {
  id: string
  category: string
  content: string
  contentEn?: string | null
  keywords: string[]
}

@Injectable()
export class KnowledgeService {
  constructor(private readonly prisma: PrismaService) {}

  /** 关键词匹配检索，返回 Top-K 相关知识条目 */
  async retrieveRelevant(question: string, _locale: string): Promise<KnowledgeEntry[]> {
    if (!question) return []

    const all = await this.prisma.knowledgeEntry.findMany({
      where: { category: { not: '_system_prompt' } },
    })

    const q = question.toLowerCase()
    const scored = all.map((entry) => {
      let score = 0
      for (const kw of entry.keywords) {
        if (q.includes(kw.toLowerCase())) score++
      }
      return { entry, score }
    })

    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((s) => ({
        id: s.entry.id,
        category: s.entry.category,
        content: s.entry.content,
        contentEn: s.entry.contentEn,
        keywords: s.entry.keywords,
      }))
  }

  /** 格式化检索结果为 LLM 上下文 */
  buildContext(entries: KnowledgeEntry[]): string {
    if (entries.length === 0) return ''
    return entries.map((e) => `[${e.category}]\n${e.content}`).join('\n\n')
  }

  /** 获取系统提示词（按 locale 选中文或英文，从 DB 读取，无数据时用默认值） */
  async getSystemPrompt(locale: string): Promise<string> {
    const row = await this.prisma.knowledgeEntry.findFirst({
      where: { category: '_system_prompt' },
    })

    if (!row) {
      return getDefaultPrompt(locale)
    }

    if (locale === 'en' && row.contentEn) {
      return row.contentEn
    }
    return row.content
  }

  // ---- CRUD ----

  async findAll(): Promise<KnowledgeEntry[]> {
    const rows = await this.prisma.knowledgeEntry.findMany({
      where: { category: { not: '_system_prompt' } },
      orderBy: { category: 'asc' },
    })
    return rows.map((r) => ({
      id: r.id,
      category: r.category,
      content: r.content,
      contentEn: r.contentEn,
      keywords: r.keywords,
    }))
  }

  async create(data: Omit<KnowledgeEntry, 'id'>): Promise<KnowledgeEntry> {
    const row = await this.prisma.knowledgeEntry.create({
      data: {
        category: data.category,
        content: data.content,
        contentEn: data.contentEn ?? null,
        keywords: data.keywords,
      },
    })
    return { ...row, contentEn: row.contentEn }
  }

  async update(id: string, data: Partial<KnowledgeEntry>): Promise<KnowledgeEntry> {
    const row = await this.prisma.knowledgeEntry.update({
      where: { id },
      data: {
        ...(data.category && { category: data.category }),
        ...(data.content && { content: data.content }),
        ...(data.contentEn !== undefined && { contentEn: data.contentEn }),
        ...(data.keywords && { keywords: data.keywords }),
      },
    })
    return { ...row, contentEn: row.contentEn }
  }

  async remove(id: string): Promise<void> {
    await this.prisma.knowledgeEntry.delete({ where: { id } })
  }
}
