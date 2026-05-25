import { PrismaClient } from '@prisma/client'
import Redis from 'ioredis'
import { knowledgeBase } from './knowledgeBase.js'
import { SYSTEM_PROMPT_ZH, SYSTEM_PROMPT_EN } from '../src/modules/knowledge/prompts.js'

const prisma = new PrismaClient()
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

async function main() {
  console.log(`Seeding ${knowledgeBase.length} knowledge entries...`)

  for (const entry of knowledgeBase) {
    await prisma.knowledgeEntry.upsert({
      where: { id: entry.id },
      create: {
        id: entry.id,
        category: entry.category,
        content: entry.content,
        keywords: entry.keywords ?? [],
      },
      update: {
        category: entry.category,
        content: entry.content,
        keywords: entry.keywords ?? [],
      },
    })
  }

  // 插入或更新花傩系统提示词（特殊 category）
  console.log('Seeding system prompts...')
  await prisma.knowledgeEntry.upsert({
    where: { id: '_system_prompt_zh' },
    create: {
      id: '_system_prompt_zh',
      category: '_system_prompt',
      content: SYSTEM_PROMPT_ZH,
      contentEn: SYSTEM_PROMPT_EN,
      keywords: [],
    },
    update: {
      content: SYSTEM_PROMPT_ZH,
      contentEn: SYSTEM_PROMPT_EN,
    },
  })

  // 商户演示数据（upsert by userId 避免重复）
  console.log('Seeding demo merchants...')
  const merchantUsers = [
    {
      phone: 'merchant_001',
      nickname: '彩天艺术焰火',
      category: 'firework',
      name: '彩天艺术焰火',
      mapLng: 114.445,
      mapLat: 28.102,
      phone_field: '0795-8888001',
      description: '专业烟花燃放与销售，承接大型庆典活动',
    },
    {
      phone: 'merchant_002',
      nickname: '千年食品',
      category: 'dining',
      name: '千年食品',
      mapLng: 114.445,
      mapLat: 28.101,
      phone_field: '0795-8888002',
      description: '万载特色美食，传承千年味道',
    },
    {
      phone: 'merchant_003',
      nickname: '泰麟花炮',
      category: 'firework',
      name: '泰麟花炮',
      mapLng: 114.446,
      mapLat: 28.103,
      phone_field: '0795-8888003',
      description: '泰麟花炮，品质烟花制造商',
    },
  ]

  for (const mu of merchantUsers) {
    const user = await prisma.user.upsert({
      where: { phone: mu.phone },
      create: { phone: mu.phone, nickname: mu.nickname, role: 'MERCHANT' },
      update: { role: 'MERCHANT', nickname: mu.nickname },
    })

    const merchant = await prisma.merchant.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        name: mu.name,
        category: mu.category,
        mapLng: mu.mapLng,
        mapLat: mu.mapLat,
        isVerified: true,
        phone: mu.phone_field,
        description: mu.description,
      },
      update: {
        name: mu.name,
        category: mu.category,
        isVerified: true,
        phone: mu.phone_field,
        description: mu.description,
      },
    })

    // 每个商户创建 1 条优惠券
    const existingCoupons = await prisma.coupon.count({ where: { merchantId: merchant.id } })
    if (existingCoupons === 0) {
      const coupon = await prisma.coupon.create({
        data: {
          merchantId: merchant.id,
          title: mu.category === 'firework' ? '烟花9折券' : '满50减10',
          discount: 10,
          totalStock: 100,
          expiresAt: new Date('2026-12-31T23:59:59Z'),
        },
      })
      // 初始化 Redis 库存
      await redis.set(`coupon:stock:${coupon.id}`, String(coupon.totalStock))
      console.log(`  Coupon ${coupon.id}: stock=${coupon.totalStock}`)
    }
  }

  await redis.quit()
  console.log('Seed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
