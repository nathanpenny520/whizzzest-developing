<template>
  <Transition name="modal">
    <div v-if="visible" class="modal-overlay" @click.self="cancel">
      <div class="modal-card">
        <!-- 花傩头像 -->
        <div class="huanuo-header">
          <HuaNuoCharacter :size="64" state="speaking" />
          <p class="huanuo-message">{{ huaNuoMessage }}</p>
        </div>

        <!-- 表单 -->
        <form @submit.prevent="handleLogin" class="login-form">
          <label class="field">
            <span class="field-label">手机号</span>
            <input v-model="phone" type="tel" maxlength="11" placeholder="请输入手机号"
              class="input" />
          </label>
          <label class="field">
            <span class="field-label">验证码</span>
            <div class="code-row">
              <input v-model="code" type="text" maxlength="6" placeholder="000000"
                class="input code-input" />
              <span class="code-hint">开发环境：万能码 000000</span>
            </div>
          </label>
          <p v-if="loginError" class="login-error">{{ loginError }}</p>
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? '登录中...' : '登录 / 注册' }}
          </button>
        </form>

        <!-- 取消 -->
        <button class="cancel-btn" @click="cancel">稍后再说</button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import HuaNuoCharacter from '@/components/HuaNuoCharacter.vue'
import { useAuthStore } from '@/stores/auth'

const visible = ref(false)
const phone = ref('')
const code = ref('')
const loading = ref(false)
const reason = ref('')

const huaNuoMessage = computed(() => {
  const messages: Record<string, string> = {
    save_firework: '我帮你把这场烟花永久留住～先跟我登记一下就好！',
    collect_firework: '想收藏的话先跟我登记一下～傩愿你的喜欢永远被记得！',
    get_coupon: '先跟我登记一下，券才好归你～',
    default: '跟花傩登记一下，就能解锁更多玩法啦～',
  }
  return messages[reason.value] || messages.default
})

const authStore = useAuthStore()

function show(reasonText: string) {
  reason.value = reasonText
  visible.value = true
  phone.value = ''
  code.value = ''
}

function cancel() {
  visible.value = false
  // 清除挂起操作
  window.dispatchEvent(new CustomEvent('login-cancelled'))
}

const loginError = ref('')

async function handleLogin() {
  if (!phone.value || !code.value) return
  loading.value = true
  loginError.value = ''
  try {
    await authStore.login(phone.value, code.value)
    visible.value = false
  } catch (e: unknown) {
    const msg = (e as { response?: { data?: { message?: string } } }).response?.data?.message
    loginError.value = msg || '登录失败，请稍后再试'
  } finally {
    loading.value = false
  }
}

// 监听全局事件
if (typeof window !== 'undefined') {
  window.addEventListener('show-login-modal', ((e: CustomEvent) => {
    show(e.detail?.reason || 'default')
  }) as EventListener)
}

defineExpose({ show, cancel })
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-card {
  background: #fff;
  border-radius: 20px;
  padding: 32px 24px 24px;
  width: 360px;
  max-width: 90vw;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.huanuo-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.huanuo-message {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
}

.field-label {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
}

.input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.input:focus {
  border-color: #f59e0b;
}

.code-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.code-input {
  letter-spacing: 4px;
  font-size: 18px;
  text-align: center;
}

.code-hint {
  font-size: 11px;
  color: #9ca3af;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #dc2626, #d97706);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.cancel-btn {
  margin-top: 12px;
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 13px;
  cursor: pointer;
}

.cancel-btn:hover {
  color: #6b7280;
}

/* Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-active .modal-card,
.modal-leave-active .modal-card {
  transition: transform 0.3s ease;
}
.modal-enter-from {
  opacity: 0;
}
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-card {
  transform: scale(0.9);
}
.modal-leave-to .modal-card {
  transform: scale(0.9);
}
.login-error {
  color: #ef4444;
  font-size: 13px;
  margin: 8px 0 0;
  text-align: center;
}
</style>
