<template>
  <nav class="navbar" role="navigation">
    <div class="nav-inner">
      <!-- Logo -->
      <span @click="navigateTo('/', true)" class="logo">
        <img src="/favicon.svg" :alt="t('nav.home')" class="logo-img">
        <span class="logo-text">{{ t('siteName') }}</span>
      </span>

      <!-- Desktop: 导航集群 -->
      <div class="nav-clusters">
        <div v-for="cluster in clusters" :key="cluster.key"
          class="cluster-wrapper"
          @mouseenter="openCluster = cluster.key"
          @mouseleave="closeClusterDelayed">
          <button class="cluster-btn" :class="{ active: openCluster === cluster.key }"
            @click="openCluster === cluster.key ? openCluster = '' : openCluster = cluster.key"
            @mouseenter="clearCloseTimer(); openCluster = cluster.key">
            <span class="cluster-icon">{{ cluster.icon }}</span>
            <span>{{ cluster.label }}</span>
          </button>
          <!-- 下拉面板 -->
          <transition name="drop">
            <div v-if="openCluster === cluster.key" class="dropdown-panel" @mouseenter="clearCloseTimer">
              <template v-for="item in cluster.items" :key="item.label">
                <!-- 可点击项（有 path 或 action） -->
                <span v-if="item.path || (item as any).action === 'chat'"
                  @click="handleClusterItem(item); openCluster = ''"
                  class="dropdown-item">
                  <span class="item-icon">{{ item.icon || '·' }}</span>
                  {{ item.label }}
                </span>
                <!-- 禁用占位项 -->
                <span v-else class="dropdown-item disabled">
                  <span class="item-icon">{{ item.icon || '🎪' }}</span>
                  {{ item.label }}
                  <span class="coming-soon">{{ isZh ? '即将上线' : 'Soon' }}</span>
                </span>
              </template>
            </div>
          </transition>
        </div>
      </div>

      <!-- 右侧 -->
      <div class="nav-right">
        <LanguageSwitcher />
        <button v-if="!authStore.isLoggedIn" @click="handleLogin" class="login-btn">{{ t('common.login') }}</button>
        <div v-else class="user-menu" @click="userMenuOpen = !userMenuOpen">
          <button class="user-btn">{{ authStore.user?.nickname || t('common.user') }}</button>
          <div v-if="userMenuOpen" class="user-dropdown">
            <div class="user-role">{{ roleLabel }}</div>
            <span @click="goTo('/profile'); userMenuOpen = false" class="ud-item">{{ t('profile.personalCenter') }}</span>
            <span v-if="authStore.user?.role === 'MERCHANT'" @click="goTo('/merchant/dashboard'); userMenuOpen = false" class="ud-item">{{ t('auth.merchantDashboard') }}</span>
            <span v-if="authStore.user?.role === 'ADMIN'" @click="goTo('/admin'); userMenuOpen = false" class="ud-item">{{ t('auth.adminPanel') }}</span>
            <span v-if="authStore.user?.role === 'TOURIST'" @click="goTo('/merchant/apply'); userMenuOpen = false" class="ud-item">{{ t('auth.merchantApply') }}</span>
            <button @click="handleLogout" class="ud-item logout">{{ t('auth.logout') }}</button>
          </div>
        </div>
      </div>

      <!-- Mobile Hamburger -->
      <button class="hamburger" @click="mobileOpen = !mobileOpen" aria-label="Menu">
        <svg :class="{ hidden: mobileOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24"><path stroke-linecap="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        <svg :class="{ hidden: !mobileOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24"><path stroke-linecap="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>

    <!-- Mobile Menu -->
    <transition name="slide">
      <div v-if="mobileOpen" class="mobile-menu">
        <div v-for="cluster in clusters" :key="cluster.key" class="mobile-cluster">
          <div class="mobile-cluster-title">{{ cluster.icon }} {{ cluster.label }}</div>
          <span v-for="item in cluster.items" :key="item.path || item.label"
            @click="item.path ? (navigateTo(item.path, true), mobileOpen = false) : null"
            :class="['mobile-item', { disabled: !item.path }]">
            {{ item.label }}
            <span v-if="!item.path" class="coming-soon">{{ isZh ? '即将上线' : 'Soon' }}</span>
          </span>
        </div>
        <div class="mobile-auth">
          <LanguageSwitcher />
          <button v-if="!authStore.isLoggedIn" @click="handleLogin; mobileOpen = false" class="mobile-login-btn">{{ t('common.login') }}</button>
          <template v-else>
            <span class="mobile-user-name">{{ authStore.user?.nickname }}</span>
            <span @click="goTo('/profile'); mobileOpen = false" class="ud-item">{{ t('profile.personalCenter') }}</span>
            <span v-if="authStore.user?.role === 'MERCHANT'" @click="goTo('/merchant/dashboard'); mobileOpen = false" class="ud-item">{{ t('auth.merchantDashboard') }}</span>
            <span v-if="authStore.user?.role === 'ADMIN'" @click="goTo('/admin'); mobileOpen = false" class="ud-item">{{ t('auth.adminPanel') }}</span>
            <button @click="handleLogout; mobileOpen = false" class="ud-item logout">{{ t('auth.logout') }}</button>
          </template>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './LanguageSwitcher.vue'
import { useAuthStore } from '@/stores/auth'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const openCluster = ref('')
const userMenuOpen = ref(false)
const mobileOpen = ref(false)
let closeTimer: ReturnType<typeof setTimeout> | null = null

const isZh = computed(() => (locale.value as string) === 'zh-CN')

function closeClusterDelayed() { closeTimer = setTimeout(() => { openCluster.value = '' }, 200) }
function clearCloseTimer() { if (closeTimer) { clearTimeout(closeTimer); closeTimer = null } }

const roleLabel = computed(() => {
  const role = authStore.user?.role
  if (role === 'ADMIN') return t('auth.admin')
  if (role === 'MERCHANT') return t('auth.merchant')
  return t('auth.user')
})

const clusters = computed(() => [
  {
    key: 'culture', icon: '🏛️', label: isZh.value ? '万载风物' : 'Wanzai Culture',
    items: [
      { path: '/', icon: '🏠', label: t('nav.home') },
      { path: '/culture', icon: '🎭', label: t('nav.culture') },
      { path: '/food', icon: '🍜', label: t('nav.food') },
      { path: '/industry', icon: '🎆', label: t('nav.industry') },
      { path: '/routes', icon: '🗺️', label: t('nav.routes') },
      { path: '/viewing-spots', icon: '📍', label: t('nav.viewingSpots') },
      { path: '/map', icon: '🧭', label: t('nav.map') },
      { path: '/about', icon: 'ℹ️', label: t('nav.about') },
    ],
  },
  {
    key: 'interactive', icon: '🎆', label: isZh.value ? '互动体验' : 'Interactive',
    items: [
      { path: '', action: 'chat', icon: '🤖', label: isZh.value ? 'AI 花傩' : 'AI Hua Nuo' },
      { path: '/firework', icon: '🎇', label: isZh.value ? '数字烟花' : 'Digital Fireworks' },
      { path: '/firework/leaderboard', icon: '🏆', label: isZh.value ? '烟花排行榜' : 'Firework Rankings' },
      { path: '', action: 'none', icon: '🎪', label: isZh.value ? '小游戏' : 'Mini Games' },
    ],
  },
  {
    key: 'business', icon: '💼', label: isZh.value ? '商业服务' : 'Business',
    items: [
      { path: '/merchant', icon: '🏪', label: t('nav.merchant') },
      { path: '/merchant/apply', icon: '📝', label: isZh.value ? '商户入驻' : 'Merchant Apply' },
    ],
  },
])

const localizedPath = (rawPath: string) => {
  if (rawPath === '/') return locale.value === 'en' ? '/en' : '/'
  return locale.value === 'en' ? `/en${rawPath}` : rawPath
}
const navigateTo = (rawPath: string, mobile = false) => {
  if (rawPath === '') return // AI/mock items
  if (mobile) router.push(localizedPath(rawPath))
  else router.push(localizedPath(rawPath))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleClusterItem(item: any) {
  if (item.action === 'chat') {
    if ((window as any).__huaNuoOpen) (window as any).__huaNuoOpen()
    return
  }
  if (item.path) navigateTo(item.path)
}
function goTo(path: string) { router.push(path) }
function handleLogin() { authStore.requireLogin(() => {}, 'default') }
function handleLogout() { authStore.logout(); userMenuOpen.value = false; router.push('/') }

// Close user menu on outside click
if (typeof window !== 'undefined') {
  window.addEventListener('click', (e: Event) => {
    const t = e.target as HTMLElement
    if (!t.closest('.user-menu')) userMenuOpen.value = false
    if (!t.closest('.nav-clusters') && !t.closest('.cluster-btn')) openCluster.value = ''
  })
}
</script>

<style scoped>
.navbar {
  background: rgba(26, 26, 46, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: fixed; top: 0; left: 0; right: 0; z-index: 50;
}
.nav-inner {
  max-width: 1280px; margin: 0 auto; padding: 0 16px;
  display: flex; align-items: center; justify-content: space-between; height: 56px; gap: 12px;
}
/* Logo */
.logo { display: flex; align-items: center; gap: 8px; cursor: pointer; flex-shrink: 0; }
.logo-img { height: 28px; width: auto; }
.logo-text { font-size: 16px; font-weight: 700; color: #f59e0b; white-space: nowrap; }

/* Clusters */
.nav-clusters { display: flex; align-items: center; gap: 4px; }
.cluster-wrapper { position: relative; }
.cluster-btn {
  background: transparent; border: none; color: #d1d5db; padding: 8px 12px; border-radius: 8px;
  font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px; white-space: nowrap;
  transition: all 0.15s;
}
.cluster-btn:hover, .cluster-btn.active { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.cluster-icon { font-size: 15px; }

/* Dropdown */
.dropdown-panel {
  position: absolute; top: 100%; left: 0; margin-top: 4px;
  background: rgba(26, 26, 46, 0.95); backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px;
  padding: 8px 0; min-width: 180px; box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4); z-index: 51;
}
.dropdown-item {
  display: flex; align-items: center; gap: 8px; padding: 9px 16px; font-size: 13px; color: #d1d5db;
  cursor: pointer; transition: all 0.1s; white-space: nowrap;
}
.dropdown-item:hover { background: rgba(255, 255, 255, 0.05); color: #f59e0b; }
.dropdown-item.disabled { color: #6b7280; cursor: default; }
.dropdown-item.disabled:hover { background: transparent; color: #6b7280; }
.item-icon { font-size: 14px; width: 20px; text-align: center; }
.coming-soon { font-size: 10px; color: #f59e0b; background: rgba(245, 158, 11, 0.1); padding: 2px 6px; border-radius: 4px; margin-left: auto; }

/* Right side */
.nav-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.login-btn, .user-btn {
  background: rgba(245, 158, 11, 0.1); border: none; color: #f59e0b; padding: 6px 14px;
  border-radius: 20px; font-size: 13px; cursor: pointer; white-space: nowrap;
}
.user-menu { position: relative; }
.user-dropdown {
  position: absolute; right: 0; top: 100%; margin-top: 4px;
  background: rgba(26, 26, 46, 0.95); backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px;
  padding: 8px 0; min-width: 150px; box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4); z-index: 51;
}
.user-role { padding: 4px 14px 8px; font-size: 11px; color: #6b7280; border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: 4px; }
.ud-item { display: block; padding: 8px 14px; font-size: 13px; color: #d1d5db; cursor: pointer; text-align: left; width: 100%; background: none; border: none; }
.ud-item:hover { background: rgba(255,255,255,0.05); color: #f59e0b; }
.ud-item.logout { color: #ef4444; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 4px; padding-top: 10px; }

/* Hamburger */
.hamburger { display: none; background: none; border: none; color: #d1d5db; cursor: pointer; padding: 4px; }
.hamburger svg.hidden { display: none; }

/* Mobile */
.mobile-menu { background: rgba(26, 26, 46, 0.95); border-top: 1px solid rgba(255,255,255,0.08); padding: 12px 16px; }
.mobile-cluster { margin-bottom: 12px; }
.mobile-cluster-title { font-size: 12px; color: #f59e0b; font-weight: 600; margin-bottom: 4px; text-transform: uppercase; letter-spacing: .5px; }
.mobile-item { display: block; padding: 7px 8px; font-size: 13px; color: #d1d5db; cursor: pointer; border-radius: 6px; }
.mobile-item:hover { background: rgba(255,255,255,0.05); }
.mobile-item.disabled { color: #6b7280; cursor: default; }
.mobile-auth { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 12px; display: flex; flex-direction: column; gap: 6px; }
.mobile-login-btn { align-self: flex-start; background: rgba(245,158,11,0.1); border: none; color: #f59e0b; padding: 6px 14px; border-radius: 20px; font-size: 13px; cursor: pointer; }
.mobile-user-name { font-size: 13px; color: #9ca3af; }

@media (max-width: 768px) {
  .nav-clusters, .nav-right { display: none; }
  .hamburger { display: block; }
}
@media (min-width: 769px) {
  .mobile-menu { display: none; }
}

/* Transitions */
.drop-enter-active { transition: opacity 0.15s, transform 0.15s; }
.drop-leave-active { transition: opacity 0.1s, transform 0.1s; }
.drop-enter-from, .drop-leave-to { opacity: 0; transform: translateY(-4px); }
.slide-enter-active, .slide-leave-active { transition: max-height 0.25s ease; }
.slide-enter-from, .slide-leave-to { max-height: 0; overflow: hidden; }
.slide-enter-to, .slide-leave-from { max-height: 800px; }
</style>
