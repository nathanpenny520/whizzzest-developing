<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero -->
    <section class="relative pt-24 pb-8 px-4 text-center">
      <h1 class="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3 hero-title">
        {{ t('docs.library') }}
      </h1>
      <p class="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
        {{ t('docs.subtitle') }}
      </p>
    </section>

    <!-- Category filter -->
    <section class="max-w-5xl mx-auto px-4 pb-6">
      <div class="flex flex-wrap gap-2 justify-center">
        <button
          v-for="cat in categories"
          :key="cat.value"
          @click="activeCategory = cat.value"
          class="px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
          :class="
            activeCategory === cat.value
              ? 'bg-amber-500 text-white'
              : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-200'
          "
        >
          {{ cat.label }}
        </button>
      </div>
    </section>

    <!-- Docs grid -->
    <section class="max-w-5xl mx-auto px-4 pb-24">
      <div v-if="loading" class="text-center py-20 text-gray-400 text-sm">
        {{ t('common.loading') }}
      </div>
      <div v-else-if="filteredDocs.length === 0" class="text-center py-20 text-gray-400 text-sm">
        {{ t('docs.empty') }}
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="doc in filteredDocs"
          :key="doc.slug"
          class="doc-card group cursor-pointer bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
          @click="router.push(localizedPath(`/docs/${doc.slug}`))"
        >
          <!-- Cover image -->
          <div class="h-40 bg-gray-100 overflow-hidden">
            <img
              v-if="doc.coverImage"
              :src="doc.coverImage"
              :alt="isZh ? doc.title : doc.titleEn || doc.title"
              class="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <!-- Card info -->
          <div class="p-4">
            <span
              class="inline-block px-2 py-0.5 rounded text-xs font-medium mb-2"
              :class="categoryBadgeClass(doc.category)"
            >
              {{ categoryLabel(doc.category) }}
            </span>
            <h3 class="text-sm font-semibold text-gray-800 leading-snug">
              {{ isZh ? doc.title : doc.titleEn || doc.title }}
            </h3>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'DocsPage' })
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { api } from '@/api/client'

const { t, locale } = useI18n()
const router = useRouter()
const isZh = computed(() => (locale.value as string) === 'zh-CN')

interface DocItem {
  slug: string
  title: string
  titleEn: string | null
  coverImage: string | null
  category: string
  createdAt: string
}

const docs = ref<DocItem[]>([])
const loading = ref(true)
const activeCategory = ref('all')

const categories = computed(() => {
  const seen = new Set<string>()
  const list: { value: string; label: string }[] = [{ value: 'all', label: t('docs.all') }]
  for (const d of docs.value) {
    if (!seen.has(d.category)) {
      seen.add(d.category)
      list.push({ value: d.category, label: t(`docs.categories.${d.category}`) })
    }
  }
  return list
})

const filteredDocs = computed(() => {
  if (activeCategory.value === 'all') return docs.value
  return docs.value.filter((d) => d.category === activeCategory.value)
})

function categoryLabel(cat: string) {
  return t(`docs.categories.${cat}`)
}

function categoryBadgeClass(cat: string) {
  const map: Record<string, string> = {
    guide: 'bg-blue-50 text-blue-700',
    story: 'bg-purple-50 text-purple-700',
    info: 'bg-green-50 text-green-700',
  }
  return map[cat] || 'bg-gray-100 text-gray-600'
}

function localizedPath(path: string) {
  if (isZh.value) return path
  return `/en${path}`
}

onMounted(async () => {
  try {
    const res = await api.get('/docs')
    docs.value = (res.data.data || []) as DocItem[]
  } catch {
    // silently fail
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.hero-title {
  position: relative;
  display: inline-block;
}
.hero-title::after {
  content: '';
  display: block;
  width: 56px;
  height: 3px;
  background: #f59e0b;
  border-radius: 2px;
  margin: 12px auto 0;
}
</style>
