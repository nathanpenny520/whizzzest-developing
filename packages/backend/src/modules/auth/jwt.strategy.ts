import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'wanzai-dev-secret',
    })
  }

  async validate(payload: { sub: string; phone: string; role?: string }) {
    return { id: payload.sub, phone: payload.phone, role: payload.role || 'TOURIST' }
  }
}
