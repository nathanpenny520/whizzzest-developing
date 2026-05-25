import { ref, watch } from 'vue'
import type { ChatMessage } from '@/types/aiChat'
import { STORAGE_KEYS, HUANUO_CONFIG } from '@/constants/huaNuo'

export interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  pinned: boolean
  createdAt: number
  updatedAt: number
}

function load(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.conversations)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
function save(convs: Conversation[]) {
  localStorage.setItem(STORAGE_KEYS.conversations, JSON.stringify(convs))
}

export function useConversations() {
  const conversations = ref<Conversation[]>(load())
  const activeId = ref<string>(conversations.value[0]?.id || '')

  watch(conversations, (v) => save(v), { deep: true })

  function create(): string {
    const id = 'conv_' + Date.now().toString(36)
    const conv: Conversation = {
      id,
      title: '',
      messages: [],
      pinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    conversations.value.unshift(conv)
    activeId.value = id
    return id
  }

  function active() {
    return conversations.value.find((c) => c.id === activeId.value) || null
  }

  function switchTo(id: string) {
    activeId.value = id
  }

  function rename(id: string, title: string) {
    const c = conversations.value.find((c) => c.id === id)
    if (c) {
      c.title = title
      c.updatedAt = Date.now()
    }
  }

  function remove(id: string) {
    conversations.value = conversations.value.filter((c) => c.id !== id)
    if (activeId.value === id) {
      activeId.value = conversations.value[0]?.id || ''
    }
  }

  function togglePin(id: string) {
    const c = conversations.value.find((c) => c.id === id)
    if (c) {
      c.pinned = !c.pinned
      c.updatedAt = Date.now()
    }
  }

  function updateMessages(id: string, msgs: ChatMessage[], bumpTime = true) {
    const c = conversations.value.find((c) => c.id === id)
    if (c) {
      c.messages = msgs
      if (bumpTime) c.updatedAt = Date.now()
      if (!c.title && msgs.length > 0) {
        const first = msgs.find((m) => m.role === 'user')
        if (first) c.title = first.content.slice(0, HUANUO_CONFIG.conversationTitleMax)
      }
    }
  }

  /** 确保至少有一个对话 */
  function ensureActive() {
    if (!activeId.value || !conversations.value.find((c) => c.id === activeId.value)) {
      if (conversations.value.length === 0) create()
      else activeId.value = conversations.value[0].id
    }
    return activeId.value
  }

  const sorted = () => {
    return [...conversations.value].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      return b.updatedAt - a.updatedAt
    })
  }

  return {
    conversations,
    activeId,
    create,
    active,
    switchTo,
    rename,
    remove,
    togglePin,
    updateMessages,
    ensureActive,
    sorted,
  }
}
