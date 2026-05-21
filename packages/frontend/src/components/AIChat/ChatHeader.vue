<!-- AI聊天头部组件 -->
<template>
  <div
    class="bg-red-600 text-white px-4 py-3 flex items-center justify-between cursor-move select-none"
    @mousedown="$emit('mousedown', $event)"
  >
    <div class="flex items-center gap-3">
      <!-- AI图标 -->
      <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>

      <!-- 标题 -->
      <div>
        <h3 class="font-semibold text-sm">{{ title }}</h3>
        <p class="text-xs text-white text-opacity-80">{{ subtitle }}</p>
      </div>
    </div>

    <!-- 控制按钮 -->
    <div class="flex items-center gap-2">
      <!-- 最小化按钮 -->
      <button
        @click.stop="$emit('minimize')"
        @mousedown.stop
        class="w-8 h-8 hover:bg-white hover:bg-opacity-20 rounded-full flex items-center justify-center transition-colors"
        aria-label="最小化"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 12H4"
          />
        </svg>
      </button>

      <!-- 关闭按钮 -->
      <button
        @click.stop="$emit('close')"
        @mousedown.stop
        class="w-8 h-8 hover:bg-white hover:bg-opacity-20 rounded-full flex items-center justify-center transition-colors"
        aria-label="关闭"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
}>();

defineEmits<{
  (e: 'minimize'): void;
  (e: 'close'): void;
  (e: 'mousedown', event: MouseEvent): void;
}>();
</script>