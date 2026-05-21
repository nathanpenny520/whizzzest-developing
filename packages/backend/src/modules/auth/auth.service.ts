import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service.js'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  /** 手机号 + 验证码登录 / 自动注册 */
  async validateUser(phone: string, code: string, locale = 'zh') {
    const isDev = process.env.NODE_ENV !== 'production'
    const devMasterCode = '000000'

    if (isDev && code === devMasterCode) {
      return this.userService.findOrCreateByPhone(phone, locale)
    }

    throw new UnauthorizedException(locale === 'en' ? 'Invalid verification code' : '验证码错误')
  }

  /** 签发 JWT 对 */
  async login(user: { id: string; phone: string; role?: string }) {
    const payload = { sub: user.id, phone: user.phone, role: user.role || 'TOURIST' }
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    }
  }

  /** 刷新 Access Token */
  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken)
      const user = await this.userService.findById(payload.sub)
      if (!user) {
        throw new UnauthorizedException('用户不存在')
      }
      const newPayload = { sub: user.id, phone: user.phone, role: user.role }
      return {
        accessToken: this.jwtService.sign(newPayload, { expiresIn: '15m' }),
      }
    } catch {
      throw new UnauthorizedException('Refresh Token 无效或已过期')
    }
  }
}
