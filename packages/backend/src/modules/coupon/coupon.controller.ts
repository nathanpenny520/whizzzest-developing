import { Controller, Get, Post, Delete, Param, Body, Req, UseGuards } from '@nestjs/common'
import { CouponService } from './coupon.service.js'
import { MerchantService } from '../merchant/merchant.service.js'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { RolesGuard } from '../../common/guards/roles.guard.js'
import { Roles } from '../../common/decorators/roles.decorator.js'
import { Public } from '../../common/decorators/public.decorator.js'
import { UserRole } from '@prisma/client'

@Controller('coupons')
export class CouponController {
  constructor(
    private readonly couponService: CouponService,
    private readonly merchantService: MerchantService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT)
  @Post()
  async create(@Req() req: { user: { id: string } }, @Body() body: { title: string; titleEn?: string; discount: number; totalStock: number; expiresAt: string }) {
    const merchant = await this.merchantService.findByUserId(req.user.id)
    const data = await this.couponService.create(merchant.id, { ...body, expiresAt: new Date(body.expiresAt) })
    return { code: 0, data, message: 'ok' }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT)
  @Get('merchant')
  async merchantCoupons(@Req() req: { user: { id: string } }) {
    const merchant = await this.merchantService.findByUserId(req.user.id)
    const data = await this.couponService.findByMerchant(merchant.id)
    return { code: 0, data, message: 'ok' }
  }

  @Public()
  @Get('public')
  async publicCoupons() {
    const data = await this.couponService.findPublic()
    return { code: 0, data, message: 'ok' }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/claim')
  async claim(@Param('id') id: string, @Req() req: { user: { id: string } }, @Body() body?: { locale?: string }) {
    const data = await this.couponService.claim(id, req.user.id, body?.locale || 'zh')
    return { code: 0, data, message: 'ok' }
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async myCoupons(@Req() req: { user: { id: string } }) {
    const data = await this.couponService.findMyCoupons(req.user.id)
    return { code: 0, data, message: 'ok' }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT)
  @Post('redeem')
  async redeem(@Req() req: { user: { id: string } }, @Body() body: { redeemCode: string }) {
    const data = await this.couponService.redeem(body.redeemCode, req.user.id)
    return { code: 0, data, message: 'ok' }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.couponService.remove(id)
    return { code: 0, data: null, message: 'deleted' }
  }
}
