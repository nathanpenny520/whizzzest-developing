/** LLM 调用参数 */
export const LLM_CONFIG = {
  temperature: 0.7,
  maxTokens: 1000,
  timeoutMs: 60_000,
} as const

/** RAG 上下文包装模板 */
export const USER_PROMPT_TEMPLATE = '参考以下信息回答问题：\n\n{context}\n\n用户问题：{question}'
