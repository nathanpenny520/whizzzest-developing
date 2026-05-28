<template>
  <div class="tab-content">
    <div v-for="c in coupons" :key="c.id" class="card">
      <div class="card-info">
        <strong>{{ c.title }}</strong>
        <span
          >{{ c.merchant?.name }} | {{ $t('admin.discount') }}: {{ c.discount }}% |
          {{ $t('admin.stock') }}: {{ (c.totalStock ?? 0) - (c.usedStock ?? 0) }}/{{
            c.totalStock
          }}</span
        >
      </div>
      <button @click="$emit('deleteCoupon', c.id)" :disabled="actionLoading" class="btn reject">
        {{ $t('admin.delete') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ICouponWithMerchant } from '@/types/coupon'

defineProps<{
  coupons: ICouponWithMerchant[]
  actionLoading: boolean
}>()

defineEmits<{
  (e: 'deleteCoupon', id: string): void
}>()
</script>

<style scoped>
.tab-content {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  border-bottom: 1px solid #f3f4f6;
  gap: 12px;
}
.card-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}
.card-info span {
  font-size: 12px;
  color: #6b7280;
}
.card-info strong {
  font-size: 14px;
}
.btn {
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn.reject {
  background: #dc2626;
  color: #fff;
}
</style>
