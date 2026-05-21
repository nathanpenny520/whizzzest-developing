import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { IAIResponse } from '@wanzai/contracts'
import { KnowledgeService } from '../knowledge/knowledge.service.js'

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name)

  constructor(
    private readonly config: ConfigService,
    private readonly knowledge: KnowledgeService,
  ) {}

  async chat(question: string, locale: string): Promise<IAIResponse> {
    const apiKey = this.config.get<string>('API_KEY')

    // 未配置 API Key 时返回占位响应
    if (!apiKey) {
      return {
        text: locale === 'en'
          ? "Hua Nuo is charging up~ Configure the API key to wake me! 🔋"
          : '花傩正在充电中～配置 API 密钥后我就能醒过来啦！🔋',
      }
    }

    // 检索知识库
    const context = await this.knowledge.retrieveRelevant(question, locale)
    const contextBlock = this.knowledge.buildContext(context)

    // 从数据库读取花傩角色 System Prompt
    const systemPrompt = await this.knowledge.getSystemPrompt(locale)

    // 构建用户消息
    const userPrompt = contextBlock
      ? `参考以下信息回答问题：\n\n${contextBlock}\n\n用户问题：${question}`
      : question

    const modelName = this.config.get<string>('MODEL_NAME', 'gpt-4o')
    const baseUrl = this.config.get<string>('BASE_URL', 'https://api.openai.com')

    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 60_000)

      const response = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
        signal: controller.signal,
      })

      clearTimeout(timer)

      if (!response.ok) {
        const body = await response.text().catch(() => '')
        this.logger.error(`LLM API error ${response.status}: ${body.slice(0, 200)}`)
        throw new Error(`Upstream API error: ${response.status}`)
      }

      const data = (await response.json()) as {
        choices?: { message?: { content?: string } }[]
      }

      const raw = data.choices?.[0]?.message?.content?.trim() ?? ''

      // 剥离 markdown code fence（LLM 有时会把 JSON 包在 ```json...``` 里）
      let jsonStr = raw
      const fenceMatch = raw.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
      if (fenceMatch) {
        jsonStr = fenceMatch[1].trim()
      }

      // 尝试解析 LLM 返回的 JSON（含 action 字段）
      try {
        const parsed = JSON.parse(jsonStr) as { text: string; action?: IAIResponse['action'] }
        return {
          text: parsed.text || raw,
          action: parsed.action,
        }
      } catch {
        // 纯文本回复
        return { text: raw }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      this.logger.error(`AI chat failed: ${msg}`)

      if (msg.includes('abort') || msg.includes('timeout')) {
        return {
          text: locale === 'en'
            ? 'Hua Nuo is thinking a bit slowly... Please try again later~ ⏳'
            : '花傩想得有点久……稍后再问一次吧～⏳',
        }
      }

      return {
        text: locale === 'en'
          ? 'Hua Nuo went to watch the fireworks and is temporarily away~ Please try again later! 🎆'
          : '花傩跑去看烟花了，暂时不在～请稍后再试！🎆',
      }
    }
  }
}
