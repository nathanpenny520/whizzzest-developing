import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export const api = axios.create({
  baseURL: '/api/v1',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// 请求拦截器：自动附带 token
api.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }
  return config
})

// 响应拦截器：401 时自动尝试刷新 token
let isRefreshing = false
let refreshQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = []

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If the refresh endpoint itself returns 401, fail fast to prevent deadlock
      if (originalRequest.url === '/auth/refresh') {
        isRefreshing = false
        return Promise.reject(error)
      }

      originalRequest._retry = true

      if (!isRefreshing) {
        isRefreshing = true
        const auth = useAuthStore()
        const refreshed = await auth.tryRefreshToken()
        isRefreshing = false

        if (refreshed && auth.accessToken) {
          // 重试队列中的请求
          refreshQueue.forEach((q) => q.resolve(auth.accessToken!))
          refreshQueue = []
          // 重试原请求
          originalRequest.headers.Authorization = `Bearer ${auth.accessToken}`
          return api(originalRequest)
        } else {
          refreshQueue.forEach((q) => q.reject(new Error('refresh failed')))
          refreshQueue = []
          auth.logout()
        }
      } else {
        // 等待正在进行的刷新
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }
    }
    return Promise.reject(error)
  },
)
