<template>
  <div class="apply-page">
    <h1>{{ isZh ? '商户入驻申请' : 'Merchant Application' }}</h1>
    <p class="subtitle">{{ isZh ? '填写以下信息，审核通过后即可管理店铺和发布优惠券' : 'Fill in the details below. Once verified, you can manage your store and publish coupons.' }}</p>

    <form @submit.prevent="submit" class="apply-form">
      <label> {{ isZh ? '店铺名称' : 'Store Name' }} <input v-model="form.name" required /></label>
      <label> {{ isZh ? '分类' : 'Category' }}
        <select v-model="form.category" required>
          <option value="dining">{{ isZh ? '餐饮' : 'Dining' }}</option>
          <option value="lodging">{{ isZh ? '民宿' : 'Lodging' }}</option>
          <option value="firework">{{ isZh ? '烟花' : 'Firework' }}</option>
          <option value="specialty">{{ isZh ? '特产' : 'Specialty' }}</option>
        </select>
      </label>
      <label> {{ isZh ? '经度' : 'Longitude' }} <input v-model.number="form.mapLng" type="number" step="0.0001" required /></label>
      <label> {{ isZh ? '纬度' : 'Latitude' }} <input v-model.number="form.mapLat" type="number" step="0.0001" required /></label>
      <label> {{ isZh ? '电话' : 'Phone' }} <input v-model="form.phone" /></label>
      <label> {{ isZh ? '营业时间' : 'Business Hours' }} <input v-model="form.businessHours" placeholder="09:00-21:00" /></label>
      <label> {{ isZh ? '描述' : 'Description' }} <textarea v-model="form.description" rows="3" /></label>
      <label> {{ isZh ? '封面图URL' : 'Cover Image URL' }} <input v-model="form.coverImage" /></label>

      <button type="submit" class="submit-btn" :disabled="loading">
        {{ loading ? (isZh ? '提交中...' : 'Submitting...') : (isZh ? '提交申请' : 'Submit Application') }}
      </button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ isZh ? '申请已提交，等待审核！' : 'Application submitted. Awaiting review!' }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/api/client'

const { locale } = useI18n()
const isZh = computed(() => (locale.value as string) === 'zh-CN')

const form = ref({ name: '', category: 'dining', mapLng: 114.445, mapLat: 28.102, phone: '', businessHours: '', description: '', coverImage: '' })
const loading = ref(false)
const error = ref('')
const success = ref(false)

async function submit() {
  loading.value = true
  error.value = ''
  try {
    await api.post('/merchants/apply', form.value)
    success.value = true
  } catch (e: unknown) {
    error.value = (e as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.apply-page { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
h1 { font-size: 24px; margin-bottom: 8px; }
.subtitle { color: #6b7280; margin-bottom: 24px; font-size: 14px; }
.apply-form { display: flex; flex-direction: column; gap: 14px; }
.apply-form label { display: flex; flex-direction: column; gap: 4px; font-size: 13px; font-weight: 500; }
.apply-form input, .apply-form select, .apply-form textarea {
  padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; outline: none;
}
.apply-form input:focus, .apply-form select:focus, .apply-form textarea:focus { border-color: #f59e0b; }
.submit-btn { padding: 12px; background: linear-gradient(135deg, #dc2626, #d97706); color: #fff; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; }
.submit-btn:disabled { opacity: 0.5; }
.error { color: #dc2626; margin-top: 12px; }
.success { color: #059669; margin-top: 12px; }
</style>
