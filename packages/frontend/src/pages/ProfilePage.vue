<template>
  <div class="profile-page">
    <h1>{{ t('profile.pageTitle') }}</h1>
    <div v-if="loading" class="loading">{{ t('admin.loading') }}</div>
    <div v-else class="profile-card">
      <div class="avatar-section">
        <div class="avatar-circle" :style="avatarStyle">{{ initial }}</div>
        <label class="field">
          <span>{{ t('profile.avatarUrl') }}</span>
          <input v-model="edit.avatarUrl" :placeholder="t('profile.avatarUrl')" />
        </label>
      </div>
      <div class="form">
        <div class="field">
          <span class="field-label">{{ t('profile.nickname') }}</span>
          <input v-model="edit.nickname" :placeholder="t('profile.nicknamePlaceholder')" />
        </div>
        <div class="field">
          <span class="field-label">{{ t('profile.email') }}</span>
          <input :value="profile.email" disabled class="disabled" />
        </div>
        <div class="field">
          <span class="field-label">{{ t('profile.phone') }}</span>
          <input :value="profile.phone" disabled class="disabled" />
        </div>
        <div class="field">
          <span class="field-label">{{ t('profile.role') }}</span>
          <input :value="roleLabel" disabled class="disabled" />
        </div>
        <div class="field" v-if="profile.createdAt">
          <span class="field-label">{{ t('profile.createdAt') }}</span>
          <input
            :value="new Date(profile.createdAt).toLocaleDateString()"
            disabled
            class="disabled"
          />
        </div>
        <button @click="save" class="save-btn" :disabled="saving">
          {{ saving ? '...' : t('profile.save') }}
        </button>
        <p v-if="msg" class="msg">{{ msg }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/api/client'
import { extractErrorMessage } from '@/utils/extractErrorMessage'
import { useAuthStore } from '@/stores/auth'

const { t, locale } = useI18n()
const auth = useAuthStore()
const loading = ref(true)
const saving = ref(false)
const msg = ref('')

const profile = ref<{
  id: string
  nickname: string
  email?: string
  phone?: string
  role: string
  avatarUrl?: string
  createdAt?: string
}>({
  id: '',
  nickname: '',
  role: 'TOURIST',
})
const edit = ref({ nickname: '', avatarUrl: '' })

const initial = computed(() => profile.value.nickname?.charAt(0)?.toUpperCase() || '?')
const avatarStyle = computed(() =>
  profile.value.avatarUrl
    ? { backgroundImage: `url(${profile.value.avatarUrl})`, backgroundSize: 'cover' }
    : {},
)

const roleMap: Record<string, Record<string, string>> = {
  zh: { TOURIST: '游客', MERCHANT: '商户', ADMIN: '管理员' },
  en: { TOURIST: 'Tourist', MERCHANT: 'Merchant', ADMIN: 'Admin' },
}
const roleLabel = computed(() => {
  const lang = (locale.value as string) === 'en' ? 'en' : 'zh'
  return roleMap[lang][profile.value.role] || profile.value.role
})

onMounted(async () => {
  try {
    const r = await api.get('/users/me')
    profile.value = r.data.data
    edit.value = { nickname: profile.value.nickname, avatarUrl: profile.value.avatarUrl || '' }
  } catch {
    /* */
  }
  loading.value = false
})

async function save() {
  saving.value = true
  msg.value = ''
  try {
    await api.put('/users/me', {
      nickname: edit.value.nickname,
      avatarUrl: edit.value.avatarUrl || undefined,
    })
    profile.value.nickname = edit.value.nickname
    profile.value.avatarUrl = edit.value.avatarUrl
    await auth.fetchProfile()
    msg.value = t('profile.saved')
  } catch (e: unknown) {
    msg.value = extractErrorMessage(e, 'Error')
  }
  saving.value = false
}
</script>

<style scoped>
.profile-page {
  max-width: 500px;
  margin: 0 auto;
  padding: 40px 20px;
}
h1 {
  font-size: 24px;
  margin-bottom: 24px;
}
.loading {
  text-align: center;
  color: #6b7280;
  padding: 40px;
}
.profile-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}
.avatar-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #dc2626, #d97706);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.field-label {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
}
.field input {
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}
.field input:focus {
  border-color: #f59e0b;
}
.field input.disabled {
  background: #f9fafb;
  color: #9ca3af;
}
.save-btn {
  padding: 12px;
  background: linear-gradient(135deg, #dc2626, #d97706);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}
.save-btn:disabled {
  opacity: 0.5;
}
.msg {
  text-align: center;
  color: #059669;
  font-size: 13px;
}
</style>
