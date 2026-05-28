import { Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ErrorCode } from '@wanzai/contracts'
import { randomInt } from 'crypto'
import { UserService } from '../user/user.service.js'
import { RedisService } from '../../redis/redis.service.js'
import { MailService } from '../mail/mail.service.js'

@Injectable()
export class AuthService {
  private readonly CODE_PREFIX = 'email:code:'
  private readonly RATE_PREFIX = 'email:rate:'
  private readonly CODE_TTL = 300
  private readonly RATE_TTL = 60

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly redisService: RedisService,
    private readonly mailService: MailService,
  ) {}

  /** 生成并发送邮箱验证码 */
  async sendCode(email: string): Promise<void> {
    if (!email?.includes('@')) {
      throw new HttpException(
        { code: ErrorCode.BAD_REQUEST, message: '邮箱格式不正确', data: null },
        HttpStatus.BAD_REQUEST,
      )
    }

    // 限流检查
    const rateKey = `${this.RATE_PREFIX}${email}`
    if (await this.redisService.get(rateKey)) {
      throw new HttpException(
        {
          code: ErrorCode.TOO_MANY_REQUESTS,
          message: '发送过于频繁，请60秒后再试',
          messageEn: 'Too frequent, please try again in 60 seconds',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      )
    }

    const code = randomInt(100000, 999999).toString()

    // 存入 Redis，5 分钟有效
    await this.redisService.set(`${this.CODE_PREFIX}${email}`, code, this.CODE_TTL)

    // 发送邮件
    const sent = await this.mailService.sendVerificationCode(email, code)
    if (!sent) {
      await this.redisService.del(`${this.CODE_PREFIX}${email}`)
      throw new HttpException(
        {
          code: ErrorCode.INTERNAL_ERROR,
          message: '邮件发送失败，请稍后再试',
          messageEn: 'Email send failed, please try again later',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }

    // 设置限流
    await this.redisService.set(rateKey, '1', this.RATE_TTL)
  }

  /** 邮箱 + 验证码验证 / 自动注册 */
  async validateUser(email: string, code: string, locale = 'zh') {
    const isDev = process.env.NODE_ENV !== 'production'
    const devMasterCode = '000000'

    if (isDev && code === devMasterCode) {
      return this.userService.findOrCreateByEmail(email, locale)
    }

    const storedCode = await this.redisService.get(`${this.CODE_PREFIX}${email}`)
    if (storedCode && storedCode === code) {
      await this.redisService.del(`${this.CODE_PREFIX}${email}`)
      return this.userService.findOrCreateByEmail(email, locale)
    }

    throw new UnauthorizedException(locale === 'en' ? 'Invalid verification code' : '验证码错误')
  }

  /** 签发 JWT 对 */
  async login(user: { id: string; phone?: string; email?: string; role?: string }) {
    const payload = {
      sub: user.id,
      phone: user.phone,
      email: user.email,
      role: user.role || 'TOURIST',
    }
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    }
  }

  /** 构建登录响应数据（含脱敏用户信息） */
  async buildLoginResponse(user: {
    id: string
    email?: string
    nickname: string
    role: string
    isNew?: boolean
  }) {
    const tokens = await this.login(user)
    return {
      ...tokens,
      user: {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
        isNew: (user as { isNew?: boolean }).isNew,
      },
    }
  }

  /** 刷新 Access Token */
  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new HttpException(
        { code: ErrorCode.BAD_REQUEST, message: 'Refresh Token 不能为空', data: null },
        HttpStatus.BAD_REQUEST,
      )
    }
    try {
      const payload = this.jwtService.verify(refreshToken)
      const user = await this.userService.findById(payload.sub)
      if (!user) {
        throw new UnauthorizedException('用户不存在')
      }
      const newPayload = { sub: user.id, phone: user.phone, email: user.email, role: user.role }
      return {
        accessToken: this.jwtService.sign(newPayload, { expiresIn: '15m' }),
      }
    } catch {
      throw new UnauthorizedException('Refresh Token 无效或已过期')
    }
  }
}
