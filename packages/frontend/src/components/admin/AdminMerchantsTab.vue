<template>
  <div class="tab-content">
    <div v-for="m in merchants" :key="m.id" class="card">
      <div class="card-info">
        <strong>{{ m.name }}</strong>
        <span
          >{{ m.category }} | {{ m.isVerified ? $t('admin.verified') : $t('admin.pending') }}</span
        >
      </div>
      <div class="card-actions">
        <button
          v-if="!m.isVerified"
          @click="$emit('verify', m.id, true)"
          :disabled="actionLoading"
          class="btn approve"
        >
          {{ $t('admin.approve') }}
        </button>
        <button
          v-if="m.isVerified"
          @click="$emit('verify', m.id, false)"
          :disabled="actionLoading"
          class="btn reject"
        >
          {{ $t('admin.revoke') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  merchants: { id: string; name: string; category: string; isVerified: boolean }[]
  actionLoading: boolean
}>()

defineEmits<{
  (e: 'verify', id: string, isVerified: boolean): void
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
.card-actions {
  display: flex;
  gap: 6px;
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
.btn.approve {
  background: #059669;
  color: #fff;
}
.btn.reject {
  background: #dc2626;
  color: #fff;
}
</style>
