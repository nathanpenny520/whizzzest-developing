import { Controller, Post, Body } from '@nestjs/common'
import { AiService } from './ai.service.js'
import type { IChatRequest, IAIResponse } from '@wanzai/contracts'
import { ErrorCode } from '@wanzai/contracts'

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(
    @Body() body: IChatRequest,
  ): Promise<{ code: number; data: IAIResponse | null; message: string }> {
    const result = await this.aiService.chat(body.question, body.locale)
    return { code: ErrorCode.SUCCESS, data: result, message: 'ok' }
  }
}
