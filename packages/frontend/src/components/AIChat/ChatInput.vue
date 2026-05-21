<!-- 聊天输入框组件 -->
<template>
  <div class="border-t border-gray-200 bg-white px-4 py-3">
    <form @submit.prevent="handleSubmit" class="flex items-center gap-3">
      <!-- 输入框 -->
      <input
        v-model="inputText"
        type="text"
        :placeholder="placeholder"
        :disabled="disabled"
        class="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        maxlength="500"
      />

      <!-- 发送按钮 -->
      <button
        type="submit"
        :disabled="disabled || !inputText.trim()"
        class="w-10 h-10 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all"
        aria-label="发送"
      >
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
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  placeholder?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'send', text: string): void;
}>();

const inputText = ref('');

// 监听disabled状态，重置输入框
watch(() => props.disabled, (newVal) => {
  if (!newVal && inputText.value) {
    // 可以保持输入内容，用户可以继续编辑
  }
});

const handleSubmit = () => {
  const text = inputText.value.trim();
  if (text && !props.disabled) {
    emit('send', text);
    inputText.value = '';
  }
};

// 暴露清空方法
defineExpose({
  clear: () => {
    inputText.value = '';
  }
});
</script>