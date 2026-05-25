import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/api/client'
import { STORAGE_KEYS } from '@/constants/huaNuo'

function loadUser(): UserProfile | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.user)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
function saveUser(u: UserProfile | null) {
  if (u)
    sessionStorage.setItem(
      STORAGE_KEYS.user,
      JSON.stringify({ id: u.id, nickname: u.nickname, role: u.role, email: u.email }),
    )
  else sessionStorage.removeItem(STORAGE_KEYS.user)
}

interface UserProfile {
  id: string
  nickname: string
  avatarUrl?: string
  email?: string
  phone?: string
  role: string
  createdAt?: string
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(sessionStorage.getItem('accessToken'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
  const user = ref<UserProfile | null>(loadUser())
  const isLoggingIn = ref(false)
  const isInitialized = ref(false)

  const isLoggedIn = computed(() => !!accessToken.value)

  // 待登录后重试的操作
  let pendingAction: (() => void) | null = null

  /** 启动时恢复登录态 */
  async function init() {
    if (isInitialized.value) return
    isInitialized.value = true

    if (!accessToken.value && !refreshToken.value) return

    if (refreshToken.value && !accessToken.value) {
      await tryRefreshToken()
    }

    if (accessToken.value && !user.value) {
      await fetchProfile()
    }
  }

  async function sendCode(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await api.post('/auth/send-code', { email })
      if (res.data.code === 0) return { success: true }
      return { success: false, message: res.data.message }
    } catch (e: unknown) {
      const data = (e as { response?: { data?: { message?: string } } }).response?.data
      return { success: false, message: data?.message || '发送失败，请稍后再试' }
    }
  }

  async function login(email: string, code: string) {
    isLoggingIn.value = true
    try {
      const locale =
        typeof window !== 'undefined' && window.location.pathname.startsWith('/en') ? 'en' : 'zh'
      const res = await api.post('/auth/login', { email, code, locale })
      const data = res.data.data
      accessToken.value = data.accessToken
      refreshToken.value = data.refreshToken
      user.value = {
        id: data.user.id,
        nickname: data.user.nickname,
        role: data.user.role,
        email: data.user.email,
      }
      saveUser(user.value)
      sessionStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)

      if (pendingAction) {
        const action = pendingAction
        pendingAction = null
        action()
      }
      return true
    } finally {
      isLoggingIn.value = false
    }
  }

  async function tryRefreshToken() {
    if (!refreshToken.value) return false
    try {
      const res = await api.post('/auth/refresh', { refreshToken: refreshToken.value })
      accessToken.value = res.data.data.accessToken
      sessionStorage.setItem('accessToken', res.data.data.accessToken)
      await fetchProfile()
      return true
    } catch {
      logout()
      return false
    }
  }

  async function fetchProfile() {
    if (!accessToken.value) return
    try {
      const res = await api.get('/users/me')
      user.value = res.data.data
      saveUser(user.value)
    } catch {
      if (refreshToken.value) {
        await tryRefreshToken()
      }
    }
  }

  function logout() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    saveUser(null)
    sessionStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  /** 确保已登录，未登录时弹出 LoginModal，登录后自动重试 */
  function requireLogin(action: () => void, reason: string) {
    if (isLoggedIn.value) {
      action()
      return
    }
    pendingAction = action
    window.dispatchEvent(new CustomEvent('show-login-modal', { detail: { reason } }))
  }

  return {
    accessToken,
    refreshToken,
    user,
    isLoggingIn,
    isLoggedIn,
    isInitialized,
    init,
    sendCode,
    login,
    logout,
    tryRefreshToken,
    fetchProfile,
    requireLogin,
  }
})
