<template>
  <div class="min-h-screen bg-white">
    <!-- Top bar -->
    <div class="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-100">
      <div class="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
        <button
          @click="router.push(localizedPath('/docs'))"
          class="flex items-center gap-1 text-gray-500 hover:text-amber-500 transition-colors text-sm shrink-0"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {{ t('docs.back') }}
        </button>
        <span class="text-gray-300">|</span>
        <span class="text-gray-600 text-sm truncate">{{ title }}</span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="max-w-3xl mx-auto px-4 py-20 text-center text-gray-400 text-sm">
      {{ t('common.loading') }}
    </div>

    <!-- Not found -->
    <div v-else-if="!doc" class="max-w-3xl mx-auto px-4 py-20 text-center text-gray-400 text-sm">
      {{ t('docs.notFound') }}
    </div>

    <!-- Content -->
    <article v-else class="max-w-3xl mx-auto px-4 py-8">
      <!-- Cover image -->
      <img
        v-if="doc.coverImage"
        :src="doc.coverImage"
        :alt="title"
        class="w-full max-h-64 object-cover rounded-xl mb-6"
      />

      <!-- Title -->
      <h1 class="text-2xl md:text-3xl font-extrabold text-gray-800 mb-2">{{ title }}</h1>
      <div class="flex items-center gap-3 text-xs text-gray-400 mb-8">
        <span>{{ categoryLabel(doc.category) }}</span>
        <span>{{ formatDate(doc.createdAt) }}</span>
      </div>

      <!-- Markdown content -->
      <div class="doc-content prose max-w-none" v-html="renderedContent" />
    </article>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'DocDetailPage' })
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { marked } from 'marked'
import { api } from '@/api/client'

marked.setOptions({ breaks: true, gfm: true })

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()
const isZh = computed(() => (locale.value as string) === 'zh-CN')

interface Doc {
  slug: string
  title: string
  titleEn: string | null
  content: string
  contentEn: string | null
  coverImage: string | null
  category: string
  createdAt: string
}

const doc = ref<Doc | null>(null)
const loading = ref(true)

const title = computed(() => {
  if (!doc.value) return ''
  return isZh.value ? doc.value.title : doc.value.titleEn || doc.value.title
})

const renderedContent = computed(() => {
  if (!doc.value) return ''
  const md = isZh.value ? doc.value.content : doc.value.contentEn || doc.value.content
  return marked.parse(md) as string
})

function localizedPath(path: string) {
  if (isZh.value) return path
  return `/en${path}`
}

function categoryLabel(cat: string) {
  return t(`docs.categories.${cat}`)
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString(isZh.value ? 'zh-CN' : 'en-US')
}

onMounted(async () => {
  const slug = route.params.slug as string
  try {
    const res = await api.get(`/docs/${slug}`)
    if (res.data.code === 0) {
      doc.value = res.data.data as Doc
    }
  } catch {
    // silently fail
  } finally {
    loading.value = false
  }
})
</script>

<style>
/* Markdown content styling (unscoped so it targets v-html) */
.doc-content h1 {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1f2937;
  margin: 1.5em 0 0.5em;
}
.doc-content h1:first-child {
  margin-top: 0;
}
.doc-content h2 {
  font-size: 1.35rem;
  font-weight: 700;
  color: #1f2937;
  margin: 1.5em 0 0.4em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #e5e7eb;
}
.doc-content h3 {
  font-size: 1.15rem;
  font-weight: 600;
  color: #374151;
  margin: 1.2em 0 0.3em;
}
.doc-content p {
  color: #4b5563;
  line-height: 1.8;
  margin: 0.8em 0;
}
.doc-content ul,
.doc-content ol {
  padding-left: 1.5em;
  margin: 0.6em 0;
}
.doc-content li {
  color: #4b5563;
  line-height: 1.7;
  margin: 0.3em 0;
}
.doc-content code {
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  color: #dc2626;
}
.doc-content pre {
  background: #1f2937;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1em 0;
}
.doc-content pre code {
  background: none;
  color: #e5e7eb;
  padding: 0;
}
.doc-content blockquote {
  border-left: 3px solid #f59e0b;
  padding-left: 16px;
  margin: 1em 0;
  color: #6b7280;
}
.doc-content img {
  max-width: 100%;
  border-radius: 8px;
  margin: 1em 0;
}
.doc-content a {
  color: #f59e0b;
  text-decoration: underline;
}
.doc-content hr {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1.5em 0;
}
.doc-content strong {
  color: #1f2937;
}
.doc-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
}
.doc-content th {
  background: #f9fafb;
  padding: 8px 12px;
  text-align: left;
  font-weight: 600;
  border: 1px solid #e5e7eb;
}
.doc-content td {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  color: #4b5563;
}
</style>
