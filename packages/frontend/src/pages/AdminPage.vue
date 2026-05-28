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

    <AdminMerchantsTab
      v-if="tab === 'admin.tabs.merchants'"
      :merchants="merchants"
      :actionLoading="actionLoading"
      @verify="verify"
    />
    <AdminCouponsTab
      v-if="tab === 'admin.tabs.coupons'"
      :coupons="coupons"
      :actionLoading="actionLoading"
      @deleteCoupon="delCoupon"
    />
    <AdminKnowledgeTab
      v-if="tab === 'admin.tabs.knowledge'"
      :knowledge="knowledge"
      :actionLoading="actionLoading"
      @addKnowledge="addKnowledge"
      @deleteKnowledge="delKnowledge"
    />
    <AdminDocsTab
      v-if="tab === 'admin.tabs.docs'"
      ref="docsTabRef"
      :docs="docs"
      :actionLoading="actionLoading"
      @saveDoc="saveDoc"
      @deleteDoc="delDoc"
      @editDoc="(d) => docsTabRef?.exposeEditDoc(d)"
    />
    <AdminStatsTab v-if="tab === 'admin.tabs.stats'" :stats="stats" />
    <AdminAnalyticsTab v-if="tab === 'admin.tabs.analytics'" :analytics="analytics" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ICouponWithMerchant } from '@/types/coupon'
import { getAllMerchants, verifyMerchant } from '@/api/merchants'
import { getAllCoupons, deleteCoupon } from '@/api/coupons'
import { getAllKnowledge, createKnowledge, deleteKnowledge } from '@/api/knowledge'
import { getAllDocs, createDoc, updateDoc, deleteDoc, uploadDocCover } from '@/api/docs'
import { getUserStats } from '@/api/users'
import { getAnalyticsStats } from '@/api/analytics'
import AdminMerchantsTab from '@/components/admin/AdminMerchantsTab.vue'
import AdminCouponsTab from '@/components/admin/AdminCouponsTab.vue'
import AdminKnowledgeTab from '@/components/admin/AdminKnowledgeTab.vue'
import AdminDocsTab from '@/components/admin/AdminDocsTab.vue'
import AdminStatsTab from '@/components/admin/AdminStatsTab.vue'
import AdminAnalyticsTab from '@/components/admin/AdminAnalyticsTab.vue'

const { t } = useI18n()
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
const coupons = ref<ICouponWithMerchant[]>([])
const knowledge = ref<{ id: string; category: string; content: string }[]>([])
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
const stats = ref({ totalUsers: 0, todayNew: 0 })
const analytics = ref<{
  total: number
  recentViews: number
  topPages: { path: string; _count: { path: number } }[]
}>({ total: 0, recentViews: 0, topPages: [] })
const pageLoading = ref(true)
const pageError = ref('')
const actionLoading = ref(false)
const docsTabRef = ref<InstanceType<typeof AdminDocsTab> | null>(null)

watch(tab, () => {
  pageError.value = ''
})

onMounted(async () => {
  try {
    const [m, c, k, d] = await Promise.all([
      getAllMerchants(true),
      getAllCoupons(),
      getAllKnowledge(),
      getAllDocs(),
    ])
    merchants.value = m as typeof merchants.value
    coupons.value = c as typeof coupons.value
    knowledge.value = k as typeof knowledge.value
    docs.value = d as typeof docs.value
    getUserStats()
      .then((s) => {
        stats.value = s
      })
      .catch(() => {})
    getAnalyticsStats(7)
      .then((a) => {
        analytics.value = a as typeof analytics.value
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
    await verifyMerchant(id, isVerified)
    merchants.value = (await getAllMerchants(true)) as typeof merchants.value
  } catch {
    pageError.value = t('admin.loadError')
  } finally {
    actionLoading.value = false
  }
}

async function delCoupon(id: string) {
  actionLoading.value = true
  try {
    await deleteCoupon(id)
    coupons.value = (await getAllCoupons()) as typeof coupons.value
  } catch {
    pageError.value = t('admin.loadError')
  } finally {
    actionLoading.value = false
  }
}

async function addKnowledge(payload: Record<string, unknown>) {
  actionLoading.value = true
  try {
    await createKnowledge(payload)
    knowledge.value = (await getAllKnowledge()) as typeof knowledge.value
  } catch {
    pageError.value = t('admin.loadError')
  } finally {
    actionLoading.value = false
  }
}

async function delKnowledge(id: string) {
  actionLoading.value = true
  try {
    await deleteKnowledge(id)
    knowledge.value = (await getAllKnowledge()) as typeof knowledge.value
  } catch {
    pageError.value = t('admin.loadError')
  } finally {
    actionLoading.value = false
  }
}

async function saveDoc(payload: Record<string, unknown>, coverFile: File | null) {
  actionLoading.value = true
  try {
    if (coverFile) {
      const fd = new FormData()
      fd.append('file', coverFile)
      const up = await uploadDocCover(fd)
      payload.coverImage = up.url
    }
    if (payload.slug) {
      await updateDoc(payload.slug as string, payload)
    } else {
      payload.slug =
        ((payload.title as string) || '')
          .replace(/\s+/g, '-')
          .replace(/[^a-zA-Z0-9一-鿿\-]/g, '')
          .toLowerCase() || 'doc-' + Date.now()
      await createDoc(payload)
    }
    docsTabRef.value?.resetForm()
    docs.value = (await getAllDocs()) as typeof docs.value
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    docsTabRef.value?.setError(msg || t('admin.loadError'))
  } finally {
    actionLoading.value = false
  }
}

async function delDoc(slug: string) {
  actionLoading.value = true
  try {
    await deleteDoc(slug)
    docs.value = (await getAllDocs()) as typeof docs.value
  } catch {
    pageError.value = t('admin.loadError')
  } finally {
    actionLoading.value = false
  }
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
