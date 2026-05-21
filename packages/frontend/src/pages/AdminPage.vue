<template>
  <div class="admin-page">
    <h1>{{ t('admin.pageTitle') }}</h1>

    <div v-if="pageLoading" class="loading-box">{{ t('admin.loading') }}</div>
    <div v-if="pageError" class="error-box">{{ pageError }}</div>

    <div v-if="!pageLoading && !pageError" class="tabs">
      <button v-for="tb in tabs" :key="tb.key" @click="tab = tb.key" :class="{ active: tab === tb.key }">{{ $t(tb.key) }}</button>
    </div>

    <!-- 商户审核 -->
    <div v-if="tab === 'admin.tabs.merchants'" class="tab-content">
      <div v-for="m in merchants" :key="m.id" class="card">
        <div class="card-info">
          <strong>{{ m.name }}</strong>
          <span>{{ m.category }} | {{ m.isVerified ? t('admin.verified') : t('admin.pending') }}</span>
        </div>
        <div class="card-actions">
          <button v-if="!m.isVerified" @click="verify(m.id, true)" class="btn approve">{{ t('admin.approve') }}</button>
          <button v-if="m.isVerified" @click="verify(m.id, false)" class="btn reject">{{ t('admin.revoke') }}</button>
        </div>
      </div>
    </div>

    <!-- 优惠券管理 -->
    <div v-if="tab === 'admin.tabs.coupons'" class="tab-content">
      <div v-for="c in coupons" :key="c.id" class="card">
        <div class="card-info">
          <strong>{{ c.title }}</strong>
          <span>{{ c.merchant?.name }} | {{ t('admin.discount') }}: {{ c.discount }}% | {{ t('admin.stock') }}: {{ c.totalStock - c.usedStock }}/{{ c.totalStock }}</span>
        </div>
        <button @click="delCoupon(c.id)" class="btn reject">{{ t('admin.delete') }}</button>
      </div>
    </div>

    <!-- 知识库 -->
    <div v-if="tab === 'admin.tabs.knowledge'" class="tab-content">
      <div class="form" style="margin-bottom:20px">
        <h3>{{ t('admin.addKnowledge') }}</h3>
        <label>{{ t('admin.category') }} <input v-model="newKnowledge.category" /></label>
        <label>{{ t('admin.content') }} <textarea v-model="newKnowledge.content" rows="3" /></label>
        <label>{{ t('admin.contentEn') }} <textarea v-model="newKnowledge.contentEn" rows="2" /></label>
        <label>{{ t('admin.keywords') }} <input v-model="newKnowledge.keywordsStr" /></label>
        <button @click="addKnowledge" class="btn approve">{{ t('admin.add') }}</button>
      </div>
      <div v-for="k in knowledge" :key="k.id" class="card">
        <strong>[{{ k.category }}] {{ k.content.slice(0, 80) }}...</strong>
        <button @click="delKnowledge(k.id)" class="btn reject">{{ t('admin.delete') }}</button>
      </div>
    </div>

    <!-- 用户统计 -->
    <div v-if="tab === 'admin.tabs.stats'" class="tab-content">
      <div class="stats-row">
        <div class="stat-card"><span class="stat-num">{{ stats.totalUsers }}</span><span class="stat-label">{{ t('admin.totalUsers') }}</span></div>
        <div class="stat-card"><span class="stat-num">{{ stats.todayNew }}</span><span class="stat-label">{{ t('admin.newToday') }}</span></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/api/client'

const { t, locale } = useI18n()
const isZh = computed(() => (locale.value as string) === 'zh-CN')
const tabs = [
  { key: 'admin.tabs.merchants' },
  { key: 'admin.tabs.coupons' },
  { key: 'admin.tabs.knowledge' },
  { key: 'admin.tabs.stats' },
]
const tab = ref('admin.tabs.merchants')

const merchants = ref<{ id: string; name: string; category: string; isVerified: boolean }[]>([])
const coupons = ref<{ id: string; title: string; discount: number; totalStock: number; usedStock: number; merchant?: { name: string } }[]>([])
const knowledge = ref<{ id: string; category: string; content: string }[]>([])
const newKnowledge = ref({ category: '', content: '', contentEn: '', keywordsStr: '' })
const stats = ref({ totalUsers: 0, todayNew: 0 })
const pageLoading = ref(true)
const pageError = ref('')

onMounted(async () => {
  try {
    const [m, c, k] = await Promise.all([
      api.get('/merchants?all=true'), api.get('/coupons/public'), api.get('/knowledge'),
    ])
    merchants.value = m.data.data; coupons.value = c.data.data; knowledge.value = k.data.data
    api.get('/users/stats').then(s => { stats.value = s.data.data }).catch(() => {})
  } catch {
    pageError.value = t('admin.loadError')
  } finally { pageLoading.value = false }
})

async function verify(id: string, isVerified: boolean) {
  await api.put(`/merchants/${id}/verify`, { isVerified })
  const m = await api.get('/merchants?all=true'); merchants.value = m.data.data
}
async function delCoupon(id: string) { await api.delete(`/coupons/${id}`); coupons.value = coupons.value.filter(c => c.id !== id) }
async function addKnowledge() {
  await api.post('/knowledge', { category: newKnowledge.value.category, content: newKnowledge.value.content, contentEn: newKnowledge.value.contentEn || null, keywords: newKnowledge.value.keywordsStr.split(',').map(s => s.trim()).filter(Boolean) })
  newKnowledge.value = { category: '', content: '', contentEn: '', keywordsStr: '' }; const k = await api.get('/knowledge'); knowledge.value = k.data.data
}
async function delKnowledge(id: string) { await api.delete(`/knowledge/${id}`); knowledge.value = knowledge.value.filter(k => k.id !== id) }
</script>

<style scoped>
.admin-page { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
h1 { font-size: 24px; margin-bottom: 20px; }
.tabs { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
.tabs button { padding: 8px 16px; border: 1px solid #d1d5db; border-radius: 8px; background: #fff; cursor: pointer; font-size: 13px; }
.tabs button.active { background: #dc2626; color: #fff; border-color: #dc2626; }
.tab-content { background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,.1); }
.card { display: flex; justify-content: space-between; align-items: center; padding: 14px; border-bottom: 1px solid #f3f4f6; gap: 12px; }
.card-info { display: flex; flex-direction: column; gap: 2px; flex: 1; }
.card-info span { font-size: 12px; color: #6b7280; }
.card-info strong { font-size: 14px; }
.card-actions { display: flex; gap: 6px; }
.btn { padding: 6px 14px; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn.approve { background: #059669; color: #fff; }
.btn.reject { background: #dc2626; color: #fff; }
.form { display: flex; flex-direction: column; gap: 10px; }
.form label { display: flex; flex-direction: column; gap: 4px; font-size: 13px; font-weight: 500; }
.form input, .form textarea { padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; outline: none; }
.loading-box { text-align: center; padding: 40px; color: #6b7280; }
.error-box { background: #fef2f2; color: #dc2626; padding: 12px 20px; border-radius: 8px; margin-bottom: 16px; }
.stats-row { display: flex; gap: 16px; margin-bottom: 24px; }
.stat-card { flex: 1; background: #fff; border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,.1); display: flex; flex-direction: column; gap: 4px; }
.stat-num { font-size: 32px; font-weight: 700; color: #dc2626; }
.stat-label { font-size: 13px; color: #6b7280; }
</style>
