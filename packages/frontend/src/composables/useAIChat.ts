// AI聊天状态管理composable
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { sendChatMessage } from '@/api/aiChat'
import { useHuaNuo } from '@/composables/useHuaNuo'
import type { ChatMessage } from '@/types/aiChat'

const STORAGE_KEY = 'huanuo_chat_history'

export function useAIChat() {
  const { locale } = useI18n()
  const { transition, handleAIResponse } = useHuaNuo()

  // 从 localStorage 恢复最近 20 条消息
  const saved = loadHistory()
  const messages = ref<ChatMessage[]>(saved)
  const isLoading = ref(false)
  const isOpen = ref(false)
  const isMinimized = ref(false)

  const lastMessage = computed(() => messages.value[messages.value.length - 1])
  const hasMessages = computed(() => messages.value.length > 0)

  // 持久化
  watch(messages, (val) => saveHistory(val), { deep: true })

  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const addMessage = (role: 'user' | 'assistant', content: string, isTyping = false): ChatMessage => {
    const message: ChatMessage = {
      id: generateId(),
      role,
      content,
      timestamp: new Date(),
      isTyping,
    }
    messages.value.push(message)
    return message
  }

  const updateMessage = (id: string, content: string, isTyping = false) => {
    const message = messages.value.find((m) => m.id === id)
    if (message) {
      message.content = content
      message.isTyping = isTyping
    }
  }

  /** 打字机效果：逐字渲染 */
  function typewriteMessage(id: string, fullText: string, speed = 30) {
    let pos = 0
    const interval = setInterval(() => {
      pos += 2 + Math.floor(Math.random() * 3) // 每次 2-4 字
      if (pos >= fullText.length) {
        updateMessage(id, fullText, false)
        clearInterval(interval)
      } else {
        updateMessage(id, fullText.slice(0, pos), true)
      }
    }, speed)
  }

  const sendMessage = async (question: string) => {
    if (!question.trim() || isLoading.value) return

    transition('listening')
    addMessage('user', question)
    isLoading.value = true
    transition('thinking')

    const typingMessage = addMessage('assistant', '', true)
    const typingMessageId = typingMessage.id

    try {
      const response = await sendChatMessage(question, locale.value)
      const reply = response.message

      // 打字机效果
      if (reply.length > 40) {
        typewriteMessage(typingMessageId, reply, 25)
      } else {
        updateMessage(typingMessageId, reply, false)
      }

      if (response.success) {
        handleAIResponse(response)
      }
    } catch (error) {
      console.error('Send message error:', error)
      const errorMsg =
        locale.value === 'en'
          ? 'Sorry, failed to generate a response. Please try again later.'
          : '抱歉，回答生成失败，请稍后再试。'
      updateMessage(typingMessageId, errorMsg, false)
    } finally {
      isLoading.value = false
    }
  }

  const clearMessages = () => {
    messages.value = []
    localStorage.removeItem(STORAGE_KEY)
  }

  const openChat = () => {
    isOpen.value = true
    isMinimized.value = false
  }

  const closeChat = () => {
    isOpen.value = false
  }

  const toggleChat = () => {
    if (isOpen.value) closeChat()
    else openChat()
  }

  const minimizeChat = () => {
    isOpen.value = false
    isMinimized.value = true
  }

  return {
    messages, isLoading, isOpen, isMinimized,
    lastMessage, hasMessages,
    sendMessage, clearMessages, openChat, closeChat, toggleChat, minimizeChat,
  }
}

function loadHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw).slice(-20)
  } catch {
    return []
  }
}

function saveHistory(msgs: ChatMessage[]) {
  try {
    const slim = msgs.slice(-20).map((m) => ({
      id: m.id, role: m.role, content: m.content, timestamp: m.timestamp,
    }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slim))
  } catch {
    /* quota exceeded, ignore */
  }
}
