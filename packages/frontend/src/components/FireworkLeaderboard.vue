<template>
  <div class="leaderboard">
    <h3 class="lb-title">
      {{ isZh ? '热门烟花' : 'Popular Fireworks' }}
      <span class="lb-sort-hint">· {{ currentSortLabel }}</span>
    </h3>
    <!-- Sort + Search -->
    <div class="lb-controls">
      <div class="lb-sorts">
        <button
          v-for="s in sortOptions"
          :key="s.value"
          class="lb-sort-btn"
          :class="{ active: currentSort === s.value }"
          @click="handleSort(s.value)"
        >
          {{ isZh ? s.labelZh : s.labelEn }}
        </button>
      </div>
      <input
        v-model="searchText"
        class="lb-search"
        :placeholder="isZh ? '搜索...' : 'Search...'"
        @keyup.enter="fetchData"
      />
      <button class="lb-search-btn" @click="fetchData" :title="isZh ? '搜索' : 'Search'">🔍</button>
    </div>
    <div class="lb-list" v-if="recipes.length > 0">
      <div v-for="(r, i) in recipes" :key="r.id" class="lb-item" @click="openRecipe(r.shareSlug)">
        <span class="lb-rank" :class="`rank-${i + 1}`">{{ i + 1 }}</span>
        <div class="lb-info">
          <span class="lb-name">{{ r.title }}</span>
          <span class="lb-author">{{ r.authorName || (isZh ? '游客' : 'Visitor') }}</span>
        </div>
        <button
          class="lb-like-btn"
          :class="{ liked: isLiked(r.shareSlug) }"
          @click.stop="handleLike(r)"
          :disabled="isLiked(r.shareSlug)"
        >
          {{ isLiked(r.shareSlug) ? '❤️' : '🤍' }} {{ r.likeCount ?? 0 }}
        </button>
        <span class="lb-views">{{ r.viewCount }} 👁</span>
      </div>
    </div>
    <p v-else class="lb-empty">
      {{ isZh ? '暂无配方，快去烟花工坊创作吧！' : 'No recipes yet. Create one!' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useIsZh } from '@/composables/useIsZh'
import { getPopularRecipes, likeFirework } from '@/api/fireworks'

const { isZh } = useIsZh()

const sortOptions = [
  { value: 'views', labelZh: '最热', labelEn: 'Hot' },
  { value: 'likes', labelZh: '最赞', labelEn: 'Liked' },
  { value: 'newest', labelZh: '最新', labelEn: 'New' },
]

const sortLabels: Record<string, { zh: string; en: string }> = {
  views: { zh: '按浏览量排序', en: 'Sorted by views' },
  likes: { zh: '按点赞数排序', en: 'Sorted by likes' },
  newest: { zh: '按发布时间排序', en: 'Sorted by newest' },
}

interface RecipeSummary {
  id: string
  title: string
  shareSlug: string
  viewCount: number
  likeCount?: number
  authorName: string
}

const recipes = ref<RecipeSummary[]>([])
const currentSort = ref('views')
const searchText = ref('')
const likedSlugs = ref<Record<string, boolean>>(
  JSON.parse(localStorage.getItem('wanzai_liked') || '{}'),
)
const localLikeCounts = ref<Record<string, number>>({})

const currentSortLabel = computed(() => {
  const s = sortLabels[currentSort.value]
  return isZh.value ? s?.zh : s?.en
})

function handleSort(value: string) {
  currentSort.value = value
  fetchData()
}

function isLiked(slug: string) {
  return !!likedSlugs.value[slug]
}

async function handleLike(r: RecipeSummary) {
  const slug = r.shareSlug
  if (likedSlugs.value[slug]) return
  try {
    await likeFirework(slug)
    likedSlugs.value = { ...likedSlugs.value, [slug]: true }
    localStorage.setItem('wanzai_liked', JSON.stringify(likedSlugs.value))
    localLikeCounts.value = {
      ...localLikeCounts.value,
      [slug]: (localLikeCounts.value[slug] || r.likeCount || 0) + 1,
    }
  } catch {
    /* ignore */
  }
}

async function fetchData() {
  try {
    const params = new URLSearchParams({ sort: currentSort.value, limit: '10' })
    if (searchText.value.trim()) params.set('search', searchText.value.trim())
    params.set('_t', String(Date.now()))
    const data = await getPopularRecipes({
      sort: currentSort.value,
      search: searchText.value.trim() || undefined,
      limit: 10,
    })
    recipes.value = (data || []).map((r) => ({
      ...r,
      likeCount: localLikeCounts.value[r.shareSlug] ?? r.likeCount ?? 0,
    }))
  } catch {
    /* ignore */
  }
}

onMounted(() => {
  fetchData()
})

function openRecipe(slug: string) {
  window.open(`/firework/share/${slug}`, '_blank')
}
</script>

<style scoped>
.leaderboard {
  padding: 16px 0;
}
.lb-title {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.lb-sort-hint {
  font-weight: 400;
  text-transform: none;
  color: #9ca3af;
  font-size: 12px;
}

.lb-controls {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  align-items: center;
}
.lb-sorts {
  display: flex;
  gap: 4px;
}
.lb-sort-btn {
  padding: 4px 10px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #6b7280;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
}
.lb-sort-btn.active {
  background: rgba(245, 158, 11, 0.12);
  border-color: rgba(245, 158, 11, 0.3);
  color: #f59e0b;
}
.lb-sort-btn:hover:not(.active) {
  color: #374151;
}
.lb-search {
  flex: 1;
  padding: 5px 10px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #111827;
  font-size: 12px;
  outline: none;
  min-width: 0;
}
.lb-search:focus {
  border-color: #f59e0b;
}
.lb-search-btn {
  padding: 5px 10px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.15s;
}
.lb-search-btn:hover {
  background: rgba(245, 158, 11, 0.12);
  border-color: rgba(245, 158, 11, 0.3);
}

.lb-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.lb-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: #f9fafb;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s;
}
.lb-item:hover {
  background: #f3f4f6;
}
.lb-rank {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  background: #e5e7eb;
  color: #6b7280;
  flex-shrink: 0;
}
.lb-rank.rank-1 {
  background: #f59e0b;
  color: #fff;
}
.lb-rank.rank-2 {
  background: #9ca3af;
  color: #fff;
}
.lb-rank.rank-3 {
  background: #cd853f;
  color: #fff;
}
.lb-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.lb-name {
  font-size: 13px;
  color: #111827;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.lb-author {
  font-size: 11px;
  color: #9ca3af;
}
.lb-like-btn {
  background: none;
  border: none;
  font-size: 13px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.15s;
  color: #9ca3af;
  white-space: nowrap;
}
.lb-like-btn:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.08);
}
.lb-like-btn.liked {
  color: #ef4444;
}
.lb-like-btn:disabled {
  cursor: default;
}
.lb-views {
  font-size: 11px;
  color: #9ca3af;
  white-space: nowrap;
}
.lb-empty {
  color: #9ca3af;
  font-size: 13px;
  text-align: center;
  padding: 12px 0;
}
</style>
