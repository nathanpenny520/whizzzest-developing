<!-- 聊天消息气泡组件 -->
<template>
  <div
    class="flex gap-3 mb-4"
    :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
  >
    <!-- AI头像（仅AI消息显示） -->
    <div
      v-if="message.role === 'assistant'"
      class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5 text-red-600"
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

    <!-- 消息内容 -->
    <div
      class="max-w-[80%] px-4 py-3 rounded-2xl"
      :class="[
        message.role === 'user'
          ? 'bg-red-600 text-white rounded-tr-sm'
          : 'bg-gray-100 text-gray-800 rounded-tl-sm',
        message.isTyping ? 'animate-pulse' : ''
      ]"
    >
      <!-- 正常消息 -->
      <!-- 用户消息：纯文本 -->
      <p
        v-if="message.role === 'user' && (!message.isTyping || message.content)"
        class="text-sm leading-relaxed whitespace-pre-wrap"
      >
        {{ message.content }}
      </p>
      <!-- AI消息：渲染markdown -->
      <div
        v-else-if="message.role === 'assistant' && (!message.isTyping || message.content)"
        class="text-sm leading-relaxed ai-message-content"
        v-html="renderedContent"
      ></div>

      <!-- 打字中状态 -->
      <div v-else class="flex items-center gap-2">
        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
      </div>
    </div>

    <!-- 用户头像（仅用户消息显示） -->
    <div
      v-if="message.role === 'user'"
      class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { marked } from 'marked';
import type { ChatMessage } from '@/types/aiChat';

const props = defineProps<{
  message: ChatMessage;
}>();

// 配置marked选项
marked.setOptions({
  breaks: true, // 支持换行
  gfm: true // 支持GitHub风格markdown
});

// 渲染markdown内容
const renderedContent = computed(() => {
  if (!props.message.content) return '';
  return marked.parse(props.message.content) as string;
});
</script>

<style scoped>
.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* AI消息markdown样式 */
.ai-message-content {
  word-wrap: break-word;
}

.ai-message-content h1,
.ai-message-content h2,
.ai-message-content h3 {
  font-weight: bold;
  margin-top: 0.5em;
  margin-bottom: 0.3em;
}

.ai-message-content h1 { font-size: 1.2em; }
.ai-message-content h2 { font-size: 1.1em; }
.ai-message-content h3 { font-size: 1.05em; }

.ai-message-content p {
  margin-bottom: 0.5em;
}

.ai-message-content ul,
.ai-message-content ol {
  margin-left: 1em;
  margin-bottom: 0.5em;
}

.ai-message-content li {
  margin-bottom: 0.2em;
}

.ai-message-content strong {
  font-weight: bold;
}

.ai-message-content em {
  font-style: italic;
}

.ai-message-content code {
  background: #f3f4f6;
  padding: 0.1em 0.3em;
  border-radius: 3px;
  font-size: 0.9em;
}

.ai-message-content hr {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 0.5em 0;
}
</style>