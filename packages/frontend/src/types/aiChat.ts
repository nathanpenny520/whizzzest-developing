// AI聊天相关类型定义

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isOpen: boolean;
  isMinimized: boolean;
}

export interface AIResponse {
  success: boolean;
  message: string;
  sources?: string[];
}

export interface ChatRequest {
  question: string;
  locale: string;
}