// AI聊天状态管理composable
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { sendChatMessage } from '@/api/aiChat';
import type { ChatMessage } from '@/types/aiChat';

export function useAIChat() {
  const { locale } = useI18n();
  // 状态
  const messages = ref<ChatMessage[]>([]);
  const isLoading = ref(false);
  const isOpen = ref(false);
  const isMinimized = ref(false);

  // 计算属性
  const lastMessage = computed(() => messages.value[messages.value.length - 1]);
  const hasMessages = computed(() => messages.value.length > 0);

  // 生成唯一ID
  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // 添加消息
  const addMessage = (role: 'user' | 'assistant', content: string, isTyping = false): ChatMessage => {
    const message: ChatMessage = {
      id: generateId(),
      role,
      content,
      timestamp: new Date(),
      isTyping
    };
    messages.value.push(message);
    return message;
  };

  // 更新消息内容
  const updateMessage = (id: string, content: string, isTyping = false) => {
    const message = messages.value.find(m => m.id === id);
    if (message) {
      message.content = content;
      message.isTyping = isTyping;
    }
  };

  // 发送消息
  const sendMessage = async (question: string) => {
    if (!question.trim() || isLoading.value) return;

    // 添加用户消息
    addMessage('user', question);
    isLoading.value = true;

    // 添加AI思考状态消息，并保存其ID
    const typingMessage = addMessage('assistant', '', true);
    const typingMessageId = typingMessage.id;

    try {
      const response = await sendChatMessage(question, locale.value);

      // 更新AI消息内容
      updateMessage(typingMessageId, response.message, false);

      // 如果失败，可能需要显示错误状态
      if (!response.success) {
        console.warn('AI response unsuccessful:', response.message);
      }
    } catch (error) {
      console.error('Send message error:', error);
      const errorMsg = locale.value === 'en'
        ? 'Sorry, failed to generate response, please try again later.'
        : '抱歉，回答生成失败，请稍后再试。';
      updateMessage(typingMessageId, errorMsg, false);
    } finally {
      isLoading.value = false;
    }
  };

  // 清空消息
  const clearMessages = () => {
    messages.value = [];
  };

  // 打开聊天窗口
  const openChat = () => {
    isOpen.value = true;
    isMinimized.value = false;
  };

  // 关闭聊天窗口
  const closeChat = () => {
    isOpen.value = false;
  };

  // 切换聊天窗口状态
  const toggleChat = () => {
    if (isOpen.value) {
      closeChat();
    } else {
      openChat();
    }
  };

  // 最小化聊天窗口
  const minimizeChat = () => {
    isOpen.value = false;
    isMinimized.value = true;
  };

  return {
    // 状态
    messages,
    isLoading,
    isOpen,
    isMinimized,

    // 计算属性
    lastMessage,
    hasMessages,

    // 方法
    sendMessage,
    clearMessages,
    openChat,
    closeChat,
    toggleChat,
    minimizeChat
  };
}