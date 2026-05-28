<template>
  <div class="tab-content">
    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-num">{{ analytics.total }}</span
        ><span class="stat-label">{{ $t('admin.totalViews') }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">{{ analytics.recentViews }}</span
        ><span class="stat-label">{{ $t('admin.recentViews') }}</span>
      </div>
    </div>
    <div v-if="analytics.topPages.length > 0" class="analytics-pages">
      <h3>{{ $t('admin.topPages') }}</h3>
      <div v-for="p in analytics.topPages" :key="p.path" class="analytics-row">
        <span>{{ p.path }}</span>
        <span>{{ p._count.path }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  analytics: {
    total: number
    recentViews: number
    topPages: { path: string; _count: { path: number } }[]
  }
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
.analytics-pages {
  margin-top: 16px;
}
.analytics-pages h3 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}
.analytics-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
  font-size: 13px;
}
</style>
