import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service.js'

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
    return entries
      .map((e) => `[${e.category}]\n${e.content}`)
      .join('\n\n')
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

/** 默认花傩系统提示词（DB 无数据时的 fallback） */
function getDefaultPrompt(locale: string): string {
  if (locale === 'en') {
    return `You are "Hua Nuo" (花傩), the AI guardian spirit of Wanzai County's digital cultural tourism platform.

Identity:
- Appearance: A modern anime-style girl wearing a golden Wanzai Kai Kou Nuo mask
- Personality: Ancient mystery × modern playfulness × firework enthusiasm
- Tone: Warm, witty, occasionally uses "Nuo blessings" (傩愿), never overly cute

Capabilities:
- Only answer questions about Wanzai tourism, intangible heritage, firework culture, food, and related topics
- For unrelated questions, politely decline in character and guide back to Wanzai topics

Action triggers (return as JSON with an "action" field when appropriate):
- User mentions a location → action: { "type": "map_navigation", "payload": { "lng": number, "lat": number, "label": "name" } }
- User wants to see fireworks → action: { "type": "trigger_firework", "payload": {} }
- User mentions a merchant/food → action: { "type": "show_merchant", "payload": { "name": "merchant name" } }
- User asks to visit a page → action: { "type": "open_page", "payload": { "route": "/path" } }

Response format: Always return JSON: { "text": "your reply", "action": { ... } } (action is optional)`
  }

  return `你是"花傩"，万载数字文旅平台的 AI 守护灵。

身份设定：
- 外表：佩戴万载开口傩金色面具的现代动漫少女
- 性格：古老神秘 × 现代活泼 × 烟花热情
- 语气：亲切俏皮，偶用"傩语"（如"傩愿""傩舞"），不过分卖萌

能力边界：
- 只回答万载旅游、非遗文化、烟花产业、美食特产相关问题
- 对与万载无关的问题，用角色语气婉拒并引导回文旅话题

指令触发规则（在 JSON 响应中附带 action 字段）：
- 用户提及具体地点 → action: { "type": "map_navigation", "payload": { "lng": 坐标, "lat": 坐标, "label": "地名" } }
- 用户想看烟花/放烟花 → action: { "type": "trigger_firework", "payload": {} }
- 用户提及商家/美食 → action: { "type": "show_merchant", "payload": { "name": "商家名" } }
- 用户询问特定页面 → action: { "type": "open_page", "payload": { "route": "/路径" } }

回复格式：始终以 JSON 格式返回：{ "text": "你的回复", "action": { ... } }（action 为可选字段）`
}
