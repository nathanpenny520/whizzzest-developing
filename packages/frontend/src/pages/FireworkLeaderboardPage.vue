<template>
  <div class="lbp-page">
    <router-link :to="isEn ? '/en/firework' : '/firework'" class="lbp-back">
      ← {{ t('leaderboard.back') }}
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
.lbp-page { min-height: 100vh; background: #0a0a1a; padding: 40px 24px; }
.lbp-back { display: inline-block; color: #9ca3af; text-decoration: none; margin-bottom: 32px; font-size: 14px; transition: color .2s; }
.lbp-back:hover { color: #f59e0b; }
.lbp-hero { text-align: center; margin-bottom: 40px; }
.lbp-hero h1 { font-size: 28px; font-weight: 700; color: #fff; margin: 0 0 8px; }
.lbp-hero p { font-size: 14px; color: #6b7280; margin: 0; }
.lbp-content { max-width: 560px; margin: 0 auto; background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.06); border-radius: 20px; padding: 24px; }
</style>
