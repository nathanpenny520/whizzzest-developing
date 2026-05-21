<!-- AI聊天主容器组件 - 支持拖动和调整大小 -->
<template>
  <!-- 聊天窗口 -->
  <div
    v-if="isOpen"
    ref="chatWindow"
    class="fixed bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-200 flex flex-col"
    :style="windowStyle"
    :class="isOpen ? 'animate-slideUp' : ''"
  >
    <!-- 头部（可拖动） -->
    <ChatHeader
      ref="chatHeader"
      :title="t('aiChat.title')"
      :subtitle="t('aiChat.subtitle')"
      @close="closeChat"
      @minimize="minimizeChat"
      @mousedown="startDrag"
    />

    <!-- 消息区域 -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 bg-gray-50"
    >
      <!-- 欢迎区域 -->
      <div v-if="!hasMessages" class="text-center py-6">
        <!-- 欢迎图标 -->
        <div class="text-4xl mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-16 h-16 mx-auto text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <!-- 欢迎语 -->
        <p class="text-gray-600 mb-4 text-sm">{{ t('aiChat.welcome') }}</p>

        <!-- 快捷问题 -->
        <div class="flex flex-wrap gap-2 justify-center">
          <button
            v-for="(q, index) in quickQuestions"
            :key="index"
            @click="handleQuickQuestion(q)"
            class="px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-sm hover:bg-red-100 active:bg-red-200 transition-colors"
          >
            {{ q }}
          </button>
        </div>
      </div>

      <!-- 消息列表 -->
      <div v-else>
        <ChatBubble
          v-for="msg in messages"
          :key="msg.id"
          :message="msg"
        />
      </div>
    </div>

    <!-- 输入区域 -->
    <ChatInput
      ref="chatInputRef"
      :placeholder="t('aiChat.placeholder')"
      :disabled="isLoading"
      @send="sendMessage"
    />

    <!-- Resize手柄（右下角） -->
    <div
      class="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
      @mousedown="startResize"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-4 h-4 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
        />
      </svg>
    </div>
  </div>

  <!-- 浮动按钮（聊天窗口关闭时显示） -->
  <AIChatButton
    v-if="!isOpen"
    @click="openChat"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAIChat } from '@/composables/useAIChat';
import ChatHeader from './ChatHeader.vue';
import ChatBubble from './ChatBubble.vue';
import ChatInput from './ChatInput.vue';
import AIChatButton from './AIChatButton.vue';

const { t } = useI18n();
const {
  messages,
  isLoading,
  isOpen,
  hasMessages,
  sendMessage,
  openChat,
  closeChat,
  minimizeChat
} = useAIChat();

// DOM引用
const messagesContainer = ref<HTMLElement | null>(null);
const chatInputRef = ref<{ clear: () => void } | null>(null);
const chatWindow = ref<HTMLElement | null>(null);
const chatHeader = ref<HTMLElement | null>(null);

// 窗口位置和大小状态
const windowPosition = ref({ x: 24, y: window.innerHeight - 520 - 24 }); // 左下角
const windowSize = ref({ width: 350, height: 480 });

// 拖拽和resize状态
const isDragging = ref(false);
const isResizing = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const resizeStart = ref({ x: 0, y: 0, width: 0, height: 0 });

// 最小/最大尺寸限制
const MIN_WIDTH = 300;
const MIN_HEIGHT = 400;
const MAX_WIDTH = 600;
const MAX_HEIGHT = 700;

// 计算窗口样式
const windowStyle = computed(() => ({
  left: `${windowPosition.value.x}px`,
  top: `${windowPosition.value.y}px`,
  width: `${windowSize.value.width}px`,
  height: `${windowSize.value.height}px`
}));

// 快捷问题
const quickQuestions = computed(() => [
  t('aiChat.quickQ1'),
  t('aiChat.quickQ2'),
  t('aiChat.quickQ3')
]);

// 处理快捷问题点击
const handleQuickQuestion = (question: string) => {
  sendMessage(question);
};

// 开始拖拽
const startDrag = (event: MouseEvent) => {
  // 只响应左键
  if (event.button !== 0) return;

  isDragging.value = true;
  dragOffset.value = {
    x: event.clientX - windowPosition.value.x,
    y: event.clientY - windowPosition.value.y
  };

  // 阻止默认行为和冒泡
  event.preventDefault();
};

// 开始resize
const startResize = (event: MouseEvent) => {
  if (event.button !== 0) return;

  isResizing.value = true;
  resizeStart.value = {
    x: event.clientX,
    y: event.clientY,
    width: windowSize.value.width,
    height: windowSize.value.height
  };

  event.preventDefault();
  event.stopPropagation();
};

// 处理鼠标移动
const handleMouseMove = (event: MouseEvent) => {
  if (isDragging.value) {
    // 计算新位置
    let newX = event.clientX - dragOffset.value.x;
    let newY = event.clientY - dragOffset.value.y;

    // 边界限制
    newX = Math.max(0, Math.min(newX, window.innerWidth - windowSize.value.width));
    newY = Math.max(0, Math.min(newY, window.innerHeight - windowSize.value.height));

    windowPosition.value = { x: newX, y: newY };
  }

  if (isResizing.value) {
    // 计算新尺寸
    const deltaX = event.clientX - resizeStart.value.x;
    const deltaY = event.clientY - resizeStart.value.y;

    let newWidth = resizeStart.value.width + deltaX;
    let newHeight = resizeStart.value.height + deltaY;

    // 尺寸限制
    newWidth = Math.max(MIN_WIDTH, Math.min(newWidth, MAX_WIDTH));
    newHeight = Math.max(MIN_HEIGHT, Math.min(newHeight, MAX_HEIGHT));

    windowSize.value = { width: newWidth, height: newHeight };

    // 同时调整位置，确保不超出屏幕
    let newX = windowPosition.value.x;
    let newY = windowPosition.value.y;
    newX = Math.max(0, Math.min(newX, window.innerWidth - newWidth));
    newY = Math.max(0, Math.min(newY, window.innerHeight - newHeight));
    windowPosition.value = { x: newX, y: newY };
  }
};

// 处理鼠标释放
const handleMouseUp = () => {
  isDragging.value = false;
  isResizing.value = false;
};

// 自动滚动到最新消息
watch(messages, async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}, { deep: true });

// 监听窗口大小变化
const handleWindowResize = () => {
  // 确保窗口不超出屏幕
  let newX = windowPosition.value.x;
  let newY = windowPosition.value.y;

  newX = Math.max(0, Math.min(newX, window.innerWidth - windowSize.value.width));
  newY = Math.max(0, Math.min(newY, window.innerHeight - windowSize.value.height));

  windowPosition.value = { x: newX, y: newY };
};

// 注册全局事件
onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  window.addEventListener('resize', handleWindowResize);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
  window.removeEventListener('resize', handleWindowResize);
});
</script>

<style scoped>
.animate-slideUp {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* resize手柄样式 */
.cursor-se-resize:hover {
  background-color: rgba(220, 38, 38, 0.1);
}
</style>