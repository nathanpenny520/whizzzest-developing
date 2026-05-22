# 更新日志

本文档记录焰境·万载项目的所有重要变更。

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，版本号遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

---

## [2.4.0] — 2026-05-21

### 综合优化

### 新增

- **AI 全屏对话**：ChatHeader 全屏按钮，占满屏幕，Esc 退出
- **AI 对话历史管理**：全屏时左侧可折叠面板，新建/切换/重命名/Pin/删除对话，三点菜单，面板宽度可拖拽
- **AI 最小化条**：区别于关闭，最小化后显示底部红金渐变小条，点击恢复
- **Navbar 导航集群**：万载风物 / 互动体验 / 商业服务 三大下拉集群替代 9 个平铺链接
- **用户个人中心** (`ProfilePage.vue`)：编辑昵称、头像 URL
- **文字烟花**：Canvas 像素采样→金红粒子扩散
- **优惠券通用组件** (`CouponCard.vue`)：封装显示/中英文/领取/库存管理
- **Redis 懒初始化**：claim() 自动从 DB 恢复丢失的 Redis 库存

### 变更

- **Admin 后台**：v-if 修复 + 用户统计独立 Tab
- **CORS**：从 `origin: true` 改为环境变量白名单
- **万能码安全**：删除无条件后门，仅开发环境放行
- **JWT 持久化**：`user` 存入 sessionStorage，刷新不丢登录态
- **优惠券校验**：增加存在性、过期、库存三重检查
- **商户中英文**：Merchant 表加 `nameEn`，Coupon 表加 `titleEn`
- **管理后台 i18n**：AdminPage 全部使用 `t()` 替换三元表达式
- **管理员手机号**：由硬编码改为 `ADMIN_PHONES` 环境变量配置

### 修复

- 领券后余额不变 — 本地 `usedStock++`
- 刷新后显示"立即领取" — `onMounted` 调用 `GET /coupons/my` 恢复
- 9折券 Redis 库存丢失 — 懒初始化 + 损坏 key 修复
- 商户改名不更新昵称 — merchant.update() 同步 User.nickname
- Refresh Token 丢失 role — 签发时补上 `role` 字段

---

## [2.3.0] — 2026-05-20

### Phase 4 完成 — 商户生态 + 商业闭环

### 新增

- **Redis**：安装配置，`RedisModule` 全局模块封装 `get/set/del/incr/decr`
- **MerchantModule**：商户入驻申请、资料管理、ADMIN 审核（`isVerified`）
- **CouponModule**：优惠券 CRUD + **Redis DECR 原子操作防超发** + 核销码核销
- **RBAC 权限体系**：`RolesGuard` + `@Roles(MERCHANT/ADMIN)` 装饰器，JWT 添加 `role` claim
- **花傩引导登录弹窗** (`LoginModal.vue`)：不同场景不同文案（保存烟花/领券/收藏）
- **渐进式鉴权**：`useAuthStore.requireLogin()`，浏览免费、操作触发登录
- **商户后台** (`MerchantDashboard.vue`)：四 Tab（概览/店铺信息/优惠券管理/核销工具）
- **商户入驻页** (`MerchantApply.vue`)：表单提交 → 审核流程
- **Admin 后台** (`AdminPage.vue`)：三 Tab（商户审核/优惠券管理/知识库管理）
- **角色路由守卫** (`router/guards.ts`)：`meta.requiresRole` 检查
- **种子商户数据**：彩天艺术焰火、千年食品、泰麟花炮（各含优惠券）

### 变更

- **JWT 负载**：新增 `role` 字段，`JwtStrategy.validate` 返回 `{ id, phone, role }`
- **MerchantPage**：数据源准备切换为 API 驱动（Phase 5 完成 UI）
- **AuthStore.requireLogin**：支持挂起操作，登录后自动重试
- **Axios 客户端**：统一 `api/client.ts`，自动 Bearer token + 401 Refresh 队列

### API 端点（新增 13 条）

| 端点                        | 鉴权     | 说明            |
| --------------------------- | -------- | --------------- |
| `POST /merchants/apply`     | 登录     | 商户入驻        |
| `GET/PUT /merchants/me`     | 登录     | 商户资料        |
| `GET /merchants`            | 公开     | 已审核商户列表  |
| `PUT /merchants/:id/verify` | ADMIN    | 审核            |
| `POST /coupons`             | MERCHANT | 发布优惠券      |
| `GET /coupons/public`       | 公开     | 可领券列表      |
| `POST /coupons/:id/claim`   | 登录     | Redis DECR 领券 |
| `POST /coupons/redeem`      | MERCHANT | 核销            |

---

## [2.2.0] — 2026-05-20

### Phase 3 完成 — 用户体系 + 数字烟花工坊

### 新增

- **手机号注册/登录**：万能码 `000000`（开发环境），自动注册
- **JWT 认证**：Access Token (15min) + Refresh Token (7天)
- **JwtAuthGuard**：NestJS 标准守卫 + `@Public()` 装饰器
- **UserService 接入 Prisma**：`findById`、`findByPhone`、`findOrCreateByPhone`、`updateProfile`
- **Auth Pinia Store**：`login/logout/requireLogin/tryRefreshToken/fetchProfile`
- **Axios 拦截器**：自动 Bearer token + 401 Refresh 队列
- **烟花配方保存**：`POST /api/v1/fireworks` + FireworkPage 保存按钮 + 命名对话框
- **烟花配方分享**：`/firework/share/:slug` 路由 + `FireworkSharePage.vue`
- **烟花排行榜**：`FireworkLeaderboard.vue` + `GET /fireworks/popular`
- **合约类型扩展**：`IFireworkNode.type` 从 4 种升至 12 种（匹配引擎），新增 `IFireworkConfig`
- **Prisma 迁移**：`FireworkRecipe.sequence` → `config`（Json）

### 变更

- **FireworkService 接入 Prisma**：`create/findBySlug/popular/findByUser/delete`
- **FireworkController 加鉴权**：`POST/DELETE` 需登录，`GET public/:slug` 公开
- **UserController** 新增 `GET /users/me`、`PUT /users/me`
- **main.ts** 注册 Pinia
- **App.vue** 嵌入 LoginModal

---

## [2.1.0] — 2026-05-20

### Phase 2 完成 — "花傩" AI IP 全站化

### 新增

- **花傩角色 System Prompt**：中英双语角色设定，数据库存储，在线编辑实时生效
- **花傩六状态状态机**：`idle | listening | thinking | speaking | celebrating | night`，夜间自动切换
- **花傩角色组件** (`HuaNuoCharacter.vue`)：纯 CSS 绘制傩面具动漫少女，6 种状态动画
- **花傩角标组件** (`HuaNuoPresence.vue`)：可嵌入任何页面，含对话气泡
- **mitt 事件总线** (`eventBus.ts`)：`map:navigate`、`firework:trigger`、`huanuo:state`
- **AI 指令驱动系统**：LLM 返回 JSON action → `useHuaNuo.dispatchAction()` → 地图飞行/页面跳转/烟花触发
- **AmapComponent 外部操控**：`defineExpose(flyTo, highlightMarker)`，响应 mitt AI 指令
- **Knowledge CRUD**：`GET/POST/PUT/DELETE /api/v1/knowledge`，Prisma 持久化，在线编辑立即生效

### 变更

- **AiService 实战化**：从旧 Express 移植 LLM 调用逻辑，OpenAI 兼容格式，ConfigService 读配置
- **KnowledgeService 接入 Prisma**：68 条知识从 DB 读取，关键词匹配 RAG
- **System Prompt DB 化**：不再硬编码在代码中，存为 `category: '_system_prompt'` 条目
- **AI Chat API**：前端从 `/api/ai/chat` (Express) 切换到 `/api/v1/ai/chat` (NestJS)
- **API 响应协议对齐**：`{ code, data: { text, action? }, message }` 统一格式
- **Chat 组件视觉升级**：Header 红金渐变、Button/Bubble 使用花傩头像
- **Navbar 毛玻璃**：`backdrop-blur-md bg-[#1A1A2E]/70` 暗色调
- **LLM 回复容错**：自动剥离 markdown code fence，JSON 解析降级到纯文本

### 修复

- `tsc` 增量编译缓存导致 `nest build` 无输出 — 构建前清除 `.tsbuildinfo`

### 技术栈

- 新增 `mitt` 事件总线
- 后端 LLM 使用内置 `fetch`（Node 18+），无需额外依赖

---

## [2.0.1] — 2026-05-20

### 变更

- 全量依赖低风险升级（patch/minor）

### 升级清单

| 依赖               | 旧版本 | 新版本      |
| ------------------ | ------ | ----------- |
| vue                | 3.5.27 | **3.5.34**  |
| vue-router         | 4.3.0  | **4.6.4**   |
| vue-i18n           | 11.2.8 | **11.4.4**  |
| pinia              | 3.0.2  | **3.0.4**   |
| vite               | 7.2.4  | **7.3.3**   |
| @vitejs/plugin-vue | 6.0.4  | **6.0.7**   |
| vue-tsc            | 3.2.5  | **3.3.0**   |
| vite-plugin-pwa    | 1.2.0  | **1.3.0**   |
| @nestjs/core       | 11.1.9 | **11.1.21** |
| @prisma/client     | 6.19.1 | **6.19.3**  |
| ioredis            | 5.8.2  | **5.10.1**  |
| axios              | 1.6.8  | **1.16.1**  |
| marked             | 18.0.0 | **18.0.4**  |

### 验证

- `pnpm typecheck` — 全部三个包通过
- `pnpm test` — 合约层测试通过，后端暂无测试

---

## [2.0.0] — 2026-05-20

### 新增

- **Monorepo 架构**：pnpm workspace 管理 `packages/contracts`、`packages/frontend`、`packages/backend`
- **NestJS 后端**：替代原有 Express 单文件服务，模块化架构
- **PostgreSQL + Prisma**：User、Merchant、FireworkRecipe、Coupon、UserCoupon、KnowledgeEntry 共 7 张表
- **共享契约层**：`@wanzai/contracts` 统一定义 API 接口类型
- **知识库入库**：68 条知识条目从硬编码 JS 迁移至数据库
- **API v1**：`/api/v1/ai/chat`、`/api/v1/knowledge`、`/api/v1/auth/*`、`/api/v1/fireworks/*` 等 11 个端点
- **JWT 认证脚手架**：Passport + JWT Strategy
- **工程规范**：ESLint 9 flat config、Prettier、Husky pre-commit、lint-staged
- **单元测试**：Vitest 覆盖 contracts 包

### 变更

- 前端代码迁移至 `packages/frontend/`
- 后端添加 Pinia、mitt 依赖（为 Phase 2 准备）
- TypeScript 严格模式扩展到所有包
- 构建输出路径变更：`packages/frontend/dist/`

### 移除

- `server/` 整个目录 — Express 后端已停止使用，知识库已迁移至 PostgreSQL，`knowledgeBase.js` 已移至 `packages/backend/prisma/`
- `zustand` 依赖（替换为 Pinia）
- `npm` 作为包管理器 — 请使用 `pnpm`

---

## [1.5.0] — 2026-04

### 新增

- "关于我们"页面，展示团队信息
- 团队成员扩展至 6 人（含 Claude AI）
- 多渠道联系方式：抖音、微信视频号、小红书
- 合作伙伴超链接和二维码展示
- 企业客服在线咨询链接

### 变更

- 项目定位升级：AI 技术赋能县域文旅数字化转型

---

## [1.4.0] — 2026-04

### 新增

- 高德地图 JS API 2.0 集成
- 旅游线路页面：真实驾车导航路线
- 地图导览页面：景点标记 + 分类筛选
- 精确景点坐标数据

### 修复

- TypeScript 类型声明问题

---

## [1.3.0] — 2026-04

### 新增

- 数字烟花多种类型可选
- 烟花页面中英双语独立切换

### 变更

- 重构烟花页面代码
- 优化烟花效果

### 修复

- 烟花页面语言切换与外部不一致
- 背景图片显示问题
- 首页语言切换无法返回中文

---

## [1.2.0] — 2026-04

### 新增

- AI 智能问答系统
- RAG 知识库检索（47 条知识点）
- OpenAI 兼容 API 支持
- Markdown 渲染回复内容

---

## [1.1.0] — 2026-03

### 新增

- 数字烟花互动页面（Canvas 实现）
- 烟花音效和全屏模式

---

## [1.0.0] — 2026-02

### 新增

- 项目初始化
- 中英双语支持（vue-i18n）
- PWA 功能（vite-plugin-pwa）
- 响应式设计（Tailwind CSS）
- SEO 优化（预渲染）
- 10 个内容页面上线
