<template>
  <Transition name="modal">
    <div v-if="visible" class="modal-overlay" @click.self="cancel">
      <div class="modal-card">
        <!-- 花傩头像 -->
        <div class="huanuo-header">
          <HuaNuoCharacter :size="64" state="speaking" />
          <p class="huanuo-message">{{ huaNuoMessage }}</p>
        </div>

        <!-- Tab 切换 -->
        <div class="tab-bar">
          <button class="tab-btn active">{{ t('auth.emailLogin') }}</button>
          <button class="tab-btn disabled" :title="t('auth.phoneComingSoon')">
            {{ t('auth.phoneLogin') }}
          </button>
        </div>

        <!-- 表单 -->
        <form @submit.prevent="handleLogin" class="login-form">
          <label class="field">
            <span class="field-label">{{ t('auth.emailPlaceholder') }}</span>
            <input v-model="email" type="email" placeholder="user@example.com" class="input" />
          </label>
          <label class="field">
            <span class="field-label">{{ t('auth.codePlaceholder') }}</span>
            <div class="code-row">
              <input
                v-model="code"
                type="text"
                maxlength="6"
                placeholder="000000"
                class="input code-input"
              />
              <button
                type="button"
                class="send-code-btn"
                :disabled="countdown > 0 || !emailValid"
                @click="handleSendCode"
              >
                {{ countdown > 0 ? countdown + 's' : t('auth.sendCode') }}
              </button>
            </div>
          </label>
          <p v-if="isDev" class="code-hint">开发环境：万能码 000000</p>
          <p v-if="loginError" class="login-error">{{ loginError }}</p>
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? t('auth.loggingIn') : t('auth.loginOrRegister') }}
          </button>
        </form>

        <!-- 取消 -->
        <button class="cancel-btn" @click="cancel">
          {{ t('auth.later') }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import HuaNuoCharacter from '@/components/HuaNuoCharacter.vue'
import { extractErrorMessage } from '@/utils/extractErrorMessage'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()

const visible = ref(false)
const email = ref('')
const code = ref('')
const loading = ref(false)
const reason = ref('')
const countdown = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const isDev = import.meta.env.DEV
const emailValid = computed(() => /.+@.+\..+/.test(email.value))

const huaNuoMessage = computed(() => {
  return t(`auth.huaNuoMessages.${reason.value}`)
})

const authStore = useAuthStore()

function show(reasonText: string) {
  reason.value = reasonText
  visible.value = true
  email.value = ''
  code.value = ''
}

function cancel() {
  visible.value = false
  window.dispatchEvent(new CustomEvent('login-cancelled'))
}

const loginError = ref('')

async function handleSendCode() {
  if (!emailValid.value || countdown.value > 0) return
  loginError.value = ''
  const result = await authStore.sendCode(email.value)
  if (result.success) {
    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        if (timer) clearInterval(timer)
        timer = null
      }
    }, 1000)
  } else {
    loginError.value = result.message || t('auth.sendCodeFailed')
  }
}

async function handleLogin() {
  if (!email.value || !code.value) return
  loading.value = true
  loginError.value = ''
  try {
    await authStore.login(email.value, code.value)
    visible.value = false
  } catch (e: unknown) {
    loginError.value = extractErrorMessage(e, t('auth.loginFailed'))
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

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

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
  width: 380px;
  max-width: 90vw;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.huanuo-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.huanuo-message {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

.tab-bar {
  display: flex;
  gap: 0;
  margin-bottom: 20px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.tab-btn {
  flex: 1;
  padding: 8px 0;
  font-size: 13px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  background: #f9fafb;
  color: #6b7280;
  transition: all 0.2s;
}

.tab-btn.active {
  background: linear-gradient(135deg, #dc2626, #d97706);
  color: white;
}

.tab-btn.disabled {
  color: #d1d5db;
  cursor: not-allowed;
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
  gap: 8px;
  align-items: center;
}

.code-input {
  flex: 1;
  letter-spacing: 4px;
  font-size: 18px;
  text-align: center;
}

.send-code-btn {
  flex-shrink: 0;
  padding: 10px 14px;
  border: 1px solid #f59e0b;
  border-radius: 10px;
  background: #fff;
  color: #f59e0b;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.send-code-btn:hover:not(:disabled) {
  background: #f59e0b;
  color: #fff;
}

.send-code-btn:disabled {
  border-color: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}

.code-hint {
  font-size: 11px;
  color: #9ca3af;
  margin: -8px 0 0;
  text-align: left;
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
