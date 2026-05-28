import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { sendCode as apiSendCode, login as apiLogin, refresh as apiRefresh } from '@/api/auth'
import { getMyProfile } from '@/api/users'
import { extractErrorMessage } from '@/utils/extractErrorMessage'
import { emitter } from '@/eventBus'
import { STORAGE_KEYS } from '@/constants/huaNuo'
import type { UserRole } from '@wanzai/contracts'

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
      JSON.stringify({
        id: u.id,
        nickname: u.nickname,
        role: u.role,
        email: u.email,
        isMerchant: u.isMerchant,
      }),
    )
  else sessionStorage.removeItem(STORAGE_KEYS.user)
}

interface UserProfile {
  id: string
  nickname: string
  avatarUrl?: string
  email?: string
  phone?: string
  role: UserRole
  isMerchant?: boolean
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

  function isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 < Date.now()
    } catch {
      return true
    }
  }

  /** 启动时恢复登录态 */
  async function init() {
    if (isInitialized.value) return
    isInitialized.value = true

    if (!accessToken.value && !refreshToken.value) return

    if (accessToken.value && isTokenExpired(accessToken.value)) {
      await tryRefreshToken()
    } else if (refreshToken.value && !accessToken.value) {
      await tryRefreshToken()
    }

    if (accessToken.value && !user.value) {
      await fetchProfile()
    }
  }

  async function sendCode(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      return await apiSendCode(email)
    } catch (e: unknown) {
      return { success: false, message: extractErrorMessage(e, '发送失败，请稍后再试') }
    }
  }

  async function login(email: string, code: string) {
    isLoggingIn.value = true
    try {
      const locale =
        typeof window !== 'undefined' && window.location.pathname.startsWith('/en') ? 'en' : 'zh'
      const res = await apiLogin(email, code, locale)
      const data = res.data as {
        accessToken: string
        refreshToken: string
        user: { id: string; nickname: string; role: string; email: string }
      }
      accessToken.value = data.accessToken
      refreshToken.value = data.refreshToken
      user.value = {
        id: data.user.id,
        nickname: data.user.nickname,
        role: data.user.role as UserRole,
        email: data.user.email,
      }
      saveUser(user.value)
      sessionStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)

      // Hydrate full profile (includes isMerchant flag omitted from login response)
      await fetchProfile()

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
      const res = await apiRefresh(refreshToken.value!)
      accessToken.value = res.data!.accessToken
      sessionStorage.setItem('accessToken', res.data!.accessToken)
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
      const profile = await getMyProfile()
      user.value = {
        id: profile.id,
        nickname: profile.nickname,
        role: profile.role,
        isMerchant: profile.isMerchant,
      }
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
    emitter.emit('show-login-modal', { reason })
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
