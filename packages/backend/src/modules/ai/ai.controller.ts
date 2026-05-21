import { Controller, Post, Body } from '@nestjs/common'
import { AiService } from './ai.service.js'
import type { ChatRequest, IAIResponse } from '@wanzai/contracts'

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@Body() body: ChatRequest): Promise<{ code: number; data: IAIResponse | null; message: string }> {
    const result = await this.aiService.chat(body.question, body.locale)
    return { code: 0, data: result, message: 'ok' }
  }
}
