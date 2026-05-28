<template>
  <div class="tab-content">
    <div class="form" style="margin-bottom: 20px">
      <h3>{{ editingDoc ? $t('admin.editDoc') : $t('admin.addDoc') }}</h3>
      <label
        >{{ $t('admin.slug') }}
        <input v-model="form.slug" :disabled="!!editingDoc" :placeholder="$t('admin.slugHint')" />
      </label>
      <label>{{ $t('admin.docTitle') }} <input v-model="form.title" /></label>
      <label>{{ $t('admin.docTitleEn') }} <input v-model="form.titleEn" /></label>
      <label
        >{{ $t('admin.category') }}
        <select v-model="form.category" class="doc-cat-select">
          <option value="guide">{{ $t('docs.categories.guide') }}</option>
          <option value="story">{{ $t('docs.categories.story') }}</option>
          <option value="info">{{ $t('docs.categories.info') }}</option>
          <option value="general">{{ $t('docs.categories.general') }}</option>
        </select>
      </label>
      <label>{{ $t('admin.order') }} <input v-model.number="form.order" type="number" /></label>
      <label
        >{{ $t('admin.coverImage') }}
        <input type="file" accept="image/*" @change="onCoverFile" style="padding: 6px" />
        <span v-if="form.coverImage" style="font-size: 11px; color: #6b7280">
          {{ $t('admin.fileSelected') }}{{ form.coverImage }}
        </span>
      </label>
      <label
        >{{ $t('admin.content') }}
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px">
          <label class="btn md-import-btn">
            {{ $t('admin.mdImport') }}
            <input type="file" accept=".md,.markdown" @change="onMdFile" style="display: none" />
          </label>
        </div>
        <textarea v-model="form.content" rows="6" />
      </label>
      <label>{{ $t('admin.contentEn') }} <textarea v-model="form.contentEn" rows="4" /></label>
      <div v-if="error" class="error-box" style="margin-top: 4px; padding: 8px 12px">
        {{ error }}
      </div>
      <div style="display: flex; gap: 8px">
        <button @click="handleSave" :disabled="actionLoading" class="btn approve">
          {{ editingDoc ? $t('admin.update') : $t('admin.add') }}
        </button>
        <button
          v-if="editingDoc"
          @click="cancelEdit"
          class="btn reject"
          style="background: #6b7280"
        >
          {{ $t('admin.cancel') }}
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
          @click="$emit('editDoc', d)"
          :disabled="actionLoading"
          class="btn"
          style="background: #3b82f6; color: #fff"
        >
          {{ $t('admin.editDoc') }}
        </button>
        <button @click="$emit('deleteDoc', d.slug)" :disabled="actionLoading" class="btn reject">
          {{ $t('admin.delete') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAdmin } from '@/composables/useAdmin'

const { formatDate } = useAdmin()

type DocRecord = {
  slug: string
  title: string
  titleEn?: string
  content: string
  contentEn?: string
  coverImage?: string
  category: string
  order: number
  createdAt: string
}

defineProps<{
  docs: DocRecord[]
  actionLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'saveDoc', payload: Record<string, unknown>, coverFile: File | null): void
  (e: 'deleteDoc', slug: string): void
  (e: 'editDoc', doc: DocRecord): void
}>()

const editingDoc = ref<string | null>(null)
const error = ref('')
let coverFile: File | null = null

const form = reactive({
  slug: '',
  title: '',
  titleEn: '',
  content: '',
  contentEn: '',
  coverImage: '',
  category: 'general',
  order: 0,
})

function onCoverFile(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.[0]) {
    coverFile = target.files[0]
    form.coverImage = target.files[0].name
  }
}

function onMdFile(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    form.content = reader.result as string
    const name = file.name.replace(/\.(md|markdown)$/i, '')
    if (!form.slug)
      form.slug = name
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9一-鿿\-]/g, '')
        .toLowerCase()
    if (!form.title) form.title = name
  }
  reader.readAsText(file)
}

function resetForm() {
  Object.assign(form, {
    slug: '',
    title: '',
    titleEn: '',
    content: '',
    contentEn: '',
    coverImage: '',
    category: 'general',
    order: 0,
  })
  coverFile = null
  editingDoc.value = null
}

function handleSave() {
  error.value = ''
  const payload: Record<string, unknown> = {
    title: form.title,
    content: form.content,
    titleEn: form.titleEn || undefined,
    contentEn: form.contentEn || undefined,
    category: form.category,
    order: form.order,
  }
  if (!editingDoc.value) {
    payload.slug =
      form.slug ||
      form.title
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9一-鿿\-]/g, '')
        .toLowerCase() ||
      'doc-' + Date.now()
  }
  emit('saveDoc', payload, coverFile)
}

function cancelEdit() {
  resetForm()
}

function exposeEditDoc(d: DocRecord) {
  editingDoc.value = d.slug
  Object.assign(form, {
    slug: d.slug,
    title: d.title,
    titleEn: d.titleEn || '',
    content: d.content,
    contentEn: d.contentEn || '',
    coverImage: d.coverImage || '',
    category: d.category,
    order: d.order,
  })
  coverFile = null
}

defineExpose({
  resetForm,
  exposeEditDoc,
  setError: (msg: string) => {
    error.value = msg
  },
})
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
.error-box {
  background: #fef2f2;
  color: #dc2626;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 16px;
}
.doc-cat-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}
.md-import-btn {
  background: #3b82f6;
  color: #fff;
  cursor: pointer;
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 4px;
  width: auto;
}
</style>
