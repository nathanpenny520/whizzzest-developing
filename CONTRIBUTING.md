# 贡献指南

感谢你对**焰境·万载**的关注。本项目为 Monorepo 结构，请仔细阅读以下指南。

## 项目结构

本项目使用 pnpm workspace 管理三个子包：

| 包 | 路径 | 说明 |
|---|------|------|
| @wanzai/contracts | `packages/contracts/` | 共享 TypeScript 类型 |
| @wanzai/frontend | `packages/frontend/` | Vue 3 前端 |
| @wanzai/backend | `packages/backend/` | NestJS 后端 |

## 环境准备

```bash
# 安装 pnpm（如未安装）
npm install -g pnpm

# 安装所有依赖
pnpm install

# 启动 PostgreSQL（macOS）
brew services start postgresql@16

# 启动 Redis（macOS）
brew services start redis

# 创建数据库（首次）
createdb wanzai

# 运行数据库迁移
cd packages/backend && pnpm prisma migrate dev && cd ../..

# 导入种子数据（68 条知识 + 3 家商户 + 优惠券）
cd packages/backend && pnpm prisma:seed && cd ../..
```

## 开发流程

```bash
# 终端 1：启动后端
pnpm dev:backend

# 终端 2：启动前端
pnpm dev
```

## 提交规范

### 分支命名

- `feature/功能描述` — 新功能
- `fix/问题描述` — Bug 修复
- `refactor/重构内容` — 重构
- `docs/文档内容` — 文档

### Commit Message

遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)：

```
feat(firework): 新增烟花配方分享
fix(auth): 修复 Token 过期未清除
refactor(map): 高德地图迁移至 useAmap
docs: 更新 API 文档
chore: 升级依赖
```

### 提交前检查

```bash
# 类型检查（所有包）
pnpm typecheck

# Lint 检查
pnpm lint

# 运行测试
pnpm test
```

Husky pre-commit 钩子会自动运行 lint-staged。

## 代码风格

### TypeScript
- 严格模式（`strict: true`）
- 接口使用 `I` 前缀（`IUser`, `IFireworkRecipe`）
- 枚举使用 PascalCase（`UserRole`）
- 禁止 `any`，使用 `unknown` 或具体类型

### Vue 3
- `<script setup lang="ts">` 语法
- 组合式 API（Composition API）
- 组件 PascalCase 命名
- 页面级状态用 Pinia store，组件级用 composable

### NestJS
- 每个模块三文件：`module.ts`、`controller.ts`、`service.ts`
- 统一响应格式：`{ code: number, data: T, message: string }`
- 全部端点前缀 `/api/v1/`
- 鉴权：`@UseGuards(JwtAuthGuard)`，角色：`@Roles(UserRole.ADMIN)`

### Pinia Store
- 全局状态用 Pinia store（`stores/auth.ts`）
- 组件级状态用 composable（`ref`/`computed`）

### 共享类型
- 修改 `packages/contracts/src/*.ts` 等同于修改 API 契约
- 确保前后端同步适配，TypeScript 编译会检查一致性

## 测试

```bash
# 合约层单元测试
pnpm --filter @wanzai/contracts test

# 后端集成测试（待补充）
pnpm --filter @wanzai/backend test

# 全量类型检查
pnpm typecheck
```

## 如何贡献

### 报告 Bug

1. 使用 [Bug 报告模板](https://github.com/nathanpenny520/WhizzZest/issues/new?template=bug_report.yml)
2. 描述复现步骤、期望行为、实际行为
3. 提供环境信息（浏览器、设备、版本）

### 功能建议

1. 使用 [功能建议模板](https://github.com/nathanpenny520/WhizzZest/issues/new?template=feature_request.yml)
2. 说明要解决的问题和期望方案
3. 标注是否愿意自行实现

### 提交 PR

1. Fork 本仓库
2. 创建功能分支
3. 编写代码并通过类型检查（`pnpm typecheck`）
4. 确保测试通过（`pnpm test`）
5. 提交 PR，填写 PR 模板

## 行为准则

请遵守[行为准则](./CODE_OF_CONDUCT.md)。

## 联系方式

- 邮箱：whizzzest@outlook.com
- 安全漏洞请私密报告，详见 [SECURITY.md](./SECURITY.md)
