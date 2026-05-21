<template>
  <div class="huanuo-presence" :class="`position-${position}`">
    <div class="presence-bubble" v-if="message">
      <p class="bubble-text">{{ message }}</p>
    </div>
    <HuaNuoCharacter :size="size" :state="presenceState" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import HuaNuoCharacter from '@/components/HuaNuoCharacter.vue'

const props = withDefaults(
  defineProps<{
    message?: string
    position?: 'left' | 'right' | 'center'
    size?: number
    page?: string
  }>(),
  {
    message: '',
    position: 'right',
    size: 60,
    page: '',
  },
)

const presenceState = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 22 || hour < 6) return 'night'
  return 'idle'
})
</script>

<style scoped>
.huanuo-presence {
  position: relative;
  display: inline-flex;
  align-items: flex-start;
  gap: 8px;
  z-index: 30;
}

.position-left {
  flex-direction: row-reverse;
}

.position-right {
  flex-direction: row;
}

.position-center {
  flex-direction: column;
  align-items: center;
}

.presence-bubble {
  max-width: 180px;
  background: rgba(26, 26, 46, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px 12px;
  animation: bubbleIn 0.5s ease-out;
}

.bubble-text {
  margin: 0;
  font-size: 12px;
  color: #e2e8f0;
  line-height: 1.4;
}

.position-left .presence-bubble::after,
.position-right .presence-bubble::after {
  content: '';
  position: absolute;
  top: 12px;
  width: 0;
  height: 0;
  border: 6px solid transparent;
}

.position-right .presence-bubble::after {
  left: -12px;
  border-right-color: rgba(26, 26, 46, 0.85);
}

.position-left .presence-bubble::after {
  right: -12px;
  border-left-color: rgba(26, 26, 46, 0.85);
}

@keyframes bubbleIn {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
