<template>
  <nav class="bg-white shadow-md fixed top-0 left-0 right-0 z-50" role="navigation" aria-label="主导航">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center py-3 md:py-4">
        <!-- Logo -->
        <div class="flex items-center">
          <span @click="navigateTo('/', true)" class="flex items-center text-xl md:text-2xl font-bold text-red-600 whitespace-nowrap cursor-pointer">
            <img src="/favicon.svg" :alt="t('nav.home')" class="h-6 md:h-8 w-auto">
            <span class="ml-1 md:ml-2">{{ t('siteName') }}</span>
          </span>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-2 lg:space-x-4 xl:space-x-6">
          <span
            v-for="link in navLinks"
            :key="link.path"
            @click="navigateTo(link.rawPath)"
            class="text-gray-700 hover:text-red-600 font-medium transition-colors text-xs lg:text-sm whitespace-nowrap cursor-pointer"
            :class="{ 'text-red-600': isActive(link.rawPath) }"
          >
            {{ link.label }}
          </span>

          <!-- Language Switcher -->
          <LanguageSwitcher />
        </div>

        <!-- Mobile Navigation Button -->
        <div class="md:hidden">
          <button
            @click="toggleMobileMenu"
            class="text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1"
            :aria-expanded="mobileMenuOpen"
            aria-controls="mobile-menu"
            aria-label="切换移动菜单"
          >
            <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Menu -->
      <transition name="slide">
        <div v-if="mobileMenuOpen" id="mobile-menu" class="md:hidden py-2 space-y-2 overflow-hidden" role="menu">
          <span
            v-for="link in navLinks"
            :key="link.path"
            @click="navigateTo(link.rawPath, true)"
            class="block text-gray-700 hover:text-red-600 font-medium transition-colors py-2 text-sm cursor-pointer"
            :class="{ 'text-red-600': isActive(link.rawPath) }"
            role="menuitem"
          >
            {{ link.label }}
          </span>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import LanguageSwitcher from './LanguageSwitcher.vue';

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const mobileMenuOpen = ref(false);

// 根据当前语言生成动态路径
const getLocalizedPath = (path: string) => {
  if (path === '/') {
    return locale.value === 'en' ? '/en' : '/';
  }
  return locale.value === 'en' ? `/en${path}` : path;
};

// 导航链接配置（包含rawPath用于导航判断）
const navLinks = computed(() => [
  { rawPath: '/', path: getLocalizedPath('/'), label: t('nav.home') },
  { rawPath: '/culture', path: getLocalizedPath('/culture'), label: t('nav.culture') },
  { rawPath: '/food', path: getLocalizedPath('/food'), label: t('nav.food') },
  { rawPath: '/industry', path: getLocalizedPath('/industry'), label: t('nav.industry') },
  { rawPath: '/routes', path: getLocalizedPath('/routes'), label: t('nav.routes') },
  { rawPath: '/viewing-spots', path: getLocalizedPath('/viewing-spots'), label: t('nav.viewingSpots') },
  { rawPath: '/map', path: getLocalizedPath('/map'), label: t('nav.map') },
  { rawPath: '/merchant', path: getLocalizedPath('/merchant'), label: t('nav.merchant') },
  { rawPath: '/about', path: getLocalizedPath('/about'), label: t('nav.about') }
]);

// 判断当前页面是否激活
const isActive = (rawPath: string) => {
  const currentPath = route.path;
  const expectedPath = getLocalizedPath(rawPath);
  return currentPath === expectedPath;
};

// 检测是否为语言切换
const isLanguageSwitch = (targetPath: string) => {
  const currentPath = route.path;
  const currentLang = currentPath.startsWith('/en') ? 'en' : 'zh';
  const targetLang = targetPath.startsWith('/en') ? 'en' : 'zh';
  return currentLang !== targetLang;
};

// 导航方法
const navigateTo = (rawPath: string, closeMenu = false) => {
  const targetPath = getLocalizedPath(rawPath);

  if (closeMenu) {
    closeMobileMenu();
  }

  if (isLanguageSwitch(targetPath)) {
    // 语言切换：保持滚动位置
    router.push({
      path: targetPath,
      state: { preserveScroll: true, scrollY: window.scrollY }
    });
  } else {
    // 页面切换：滚动到顶部
    router.push(targetPath);
  }
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

watch(() => route.path, () => {
  closeMobileMenu();
});
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
