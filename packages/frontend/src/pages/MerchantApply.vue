<template>
  <div class="apply-page">
    <h1>{{ t('merchant.apply.title') }}</h1>
    <p class="subtitle">{{ t('merchant.apply.subtitle') }}</p>

    <form @submit.prevent="submit" class="apply-form">
      <label>
        {{ t('merchant.apply.storeName') }}
        <input
          v-model="form.name"
          required
          @invalid="
            (e) =>
              (e.target as HTMLInputElement).setCustomValidity(
                t('merchant.apply.requiredField', { field: t('merchant.apply.storeName') }),
              )
          "
          @input="(e) => (e.target as HTMLInputElement).setCustomValidity('')"
        />
      </label>
      <label>
        {{ t('merchant.apply.category') }}
        <select
          v-model="form.category"
          required
          @invalid="
            (e) =>
              (e.target as HTMLSelectElement).setCustomValidity(
                t('merchant.apply.requiredField', { field: t('merchant.apply.category') }),
              )
          "
          @change="(e) => (e.target as HTMLSelectElement).setCustomValidity('')"
        >
          <option value="dining">{{ t('merchant.apply.dining') }}</option>
          <option value="lodging">{{ t('merchant.apply.lodging') }}</option>
          <option value="firework">{{ t('merchant.apply.firework') }}</option>
          <option value="specialty">{{ t('merchant.apply.specialty') }}</option>
        </select>
      </label>
      <label>
        {{ t('merchant.apply.longitude') }}
        <input
          v-model.number="form.mapLng"
          type="number"
          step="0.0001"
          required
          @invalid="
            (e) =>
              (e.target as HTMLInputElement).setCustomValidity(
                t('merchant.apply.requiredField', { field: t('merchant.apply.longitude') }),
              )
          "
          @input="(e) => (e.target as HTMLInputElement).setCustomValidity('')"
      /></label>
      <label>
        {{ t('merchant.apply.latitude') }}
        <input
          v-model.number="form.mapLat"
          type="number"
          step="0.0001"
          required
          @invalid="
            (e) =>
              (e.target as HTMLInputElement).setCustomValidity(
                t('merchant.apply.requiredField', { field: t('merchant.apply.latitude') }),
              )
          "
          @input="(e) => (e.target as HTMLInputElement).setCustomValidity('')"
      /></label>
      <label> {{ t('merchant.apply.phone') }} <input v-model="form.phone" /></label>
      <label>
        {{ t('merchant.apply.businessHours') }}
        <input v-model="form.businessHours" placeholder="09:00-21:00"
      /></label>
      <label>
        {{ t('merchant.apply.description') }} <textarea v-model="form.description" rows="3" />
      </label>
      <label> {{ t('merchant.apply.coverImage') }} <input v-model="form.coverImage" /></label>

      <button type="submit" class="submit-btn" :disabled="loading">
        {{ loading ? t('merchant.apply.submitting') : t('merchant.apply.submit') }}
      </button>
    </form>

    <Transition name="fade">
      <p v-if="error" class="error">{{ error }}</p>
    </Transition>
    <Transition name="fade">
      <p v-if="success" class="success">{{ t('merchant.apply.success') }}</p>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { applyMerchant } from '@/api/merchants'
import { extractErrorMessage } from '@/utils/extractErrorMessage'

const { t } = useI18n()

const form = ref({
  name: '',
  category: 'dining',
  mapLng: 114.445,
  mapLat: 28.102,
  phone: '',
  businessHours: '',
  description: '',
  coverImage: '',
})
const loading = ref(false)
const error = ref('')
const success = ref(false)
let successTimer: ReturnType<typeof setTimeout> | null = null

onUnmounted(() => {
  if (successTimer) clearTimeout(successTimer)
})

async function submit() {
  error.value = ''
  success.value = false
  if (successTimer) {
    clearTimeout(successTimer)
    successTimer = null
  }

  loading.value = true
  try {
    await applyMerchant(form.value)
    success.value = true
    successTimer = setTimeout(() => {
      success.value = false
    }, 5000)
  } catch (e: unknown) {
    error.value = extractErrorMessage(e, t('merchant.apply.failed'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.apply-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
}
h1 {
  font-size: 24px;
  margin-bottom: 8px;
}
.subtitle {
  color: #6b7280;
  margin-bottom: 24px;
  font-size: 14px;
}
.apply-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.apply-form label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
}
.apply-form input,
.apply-form select,
.apply-form textarea {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}
.apply-form input:focus,
.apply-form select:focus,
.apply-form textarea:focus {
  border-color: #f59e0b;
}
.submit-btn {
  padding: 12px;
  background: linear-gradient(135deg, #dc2626, #d97706);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}
.submit-btn:disabled {
  opacity: 0.5;
}
.error {
  color: #dc2626;
  margin-top: 12px;
}
.success {
  color: #059669;
  margin-top: 12px;
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
