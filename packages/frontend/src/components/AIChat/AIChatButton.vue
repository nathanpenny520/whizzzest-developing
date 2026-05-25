<!-- AI聊天浮动入口按钮 - 3D 花傩模型版 -->
<template>
  <div class="ai-button-wrapper">
    <!-- 主动招呼气泡 -->
    <div v-if="showGreeting && !showQuickMenu" class="greeting-bubble">
      {{ t('huaNuo.button.greeting') }}
    </div>

    <!-- 快捷操作菜单 -->
    <div v-if="showQuickMenu" class="quick-menu" @click.stop>
      <button class="quick-menu-item" @click="handleOpenChat">
        <svg
          class="menu-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        <span>{{ t('huaNuo.button.chatWithNuo') }}</span>
      </button>
      <button class="quick-menu-item" @click="handleGames">
        <svg
          class="menu-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <path d="M8 12h.01M12 10v4M16 12h.01" />
        </svg>
        <span>{{ t('huaNuo.button.playGames') }}</span>
      </button>
      <button class="quick-menu-item" @click="handleFirework">
        <svg
          class="menu-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2l1.5 5.5L19 6l-4.5 4L16 16l-4-2.5L8 16l1.5-6L5 6l5.5.5z" />
        </svg>
        <span>{{ t('huaNuo.button.launchFirework') }}</span>
      </button>
    </div>

    <!-- CSS 花傩角色按钮 -->
    <div
      class="fixed bottom-4 left-4 z-40 group flex items-center justify-center transition-all duration-300"
      :class="{ 'scale-0 opacity-0': hidden }"
      aria-label="打开AI助手"
    >
      <div class="fallback-button" @click="handleFallbackClick">
        <HuaNuoCharacter :size="48" :state="huaNuoState" />
      </div>
    </div>

    <!-- 菜单遮罩（点击外部关闭） -->
    <div v-if="showQuickMenu" class="menu-backdrop" @click="showQuickMenu = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useHuaNuo } from '@/composables/useHuaNuo'
import HuaNuoCharacter from '@/components/HuaNuoCharacter.vue'

// 3D 模型代码保留，需要时取消注释：
// import { defineAsyncComponent } from 'vue'
// const ThreeAiModel = defineAsyncComponent(() => import('@/components/ThreeAiModel.vue'))

const { t } = useI18n()
const router = useRouter()

defineProps<{
  hidden?: boolean
  showGreeting?: boolean
}>()

const emit = defineEmits<{
  (e: 'open-chat'): void
}>()

const { state: huaNuoState } = useHuaNuo()

// Quick menu
const showQuickMenu = ref(false)

// Click handlers

function handleOpenChat() {
  showQuickMenu.value = false
  emit('open-chat')
}

function handleGames() {
  showQuickMenu.value = false
  router.push('/games')
}

function handleFirework() {
  showQuickMenu.value = false
  router.push('/firework')
}

function handleFallbackClick() {
  showQuickMenu.value = !showQuickMenu.value
}

function handleEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') showQuickMenu.value = false
}

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.ai-button-wrapper {
  position: relative;
}

/* ---- Quick Menu ---- */

.menu-backdrop {
  position: fixed;
  inset: 0;
  z-index: 39;
}

.quick-menu {
  position: fixed;
  bottom: 88px;
  left: 20px;
  z-index: 42;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-radius: 14px;
  padding: 6px;
  min-width: 200px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  animation: menuIn 0.2s ease-out;
}

.quick-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #e5e7eb;
  font-size: 13px;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
  text-align: left;
}

.quick-menu-item:hover {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.menu-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  opacity: 0.7;
}

.quick-menu-item:hover .menu-icon {
  opacity: 1;
}

/* ---- Loading / Fallback ---- */

.loading-placeholder {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #dc2626 0%, #d97706 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
  animation: fadeInUp 0.3s ease-out;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2.5px solid rgba(255, 255, 255, 0.25);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.fallback-button {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #dc2626 0%, #d97706 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  animation: fadeInUp 0.3s ease-out;
}
.fallback-button:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 20px rgba(220, 38, 38, 0.45);
}

/* ---- Greeting Bubble ---- */

.greeting-bubble {
  position: fixed;
  bottom: 84px;
  left: 16px;
  background: rgba(26, 26, 46, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #f59e0b;
  padding: 8px 14px;
  border-radius: 12px;
  font-size: 13px;
  white-space: nowrap;
  z-index: 41;
  animation: bubbleIn 0.5s ease-out;
}
.greeting-bubble::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 24px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid rgba(26, 26, 46, 0.9);
}

/* ---- Keyframes ---- */

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes bubbleIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes menuIn {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
