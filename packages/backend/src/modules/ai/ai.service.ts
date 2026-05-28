import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { IAIResponse } from './interfaces/ai-response.interface.js'
import { ErrorCode } from '@wanzai/contracts'
import { KnowledgeService } from '../knowledge/knowledge.service.js'
import { getHuaNuoMessage } from './messages.js'
import { LLM_CONFIG as LLM, USER_PROMPT_TEMPLATE } from './ai.config.js'

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
      return { text: getHuaNuoMessage('noApiKey', locale) }
    }

    // 检索知识库
    const context = await this.knowledge.retrieveRelevant(question, locale)
    const contextBlock = this.knowledge.buildContext(context)

    // 从数据库读取花傩角色 System Prompt
    const systemPrompt = await this.knowledge.getSystemPrompt(locale)

    // 构建用户消息
    const userPrompt = contextBlock
      ? USER_PROMPT_TEMPLATE.replace('{context}', contextBlock).replace('{question}', question)
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
          max_tokens: LLM.maxTokens,
          temperature: LLM.temperature,
        }),
        signal: controller.signal,
      })

      clearTimeout(timer)

      if (!response.ok) {
        const body = await response.text().catch(() => '')
        this.logger.error(`LLM API error ${response.status}: ${body.slice(0, 200)}`)
        throw new HttpException(
          {
            code: ErrorCode.INTERNAL_ERROR,
            message: `Upstream API error: ${response.status}`,
            data: null,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        )
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
        return { text: getHuaNuoMessage('timeout', locale) }
      }

      return { text: getHuaNuoMessage('genericError', locale) }
    }
  }
}
