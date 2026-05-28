import { Controller, Get, Put, Param, Body, Req, UseGuards } from '@nestjs/common'
import { UserService } from './user.service.js'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js'
import { Public } from '../../common/decorators/public.decorator.js'
import { ErrorCode } from '@wanzai/contracts'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: { user: { id: string } }) {
    const user = await this.userService.findById(req.user.id)
    if (!user) {
      return { code: ErrorCode.NOT_FOUND, data: null, message: '用户不存在' }
    }
    return {
      code: ErrorCode.SUCCESS,
      data: this.userService.sanitizeUserResponse(user, true),
      message: 'ok',
    }
  }

  @Public()
  @Get('stats')
  async stats() {
    const data = await this.userService.getStats()
    return { code: ErrorCode.SUCCESS, data, message: 'ok' }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findById(id)
    if (!user) {
      return { code: ErrorCode.NOT_FOUND, data: null, message: '用户不存在' }
    }
    return {
      code: ErrorCode.SUCCESS,
      data: this.userService.sanitizeUserResponse(user),
      message: 'ok',
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateProfile(
    @Req() req: { user: { id: string } },
    @Body() body: { nickname?: string; avatarUrl?: string },
  ) {
    const user = await this.userService.updateProfile(req.user.id, body)
    return { code: ErrorCode.SUCCESS, data: user, message: 'ok' }
  }
}
