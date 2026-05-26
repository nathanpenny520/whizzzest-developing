<template>
  <div class="dashboard">
    <h1>{{ merchant?.name || t('merchantDashboard.pageTitle') }}</h1>
    <div class="tabs">
      <button
        v-for="tb in tabs"
        :key="tb.key"
        @click="tab = tb.key"
        :class="{ active: tab === tb.key }"
      >
        {{ $t(tb.key) }}
      </button>
    </div>

    <!-- 概览 -->
    <div v-if="tab === 'merchantDashboard.overview'" class="tab-content">
      <div class="stat-cards">
        <div class="stat">
          <span class="num">{{ myCoupons.length }}</span
          ><span>{{ t('merchantDashboard.totalCoupons') }}</span>
        </div>
        <div class="stat">
          <span class="num">{{ redeemedCount }}</span
          ><span>{{ t('merchantDashboard.redeemed') }}</span>
        </div>
      </div>
    </div>

    <!-- 店铺信息 -->
    <div v-if="tab === 'merchantDashboard.storeInfo'" class="tab-content">
      <form @submit.prevent="updateInfo" class="form">
        <label>{{ t('merchantDashboard.name') }} <input v-model="edit.name" /></label>
        <label>{{ t('merchantDashboard.phone') }} <input v-model="edit.phone" /></label>
        <label>{{ t('merchantDashboard.hours') }} <input v-model="edit.businessHours" /></label>
        <label
          >{{ t('merchantDashboard.description') }} <textarea v-model="edit.description" rows="3" />
        </label>
        <button type="submit" class="btn primary">{{ t('merchantDashboard.save') }}</button>
      </form>
    </div>

    <!-- 优惠券管理 -->
    <div v-if="tab === 'merchantDashboard.couponMgmt'" class="tab-content">
      <div v-if="couponError" class="error-msg">{{ couponError }}</div>
      <div class="form" style="margin-bottom: 20px">
        <h3>{{ t('merchantDashboard.publishNew') }}</h3>
        <label>{{ t('merchantDashboard.title') }} <input v-model="newCoupon.title" /></label>
        <label
          >{{ t('merchantDashboard.discount') }}
          <input v-model.number="newCoupon.discount" type="number"
        /></label>
        <label
          >{{ t('merchantDashboard.stock') }}
          <input v-model.number="newCoupon.totalStock" type="number"
        /></label>
        <label
          >{{ t('merchantDashboard.expires') }} <input v-model="newCoupon.expiresAt" type="date"
        /></label>
        <button @click="createCoupon" class="btn primary" :disabled="publishing">
          {{ publishing ? '...' : t('merchantDashboard.publish') }}
        </button>
      </div>
      <div v-for="c in myCoupons" :key="c.id" class="coupon-card">
        <div>
          <strong>{{ c.title }}</strong>
          <span
            >{{ t('merchantDashboard.stock') }}: {{ c.totalStock }} |
            {{ t('merchantDashboard.used') }}: {{ c.usedStock }} |
            {{ t('merchantDashboard.expires') }}:
            {{ new Date(c.expiresAt).toLocaleDateString() }}</span
          >
        </div>
        <button @click="deleteCoupon(c.id)" class="btn-delete" :disabled="deletingId === c.id">
          {{ deletingId === c.id ? '...' : t('admin.delete') }}
        </button>
      </div>
    </div>

    <!-- 核销 -->
    <div v-if="tab === 'merchantDashboard.redeemTool'" class="tab-content">
      <div class="form">
        <label
          >{{ t('merchantDashboard.redeemCode') }}
          <input v-model="redeemCode" placeholder="XXXXXXXX"
        /></label>
        <button @click="doRedeem" class="btn primary" :disabled="redeeming">
          {{ redeeming ? '...' : t('merchantDashboard.redeem') }}
        </button>
        <p v-if="redeemMsg">{{ redeemMsg }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/api/client'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const authStore = useAuthStore()
const tabs = [
  { key: 'merchantDashboard.overview' },
  { key: 'merchantDashboard.storeInfo' },
  { key: 'merchantDashboard.couponMgmt' },
  { key: 'merchantDashboard.redeemTool' },
]
const tab = ref('merchantDashboard.overview')
const merchant = ref<{
  id: string
  name: string
  isVerified: boolean
  phone?: string
  businessHours?: string
  description?: string
} | null>(null)
const myCoupons = ref<
  { id: string; title: string; totalStock: number; usedStock: number; expiresAt: string }[]
>([])
const edit = ref({ name: '', phone: '', businessHours: '', description: '' })
const newCoupon = ref({ title: '', discount: 10, totalStock: 100, expiresAt: '' })
const redeemCode = ref('')
const redeeming = ref(false)
const redeemMsg = ref('')
const couponError = ref('')
const publishing = ref(false)
const deletingId = ref<string | null>(null)
const redeemedCount = computed(() => myCoupons.value.reduce((s, c) => s + c.usedStock, 0))

onMounted(async () => {
  try {
    const m = await api.get('/merchants/me')
    merchant.value = m.data.data
    edit.value = {
      name: merchant.value!.name,
      phone: merchant.value!.phone || '',
      businessHours: merchant.value!.businessHours || '',
      description: merchant.value!.description || '',
    }
    myCoupons.value = (await api.get('/coupons/merchant')).data.data
  } catch {
    /* not a merchant yet */
  }
})

async function updateInfo() {
  await api.put('/merchants/me', edit.value)
  await authStore.fetchProfile() // 刷新昵称
  alert(t('merchantDashboard.savedMsg'))
}
async function createCoupon() {
  couponError.value = ''
  publishing.value = true
  try {
    await api.post('/coupons', {
      ...newCoupon.value,
      expiresAt: new Date(newCoupon.value.expiresAt).toISOString(),
    })
    newCoupon.value = { title: '', discount: 10, totalStock: 100, expiresAt: '' }
    // Add timestamp to bypass cache
    myCoupons.value = (await api.get('/coupons/merchant', { params: { _t: Date.now() } })).data.data
  } catch (e: unknown) {
    const msg = (e as { response?: { data?: { message?: string } } }).response?.data?.message
    couponError.value = msg || t('admin.loadError')
  } finally {
    publishing.value = false
  }
}
async function deleteCoupon(id: string) {
  deletingId.value = id
  try {
    await api.delete(`/coupons/${id}`)
    myCoupons.value = myCoupons.value.filter((c) => c.id !== id)
  } catch {
    couponError.value = t('admin.loadError')
  } finally {
    deletingId.value = null
  }
}
async function doRedeem() {
  redeeming.value = true
  try {
    const r = await api.post('/coupons/redeem', { redeemCode: redeemCode.value })
    redeemMsg.value = r.data.code === 0 ? t('merchantDashboard.redeemSuccess') : r.data.message
  } catch (e: unknown) {
    redeemMsg.value =
      (e as { response?: { data?: { message?: string } } }).response?.data?.message || 'Error'
  }
  redeeming.value = false
}
</script>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}
h1 {
  font-size: 24px;
  margin-bottom: 20px;
}
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.tabs button {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
}
.tabs button.active {
  background: #dc2626;
  color: #fff;
  border-color: #dc2626;
}
.tab-content {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.stat-cards {
  display: flex;
  gap: 16px;
}
.stat {
  flex: 1;
  padding: 20px;
  background: #f9fafb;
  border-radius: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: #6b7280;
}
.stat .num {
  font-size: 28px;
  font-weight: 700;
  color: #dc2626;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.form label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
}
.form input,
.form textarea {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
}
.form input:focus,
.form textarea:focus {
  border-color: #f59e0b;
}
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}
.btn.primary {
  background: linear-gradient(135deg, #dc2626, #d97706);
  color: #fff;
  font-weight: 600;
}
.coupon-card {
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.coupon-card > div:first-child {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}
.coupon-card > div:first-child span {
  font-size: 12px;
  color: #6b7280;
}
.btn-delete {
  padding: 4px 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  background: #dc2626;
  color: #fff;
  white-space: nowrap;
}
.btn-delete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.error-msg {
  background: #fef2f2;
  color: #dc2626;
  padding: 8px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
}
</style>
