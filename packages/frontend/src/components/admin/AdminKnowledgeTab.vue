<template>
  <div class="tab-content">
    <div class="form" style="margin-bottom: 20px">
      <h3>{{ $t('admin.addKnowledge') }}</h3>
      <label>{{ $t('admin.category') }} <input v-model="form.category" /></label>
      <label>{{ $t('admin.content') }} <textarea v-model="form.content" rows="3" /></label>
      <label>{{ $t('admin.contentEn') }} <textarea v-model="form.contentEn" rows="2" /></label>
      <label>{{ $t('admin.keywords') }} <input v-model="form.keywordsStr" /></label>
      <button @click="handleAdd" :disabled="actionLoading" class="btn approve">
        {{ $t('admin.add') }}
      </button>
    </div>
    <div v-for="k in knowledge" :key="k.id" class="card">
      <strong>[{{ k.category }}] {{ k.content.slice(0, 80) }}...</strong>
      <button @click="$emit('deleteKnowledge', k.id)" :disabled="actionLoading" class="btn reject">
        {{ $t('admin.delete') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

defineProps<{
  knowledge: { id: string; category: string; content: string }[]
  actionLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'addKnowledge', payload: Record<string, unknown>): void
  (e: 'deleteKnowledge', id: string): void
}>()

const form = reactive({ category: '', content: '', contentEn: '', keywordsStr: '' })

function handleAdd() {
  emit('addKnowledge', {
    category: form.category,
    content: form.content,
    contentEn: form.contentEn || null,
    keywords: form.keywordsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  })
  Object.assign(form, { category: '', content: '', contentEn: '', keywordsStr: '' })
}
</script>

<style scoped>
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
</style>
