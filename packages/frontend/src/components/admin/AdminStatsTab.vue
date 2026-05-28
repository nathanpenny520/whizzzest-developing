<template>
  <div class="tab-content">
    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-num">{{ stats.totalUsers }}</span
        ><span class="stat-label">{{ $t('admin.totalUsers') }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">{{ stats.todayNew }}</span
        ><span class="stat-label">{{ $t('admin.newToday') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  stats: { totalUsers: number; todayNew: number }
}>()
</script>

<style scoped>
.tab-content {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.stats-row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}
.stat-card {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.stat-num {
  font-size: 32px;
  font-weight: 700;
  color: #dc2626;
}
.stat-label {
  font-size: 13px;
  color: #6b7280;
}
</style>
