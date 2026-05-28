<template>
  <div class="coupon-card">
    <div class="coupon-merchant">{{ displayName }}</div>
    <div class="coupon-title">{{ displayTitle }}</div>
    <div class="coupon-meta">
      <span>{{ t('coupon.discount') }}: {{ coupon.discount }}%</span>
      <span>{{ t('coupon.remaining') }}: {{ remaining }}/{{ coupon.totalStock }}</span>
    </div>
    <button class="coupon-claim" @click="handleClaim" :disabled="isClaimed || remaining <= 0">
      {{
        isClaimed ? t('coupon.claimed') : remaining <= 0 ? t('coupon.expired') : t('coupon.claim')
      }}
    </button>
    <p v-if="errorMsg" class="claim-error-msg">{{ errorMsg }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/api/client'
import { extractErrorMessage } from '@/utils/extractErrorMessage'
import { useAuthStore } from '@/stores/auth'
import type { ICouponWithMerchant } from '@/types/coupon'

const props = defineProps<{
  coupon: ICouponWithMerchant
  preClaimed?: boolean
}>()

const emit = defineEmits<{
  (e: 'claimed', id: string): void
  (e: 'error', id: string, msg: string): void
}>()

const { t, locale } = useI18n()
const auth = useAuthStore()
const isClaimed = ref(props.preClaimed || false)
const localUsed = ref(props.coupon.usedStock)
const errorMsg = ref('')

// 响应父组件 prop 变化（刷新后异步加载 claimedIds）
watch(
  () => props.preClaimed,
  (v) => {
    isClaimed.value = v || false
  },
)
// 响应后端数据变化（库存更新）
watch(
  () => props.coupon.usedStock,
  (v) => {
    if (!isClaimed.value) localUsed.value = v
  },
)

const remaining = computed(() => Math.max(0, props.coupon.totalStock - localUsed.value))
const displayName = computed(() =>
  locale.value === 'en' && props.coupon.merchant?.nameEn
    ? props.coupon.merchant.nameEn
    : props.coupon.merchant?.name || '',
)
const displayTitle = computed(() =>
  locale.value === 'en' && props.coupon.titleEn ? props.coupon.titleEn : props.coupon.title,
)

async function handleClaim() {
  if (!auth.isLoggedIn) {
    auth.requireLogin(() => handleClaim(), 'get_coupon')
    return
  }
  if (remaining.value <= 0) return
  errorMsg.value = ''
  try {
    await api.post(`/coupons/${props.coupon.id}/claim`, {
      locale: (locale.value as string) === 'en' ? 'en' : 'zh',
    })
    isClaimed.value = true
    localUsed.value++
    emit('claimed', props.coupon.id)
  } catch (e: unknown) {
    const msg = extractErrorMessage(e, '')
    if (
      msg.includes('已领取') ||
      msg.includes('Claimed') ||
      msg.includes('已领完') ||
      msg.includes('sold out')
    ) {
      isClaimed.value = true
      if (msg.includes('已领完') || msg.includes('sold out')) {
        localUsed.value = props.coupon.totalStock
      }
    }
    errorMsg.value = msg || t('common.saveFailed')
    emit('error', props.coupon.id, errorMsg.value)
  }
}
</script>

<style scoped>
.coupon-card {
  background: linear-gradient(135deg, #1a1a2e 0%, #2d1f3d 100%);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 14px;
  padding: 20px;
  color: #fff;
}
.coupon-merchant {
  font-size: 11px;
  color: #f59e0b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}
.coupon-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
}
.coupon-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 14px;
}
.coupon-claim {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #dc2626, #d97706);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.coupon-claim:disabled {
  opacity: 0.4;
  cursor: default;
}
.claim-error-msg {
  color: #ef4444;
  font-size: 12px;
  margin: 8px 0 0;
  text-align: center;
}
</style>
