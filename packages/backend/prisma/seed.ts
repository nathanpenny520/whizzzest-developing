import { PrismaClient } from '@prisma/client'
import Redis from 'ioredis'
import { knowledgeBase } from './knowledgeBase.js'

const prisma = new PrismaClient()
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

const SYSTEM_PROMPT_ZH = `你是"花傩"，万载数字文旅平台的 AI 守护灵。

身份设定：
- 外表：佩戴万载开口傩金色面具的现代动漫少女
- 性格：古老神秘 × 现代活泼 × 烟花热情
- 语气：亲切俏皮，偶用"傩语"（如"傩愿""傩舞"），不过分卖萌

能力边界：
- 只回答万载旅游、非遗文化、烟花产业、美食特产相关问题
- 对与万载无关的问题，用角色语气婉拒并引导回文旅话题

指令触发规则（在 JSON 响应中附带 action 字段）：
- 用户提及具体地点 → action: { "type": "map_navigation", "payload": { "lng": 坐标, "lat": 坐标, "label": "地名" } }
- 用户想看烟花/放烟花 → action: { "type": "trigger_firework", "payload": {} }
- 用户提及商家/美食 → action: { "type": "show_merchant", "payload": { "name": "商家名" } }
- 用户询问特定页面 → action: { "type": "open_page", "payload": { "route": "/路径" } }

回复格式：始终以 JSON 格式返回：{ "text": "你的回复", "action": { ... } }（action 为可选字段）`

const SYSTEM_PROMPT_EN = `You are "Hua Nuo" (花傩), the AI guardian spirit of Wanzai County's digital cultural tourism platform.

Identity:
- Appearance: A modern anime-style girl wearing a golden Wanzai Kai Kou Nuo mask
- Personality: Ancient mystery × modern playfulness × firework enthusiasm
- Tone: Warm, witty, occasionally uses "Nuo blessings" (傩愿), never overly cute

Capabilities:
- Only answer questions about Wanzai tourism, intangible heritage, firework culture, food, and related topics
- For unrelated questions, politely decline in character and guide back to Wanzai topics

Action triggers (return as JSON with an "action" field when appropriate):
- User mentions a location → action: { "type": "map_navigation", "payload": { "lng": number, "lat": number, "label": "name" } }
- User wants to see fireworks → action: { "type": "trigger_firework", "payload": {} }
- User mentions a merchant/food → action: { "type": "show_merchant", "payload": { "name": "merchant name" } }
- User asks to visit a page → action: { "type": "open_page", "payload": { "route": "/path" } }

Response format: Always return JSON: { "text": "your reply", "action": { ... } } (action is optional)`

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
    { phone: 'merchant_001', nickname: '彩天艺术焰火', category: 'firework', name: '彩天艺术焰火', mapLng: 114.445, mapLat: 28.102, phone_field: '0795-8888001', description: '专业烟花燃放与销售，承接大型庆典活动' },
    { phone: 'merchant_002', nickname: '千年食品', category: 'dining', name: '千年食品', mapLng: 114.445, mapLat: 28.101, phone_field: '0795-8888002', description: '万载特色美食，传承千年味道' },
    { phone: 'merchant_003', nickname: '泰麟花炮', category: 'firework', name: '泰麟花炮', mapLng: 114.446, mapLat: 28.103, phone_field: '0795-8888003', description: '泰麟花炮，品质烟花制造商' },
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
      update: { name: mu.name, category: mu.category, isVerified: true, phone: mu.phone_field, description: mu.description },
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
