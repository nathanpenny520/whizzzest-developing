import { Controller, Get, Put, Param, Body, Req, UseGuards } from '@nestjs/common'
import { UserService } from './user.service.js'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { RolesGuard } from '../../common/guards/roles.guard.js'
import { Roles } from '../../common/decorators/roles.decorator.js'
import { UserRole } from '@prisma/client'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: { user: { id: string } }) {
    const user = await this.userService.findById(req.user.id)
    if (!user) {
      return { code: 40400, data: null, message: '用户不存在' }
    }
    const { phone, ...safe } = user
    return { code: 0, data: safe, message: 'ok' }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('stats')
  async stats() {
    const data = await this.userService.getStats()
    return { code: 0, data, message: 'ok' }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findById(id)
    if (!user) {
      return { code: 40400, data: null, message: '用户不存在' }
    }
    const { phone: _, ...safe } = user
    return { code: 0, data: safe, message: 'ok' }
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateProfile(@Req() req: { user: { id: string } }, @Body() body: { nickname?: string; avatarUrl?: string }) {
    const user = await this.userService.updateProfile(req.user.id, body)
    return { code: 0, data: user, message: 'ok' }
  }
}
