<!-- AI聊天浮动入口按钮 -->
<template>
  <div class="ai-button-wrapper">
    <!-- 主动招呼气泡 -->
    <div v-if="showGreeting" class="greeting-bubble">
      {{ isZh ? '需要傩帮忙吗？' : 'Need Hua Nuo\'s help?' }}
    </div>
    <button
      @click="$emit('click')"
      class="fixed bottom-6 left-6 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-40 group"
      :class="{ 'scale-0 opacity-0': hidden, 'pulse-glow': showGreeting }"
      aria-label="打开AI助手"
    >
      <HuaNuoCharacter :size="48" state="idle" />
      <span
        class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ?
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import HuaNuoCharacter from '@/components/HuaNuoCharacter.vue'

const { locale } = useI18n()
const isZh = computed(() => (locale.value as string) === 'zh-CN')

defineProps<{
  hidden?: boolean
  showGreeting?: boolean
}>()

defineEmits<{
  (e: 'click'): void
}>()
</script>

<style scoped>
.ai-button-wrapper {
  position: relative;
}
button {
  animation: fadeInUp 0.3s ease-out;
}
.pulse-glow {
  animation: fadeInUp 0.3s ease-out, pulseGlow 2s ease-in-out infinite;
}

.greeting-bubble {
  position: fixed;
  bottom: 100px;
  left: 28px;
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

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  50% { box-shadow: 0 0 0 12px rgba(239, 68, 68, 0); }
}
@keyframes bubbleIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
