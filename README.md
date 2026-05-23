# 焰境·万载

> 江西万载数字文旅平台 · 北京高校在读生发起 · AI 技术赋能县域文旅数字化转型

[![Vue 3](https://img.shields.io/badge/Vue-3.5-green?logo=vue.js)](https://vuejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-red?logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-cyan?logo=vite)](https://vite.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-red?logo=redis)](https://redis.io/)
[![pnpm](https://img.shields.io/badge/pnpm-11-orange?logo=pnpm)](https://pnpm.io/)

## 项目简介

**焰境·万载**是围绕江西省万载县打造的数字文旅平台，以"中国花炮之乡"的千年烟花文化为核心，融合非遗传承、美食特产、旅游导览，以 AI 动漫角色"**花傩**"为数字灵魂。

| 功能        | 说明                                                                              |
| ----------- | --------------------------------------------------------------------------------- |
| 🎆 数字烟花 | Canvas 粒子引擎，12+ 类型，配方编排、保存、分享、排行榜                           |
| 🤖 AI 花傩  | RAG 增强智能导游，六状态动画，全屏对话+对话历史管理，AI 指令驱动页面跳转/地图飞行 |
| 🗺️ 高德地图 | POI 标记、驾车路线、商户标记、AI 指令联动                                         |
| 🏪 商户生态 | 入驻申请、ADMIN 审核、商户后台、优惠券发布/领券（Redis 防超发）/核销              |
| 👤 用户体系 | 手机号注册登录（万能码），JWT 认证，RBAC 三角色（游客/商户/管理员），个人中心     |
| 🧭 导航集群 | 万载风物 / 互动体验 / 商业服务 三大下拉集群                                       |
| 🎮 像素世界 | Minecraft 1.8.8 + Plants vs. Zombies，浏览器即点即玩，IndexedDB 存档              |
| 🌍 中英双语 | vue-i18n，URL 路径前缀切换                                                        |
| 📱 PWA      | 离线缓存、桌面安装、自动更新提示                                                  |
| 🔍 SEO      | 三层 SEO 体系：静态 meta + 运行时注入 + 预渲染                                    |
| 🔐 安全     | CSP、HTTPS、API Key 代理、RBAC 角色守卫                                           |

## 技术栈

| 层级     | 技术                       | 说明                     |
| -------- | -------------------------- | ------------------------ |
| 前端框架 | Vue 3.5 + TypeScript 5.9   | Composition API          |
| 构建工具 | Vite 7                     | 开发/构建                |
| CSS      | Tailwind CSS 3.4           | 实用优先                 |
| 状态管理 | Pinia 3                    | 全局状态                 |
| 国际化   | vue-i18n 11                | 中英双语                 |
| 地图     | 高德地图 JS API 2.0        | POI + 路线               |
| 烟花引擎 | Canvas 2D + Web Worker     | 粒子模拟                 |
| 后端框架 | NestJS 11                  | 模块化架构               |
| 数据库   | PostgreSQL 16 + Prisma ORM | 主数据存储               |
| 缓存     | Redis 7 + ioredis          | 高频查询/限流            |
| 认证     | Passport + JWT             | 渐进式鉴权               |
| 包管理   | pnpm workspace             | Monorepo                 |
| 测试     | Vitest + Supertest         | 单元 + 集成              |
| CI/CD    | GitHub Actions             | 自动构建部署到生产服务器 |
| 共享类型 | @wanzai/contracts          | 契约层                   |

## 项目结构

```
wanzai/
├── packages/
│   ├── contracts/             ← 共享 TypeScript 类型定义
│   │   └── src/
│   │       ├── common.ts      ← ApiResponse<T>、ErrorCode
│   │       ├── user.ts        ← IUser、UserRole
│   │       ├── ai.ts          ← IAIResponse、IAIAction
│   │       ├── firework.ts    ← IFireworkRecipe
│   │       ├── merchant.ts    ← IMerchant、ICoupon
│   │       └── index.ts
│   │
│   ├── frontend/              ← Vue 3 SPA
│   │   ├── src/
│   │   │   ├── pages/         ← 17 个页面（含商户后台、管理员页等）
│   │   │   ├── components/    ← 通用组件 + AIChat/ + 花傩角色
│   │   │   ├── composables/   ← useAIChat、useHuaNuo 等
│   │   │   ├── api/           ← axios 封装（client.ts）
│   │   │   ├── stores/        ← Pinia auth store
│   │   │   ├── types/         ← 前端类型
│   │   │   ├── locales/       ← i18n 文本（1773+ 行）
│   │   │   ├── assets/        ← 图片/音频（视频通过 B 站播放器嵌入）
│   │   │   └── router/        ← 34 条双语路由 + role-based 守卫
│   │   ├── public/            ← favicon、robots.txt、sitemap.xml、CNAME、games/
│   │   ├── vite.config.ts
│   │   └── tailwind.config.js
│   │
│   └── backend/               ← NestJS 后端
│       ├── src/
│       │   ├── modules/
│       │   │   ├── ai/        ← AI 对话 + RAG + LLM 调用
│       │   │   ├── auth/      ← JWT 认证 + 万能验证码
│       │   │   ├── user/      ← 用户 CRUD
│       │   │   ├── firework/  ← 烟花配方
│       │   │   ├── knowledge/ ← 知识库管理（从 DB 读取 System Prompt）
│       │   │   ├── merchant/  ← 商户入驻 + ADMIN 审核
│       │   │   └── coupon/    ← 优惠券 + Redis 库存 + 核销
│       │   ├── prisma/        ← PrismaService
│       │   ├── redis/         ← RedisService（ioredis 封装）
│       │   ├── common/        ← 守卫、装饰器
│       │   └── main.ts
│       └── prisma/
│           ├── schema.prisma  ← 6 个数据模型
│           ├── seed.ts        ← 68 条知识库 + 3 个演示商户
│           └── migrations/    ← 4 个数据库迁移
│
├── scripts/                   ← 预渲染等构建脚本
├── .github/workflows/         ← CI（类型检查+Lint+测试）+ 自动部署
├── pnpm-workspace.yaml        ← pnpm 工作空间
├── eslint.config.js           ← ESLint 9 flat config
├── .prettierrc                ← Prettier 配置
├── CLAUDE.md                  ← Claude Code 项目文档
└── package.json               ← 根 workspace
```

## 快速开始

### 环境要求

- Node.js >= 18.0
- pnpm >= 8.0
- PostgreSQL 16（本地开发需安装并运行）
- Redis 7（需要运行）

### 1. 安装依赖

```bash
npm install -g pnpm
pnpm install
```

### 2. 配置环境变量

**前端** (`packages/frontend/.env`，参考 `.env.example`)：

```bash
VITE_AMAP_KEY=你的高德地图Key
VITE_AMAP_SECURITY_CODE=你的高德地图安全密钥
```

**后端** (`packages/backend/.env`，参考 `.env.example`)：

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/wanzai
JWT_SECRET=随机字符串（建议 openssl rand -hex 32）
REDIS_URL=redis://localhost:6379
API_KEY=你的LLM_API密钥
BASE_URL=https://llmapi.paratera.com
MODEL_NAME=MiniMax-M2.5
PORT=3002
```

### 3. 初始化数据库

```bash
# 启动 PostgreSQL
brew services start postgresql@16

# 创建数据库
createdb wanzai

# 运行迁移
cd packages/backend
pnpm prisma migrate dev

# 导入种子数据（68 条知识库 + 演示商户）
pnpm prisma:seed
```

### 4. 启动开发环境

```bash
# 终端 1：NestJS 后端（端口 3002）
pnpm dev:backend

# 终端 2：Vite 前端（端口 5173）
pnpm dev
```

访问 `http://localhost:5173`。

### 5. 类型检查与测试

```bash
pnpm typecheck   # 全量类型检查
pnpm test        # 运行测试
pnpm lint        # ESLint
```

### 6. 构建

```bash
pnpm build         # 构建前端 → packages/frontend/dist/
pnpm build:backend # 构建后端 → packages/backend/dist/
```

## API 接口

所有接口前缀 `https://whizzzest-yanjingwanzai.top/api/v1/`。

| 模块   | 端点                    | 方法       | 鉴权     | 说明                               |
| ------ | ----------------------- | ---------- | -------- | ---------------------------------- |
| AI     | `/ai/chat`              | POST       | 公开     | 花傩 AI 对话（RAG 增强）           |
| 知识库 | `/knowledge`            | GET/POST   | ADMIN    | 知识条目管理                       |
| 知识库 | `/knowledge/:id`        | PUT/DELETE | ADMIN    | 知识条目更新                       |
| 认证   | `/auth/login`           | POST       | 公开     | 手机号注册/登录（万能码 `000000`） |
| 认证   | `/auth/refresh`         | POST       | 公开     | 刷新 Token                         |
| 用户   | `/users/me`             | GET/PUT    | 登录     | 当前用户资料                       |
| 用户   | `/users/:id`            | GET        | 登录     | 用户信息                           |
| 烟花   | `/fireworks`            | POST       | 登录     | 保存配方                           |
| 烟花   | `/fireworks/mine`       | GET        | 登录     | 我的配方                           |
| 烟花   | `/fireworks/:slug`      | GET        | 公开     | 获取分享配方                       |
| 烟花   | `/fireworks/popular`    | GET        | 公开     | 热门排行榜                         |
| 烟花   | `/fireworks/:id`        | DELETE     | 登录     | 删除配方                           |
| 商户   | `/merchants/apply`      | POST       | 登录     | 入驻申请                           |
| 商户   | `/merchants/me`         | GET/PUT    | MERCHANT | 商户资料                           |
| 商户   | `/merchants`            | GET        | 公开     | 商户列表                           |
| 商户   | `/merchants/:id/verify` | PUT        | ADMIN    | 审核商户                           |
| 优惠券 | `/coupons`              | POST       | MERCHANT | 发布优惠券                         |
| 优惠券 | `/coupons/public`       | GET        | 公开     | 可领券列表                         |
| 优惠券 | `/coupons/:id/claim`    | POST       | 登录     | 领券（Redis 防超发）               |
| 优惠券 | `/coupons/my`           | GET        | 登录     | 我的券                             |
| 优惠券 | `/coupons/redeem`       | POST       | MERCHANT | 核销                               |

## 部署

### 架构

```
Nginx (端口 80/443)
├── 前端静态文件 /usr/share/nginx/html/dist/
├── /api/ → localhost:8080 (NestJS，pm2 管理)
└── 后端依赖 PostgreSQL :5432 + Redis :6379
```

### 自动部署

push 到 `main` 分支后，GitHub Actions 自动执行（`.github/workflows/deploy.yml`）：

1. 构建前端 + 后端
2. rsync 前端 dist → `/usr/share/nginx/html/dist/`
3. rsync 后端 dist + prisma → `/usr/share/nginx/wanzai-backend/`
4. `npm install --prod` → `prisma generate` → `prisma migrate deploy`
5. `pm2 reload wanzai-backend`
6. 健康检查

详细配置和服务器运维指南见 **[更新配置网站服务器.md](更新配置网站服务器.md)**。

### 手动部署

```bash
# 构建
pnpm build && pnpm build:backend

# 上传到服务器
scp -r packages/frontend/dist/* root@server:/usr/share/nginx/html/dist/
scp -r packages/backend/dist/* root@server:/usr/share/nginx/wanzai-backend/dist/

# 重启服务
ssh root@server "pm2 reload wanzai-backend"
```

## 开发规范

### 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)：

```
feat(firework): 新增烟花配方分享链接生成
fix(auth): 修复 Refresh Token 未清除的问题
refactor(map): 高德地图逻辑迁移至 useAmap composable
docs: 更新 README 开发指南
chore: 升级依赖版本
```

### 命名规范

| 类别        | 规范       | 示例                    |
| ----------- | ---------- | ----------------------- |
| Vue 组件    | PascalCase | `AIChatWidget.vue`      |
| Composable  | useXxx     | `useHuaNuo.ts`          |
| TS 接口     | IXxx       | `IFireworkRecipe`       |
| NestJS 模块 | XxxModule  | `CouponModule`          |
| API 路由    | 复数 REST  | `/api/v1/fireworks/:id` |
| Redis Key   | 冒号分隔   | `coupon:stock:{id}`     |

### 代码风格

- TypeScript strict 模式
- Vue 3 Composition API（`<script setup lang="ts">`）
- Prettier：printWidth 100，singleQuote，no semicolons
- ESLint 9 flat config，提交前自动 lint

## 国际化

- 中文：`zh-CN`（默认）
- 英文：`en`
- 切换：导航栏语言按钮 / URL 路径 `/en` 前缀

## PWA

1. 浏览器访问网站
2. 地址栏右侧点击"安装"图标
3. 支持离线访问、桌面图标、全屏体验
4. 新版本发布时顶部弹出更新提示条

## 相关文档

- **[CLAUSE.md](CLAUDE.md)** — Claude Code 项目文档（架构速查、常用命令）
- **[更新配置网站服务器.md](更新配置网站服务器.md)** — 服务器迁移与运维指南
- **[焰境万载重构方案.md](焰境万载重构方案.md)** — 完整重构蓝图与 6 阶段路线图
- **[docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md)** — 开发者使用与验证指南

## 许可证

本项目仅供学习和展示用途。详见 [LICENSE](./LICENSE)。

## 联系方式

- **官方网站**：https://whizzzest-yanjingwanzai.top
- **电子邮箱**：whizzzest@outlook.com
- **官方抖音**：焰境·万载
- **微信公众号**：云上万载-焰遇乡旅
- **微信视频号**：焰境万载
- **小红书**：焰境万载

## 团队

| 成员      | 角色         | 职责                 |
| --------- | ------------ | -------------------- |
| 林雨晴    | 项目负责人   | 统筹全局战略         |
| 陈浩然    | 技术架构师   | 全栈开发与系统架构   |
| 周雅琪    | 品牌运营总监 | 新媒体矩阵与品牌策略 |
| 苏婉婷    | 视频创意总监 | 视觉内容策划制作     |
| 刘思颖    | 内容战略总监 | 内容规划与方案撰写   |
| Claude AI | 智能赋能助手 | AI 技术赋能          |

> 一朝相逢，便是万载 🎆
