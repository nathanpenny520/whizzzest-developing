<!-- AI聊天主容器组件 - 支持拖动和调整大小 -->
<template>
  <!-- 聊天窗口 -->
  <div
    v-if="isOpen"
    ref="chatWindow"
    class="fixed bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-200 flex flex-col"
    :style="windowStyle"
    :class="[isOpen ? 'animate-slideUp' : '', isFullscreen ? 'fullscreen-mode' : '']"
  >
    <ChatHeader
      ref="chatHeader"
      :title="t('aiChat.title')"
      :subtitle="t('aiChat.subtitle')"
      @close="closeChat"
      @minimize="minimizeChat"
      @expand="toggleFullscreen"
      @mousedown="startDrag"
    />

    <div class="chat-body" :class="{ 'has-sidebar': isFullscreen && !sidebarCollapsed }">
      <!-- 对话历史侧边栏（全屏模式） -->
      <div
        v-if="isFullscreen && !sidebarCollapsed"
        class="conv-sidebar"
        :style="{ width: sidebarWidth + 'px' }"
      >
        <div class="conv-sidebar-header">
          <button @click="createConversation" class="conv-new-btn">
            + {{ t('aiChat.newChat') }}
          </button>
          <button @click="sidebarCollapsed = true" class="conv-collapse-btn">◀</button>
        </div>
        <div class="conv-list">
          <div
            v-for="conv in sortedConversations"
            :key="conv.id"
            class="conv-item"
            :class="{ active: conv.id === activeConvId }"
            @click="switchConversation(conv.id)"
          >
            <span v-if="conv.pinned" class="conv-pin">📌</span>
            <span class="conv-title">{{ conv.title || t('aiChat.newConversation') }}</span>
            <span class="conv-time">{{ formatTime(conv.updatedAt) }}</span>
            <!-- 三点菜单 -->
            <button
              class="conv-menu-btn"
              @click.stop="convMenuId === conv.id ? (convMenuId = '') : (convMenuId = conv.id)"
            >
              ⋯
            </button>
            <div v-if="convMenuId === conv.id" class="conv-menu">
              <button @click.stop="renameConv(conv.id)">✏️ {{ t('aiChat.rename') }}</button>
              <button @click.stop="togglePinConv(conv.id)">
                📌 {{ conv.pinned ? t('aiChat.unpin') : t('aiChat.pin') }}
              </button>
              <button @click.stop="deleteConv(conv.id)" class="danger">
                🗑️ {{ t('aiChat.delete') }}
              </button>
            </div>
          </div>
        </div>
        <div class="sidebar-resize" @mousedown="startSidebarResize" />
      </div>

      <!-- 折叠后展开按钮 -->
      <button
        v-if="isFullscreen && sidebarCollapsed"
        @click="sidebarCollapsed = false"
        class="sidebar-expand-btn"
      >
        ▶
      </button>

      <!-- 主聊天区 -->
      <div class="chat-main">
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 bg-gray-50">
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
            <ChatBubble v-for="msg in messages" :key="msg.id" :message="msg" />
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
        <div class="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" @mousedown="startResize">
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
      <!-- end chat-main -->
    </div>
    <!-- end chat-body -->
  </div>

  <!-- 最小化条（点击恢复） -->
  <div v-if="isMinimized && !isOpen" class="minimized-bar" @click="restoreFromMinimize">
    <HuaNuoCharacter :size="36" state="idle" />
    <span class="minimized-title">{{ t('aiChat.title') }}</span>
  </div>

  <!-- 浮动按钮（彻底关闭时显示） -->
  <AIChatButton
    v-if="!isOpen && !isMinimized"
    :show-greeting="showGreeting"
    @open-chat="openChat"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAIChat } from '@/composables/useAIChat'
import { useConversations } from '@/composables/useConversations'
import type { ChatMessage } from '@/types/aiChat'
import ChatHeader from './ChatHeader.vue'
import ChatBubble from './ChatBubble.vue'
import ChatInput from './ChatInput.vue'
import AIChatButton from './AIChatButton.vue'
import HuaNuoCharacter from '@/components/HuaNuoCharacter.vue'

const { t } = useI18n()

// 对话管理
const conv = useConversations()
const activeConvId = ref(conv.ensureActive())
const convMenuId = ref('')
const sidebarCollapsed = ref(false)
const sidebarWidth = ref(280)
let sidebarResizing = false
let _clearMessages: (() => void) | null = null
let _loadingConv = false

const sortedConversations = computed(() => conv.sorted())
function createConversation() {
  const id = conv.create()
  activeConvId.value = id
  if (_clearMessages) _clearMessages()
}
function switchConversation(id: string) {
  _loadingConv = true
  conv.switchTo(id)
  activeConvId.value = id
  convMenuId.value = ''
  const c = conv.active()
  if (c) messages.value = c.messages.map((m: ChatMessage) => ({ ...m }))
  setTimeout(() => {
    _loadingConv = false
  }, 100)
}
function renameConv(id: string) {
  const name = prompt(t('aiChat.renamePrompt'))
  if (name) conv.rename(id, name)
  convMenuId.value = ''
}
function deleteConv(id: string) {
  if (!confirm(t('aiChat.confirmDelete'))) return
  conv.remove(id)
  convMenuId.value = ''
  if (activeConvId.value === id) {
    const c = conv.active()
    if (c) {
      activeConvId.value = c.id
      messages.value = c.messages.map((m: ChatMessage) => ({ ...m }))
    } else {
      if (_clearMessages) _clearMessages()
      createConversation()
    }
  }
}
function togglePinConv(id: string) {
  conv.togglePin(id)
  convMenuId.value = ''
}
function formatTime(ts: number) {
  const d = new Date(ts)
  const now = new Date()
  if (d.toDateString() === now.toDateString())
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

// 侧边栏拖拽
function startSidebarResize(e: MouseEvent) {
  sidebarResizing = true
  e.preventDefault()
}
function handleSidebarMouseMove(e: MouseEvent) {
  if (!sidebarResizing) return
  const w = e.clientX
  if (w >= 180 && w <= 500) sidebarWidth.value = w
}
function handleSidebarMouseUp() {
  sidebarResizing = false
}

const {
  messages,
  isLoading,
  isOpen,
  hasMessages,
  sendMessage,
  openChat: _openChat,
  closeChat,
  minimizeChat: _minimizeChat,
  isMinimized,
  clearMessages: _cm,
} = useAIChat()
_clearMessages = _cm

// 对话消息自动保存
watch(
  messages,
  (msgs) => {
    if (activeConvId.value)
      conv.updateMessages(activeConvId.value, msgs as ChatMessage[], !_loadingConv)
  },
  { deep: true },
)

// 打开聊天时清除招呼
function openChat() {
  showGreeting.value = false
  if (greetingTimer) {
    clearTimeout(greetingTimer)
    greetingTimer = null
  }
  _openChat()
}
function minimizeChat() {
  _minimizeChat()
}
function restoreFromMinimize() {
  openChat()
}

// DOM引用
const messagesContainer = ref<HTMLElement | null>(null)
const chatInputRef = ref<{ clear: () => void } | null>(null)
const chatWindow = ref<HTMLElement | null>(null)
const chatHeader = ref<HTMLElement | null>(null)

// 窗口位置和大小状态
const isFullscreen = ref(false)
function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
}
function _openAiChat() {
  openChat()
  isFullscreen.value = true
}
;(window as unknown as Record<string, unknown>).__huaNuoOpen = _openAiChat
const windowPosition = ref({ x: 24, y: window.innerHeight - 580 - 24 }) // 左下角
const windowSize = ref({ width: 420, height: 560 })

// 拖拽和resize状态
const isDragging = ref(false)
const isResizing = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const resizeStart = ref({ x: 0, y: 0, width: 0, height: 0 })

// 最小/最大尺寸限制
const MIN_WIDTH = 360
const MIN_HEIGHT = 460
const MAX_WIDTH = 800
const MAX_HEIGHT = 800

// 计算窗口样式
const windowStyle = computed(() => {
  if (isFullscreen.value) {
    return { left: '0', top: '0', width: '100vw', height: '100vh', borderRadius: '0' }
  }
  return {
    left: `${windowPosition.value.x}px`,
    top: `${windowPosition.value.y}px`,
    width: `${windowSize.value.width}px`,
    height: `${windowSize.value.height}px`,
  }
})

// 快捷问题
const quickQuestions = computed(() => [
  t('aiChat.quickQ1'),
  t('aiChat.quickQ2'),
  t('aiChat.quickQ3'),
  t('aiChat.quickQ4'),
])

// 处理快捷问题点击
const handleQuickQuestion = (question: string) => {
  sendMessage(question)
}

// 开始拖拽
const startDrag = (event: MouseEvent) => {
  if (isFullscreen.value) return
  if (event.button !== 0) return

  isDragging.value = true
  dragOffset.value = {
    x: event.clientX - windowPosition.value.x,
    y: event.clientY - windowPosition.value.y,
  }

  // 阻止默认行为和冒泡
  event.preventDefault()
}

// 开始resize
const startResize = (event: MouseEvent) => {
  if (isFullscreen.value) return
  if (event.button !== 0) return

  isResizing.value = true
  resizeStart.value = {
    x: event.clientX,
    y: event.clientY,
    width: windowSize.value.width,
    height: windowSize.value.height,
  }

  event.preventDefault()
  event.stopPropagation()
}

// 处理鼠标移动
const handleMouseMove = (event: MouseEvent) => {
  if (isDragging.value) {
    // 计算新位置
    let newX = event.clientX - dragOffset.value.x
    let newY = event.clientY - dragOffset.value.y

    // 边界限制
    newX = Math.max(0, Math.min(newX, window.innerWidth - windowSize.value.width))
    newY = Math.max(0, Math.min(newY, window.innerHeight - windowSize.value.height))

    windowPosition.value = { x: newX, y: newY }
  }

  if (isResizing.value) {
    // 计算新尺寸
    const deltaX = event.clientX - resizeStart.value.x
    const deltaY = event.clientY - resizeStart.value.y

    let newWidth = resizeStart.value.width + deltaX
    let newHeight = resizeStart.value.height + deltaY

    // 尺寸限制
    newWidth = Math.max(MIN_WIDTH, Math.min(newWidth, MAX_WIDTH))
    newHeight = Math.max(MIN_HEIGHT, Math.min(newHeight, MAX_HEIGHT))

    windowSize.value = { width: newWidth, height: newHeight }

    // 同时调整位置，确保不超出屏幕
    let newX = windowPosition.value.x
    let newY = windowPosition.value.y
    newX = Math.max(0, Math.min(newX, window.innerWidth - newWidth))
    newY = Math.max(0, Math.min(newY, window.innerHeight - newHeight))
    windowPosition.value = { x: newX, y: newY }
  }
}

// 处理鼠标释放
const handleMouseUp = () => {
  isDragging.value = false
  isResizing.value = false
}

// 自动滚动到最新消息
watch(
  messages,
  async () => {
    await nextTick()
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  },
  { deep: true },
)

// 监听窗口大小变化
const handleWindowResize = () => {
  // 确保窗口不超出屏幕
  let newX = windowPosition.value.x
  let newY = windowPosition.value.y

  newX = Math.max(0, Math.min(newX, window.innerWidth - windowSize.value.width))
  newY = Math.max(0, Math.min(newY, window.innerHeight - windowSize.value.height))

  windowPosition.value = { x: newX, y: newY }
}

// 注册全局事件
// 主动招呼：15s 未打开且无历史消息
const showGreeting = ref(false)
let greetingTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  if (!hasMessages.value && !isOpen.value) {
    greetingTimer = setTimeout(() => {
      showGreeting.value = true
    }, 15000)
  }
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  window.addEventListener('resize', handleWindowResize)
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('open-ai-chat', _openAiChat)
  document.addEventListener('mousemove', handleSidebarMouseMove)
  document.addEventListener('mouseup', handleSidebarMouseUp)
})

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isFullscreen.value) {
    isFullscreen.value = false
  }
}

onUnmounted(() => {
  if (greetingTimer) clearTimeout(greetingTimer)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  window.removeEventListener('resize', handleWindowResize)
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('open-ai-chat', _openAiChat)
  document.removeEventListener('mousemove', handleSidebarMouseMove)
  document.removeEventListener('mouseup', handleSidebarMouseUp)
})
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

/* 全屏 + 侧边栏 */
.fullscreen-mode {
  border-radius: 0 !important;
}
.chat-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.chat-body.has-sidebar .chat-main {
  flex: 1;
}
.chat-main {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}
.conv-sidebar {
  display: flex;
  flex-direction: column;
  background: #1a1a2e;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  position: relative;
  overflow: hidden;
}
.conv-sidebar-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.conv-new-btn {
  flex: 1;
  padding: 6px 10px;
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}
.conv-collapse-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
}
.conv-list {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
}
.conv-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  cursor: pointer;
  transition: background 0.1s;
}
.conv-item:hover {
  background: rgba(255, 255, 255, 0.03);
}
.conv-item.active {
  background: rgba(245, 158, 11, 0.1);
}
.conv-pin {
  font-size: 10px;
  flex-shrink: 0;
}
.conv-title {
  flex: 1;
  font-size: 12px;
  color: #d1d5db;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.conv-item.active .conv-title {
  color: #f59e0b;
}
.conv-time {
  font-size: 10px;
  color: #6b7280;
  flex-shrink: 0;
}
.conv-menu-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 13px;
  padding: 2px 4px;
  border-radius: 4px;
}
.conv-menu-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}
.conv-menu {
  position: absolute;
  right: 8px;
  top: 32px;
  background: #1f2937;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 4px 0;
  z-index: 60;
  min-width: 100px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}
.conv-menu button {
  display: block;
  width: 100%;
  padding: 6px 12px;
  background: none;
  border: none;
  color: #d1d5db;
  font-size: 12px;
  text-align: left;
  cursor: pointer;
}
.conv-menu button:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}
.conv-menu button.danger {
  color: #ef4444;
}
.conv-menu button.danger:hover {
  background: rgba(239, 68, 68, 0.1);
}
.sidebar-resize {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 4px;
  cursor: col-resize;
  background: transparent;
}
.sidebar-resize:hover {
  background: rgba(245, 158, 11, 0.3);
}
.sidebar-expand-btn {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f59e0b;
  cursor: pointer;
  padding: 8px 4px;
  border-radius: 4px;
  font-size: 12px;
}

/* 最小化条（与浮动按钮区分） */
.minimized-bar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 45;
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.9), rgba(217, 119, 6, 0.9));
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  padding: 8px 18px;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 0.3s ease-out;
}
.minimized-bar:hover {
  transform: translateX(-50%) scale(1.03);
}
.minimized-title {
  font-size: 13px;
  color: #fff;
  font-weight: 600;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
