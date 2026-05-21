# 安全政策

## 报告安全漏洞

如果你发现了安全漏洞，**请不要通过公开 Issue 报告**。

请发送邮件至 **whizzzest@outlook.com**，加密通信可使用以下 PGP 公钥（如有配置）。

请在报告中包含：

- 漏洞的详细描述
- 复现步骤
- 受影响的版本/组件
- 可能的修复建议（如有）

## 处理流程

1. 收到报告后，**5 个工作日内**确认收到
2. **15 个工作日内**完成验证和评估
3. 修复后发布安全公告，致谢报告者（如愿意被致谢）

## 覆盖范围

| 类型 | 说明 |
|------|------|
| XSS | 跨站脚本攻击 |
| CSRF | 跨站请求伪造 |
| API 密钥泄露 | 敏感信息暴露 |
| 依赖漏洞 | 已知 CVE |
| 认证缺陷 | 鉴权/授权问题 |
| SQL 注入 | 数据库注入攻击 |
| SSRF | 服务端请求伪造 |

## 不在范围内

- HTTP 安全头缺失（如已配置最佳实践）
- 第三方服务已知漏洞
- 需物理访问的攻击
- 社会工程学攻击

## 已实施的安全措施

| 措施 | 实现 |
|------|------|
| HTTPS | 全站加密（Let's Encrypt） |
| CSP | Content-Security-Policy，限制脚本/样式/连接来源 |
| API Key 保护 | 密钥仅存后端环境变量，前端不可见 |
| 高德安全密钥 | securityJsCode 保护 API 调用 |
| X-Frame-Options | `DENY`，防 iframe 嵌入 |
| X-Content-Type-Options | `nosniff` |
| X-XSS-Protection | `1; mode=block` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| HSTS | `max-age=31536000; includeSubDomains` |
| CORS | 后端限制允许的源（生产环境） |
| JWT 黑名单 | Redis 存储已注销 Token（Phase 4 后） |
