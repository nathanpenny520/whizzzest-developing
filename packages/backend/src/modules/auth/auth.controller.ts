import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { AuthService } from './auth.service.js'

class LoginDto {
  phone!: string
  code!: string
  locale?: string
}

class RefreshDto {
  refreshToken!: string
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    if (!body.phone || !body.code) {
      return { code: 40000, data: null, message: '手机号和验证码不能为空' }
    }
    const user = await this.authService.validateUser(body.phone, body.code, body.locale || 'zh')
    const tokens = await this.authService.login(user)
    return {
      code: 0,
      data: {
        ...tokens,
        user: { id: user.id, nickname: user.nickname, phone: user.phone, role: user.role, isNew: (user as { isNew?: boolean }).isNew },
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
