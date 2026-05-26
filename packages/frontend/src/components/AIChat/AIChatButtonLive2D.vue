<!-- AI聊天浮动入口按钮 - Live2D 版本 -->
<template>
  <div class="ai-button-live2d-wrapper">
    <!-- 主动招呼气泡 -->
    <div v-if="showGreeting && loaded" class="greeting-bubble">
      {{ t('huaNuo.button.greeting') }}
    </div>

    <!-- 加载状态 -->
    <div
      v-if="!loaded && !hidden"
      class="fixed bottom-4 left-4 z-40 flex items-center justify-center"
    >
      <div class="live2d-loading">
        <div class="loading-spinner" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t, locale } = useI18n()
const router = useRouter()

defineProps<{
  hidden?: boolean
  showGreeting?: boolean
}>()

const loaded = ref(false)
const live2dPath = '/live2d/'

function getTools() {
  return [
    {
      svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
      title: t('huaNuo.button.chatWithNuo'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      action: () => {
        ;(window as any).__huaNuoOpen?.()
      },
    },
    {
      svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M8 12h.01M12 10v4M16 12h.01"/></svg>',
      title: t('huaNuo.button.playGames'),
      action: () => router.push('/games'),
    },
    {
      svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2l1.5 5.5L19 6l-4.5 4L16 16l-4-2.5L8 16l1.5-6L5 6l5.5.5z"/></svg>',
      title: t('huaNuo.button.launchFirework'),
      action: () => router.push('/firework'),
    },
    {
      svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M6 12h12"/></svg>',
      title: t('huaNuo.button.toggleLive2D'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      action: () => {
        ;(window as any).__toggleLive2D?.()
      },
    },
  ]
}

function injectTools() {
  const container = document.getElementById('waifu-tool')
  if (!container) return

  container.innerHTML = ''

  getTools().forEach((tool) => {
    const span = document.createElement('span')
    span.innerHTML = tool.svg
    span.title = tool.title
    span.addEventListener('click', (e) => {
      e.stopPropagation()
      tool.action()
    })
    container.appendChild(span)
  })
}

function loadLive2D() {
  if (document.getElementById('live2d-autoload')) return

  const script = document.createElement('script')
  script.id = 'live2d-autoload'
  script.src = '/live2d/autoload.js'
  script.onload = () => {
    loaded.value = true
    setTimeout(injectTools, 500)
  }
  script.onerror = () => {
    loaded.value = true
  }
  document.head.appendChild(script)

  const style = document.createElement('style')
  style.id = 'live2d-custom-style'
  style.textContent = `
    #waifu-toggle { display: none !important; }
    #waifu { z-index: 30 !important; }
    #waifu-tips:not(.waifu-tips-active) { pointer-events: none; }
    #waifu-tool span {
      display: flex; align-items: center; justify-content: center;
      width: 38px; height: 38px;
      border-radius: 50%;
      background: rgba(26, 26, 46, 0.9);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(245, 158, 11, 0.25);
      cursor: pointer;
      transition: background .2s, transform .2s, border-color .2s;
    }
    #waifu-tool span:hover {
      background: rgba(245, 158, 11, 0.2);
      border-color: rgba(245, 158, 11, 0.5);
      transform: scale(1.1);
    }
    #waifu-tool span svg {
      stroke: rgba(229, 231, 235, 0.8);
      transition: stroke .2s;
      width: 20px; height: 20px;
    }
    #waifu-tool span:hover svg {
      stroke: #f59e0b;
    }
  `
  document.head.appendChild(style)
}

function rebuildWidget() {
  // Remove old widget DOM
  document.getElementById('waifu')?.remove()
  document.getElementById('waifu-toggle')?.remove()
  // Clear localStorage so initWidget re-creates the widget
  localStorage.removeItem('waifu-display')
  // Re-initialize widget with new language tips (cache buster to avoid stale fetch)
  const tipsFile = locale.value === 'en' ? 'waifu-tips-en.json' : 'waifu-tips.json'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as any).initWidget?.({
    waifuPath: live2dPath + tipsFile + '?t=' + Date.now(),
    cdnPath: live2dPath,
    cubism2Path: live2dPath + 'live2d.min.js',
    tools: [],
    logLevel: 'warn',
    drag: false,
  })
  // Re-inject custom tools after widget is ready
  setTimeout(injectTools, 800)
}

onMounted(() => {
  if (document.getElementById('waifu')) {
    // Widget persisted in DOM from previous mount, skip re-init
    loaded.value = true
    injectTools()
  } else {
    loadLive2D()
  }
})

// Rebuild widget when language switches (no page refresh needed)
watch(locale, () => {
  if (loaded.value) rebuildWidget()
})
</script>

<style scoped>
.ai-button-live2d-wrapper {
  position: relative;
}

/* ---- Loading ---- */

.live2d-loading {
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
</style>
