import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common'
import Redis from 'ioredis'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name)
  private client: Redis | null = null

  async onModuleInit() {
    const url = process.env.REDIS_URL || 'redis://localhost:6379'
    this.client = new Redis(url, { lazyConnect: true })
    try {
      await this.client.connect()
      this.logger.log(`Redis connected: ${url}`)
    } catch (err) {
      this.logger.warn(`Redis unavailable (${url}), running without cache`)
      this.client = null
    }
  }

  async onModuleDestroy() {
    if (this.client) await this.client.quit()
  }

  async get(key: string): Promise<string | null> {
    return this.client?.get(key) ?? null
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (!this.client) return
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds)
    } else {
      await this.client.set(key, value)
    }
  }

  async del(key: string): Promise<void> {
    await this.client?.del(key)
  }

  async incr(key: string): Promise<number> {
    return (await this.client?.incr(key)) ?? 0
  }

  async decr(key: string): Promise<number> {
    if (!this.client) return -1
    return await this.client.decr(key)
  }

  getClient(): Redis | null {
    return this.client
  }
}
