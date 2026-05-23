import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { AuthService } from './auth.service.js'

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
    if (!body.email) {
      return { code: 40000, data: null, message: '邮箱不能为空' }
    }
    if (!body.email.includes('@')) {
      return { code: 40000, data: null, message: '邮箱格式不正确' }
    }
    try {
      await this.authService.sendCode(body.email)
      return { code: 0, data: null, message: '验证码已发送' }
    } catch (err: unknown) {
      if (err instanceof Error && 'getStatus' in err) {
        const httpErr = err as unknown as {
          getStatus(): number
          getResponse(): { code: number; message: string }
        }
        const resp = httpErr.getResponse()
        return { code: resp.code, data: null, message: resp.message }
      }
      return { code: 50000, data: null, message: '发送失败' }
    }
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    if (!body.email || !body.code) {
      return { code: 40000, data: null, message: '邮箱和验证码不能为空' }
    }
    const user = await this.authService.validateUser(body.email, body.code, body.locale || 'zh')
    const tokens = await this.authService.login(user)
    return {
      code: 0,
      data: {
        ...tokens,
        user: {
          id: user.id,
          nickname: user.nickname,
          email: user.email,
          role: user.role,
          isNew: (user as { isNew?: boolean }).isNew,
        },
      },
      message: 'ok',
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: RefreshDto) {
    if (!body.refreshToken) {
      return { code: 40000, data: null, message: 'Refresh Token 不能为空' }
    }
    const tokens = await this.authService.refresh(body.refreshToken)
    return { code: 0, data: tokens, message: 'ok' }
  }
}
