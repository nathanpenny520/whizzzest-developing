<template>
  <div class="min-h-screen bg-gray-50">
    <SeoHead />
    <!-- Skip Link for Accessibility -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-red-600 focus:text-white focus:px-4 focus:py-2 focus:rounded"
    >
      跳转到主要内容
    </a>

    <Navbar />
    <Transition name="slide-down">
      <div
        v-if="needRefresh"
        class="fixed top-0 left-0 right-0 z-[200] flex items-center justify-center gap-4 px-4 py-3 bg-amber-500 text-white text-sm shadow-lg"
      >
        <span>{{ t('pwa.updateAvailable') }}</span>
        <button
          class="px-3 py-1 bg-white text-amber-600 rounded-full text-xs font-medium hover:bg-amber-50 transition-colors"
          @click="updateServiceWorker()"
        >
          {{ t('pwa.update') }}
        </button>
      </div>
    </Transition>
    <main id="main-content" class="container mx-auto px-4 py-6 md:py-8 pt-16 md:pt-20">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer />
    <BackToTop />
    <LoginModal />
    <AIChatWidget />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import BackToTop from './components/BackToTop.vue'
import SeoHead from './components/SeoHead.vue'
import LoginModal from './components/LoginModal.vue'
import AIChatWidget from './components/AIChat/AIChatWidget.vue'

const { t } = useI18n()
const { needRefresh, updateServiceWorker } = useRegisterSW()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
}
</style>
