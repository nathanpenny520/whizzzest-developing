import { Controller, Get, Post, Put, Param, Body, Query, Req, UseGuards } from '@nestjs/common'
import { MerchantService } from './merchant.service.js'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { RolesGuard } from '../../common/guards/roles.guard.js'
import { Roles } from '../../common/decorators/roles.decorator.js'
import { Public } from '../../common/decorators/public.decorator.js'
import { UserRole } from '@prisma/client'

@Controller('merchants')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @UseGuards(JwtAuthGuard)
  @Post('apply')
  async apply(@Req() req: { user: { id: string } }, @Body() body: { name: string; category: string; mapLng: number; mapLat: number; businessHours?: string; phone?: string; description?: string; coverImage?: string }) {
    const data = await this.merchantService.apply(req.user.id, body)
    return { code: 0, data, message: 'ok' }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: { user: { id: string } }) {
    const data = await this.merchantService.findByUserId(req.user.id)
    return { code: 0, data, message: 'ok' }
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateMe(@Req() req: { user: { id: string } }, @Body() body: { name?: string; category?: string; mapLng?: number; mapLat?: number; businessHours?: string; phone?: string; description?: string; coverImage?: string }) {
    const data = await this.merchantService.update(req.user.id, body)
    return { code: 0, data, message: 'ok' }
  }

  @Public()
  @Get()
  async findAll(@Query('all') all?: string) {
    const verifiedOnly = all !== 'true'
    const data = await this.merchantService.findAll(verifiedOnly)
    return { code: 0, data, message: 'ok' }
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.merchantService.findById(id)
    return { code: 0, data, message: 'ok' }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id/verify')
  async verify(@Param('id') id: string, @Body() body: { isVerified: boolean }) {
    const data = await this.merchantService.verify(id, body.isVerified)
    return { code: 0, data, message: 'ok' }
  }
}
