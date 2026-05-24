import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Response } from 'express'

/**
 * Cache-Control 拦截器
 *
 * 为公开 API 设置缓存头，降低后端负载；用户相关接口默认不缓存。
 * 规则从上到下匹配，命中即停。
 */
const cacheProfiles: Array<{ method: string; pattern: RegExp; cacheControl: string }> = [
  {
    method: 'GET',
    pattern: /^\/api\/v1\/docs$/,
    cacheControl: 'public, max-age=300, stale-while-revalidate=600',
  },
  {
    method: 'GET',
    pattern: /^\/api\/v1\/docs\/[\w-]+$/,
    cacheControl: 'public, max-age=60',
  },
  {
    method: 'GET',
    pattern: /^\/api\/v1\/merchants$/,
    cacheControl: 'public, max-age=300, stale-while-revalidate=600',
  },
  {
    method: 'GET',
    pattern: /^\/api\/v1\/knowledge/,
    cacheControl: 'public, max-age=300, stale-while-revalidate=600',
  },
  {
    method: 'GET',
    pattern: /^\/api\/v1\/firework\/leaderboard/,
    cacheControl: 'public, max-age=30',
  },
  {
    method: 'GET',
    pattern: /^\/api\/v1\/coupons/,
    cacheControl: 'public, max-age=60',
  },
  // 用户相关、认证相关默认不缓存
  {
    method: 'GET',
    pattern: /^\/api\/v1\/user/,
    cacheControl: 'private, no-cache',
  },
  {
    method: 'GET',
    pattern: /^\/api\/v1\/auth/,
    cacheControl: 'private, no-cache',
  },
  // 所有 GET 请求默认缓存 60 秒
  {
    method: 'GET',
    pattern: /^\/api\/v1\//,
    cacheControl: 'public, max-age=60',
  },
  // 非 GET 请求不缓存
  {
    method: '*',
    pattern: /.*/,
    cacheControl: 'private, no-cache, no-store, must-revalidate',
  },
]

@Injectable()
export class CacheControlInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp()
    const request = http.getRequest()
    const response = http.getResponse<Response>()

    const method = request.method
    const url = request.url

    for (const profile of cacheProfiles) {
      if (profile.method !== '*' && profile.method !== method) continue
      if (profile.pattern.test(url)) {
        response.setHeader('Cache-Control', profile.cacheControl)
        break
      }
    }

    return next.handle()
  }
}
