import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { AuthService } from './auth.service.js'
import { ErrorCode } from '@wanzai/contracts'

class SendCodeDto {
  email!: string
}

class LoginDto {
  email!: string
  code!: string
  locale?: string
}

class RefreshDto {
  refreshToken!: string
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-code')
  async sendCode(@Body() body: SendCodeDto) {
    await this.authService.sendCode(body.email)
    return { code: ErrorCode.SUCCESS, data: null, message: '验证码已发送' }
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.code, body.locale || 'zh')
    const data = await this.authService.buildLoginResponse(user)
    return { code: ErrorCode.SUCCESS, data, message: 'ok' }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: RefreshDto) {
    const tokens = await this.authService.refresh(body.refreshToken)
    return { code: ErrorCode.SUCCESS, data: tokens, message: 'ok' }
  }
}
