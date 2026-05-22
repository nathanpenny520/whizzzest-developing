<template>
  <div class="lbp-page">
    <router-link :to="isEn ? '/en/firework' : '/firework'" class="lbp-back">
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      {{ t('leaderboard.back') }}
    </router-link>
    <div class="lbp-hero">
      <h1>{{ t('leaderboard.title') }}</h1>
      <p>{{ t('leaderboard.subtitle') }}</p>
    </div>
    <div class="lbp-content">
      <FireworkLeaderboard />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import FireworkLeaderboard from '@/components/FireworkLeaderboard.vue'

const route = useRoute()
const { t } = useI18n()
const isEn = computed(() => route.path.startsWith('/en'))
</script>

<style scoped>
.lbp-page {
  min-height: 100vh;
  background: linear-gradient(180deg, rgba(245, 158, 11, 0.04) 0%, #f9fafb 120px);
  padding: 40px 24px;
}
.lbp-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  text-decoration: none;
  margin-bottom: 32px;
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 20px;
  background: #fff;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}
.lbp-back:hover {
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.3);
  background: rgba(245, 158, 11, 0.04);
}
.lbp-hero {
  text-align: center;
  margin-bottom: 40px;
}
.lbp-hero h1 {
  font-size: 32px;
  font-weight: 800;
  color: #111827;
  margin: 0 0 12px;
  position: relative;
  display: inline-block;
}
.lbp-hero h1::after {
  content: '';
  display: block;
  width: 48px;
  height: 3px;
  background: #f59e0b;
  border-radius: 2px;
  margin: 10px auto 0;
}
.lbp-hero p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}
.lbp-content {
  max-width: 560px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid #f3f4f6;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
</style>
