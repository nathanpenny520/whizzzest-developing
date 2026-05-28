import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { emitter } from '@/eventBus'

export function registerAuthGuard(router: Router) {
  let isGuarding = false

  router.beforeEach(async (to, _from, next) => {
    const auth = useAuthStore()

    // 等待初始化完成（所有路由都需要，确保公共页面也能用 token）
    if (!auth.isInitialized) {
      await auth.init()
    }

    const requiredRole = to.meta.requiresRole as string | undefined
    if (!requiredRole) {
      next()
      return
    }

    // 防止重复触发
    if (isGuarding) {
      next(false)
      return
    }

    // 已登录且角色匹配
    if (auth.isLoggedIn) {
      const userRole = auth.user?.role
      if (userRole === requiredRole || userRole === 'ADMIN') {
        next()
        return
      }
      // 角色不匹配 → 回首页
      next('/')
      return
    }

    // 未登录 → 弹出花傩登录框
    isGuarding = true
    auth.requireLogin(() => {
      isGuarding = false
      // 登录成功后用 router.push 导航（不用 location.href，避免丢状态）
      router.push(to.fullPath).catch(() => {})
    }, 'save_firework')
    next(false)
  })

  // 用户取消登录时重置守卫，允许下次再触发
  emitter.on('login-cancelled', () => {
    isGuarding = false
  })
}
