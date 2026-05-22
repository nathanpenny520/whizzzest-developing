# 焰境·万载 — 开发者使用与验证指南

> 本文档面向接手项目的开发者，覆盖环境搭建、功能验证、API 测试全流程。

---

## 一、环境搭建

### 1.1 前置依赖

| 依赖       | 版本    | 安装方式                                                    |
| ---------- | ------- | ----------------------------------------------------------- |
| Node.js    | >= 18.0 | `brew install node` 或 [nvm](https://github.com/nvm-sh/nvm) |
| pnpm       | >= 8.0  | `npm install -g pnpm`                                       |
| PostgreSQL | 16      | `brew install postgresql@16`                                |
| Redis      | 7       | `brew install redis`                                        |

### 1.2 启动服务

```bash
# 启动 PostgreSQL
brew services start postgresql@16

# 启动 Redis
brew services start redis

# 验证服务
psql --version       # PostgreSQL 16.x
redis-cli ping       # PONG
```

### 1.3 克隆与安装

```bash
git clone <repo-url>
cd "whizzzest(website-version)"   # 注意项目路径含括号

# 安装所有工作空间依赖
pnpm install
```

### 1.4 配置环境变量

**后端** `packages/backend/.env`：

```bash
# 数据库
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/wanzai?schema=public"

# JWT
JWT_SECRET="change-me-in-production"

# AI 模型（OpenAI 兼容接口）
MODEL_NAME="MiniMax-M2.5"
API_KEY="sk-your-api-key-here"
BASE_URL="https://llmapi.paratera.com"

# Redis
REDIS_URL=redis://localhost:6379

# 端口
PORT=3002
```

**前端** `packages/frontend/.env`：

```bash
VITE_AMAP_KEY=你的高德地图Key
VITE_AMAP_SECURITY_CODE=你的高德地图安全密钥
```

> **高德密钥获取**：访问 [高德开放平台](https://lbs.amap.com/) → 创建应用 → 选择「Web端(JS API)」→ 获取 Key 和安全密钥。

### 1.5 初始化数据库

```bash
# 创建数据库
createdb wanzai

# 运行 Prisma 迁移（建表）
cd packages/backend
pnpm prisma migrate dev

# 导入种子数据（68 条知识 + 3 家商户 + 系统提示词）
pnpm prisma:seed
cd ../..
```

### 1.6 启动开发环境

```bash
# 终端 1：启动 NestJS 后端（端口 3002）
pnpm dev:backend

# 终端 2：启动 Vite 前端（端口 5173）
pnpm dev
```

访问 `http://localhost:5173` 即可看到网站。

---

## 二、类型检查与测试

```bash
# 全量类型检查（3 个包）
pnpm typecheck

# 运行测试
pnpm test

# Lint
pnpm lint

# 构建前端
pnpm build

# 构建后端
pnpm build:backend
```

---

## 三、功能验证 — 后端 API

> 以下所有 `curl` 命令假设后端运行在 `localhost:3002`。

### 3.1 认证系统

#### 3.1.1 注册/登录（万能码）

```bash
# 首次登录自动注册，昵称"游客"
curl -s http://localhost:3002/api/v1/auth/login \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{"phone":"13800000001","code":"000000"}'
```

**预期响应**：

```json
{
  "code": 0,
  "data": {
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG...",
    "user": {
      "id": "uuid",
      "nickname": "游客",
      "phone": "13800000001",
      "role": "TOURIST",
      "isNew": true
    }
  }
}
```

- 验证码 `000000` 为开发环境万能码，任何手机号均可通过
- `isNew: true` 表示首次注册，`false` 表示已有账户
- JWT 负载包含 `sub`（用户ID）、`phone`、`role`

#### 3.1.2 刷新 Token

```bash
REFRESH_TOKEN="上一步返回的refreshToken"
curl -s http://localhost:3002/api/v1/auth/refresh \
  -X POST \
  -H 'Content-Type: application/json' \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}"
```

#### 3.1.3 获取当前用户

```bash
TOKEN="上一步返回的accessToken"
curl -s http://localhost:3002/api/v1/users/me \
  -H "Authorization: Bearer $TOKEN"
```

#### 3.1.4 无 Token 访问（应返回 401）

```bash
curl -s http://localhost:3002/api/v1/users/me
# 预期：{"message":"Unauthorized","statusCode":401}
```

---

### 3.2 花傩 AI 对话

```bash
# 中文提问
curl -s http://localhost:3002/api/v1/ai/chat \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{"question":"万载有什么好吃的推荐","locale":"zh"}'

# 英文提问
curl -s http://localhost:3002/api/v1/ai/chat \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{"question":"Where to watch fireworks in Wanzai?","locale":"en"}'
```

**验证要点**：

- 回复语气应体现花傩角色设定（俏皮、用"傩愿"等词）
- RAG 检索结果应包含相关知识库内容
- 如果 API_KEY 未配置，返回花傩"充电中"提示
- 如果提到地点/烟花，响应 JSON 含 `action` 字段：

```json
{
  "text": "傩愿为你...",
  "action": { "type": "trigger_firework", "payload": {} }
}
```

---

### 3.3 知识库管理（ADMIN）

```bash
# 登录 ADMIN 账户（种子数据已预置 ADMIN 账号，手机号见 .env 中 ADMIN_PHONES）
ADMIN_TOKEN=$(curl -s http://localhost:3002/api/v1/auth/login \
  -X POST -H 'Content-Type: application/json' \
  -d '{"phone":"你的管理员手机号","code":"000000"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['accessToken'])")

# 查看全量知识库
curl -s http://localhost:3002/api/v1/knowledge \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# 添加知识
curl -s http://localhost:3002/api/v1/knowledge \
  -X POST -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"category":"测试","content":"这是一条测试知识","keywords":["测试","关键词"]}'

# 编辑花傩角色提示词（category: _system_prompt）
curl -s http://localhost:3002/api/v1/knowledge/_system_prompt_zh \
  -X PUT -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"content":"你是花傩...这里是新的提示词"}'
```

**验证要点**：

- 修改知识/提示词后立即生效，无需重启服务
- 新添加的知识条目下次 AI 对话会被检索到

---

### 3.4 烟花配方

#### 3.4.1 保存配方

```bash
TOKEN="你的登录Token"
curl -s http://localhost:3002/api/v1/fireworks \
  -X POST \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title":"我的烟花秀",
    "config":{
      "shellType":"willow",
      "shellSize":3,
      "quality":2,
      "skyLighting":2,
      "autoLaunch":true,
      "finaleMode":false,
      "soundEnabled":true,
      "backgroundImage":null
    }
  }'
```

**预期响应**：包含 `shareSlug`（如 `我的烟花秀-mxxxx`）。

#### 3.4.2 获取分享配方

```bash
curl -s http://localhost:3002/api/v1/fireworks/我的烟花秀-mxxxx
# 每次访问 viewCount +1
```

#### 3.4.3 热门排行榜

```bash
curl -s http://localhost:3002/api/v1/fireworks/popular
```

#### 3.4.4 无登录保存（应返回 401）

```bash
curl -s http://localhost:3002/api/v1/fireworks \
  -X POST -H 'Content-Type: application/json' \
  -d '{"title":"test","config":{}}'
```

---

### 3.5 商户系统

#### 3.5.1 申请入驻

```bash
TOKEN="任意登录用户的Token"
curl -s http://localhost:3002/api/v1/merchants/apply \
  -X POST \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name":"我的店铺",
    "category":"dining",
    "mapLng":114.445,
    "mapLat":28.102,
    "phone":"0795-1234567",
    "description":"这是一家测试店铺"
  }'
```

#### 3.5.2 查看已审核商户（公开）

```bash
curl -s http://localhost:3002/api/v1/merchants
```

#### 3.5.3 ADMIN 审核商户

```bash
ADMIN_TOKEN="admin的Token"
MERCHANT_ID="上一步返回的商户id"

# 审核通过
curl -s "http://localhost:3002/api/v1/merchants/$MERCHANT_ID/verify" \
  -X PUT -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"isVerified":true}'
```

#### 3.5.4 查看所有商户（含未审核，ADMIN）

```bash
curl -s 'http://localhost:3002/api/v1/merchants?all=true' \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

### 3.6 优惠券系统（核心商业闭环）

#### 3.6.1 商户发布优惠券

```bash
# 先用商户手机号登录（种子数据：merchant_001）
M_TOKEN=$(curl -s http://localhost:3002/api/v1/auth/login \
  -X POST -H 'Content-Type: application/json' \
  -d '{"phone":"merchant_001","code":"000000"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['accessToken'])")

# 发布优惠券
curl -s http://localhost:3002/api/v1/coupons \
  -X POST -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $M_TOKEN" \
  -d '{
    "title":"满100减20",
    "discount":20,
    "totalStock":10,
    "expiresAt":"2026-12-31T23:59:59Z"
  }'

# 查看自己的券
curl -s http://localhost:3002/api/v1/coupons/merchant \
  -H "Authorization: Bearer $M_TOKEN"
```

#### 3.6.2 验证 Redis 库存初始化

```bash
COUPON_ID="上一步返回的优惠券id"
redis-cli get "coupon:stock:$COUPON_ID"
# 预期输出："10"
```

#### 3.6.3 用户领券（Redis DECR 防超发）

```bash
# 用普通用户登录
U_TOKEN=$(curl -s http://localhost:3002/api/v1/auth/login \
  -X POST -H 'Content-Type: application/json' \
  -d '{"phone":"13800000001","code":"000000"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['accessToken'])")

# 领券
curl -s "http://localhost:3002/api/v1/coupons/$COUPON_ID/claim" \
  -X POST -H "Authorization: Bearer $U_TOKEN"

# 验证 Redis 库存已递减
redis-cli get "coupon:stock:$COUPON_ID"
# 预期输出："9"
```

#### 3.6.4 重复领券（应拒绝）

```bash
# 同一用户再次领同一券
curl -s "http://localhost:3002/api/v1/coupons/$COUPON_ID/claim" \
  -X POST -H "Authorization: Bearer $U_TOKEN"
# 预期：{"message":"已领取过该优惠券"}
```

#### 3.6.5 超发测试

```bash
# 如果库存为 10，用 11 个不同用户领取，第 11 次应返回"已领完"
# 每次 DECR 后结果 < 0 时自动 INCR 回滚
```

#### 3.6.6 商户核销

```bash
# 获取核销码
REDEEM_CODE=$(curl -s http://localhost:3002/api/v1/coupons/my \
  -H "Authorization: Bearer $U_TOKEN" | python3 -c "import sys,json; print(json.load(sys.stdin)['data'][0]['redeemCode'])")

# 商户核销
curl -s http://localhost:3002/api/v1/coupons/redeem \
  -X POST -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $M_TOKEN" \
  -d "{\"redeemCode\":\"$REDEEM_CODE\"}"
# 预期：{"code":0,"message":"ok"}
```

#### 3.6.7 验证 PostgreSQL 库存同步

```bash
psql -d wanzai -c "SELECT title, total_stock, used_stock FROM \"Coupon\" WHERE id='$COUPON_ID';"
```

---

## 四、功能验证 — 前端页面

### 4.1 页面导航测试

| 页面     | 中文路径                | 英文路径                   | 关键验证点                                                                  |
| -------- | ----------------------- | -------------------------- | --------------------------------------------------------------------------- |
| 首页     | `/`                     | `/en`                      | Hero 轮播、导航栏三大集群、右下角花傩按钮（点击后可全屏对话、管理对话历史） |
| 非遗文化 | `/culture`              | `/en/culture`              | 5 个非遗项目展示、视频播放                                                  |
| 美食特产 | `/food`                 | `/en/food`                 | 六大碗 + 其他美食、图片网格                                                 |
| 烟花产业 | `/industry`             | `/en/industry`             | Chart.js 图表（饼图+柱状图）、中英切换图表重建                              |
| 旅游线路 | `/routes`               | `/en/routes`               | 高德驾车路线、途经点标记                                                    |
| 赏烟地点 | `/viewing-spots`        | `/en/viewing-spots`        | 两个观赏点、提示卡片                                                        |
| 地图导览 | `/map`                  | `/en/map`                  | 分类筛选按钮、10 个景点标记                                                 |
| 商家展示 | `/merchant`             | `/en/merchant`             | 3 家种子商户展示、优惠券卡片、领券按钮                                      |
| 数字烟花 | `/firework`             | `/en/firework`             | 点击发射烟花、播放/暂停/设置面板、**保存配方按钮**                          |
| 关于我们 | `/about`                | `/en/about`                | 团队介绍、时间线、联系方式                                                  |
| 烟花分享 | `/firework/share/:slug` | `/en/firework/share/:slug` | 加载配方回放                                                                |
| 商户入驻 | `/merchant/apply`       | —                          | 表单提交                                                                    |
| 商户后台 | `/merchant/dashboard`   | —                          | 需 MERCHANT 角色                                                            |
| 管理后台 | `/admin`                | —                          | 需 ADMIN 角色                                                               |

### 4.2 花傩 AI 对话（含全屏与对话管理）

1. 点击任意页面右下角**花傩头像浮动按钮**
2. 聊天窗口弹出，点击 ⛶ **全屏按钮** → 占满屏幕
3. 全屏模式左侧出现**对话历史面板**：
   - **新建对话**：点击「+ 新对话」
   - **切换对话**：点击列表项
   - **三点菜单**：每条右侧「⋯」→ 重命名 / Pin / 删除
   - **折叠面板**：左边缘 ◀ 箭头
   - **拖拽宽度**：右边缘横向拖动
4. 点击 **− 最小化** → 底部红金渐变小条 → 点击恢复
5. 点击 **× 关闭** → 彻底关闭 → 浮动按钮出现

### 4.3 用户注册/登录

1. 访问烟花页 `http://localhost:5173/firework`
2. 点击底部控制栏的**保存配方按钮**（💾 图标）
3. 弹出花傩登录弹窗，文案："我帮你把这场烟花永久留住～先跟我登记一下就好！"
4. 输入任意手机号 + 万能码 `000000`
5. 登录成功后弹出命名对话框，输入标题 → 保存
6. 显示分享链接 → 点击复制

### 4.4 烟花配方分享

1. 上一步保存成功后获取分享链接
2. 在隐身窗口打开 `/firework/share/<shareSlug>`
3. 验证：
   - 加载配方数据
   - 显示标题 + 作者 + 浏览量
   - 可复制链接或跳转到创作页

### 4.5 商户入驻流程（端到端）

1. 用普通账户（如 `13800000001`）登录
2. 访问 `/merchant/apply` → 填写商户信息 → 提交
3. 用 ADMIN 账户登录（手机号见 `.env` 中 `ADMIN_PHONES`）
4. 访问 `/admin` → 商户审核 Tab → 找到刚才的申请 → 点击"通过"
5. 将该用户角色设为 MERCHANT（通过数据库或 ADMIN 后台）
6. 重新登录 → 访问 `/merchant/dashboard`
7. 验证四个 Tab：
   - **概览**：显示统计数据
   - **店铺信息**：可编辑
   - **优惠券管理**：发布新券 → 可查看
   - **核销工具**：输入核销码 → 核销

### 4.6 用户领券

1. 访问 `/merchant` 页面
2. 应看到已审核商户列表及其优惠券
3. 点击"领取"按钮 → 未登录弹出 LoginModal → 登录后领取成功
4. 同一用户再次点击同一券应提示"已领取过"

---

## 五、数据库管理

### 5.1 Prisma Studio

```bash
cd packages/backend
pnpm prisma:studio
# 浏览器打开 http://localhost:5555
```

可在图形界面查看/编辑所有表数据。

### 5.2 直接 SQL

```bash
psql -d wanzai

# 查看所有用户
SELECT id, phone, nickname, role FROM "User";

# 查看已审核商户
SELECT m.name, m.category, m."isVerified", u.nickname
FROM "Merchant" m JOIN "User" u ON m."userId" = u.id;

# 查看优惠券领用情况
SELECT c.title, c."totalStock", c."usedStock", COUNT(uc.id) as claims
FROM "Coupon" c LEFT JOIN "UserCoupon" uc ON c.id = uc."couponId"
GROUP BY c.id;

# 查看核销明细
SELECT uc."redeemCode", uc."isRedeemed", uc."claimedAt", uc."redeemedAt",
       c.title, u.nickname
FROM "UserCoupon" uc
JOIN "Coupon" c ON uc."couponId" = c.id
JOIN "User" u ON uc."userId" = u.id;
```

---

## 六、Redis 管理

```bash
# 查看所有优惠券库存
redis-cli keys "coupon:stock:*"

# 查看特定库存
redis-cli get "coupon:stock:<coupon-id>"

# 手动调整库存（测试用）
redis-cli set "coupon:stock:<coupon-id>" 100

# 清空所有缓存
redis-cli FLUSHALL
```

---

## 七、常见问题排查

### 7.1 后端无法启动

```bash
# 检查 PostgreSQL
brew services list | grep postgresql
psql -d wanzai -c "SELECT 1"  # 验证连接

# 检查 Redis
redis-cli ping

# 检查 .env 配置
cat packages/backend/.env

# 重新构建
cd packages/backend
rm -rf dist tsconfig.build.tsbuildinfo
pnpm build
node dist/main.js
```

### 7.2 AI 对话返回"充电中"

- `API_KEY` 未配置或无效
- 检查 `packages/backend/.env` 中 `API_KEY` 是否正确
- 后端日志会打印 LLM 调用错误

### 7.3 类型检查失败

```bash
pnpm typecheck
# 常见原因：
# 1. 修改了 contracts 类型但前后端未同步
# 2. 新组件未使用 <script setup lang="ts">
# 3. 后端 tsconfig.build.tsbuildinfo 缓存 → rm 后重试
```

### 7.4 优惠券领券失败

- 确保 Redis 运行中：`redis-cli ping`
- 检查库存：`redis-cli get "coupon:stock:<id>"`
- 如果 Redis 重启后库存丢失，用 Prisma 数据重建：
  ```bash
  psql -d wanzai -c "SELECT id, total_stock, used_stock FROM \"Coupon\";"
  # 手动 redis-cli set coupon:stock:<id> <total_stock - used_stock>
  ```
