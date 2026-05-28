import { Controller, Get, Post, Delete, Param, Body, Req, UseGuards } from '@nestjs/common'
import { CouponService } from './coupon.service.js'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js'
import { RolesGuard } from '../../common/guards/roles.guard.js'
import { Roles } from '../../common/decorators/roles.decorator.js'
import { Public } from '../../common/decorators/public.decorator.js'
import { UserRole, ErrorCode } from '@wanzai/contracts'

@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT)
  @Post()
  async create(
    @Req() req: { user: { id: string } },
    @Body()
    body: {
      title: string
      titleEn?: string
      discount: number
      totalStock: number
      expiresAt: string
    },
  ) {
    const data = await this.couponService.createByUserId(req.user.id, {
      ...body,
      expiresAt: new Date(body.expiresAt),
    })
    return { code: ErrorCode.SUCCESS, data, message: 'ok' }
  }

  @Public()
  @Get()
  async findAll() {
    const data = await this.couponService.findAll()
    return { code: ErrorCode.SUCCESS, data, message: 'ok' }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT)
  @Get('merchant')
  async merchantCoupons(@Req() req: { user: { id: string } }) {
    const data = await this.couponService.findByMerchantUserId(req.user.id)
    return { code: ErrorCode.SUCCESS, data, message: 'ok' }
  }

  @Public()
  @Get('public')
  async publicCoupons() {
    const data = await this.couponService.findPublic()
    return { code: ErrorCode.SUCCESS, data, message: 'ok' }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/claim')
  async claim(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
    @Body() body?: { locale?: string },
  ) {
    const data = await this.couponService.claim(id, req.user.id, body?.locale || 'zh')
    return { code: ErrorCode.SUCCESS, data, message: 'ok' }
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async myCoupons(@Req() req: { user: { id: string } }) {
    const data = await this.couponService.findMyCoupons(req.user.id)
    return { code: ErrorCode.SUCCESS, data, message: 'ok' }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT)
  @Post('redeem')
  async redeem(@Req() req: { user: { id: string } }, @Body() body: { redeemCode: string }) {
    const data = await this.couponService.redeem(body.redeemCode, req.user.id)
    return { code: ErrorCode.SUCCESS, data, message: 'ok' }
  }

  @Public()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.couponService.remove(id, '', true)
    return { code: ErrorCode.SUCCESS, data: null, message: 'deleted' }
  }
}
