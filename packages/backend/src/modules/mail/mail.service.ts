import { Injectable, Logger } from '@nestjs/common'
import nodemailer from 'nodemailer'

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)
  private readonly transporter: nodemailer.Transporter | null = null
  private readonly from: string

  constructor() {
    const user = process.env.MAIL_USER
    const pass = process.env.MAIL_PASS
    this.from = process.env.MAIL_FROM || '"焰境·万载" <noreply@whizzzest.top>'

    if (user && pass) {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.qq.com',
        port: 465,
        secure: true,
        auth: { user, pass },
      })
    } else {
      this.logger.warn('Mail credentials not configured, email sending disabled')
    }
  }

  async sendVerificationCode(to: string, code: string): Promise<boolean> {
    const isDev = process.env.NODE_ENV !== 'production'
    if (isDev) {
      this.logger.log(`[DEV] Verification code for ${to}: ${code}`)
      return true
    }

    if (!this.transporter) {
      this.logger.error('Mail transporter not initialized, cannot send email')
      return false
    }

    try {
      await this.transporter.sendMail({
        from: this.from,
        to,
        subject: '焰境·万载 — 登录验证码',
        html: `
<div style="max-width:480px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:12px;font-family:sans-serif">
  <h2 style="color:#dc2626;margin:0 0 16px">焰境·万载</h2>
  <p style="color:#374151;font-size:14px;line-height:1.6">您的登录验证码是：</p>
  <div style="background:#fef3c7;padding:16px 24px;border-radius:8px;text-align:center;margin:16px 0">
    <span style="font-size:28px;font-weight:700;letter-spacing:6px;color:#d97706">${code}</span>
  </div>
  <p style="color:#9ca3af;font-size:12px;line-height:1.5">验证码 5 分钟内有效，请勿泄露给他人。</p>
  <hr style="border:none;border-top:1px solid #f3f4f6;margin:16px 0">
  <p style="color:#d1d5db;font-size:11px">万载数字文旅平台 · 花傩 AI 智能导游</p>
</div>`,
      })
      this.logger.log(`Verification email sent to ${to}`)
      return true
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}: ${err}`)
      return false
    }
  }
}
