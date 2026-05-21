<template>
  <div class="leaderboard">
    <h3 class="lb-title">{{ isZh ? '热门烟花' : 'Popular Fireworks' }}</h3>
    <!-- Sort + Search -->
    <div class="lb-controls">
      <div class="lb-sorts">
        <button v-for="s in sortOptions" :key="s.value" class="lb-sort-btn"
          :class="{ active: currentSort === s.value }" @click="currentSort = s.value; fetchData()">
          {{ isZh ? s.labelZh : s.labelEn }}
        </button>
      </div>
      <input v-model="searchText" class="lb-search" :placeholder="isZh ? '搜索...' : 'Search...'"
        @keyup.enter="fetchData" />
    </div>
    <div class="lb-list" v-if="recipes.length > 0">
      <div v-for="(r, i) in recipes" :key="r.id" class="lb-item" @click="openRecipe(r.shareSlug)">
        <span class="lb-rank" :class="`rank-${i + 1}`">{{ i + 1 }}</span>
        <div class="lb-info">
          <span class="lb-name">{{ r.title }}</span>
          <span class="lb-author">{{ r.authorName || (isZh ? '游客' : 'Visitor') }}</span>
        </div>
        <span class="lb-views">{{ r.viewCount }} 👁 {{ r.likeCount ?? 0 }} ❤️</span>
      </div>
    </div>
    <p v-else class="lb-empty">{{ isZh ? '暂无配方' : 'No recipes yet' }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/api/client'

const { locale } = useI18n()
const isZh = computed(() => (locale.value as string) === 'zh-CN')

const sortOptions = [
  { value: 'views', labelZh: '最热', labelEn: 'Hot' },
  { value: 'likes', labelZh: '最赞', labelEn: 'Liked' },
  { value: 'newest', labelZh: '最新', labelEn: 'New' },
]

interface RecipeSummary {
  id: string; title: string; shareSlug: string
  viewCount: number; likeCount?: number; authorName: string
}

const recipes = ref<RecipeSummary[]>([])
const currentSort = ref('views')
const searchText = ref('')

async function fetchData() {
  try {
    const params = new URLSearchParams({ sort: currentSort.value, limit: '10' })
    if (searchText.value.trim()) params.set('search', searchText.value.trim())
    const res = await api.get(`/fireworks/popular?${params.toString()}`)
    recipes.value = res.data.data || []
  } catch { /* ignore */ }
}

onMounted(() => { fetchData() })

function openRecipe(slug: string) {
  window.open(`/firework/share/${slug}`, '_blank')
}
</script>

<style scoped>
.leaderboard { padding: 16px 0; }
.lb-title { font-size: 14px; font-weight: 600; color: #9ca3af; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 0.5px; }

.lb-controls { display: flex; gap: 8px; margin-bottom: 12px; align-items: center; }
.lb-sorts { display: flex; gap: 4px; }
.lb-sort-btn { padding: 4px 10px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08); border-radius: 6px; color: #9ca3af; font-size: 11px; cursor: pointer; transition: all .15s; }
.lb-sort-btn.active { background: rgba(245,158,11,.15); border-color: rgba(245,158,11,.3); color: #f59e0b; }
.lb-sort-btn:hover:not(.active) { color: #e2e8f0; }
.lb-search { flex: 1; padding: 5px 10px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: 6px; color: #fff; font-size: 12px; outline: none; min-width: 0; }
.lb-search:focus { border-color: #f59e0b; }

.lb-list { display: flex; flex-direction: column; gap: 8px; }
.lb-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: rgba(255,255,255,.03); border-radius: 10px; cursor: pointer; transition: background .2s; }
.lb-item:hover { background: rgba(255,255,255,.08); }
.lb-rank { width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; background: rgba(255,255,255,.05); color: #9ca3af; flex-shrink: 0; }
.lb-rank.rank-1 { background: #f59e0b; color: #1a1a2e; }
.lb-rank.rank-2 { background: #9ca3af; color: #1a1a2e; }
.lb-rank.rank-3 { background: #cd853f; color: #1a1a2e; }
.lb-info { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.lb-name { font-size: 13px; color: #e2e8f0; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lb-author { font-size: 11px; color: #6b7280; }
.lb-views { font-size: 11px; color: #6b7280; white-space: nowrap; }
.lb-empty { color: #6b7280; font-size: 13px; text-align: center; padding: 12px 0; }
</style>
