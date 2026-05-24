# 焰境·万载 — Claude Code 项目文档

## 项目定位

数字文旅平台，面向江西省万载县。核心差异化是以"花傩"动漫 IP 为灵魂的 AI 智能导游，配合数字烟花 Canvas 引擎、高德地图导览、商户优惠券生态形成完整文旅体验闭环。

**域名**：`whizzzest-yanjingwanzai.top`  
**Git 主分支**：`main`  
**包管理器**：pnpm（严禁使用 npm/yarn 安装依赖）  
**Node 版本**：>= 18.0

## 技术架构

```
前端: Vue 3.5 + Vite 7 + Tailwind CSS 3.4 + Pinia + vue-i18n
后端: NestJS 11 + Prisma ORM + PostgreSQL 16 + Redis 7
共享: @wanzai/contracts (纯 TypeScript 接口)
包管理: pnpm workspace (packages/contracts, packages/frontend, packages/backend)
测试: Vitest (合约层), Supertest (后端集成), Playwright (E2E 远期)
```

## Monorepo 结构

```
packages/
├── contracts/      纯 TS 类型，noEmit，前后端共同引用
├── frontend/       Vue 3 SPA，Vite 构建，输出到 dist/
└── backend/        NestJS，tsconfig.build.json 输出 CommonJS 到 dist/
```

- **contracts** 被前端和后端以 `"@wanzai/contracts": "workspace:*"` 引用
- **frontend** 的 `@/*` 别名指向 `packages/frontend/src/*`
- **backend** 使用 `tsconfig.json`（bundler 解析）做类型检查，`tsconfig.build.json`（CommonJS）做构建输出

## 常用命令

```bash
pnpm install                    # 安装所有依赖
pnpm dev                        # 启动 Vite 前端（localhost:5173）
pnpm dev:backend                # 启动 NestJS 后端（localhost:3002）
pnpm build                      # 构建前端
pnpm build:backend              # 构建后端
pnpm typecheck                  # 全部包的类型检查
pnpm lint                       # 全部包的 ESLint
pnpm test                       # 全部包的测试

# 单包操作
pnpm --filter @wanzai/contracts test
pnpm --filter @wanzai/backend prisma:migrate
pnpm --filter @wanzai/backend prisma:seed
```

## 关键文件速查

| 文件                                                          | 用途                                                                              |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `packages/contracts/src/*.ts`                                 | 所有共享接口定义，改动需同步影响前后端                                            |
| `packages/frontend/src/router/index.ts`                       | 38 条双语路由，含 role-based 守卫 + beforeEach locale                             |
| `packages/frontend/src/router/guards.ts`                      | 角色路由守卫（MERCHANT/ADMIN）                                                    |
| `packages/frontend/src/stores/auth.ts`                        | Pinia Auth Store — login/logout/requireLogin/refreshToken                         |
| `packages/frontend/src/api/client.ts`                         | Axios 实例 — 自动 Bearer token + 401 刷新                                         |
| `packages/frontend/src/components/LoginModal.vue`             | 花傩引导登录弹窗（渐进式鉴权）                                                    |
| `packages/frontend/src/pages/FireworkSharePage.vue`           | 烟花配方分享回放页                                                                |
| `packages/frontend/src/pages/MerchantDashboard.vue`           | 商户后台（四 Tab：概览/店铺/优惠券/核销）                                         |
| `packages/frontend/src/pages/MerchantApply.vue`               | 商户入驻申请页                                                                    |
| `packages/frontend/src/pages/AdminPage.vue`                   | 管理后台（五 Tab：商户审核/优惠券/知识库/文档管理/用户统计）                      |
| `packages/frontend/src/components/SeoHead.vue`                | 运行时 SEO 注入，每页独立 meta                                                    |
| `packages/frontend/src/pages/DocsPage.vue`                    | 万载文库列表页（分类筛选 + 卡片网格）                                             |
| `packages/frontend/src/pages/DocDetailPage.vue`               | 万载文库详情页（marked 渲染 + 封面图）                                            |
| `packages/frontend/src/pages/GamesPage.vue`                   | 游戏集合页（Minecraft 1.8.8 + Plants vs. Zombies）                                |
| `packages/frontend/public/games/minecraft-1.8.8.html`         | Eaglercraft X 浏览器版 Minecraft（14MB）                                          |
| `packages/frontend/public/games/pvz.html`                     | WASM 版 Plants vs. Zombies（64MB，IndexedDB 存档）                                |
| `packages/frontend/src/pages/FireworkPage.vue`                | ~1200 行 Canvas 烟花引擎（FireworkEngine 类）                                     |
| `packages/frontend/src/composables/useAIChat.ts`              | AI 对话状态管理                                                                   |
| `packages/frontend/src/locales/index.ts`                      | ~1773 行中英双语文本                                                              |
| `packages/backend/prisma/schema.prisma`                       | 数据模型：User, Merchant, FireworkRecipe, Coupon, UserCoupon, KnowledgeEntry, Doc |
| `packages/backend/prisma/seed.ts`                             | 导入 68 条知识到 PostgreSQL                                                       |
| `packages/backend/src/main.ts`                                | NestJS 入口，全局前缀 `/api/v1`，CORS 全开                                        |
| `scripts/prerender.js`                                        | 构建后生成 22 个静态 HTML（SEO）                                                  |
| `packages/frontend/src/eventBus.ts`                           | mitt 事件总线：map:navigate、firework:trigger、huanuo:state                       |
| `packages/frontend/src/composables/useHuaNuo.ts`              | 花傩六状态状态机 + AI action 分发 + 路由白名单                                    |
| `packages/frontend/src/composables/useConversations.ts`       | 对话历史管理（localStorage 持久化，pin/重命名/删除）                              |
| `packages/frontend/src/components/HuaNuoCharacter.vue`        | 纯 CSS 花傩角色组件（6 状态动画）                                                 |
| `packages/frontend/src/components/CouponCard.vue`             | 可复用优惠券卡片（中英文/领取/库存管理）                                          |
| `packages/frontend/src/components/HuaNuoPresence.vue`         | 花傩角标组件（可嵌入任何页面）                                                    |
| `packages/backend/src/modules/knowledge/knowledge.service.ts` | Prisma 知识库检索 + 系统提示词管理（DB 存储，在线编辑实时生效）                   |
| `packages/backend/src/modules/ai/ai.service.ts`               | LLM 调用 + JSON 解析 + code fence 剥离                                            |
| `packages/backend/src/modules/merchant/merchant.service.ts`   | 商户入驻、审核、资料管理                                                          |
| `packages/backend/src/modules/coupon/coupon.service.ts`       | 优惠券 CRUD + Redis DECR 防超发领券 + 核销                                        |
| `packages/backend/src/redis/redis.service.ts`                 | ioredis 封装，全局模块                                                            |
| `packages/backend/src/modules/docs/docs.service.ts`           | 文档 CRUD + 按 order/createdAt 排序                                               |
| `packages/backend/src/modules/docs/docs.controller.ts`        | 文档 REST 端点 + 封面图片上传（Multer + diskStorage）                             |
| `packages/backend/src/common/guards/roles.guard.ts`           | RBAC 角色守卫（TOURIST/MERCHANT/ADMIN）                                           |
| `焰境万载重构方案.md`                                         | 完整重构蓝图，6 阶段路线图                                                        |

## 编码约定

### 文件命名

- Vue 组件：PascalCase（`AIChatWidget.vue`）
- Composables：camelCase + use 前缀（`useAIChat.ts`）
- TypeScript 接口：`I` 前缀（`IFireworkRecipe`）
- NestJS 模块：XxxModule 模式（`AiModule`）

### Git 提交

Conventional Commits，中文或英文均可：

```
feat(firework): 新增配方分享
fix(auth): 修复 Token 刷新
refactor(map): 地图逻辑迁移至 useAmap
```

### 组件风格

- `<script setup lang="ts">` + Composition API
- 页面级状态用 Pinia store
- 组件级状态用 composable（ref/computed）

### 后端模块惯例

每个 NestJS 模块包含：`module.ts`、`controller.ts`、`service.ts`
统一响应格式：`{ code: number, data: T, message: string }`

## TypeScript 编译配置差异

| 包                 | tsconfig            | moduleResolution | noEmit |
| ------------------ | ------------------- | ---------------- | ------ |
| contracts          | tsconfig.json       | bundler          | true   |
| frontend           | tsconfig.json       | bundler          | true   |
| backend (类型检查) | tsconfig.json       | bundler          | true   |
| backend (构建)     | tsconfig.build.json | node10           | false  |

前端去掉了 `noUnusedLocals` 和 `noUnusedParameters`，因为 Vue 模板 ref 会触发误报。

## 重构路线图

按 [焰境万载重构方案.md](焰境万载重构方案.md) 执行：

| Phase | 主题                                       | 状态        |
| ----- | ------------------------------------------ | ----------- |
| 1     | 统一底座（Monorepo + NestJS + PostgreSQL） | ✅ 完成     |
| 2     | "花傩" AI IP 全站化                        | ✅ 完成     |
| 3     | 用户体系 + 数字烟花工坊                    | ✅ 完成     |
| 4     | 商户生态 + 商业闭环                        | ✅ 完成     |
| 5     | 页面架构 + SEO/PWA 增强                    | ⚠️ 部分完成 |
| 6     | 中长期扩展（按需触发）                     | 📋 远期     |

### Phase 5 完成度

- ✅ Navbar 毛玻璃效果 + 导航集群（万载风物/互动体验/商业服务）
- ✅ AI Chat Widget 全站化（App.vue）+ 全屏对话 + 对话历史管理
- ✅ useAmap 可外部操控（defineExpose + mitt）
- ✅ 用户个人中心（ProfilePage）
- ✅ 文字烟花
- ✅ 游戏集合页（GamesPage）：Minecraft 1.8.8 + Plants vs. Zombies，IndexedDB 存档
- ✅ PWA 更新提示条（registerType: 'prompt' + App.vue 横幅）
- ✅ 万载文库（DocsPage + DocDetailPage + Admin 文档管理 Tab + MD 导入 + 封面上传）
- ❌ DiscoveryPage 合并（MapPage + RoutesPage）
- ❌ HomePage 日夜切换
- ❌ CulturePage 傩面具博物馆
- ❌ 动态 sitemap、离线降级

## 注意事项

- **路径含括号**：项目路径为 `whizzzest(website-version)`，shell 命令注意转义
- **高德地图**：通过 Vite proxy 代理，前端环境变量 `VITE_AMAP_KEY` 和 `VITE_AMAP_SECURITY_CODE`
- **LLM API**：使用 MiniMax-M2.5 模型，通过 `llmapi.paratera.com` 代理，密钥在 `packages/backend/.env`
- **Redis**：`brew services start redis`，端口 6379，优惠券库存原子操作依赖
- **万能验证码**：开发环境登录使用 `000000`（6 位），生产环境需接入短信服务
- **测试账户**：ADMIN ``，MERCHANT `merchant_001`/`merchant_002`/`merchant_003`（种子数据）
- **大文件**：视频文件未纳入 Git（> 100MB），部署时手动上传
- **CSP**：vite.config.ts 中配置了严格的内容安全策略，修改外部资源时需同步更新
