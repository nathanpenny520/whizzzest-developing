<!-- 打字动画指示器组件 -->
<template>
  <div class="flex items-center gap-2 text-gray-500 text-sm py-2">
    <div class="flex gap-1">
      <div
        class="w-2 h-2 bg-red-500 rounded-full animate-typing"
        style="animation-delay: 0ms"
      ></div>
      <div
        class="w-2 h-2 bg-red-500 rounded-full animate-typing"
        style="animation-delay: 200ms"
      ></div>
      <div
        class="w-2 h-2 bg-red-500 rounded-full animate-typing"
        style="animation-delay: 400ms"
      ></div>
    </div>
    <span class="ml-2">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text?: string;
}>();
</script>

<style scoped>
.animate-typing {
  animation: typingBounce 1.4s infinite ease-in-out;
}

@keyframes typingBounce {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}
</style>