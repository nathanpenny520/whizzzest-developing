<!-- AI聊天浮动入口按钮 -->
<template>
  <button
    @click="$emit('click')"
    class="fixed bottom-6 left-6 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-40 group"
    :class="{ 'scale-0 opacity-0': hidden }"
    aria-label="打开AI助手"
  >
    <!-- AI图标 -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-7 h-7 transition-transform group-hover:scale-110"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
      />
    </svg>

    <!-- 提示文字 -->
    <span
      class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
    >
      ?
    </span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  hidden?: boolean;
}>();

defineEmits<{
  (e: 'click'): void;
}>();
</script>

<style scoped>
button {
  animation: fadeInUp 0.3s ease-out;
}

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
</style>