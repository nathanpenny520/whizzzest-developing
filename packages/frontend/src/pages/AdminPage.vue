<template>
  <div class="admin-page">
    <h1>{{ t('admin.pageTitle') }}</h1>

    <div v-if="pageLoading" class="loading-box">{{ t('admin.loading') }}</div>
    <div v-if="pageError" class="error-box">{{ pageError }}</div>

    <div v-if="!pageLoading" class="tabs">
      <button
        v-for="tb in tabs"
        :key="tb.key"
        @click="tab = tb.key"
        :class="{ active: tab === tb.key }"
      >
        {{ $t(tb.key) }}
      </button>
    </div>

    <!-- 商户审核 -->
    <div v-if="tab === 'admin.tabs.merchants'" class="tab-content">
      <div v-for="m in merchants" :key="m.id" class="card">
        <div class="card-info">
          <strong>{{ m.name }}</strong>
          <span
            >{{ m.category }} | {{ m.isVerified ? t('admin.verified') : t('admin.pending') }}</span
          >
        </div>
        <div class="card-actions">
          <button
            v-if="!m.isVerified"
            @click="verify(m.id, true)"
            :disabled="actionLoading"
            class="btn approve"
          >
            {{ t('admin.approve') }}
          </button>
          <button
            v-if="m.isVerified"
            @click="verify(m.id, false)"
            :disabled="actionLoading"
            class="btn reject"
          >
            {{ t('admin.revoke') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 优惠券管理 -->
    <div v-if="tab === 'admin.tabs.coupons'" class="tab-content">
      <div v-for="c in coupons" :key="c.id" class="card">
        <div class="card-info">
          <strong>{{ c.title }}</strong>
          <span
            >{{ c.merchant?.name }} | {{ t('admin.discount') }}: {{ c.discount }}% |
            {{ t('admin.stock') }}: {{ c.totalStock - c.usedStock }}/{{ c.totalStock }}</span
          >
        </div>
        <button @click="delCoupon(c.id)" :disabled="actionLoading" class="btn reject">
          {{ t('admin.delete') }}
        </button>
      </div>
    </div>

    <!-- 知识库 -->
    <div v-if="tab === 'admin.tabs.knowledge'" class="tab-content">
      <div class="form" style="margin-bottom: 20px">
        <h3>{{ t('admin.addKnowledge') }}</h3>
        <label>{{ t('admin.category') }} <input v-model="newKnowledge.category" /></label>
        <label>{{ t('admin.content') }} <textarea v-model="newKnowledge.content" rows="3" /></label>
        <label
          >{{ t('admin.contentEn') }} <textarea v-model="newKnowledge.contentEn" rows="2" />
        </label>
        <label>{{ t('admin.keywords') }} <input v-model="newKnowledge.keywordsStr" /></label>
        <button @click="addKnowledge" :disabled="actionLoading" class="btn approve">
          {{ t('admin.add') }}
        </button>
      </div>
      <div v-for="k in knowledge" :key="k.id" class="card">
        <strong>[{{ k.category }}] {{ k.content.slice(0, 80) }}...</strong>
        <button @click="delKnowledge(k.id)" :disabled="actionLoading" class="btn reject">
          {{ t('admin.delete') }}
        </button>
      </div>
    </div>

    <!-- 文档管理 -->
    <div v-if="tab === 'admin.tabs.docs'" class="tab-content">
      <div class="form" style="margin-bottom: 20px">
        <h3>{{ editingDoc ? t('admin.editDoc') : t('admin.addDoc') }}</h3>
        <label
          >{{ t('admin.slug') }}
          <input v-model="docForm.slug" :disabled="!!editingDoc" :placeholder="t('admin.slugHint')"
        /></label>
        <label>{{ t('admin.docTitle') }} <input v-model="docForm.title" /></label>
        <label>{{ t('admin.docTitleEn') }} <input v-model="docForm.titleEn" /></label>
        <label
          >{{ t('admin.category') }}
          <select
            v-model="docForm.category"
            style="
              padding: 8px 12px;
              border: 1px solid #d1d5db;
              border-radius: 6px;
              font-size: 14px;
            "
          >
            <option value="guide">{{ t('docs.categories.guide') }}</option>
            <option value="story">{{ t('docs.categories.story') }}</option>
            <option value="info">{{ t('docs.categories.info') }}</option>
            <option value="general">{{ t('docs.categories.general') }}</option>
          </select>
        </label>
        <label>{{ t('admin.order') }} <input v-model.number="docForm.order" type="number" /></label>
        <label
          >{{ t('admin.coverImage') }}
          <input type="file" accept="image/*" @change="onCoverFile" style="padding: 6px" />
          <span v-if="docForm.coverImage" style="font-size: 11px; color: #6b7280"
            >{{ t('admin.fileSelected') }}{{ docForm.coverImage }}</span
          >
        </label>
        <label
          >{{ t('admin.content') }}
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px">
            <label
              class="btn"
              style="
                background: #3b82f6;
                color: #fff;
                cursor: pointer;
                padding: 4px 10px;
                font-size: 12px;
                border-radius: 4px;
                width: auto;
              "
            >
              {{ t('admin.mdImport') }}
              <input type="file" accept=".md,.markdown" @change="onMdFile" style="display: none" />
            </label>
          </div>
          <textarea v-model="docForm.content" rows="6" />
        </label>
        <label>{{ t('admin.contentEn') }} <textarea v-model="docForm.contentEn" rows="4" /></label>
        <div v-if="docError" class="error-box" style="margin-top: 4px; padding: 8px 12px">
          {{ docError }}
        </div>
        <div style="display: flex; gap: 8px">
          <button @click="saveDoc" :disabled="actionLoading" class="btn approve">
            {{ editingDoc ? t('admin.update') : t('admin.add') }}
          </button>
          <button
            v-if="editingDoc"
            @click="cancelEdit"
            class="btn reject"
            style="background: #6b7280"
          >
            {{ t('admin.cancel') }}
          </button>
        </div>
      </div>
      <div v-for="d in docs" :key="d.slug" class="card">
        <div class="card-info">
          <strong>[{{ d.category }}] {{ d.title }}</strong>
          <span>{{ d.slug }} | {{ formatDate(d.createdAt) }}</span>
        </div>
        <div class="card-actions" style="gap: 4px">
          <button
            @click="editDoc(d)"
            :disabled="actionLoading"
            class="btn"
            style="background: #3b82f6; color: #fff"
          >
            {{ t('admin.editDoc') }}
          </button>
          <button @click="delDoc(d.slug)" :disabled="actionLoading" class="btn reject">
            {{ t('admin.delete') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 用户统计 -->
    <div v-if="tab === 'admin.tabs.stats'" class="tab-content">
      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-num">{{ stats.totalUsers }}</span
          ><span class="stat-label">{{ t('admin.totalUsers') }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ stats.todayNew }}</span
          ><span class="stat-label">{{ t('admin.newToday') }}</span>
        </div>
      </div>
    </div>

    <!-- 数据统计 -->
    <div v-if="tab === 'admin.tabs.analytics'" class="tab-content">
      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-num">{{ analytics.total }}</span
          ><span class="stat-label">{{ t('admin.totalViews') }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ analytics.recentViews }}</span
          ><span class="stat-label">{{ t('admin.recentViews') }}</span>
        </div>
      </div>
      <h3 style="margin-top: 24px; font-weight: 600">{{ t('admin.topPages') }}</h3>
      <div v-if="analytics.topPages?.length" style="margin-top: 12px">
        <div
          v-for="(p, i) in analytics.topPages"
          :key="i"
          class="card"
          style="justify-content: space-between"
        >
          <span>{{ p.path }}</span>
          <span style="color: #6b7280; font-size: 13px"
            >{{ p._count.path }}{{ t('admin.views') }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/api/client'

const { t, locale } = useI18n()
const isZh = computed(() => (locale.value as string) === 'zh-CN')
const tabs = [
  { key: 'admin.tabs.merchants' },
  { key: 'admin.tabs.coupons' },
  { key: 'admin.tabs.knowledge' },
  { key: 'admin.tabs.docs' },
  { key: 'admin.tabs.stats' },
  { key: 'admin.tabs.analytics' },
]
const tab = ref('admin.tabs.merchants')

const merchants = ref<{ id: string; name: string; category: string; isVerified: boolean }[]>([])
const coupons = ref<
  {
    id: string
    title: string
    discount: number
    totalStock: number
    usedStock: number
    merchant?: { name: string }
  }[]
>([])
const knowledge = ref<{ id: string; category: string; content: string }[]>([])
const newKnowledge = ref({ category: '', content: '', contentEn: '', keywordsStr: '' })
const docs = ref<
  {
    slug: string
    title: string
    titleEn?: string
    content: string
    contentEn?: string
    coverImage?: string
    category: string
    order: number
    createdAt: string
  }[]
>([])
const docForm = ref({
  slug: '',
  title: '',
  titleEn: '',
  content: '',
  contentEn: '',
  coverImage: '',
  category: 'general',
  order: 0,
})
const editingDoc = ref<string | null>(null)
const docError = ref('')
const stats = ref({ totalUsers: 0, todayNew: 0 })
const analytics = ref<{
  total: number
  recentViews: number
  topPages: { path: string; _count: { path: number } }[]
}>({
  total: 0,
  recentViews: 0,
  topPages: [],
})
const pageLoading = ref(true)
const pageError = ref('')
const actionLoading = ref(false)

watch(tab, () => {
  pageError.value = ''
})

onMounted(async () => {
  try {
    const [m, c, k, d] = await Promise.all([
      api.get('/merchants?all=true'),
      api.get('/coupons/public'),
      api.get('/knowledge'),
      api.get('/docs'),
    ])
    merchants.value = m.data.data
    coupons.value = c.data.data
    knowledge.value = k.data.data
    docs.value = d.data.data
    api
      .get('/users/stats')
      .then((s) => {
        stats.value = s.data.data
      })
      .catch(() => {})
    api
      .get('/analytics/stats?days=7')
      .then((a) => {
        analytics.value = a.data.data
      })
      .catch(() => {})
  } catch {
    pageError.value = t('admin.loadError')
  } finally {
    pageLoading.value = false
  }
})

async function verify(id: string, isVerified: boolean) {
  actionLoading.value = true
  try {
    await api.put(`/merchants/${id}/verify`, { isVerified })
    const m = await api.get('/merchants?all=true')
    merchants.value = m.data.data
  } catch {
    pageError.value = t('admin.loadError')
  } finally {
    actionLoading.value = false
  }
}
async function delCoupon(id: string) {
  actionLoading.value = true
  try {
    await api.delete(`/coupons/${id}`)
    coupons.value = coupons.value.filter((c) => c.id !== id)
  } catch {
    pageError.value = t('admin.loadError')
  } finally {
    actionLoading.value = false
  }
}
async function addKnowledge() {
  actionLoading.value = true
  try {
    await api.post('/knowledge', {
      category: newKnowledge.value.category,
      content: newKnowledge.value.content,
      contentEn: newKnowledge.value.contentEn || null,
      keywords: newKnowledge.value.keywordsStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    })
    newKnowledge.value = { category: '', content: '', contentEn: '', keywordsStr: '' }
    const k = await api.get('/knowledge')
    knowledge.value = k.data.data
  } catch {
    pageError.value = t('admin.loadError')
  } finally {
    actionLoading.value = false
  }
}
async function delKnowledge(id: string) {
  actionLoading.value = true
  try {
    await api.delete(`/knowledge/${id}`)
    knowledge.value = knowledge.value.filter((k) => k.id !== id)
  } catch {
    pageError.value = t('admin.loadError')
  } finally {
    actionLoading.value = false
  }
}

// Doc CRUD
let coverFile: File | null = null
function onCoverFile(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.[0]) {
    coverFile = target.files[0]
    docForm.value.coverImage = target.files[0].name
  }
}

function onMdFile(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    docForm.value.content = reader.result as string
    // Extract slug from filename
    const name = file.name.replace(/\.(md|markdown)$/i, '')
    if (!docForm.value.slug)
      docForm.value.slug = name
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9一-鿿\-]/g, '')
        .toLowerCase()
    if (!docForm.value.title) docForm.value.title = name
  }
  reader.readAsText(file)
}

function resetDocForm() {
  docForm.value = {
    slug: '',
    title: '',
    titleEn: '',
    content: '',
    contentEn: '',
    coverImage: '',
    category: 'general',
    order: 0,
  }
  coverFile = null
  editingDoc.value = null
}

function editDoc(d: (typeof docs.value)[0]) {
  editingDoc.value = d.slug
  docForm.value = {
    slug: d.slug,
    title: d.title,
    titleEn: d.titleEn || '',
    content: d.content,
    contentEn: d.contentEn || '',
    coverImage: d.coverImage || '',
    category: d.category,
    order: d.order,
  }
  coverFile = null
}

function cancelEdit() {
  resetDocForm()
}

async function saveDoc() {
  docError.value = ''
  actionLoading.value = true
  try {
    const payload: Record<string, unknown> = {
      title: docForm.value.title,
      content: docForm.value.content,
      titleEn: docForm.value.titleEn || undefined,
      contentEn: docForm.value.contentEn || undefined,
      category: docForm.value.category,
      order: docForm.value.order,
    }
    if (coverFile) {
      const fd = new FormData()
      fd.append('file', coverFile)
      const up = await api.post('/docs/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      payload.coverImage = up.data.data.url
    }
    if (!editingDoc.value) {
      payload.slug =
        docForm.value.slug ||
        docForm.value.title
          .replace(/\s+/g, '-')
          .replace(/[^a-zA-Z0-9一-鿿\-]/g, '')
          .toLowerCase() ||
        'doc-' + Date.now()
      await api.post('/docs', payload)
    } else {
      await api.put(`/docs/${editingDoc.value}`, payload)
    }
    resetDocForm()
    const d = await api.get('/docs')
    docs.value = d.data.data
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    docError.value = msg || t('admin.loadError')
  } finally {
    actionLoading.value = false
  }
}

async function delDoc(slug: string) {
  actionLoading.value = true
  try {
    await api.delete(`/docs/${slug}`)
    docs.value = docs.value.filter((d) => d.slug !== slug)
  } catch {
    pageError.value = t('admin.loadError')
  } finally {
    actionLoading.value = false
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString(isZh.value ? 'zh-CN' : 'en-US')
}
</script>

<style scoped>
.admin-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}
h1 {
  font-size: 24px;
  margin-bottom: 20px;
}
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.tabs button {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
}
.tabs button.active {
  background: #dc2626;
  color: #fff;
  border-color: #dc2626;
}
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
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.form label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
}
.form input,
.form textarea {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
}
.loading-box {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}
.error-box {
  background: #fef2f2;
  color: #dc2626;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 16px;
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
