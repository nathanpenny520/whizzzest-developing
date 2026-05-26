<template>
  <div class="comment-section max-w-3xl mx-auto px-4 py-12">
    <h3 class="text-xl font-bold text-gray-900 mb-6">{{ t('comments.title') }}</h3>

    <!-- Submit form -->
    <div class="mb-8">
      <div v-if="errorMsg" class="bg-red-50 text-red-600 text-xs rounded-lg px-3 py-2 mb-3">
        {{ errorMsg }}
      </div>
      <textarea
        v-model="newContent"
        :placeholder="t('comments.placeholder')"
        class="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-red-400"
        rows="3"
      ></textarea>
      <div class="flex justify-between items-center mt-2">
        <span v-if="!authStore.isLoggedIn" class="text-xs text-gray-400">
          {{ t('comments.loginPrompt') }}
          <button @click="promptLogin" class="text-red-500 hover:underline">
            {{ t('comments.login') }}
          </button>
        </span>
        <span v-else class="text-xs text-gray-400">
          {{ authStore.user?.nickname }}
        </span>
        <button
          @click="submitComment"
          :disabled="!newContent.trim() || submitting"
          class="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-600 disabled:opacity-50 transition-colors"
        >
          {{ t('comments.submit') }}
        </button>
      </div>
    </div>

    <!-- Comment list -->
    <div v-if="loading" class="text-center text-gray-400 text-sm py-8">
      {{ t('common.loading') }}
    </div>

    <div v-else-if="comments.length === 0" class="text-center text-gray-400 text-sm py-8">
      {{ t('comments.empty') }}
    </div>

    <div v-else class="space-y-6">
      <div v-for="comment in comments" :key="comment.id" class="border-b border-gray-100 pb-4">
        <div class="flex items-start gap-3">
          <img
            :src="comment.author.avatarUrl || defaultAvatar"
            class="w-8 h-8 rounded-full mt-0.5"
            alt=""
          />
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-sm font-medium text-gray-900">{{ comment.author.nickname }}</span>
              <span class="text-xs text-gray-400">{{ formatDate(comment.createdAt) }}</span>
            </div>
            <p class="text-sm text-gray-700 leading-relaxed">{{ comment.content }}</p>
            <div class="flex items-center gap-4 mt-2">
              <button
                @click="likeComment(comment)"
                :disabled="likingId === comment.id"
                class="text-xs transition-colors"
                :class="hasLiked(comment.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'"
              >
                {{ hasLiked(comment.id) ? '❤️' : '🤍' }} {{ comment.likes || 0 }}
              </button>
              <button
                @click="startReply(comment)"
                class="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                {{ t('comments.reply') }}
              </button>
              <button
                v-if="canDelete(comment)"
                @click="deleteComment(comment.id)"
                class="text-xs text-gray-300 hover:text-red-500 transition-colors"
              >
                {{ t('comments.delete') }}
              </button>
            </div>

            <!-- Reply input -->
            <div v-if="replyTargetId === comment.id" class="mt-3 ml-2">
              <textarea
                v-model="replyContent"
                :placeholder="t('comments.replyPlaceholder')"
                class="w-full border border-gray-200 rounded-lg p-2 text-xs resize-none focus:outline-none focus:border-red-400"
                rows="2"
              ></textarea>
              <div class="flex gap-2 mt-1">
                <button
                  @click="submitReply(comment.id)"
                  :disabled="!replyContent.trim()"
                  class="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 disabled:opacity-50"
                >
                  {{ t('comments.submit') }}
                </button>
                <button
                  @click="cancelReply"
                  class="text-gray-400 px-3 py-1 rounded text-xs hover:text-gray-600"
                >
                  {{ t('comments.cancel') }}
                </button>
              </div>
            </div>

            <!-- Replies -->
            <div v-if="comment.replies?.length" class="mt-3 ml-4 space-y-3">
              <div v-for="reply in comment.replies" :key="reply.id" class="flex items-start gap-2">
                <img
                  :src="reply.author.avatarUrl || defaultAvatar"
                  class="w-6 h-6 rounded-full mt-0.5"
                  alt=""
                />
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-medium text-gray-900">{{
                      reply.author.nickname
                    }}</span>
                    <span class="text-xs text-gray-400">{{ formatDate(reply.createdAt) }}</span>
                  </div>
                  <p class="text-xs text-gray-600 mt-0.5">{{ reply.content }}</p>
                  <div class="flex items-center gap-3 mt-1">
                    <button
                      @click="likeComment(reply)"
                      :disabled="likingId === reply.id"
                      class="text-xs transition-colors"
                      :class="
                        hasLiked(reply.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                      "
                    >
                      {{ hasLiked(reply.id) ? '❤️' : '🤍' }} {{ reply.likes || 0 }}
                    </button>
                    <button
                      v-if="canDelete(reply)"
                      @click="deleteComment(reply.id)"
                      class="text-xs text-gray-300 hover:text-red-500"
                    >
                      {{ t('comments.delete') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/api/client'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{ page: string }>()

const { t, locale } = useI18n()
const authStore = useAuthStore()

interface CommentAuthor {
  id: string
  nickname: string
  avatarUrl?: string
}

interface CommentItem {
  id: string
  page: string
  content: string
  author: CommentAuthor
  parentId?: string | null
  replies?: CommentItem[]
  likes: number
  createdAt: string
  likedBy?: { id: string }[]
}

const comments = ref<CommentItem[]>([])
const loading = ref(true)
const newContent = ref('')
const submitting = ref(false)
const replyTargetId = ref<string | null>(null)
const replyContent = ref('')
const errorMsg = ref('')
const likingId = ref<string | null>(null)
const likedIds = ref<Set<string>>(new Set())
const defaultAvatar =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23d1d5db"%3E%3Cpath d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/%3E%3C/svg%3E'

function clearError() {
  errorMsg.value = ''
}

function hasLiked(commentId: string) {
  return likedIds.value.has(commentId)
}

function formatDate(d: string) {
  const date = new Date(d)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return t('comments.justNow')
  if (mins < 60) return `${mins} ${t('comments.minutesAgo')}`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} ${t('comments.hoursAgo')}`
  return date.toLocaleDateString(locale.value === 'zh-CN' ? 'zh-CN' : 'en-US')
}

function promptLogin() {
  authStore.requireLogin(() => {}, 'comment')
}

function canDelete(comment: CommentItem) {
  return (
    authStore.user && (authStore.user.role === 'ADMIN' || authStore.user.id === comment.author.id)
  )
}

function findComment(items: CommentItem[], id: string): CommentItem | null {
  for (const item of items) {
    if (item.id === id) return item
    if (item.replies) {
      const found = findComment(item.replies, id)
      if (found) return found
    }
  }
  return null
}

async function fetchComments(showLoading = true) {
  if (showLoading) loading.value = true
  try {
    const params: Record<string, string> = { page: props.page }
    const res = await api.get('/comments', { params })
    if (res.data.code === 0) {
      comments.value = res.data.data as CommentItem[]
      // Rebuild likedIds from server data
      const ids = new Set<string>()
      function collectLiked(items: CommentItem[]) {
        for (const c of items) {
          if (c.likedBy && c.likedBy.length > 0) ids.add(c.id)
          if (c.replies) collectLiked(c.replies)
        }
      }
      collectLiked(comments.value)
      likedIds.value = ids
    }
  } catch {
    errorMsg.value = t('comments.error')
  } finally {
    loading.value = false
  }
}

async function doSubmitComment() {
  if (!newContent.value.trim() || submitting.value) return

  submitting.value = true
  clearError()
  try {
    const res = await api.post('/comments', { page: props.page, content: newContent.value })
    if (res.data.code === 0) {
      const created: CommentItem = { ...res.data.data, replies: [], likedBy: [] }
      comments.value = [created, ...comments.value]
    }
    newContent.value = ''
  } catch {
    errorMsg.value = t('comments.error')
  } finally {
    submitting.value = false
  }
}

function submitComment() {
  if (!authStore.isLoggedIn) {
    authStore.requireLogin(() => doSubmitComment(), 'comment')
    return
  }
  doSubmitComment()
}

function startReply(comment: CommentItem) {
  if (!authStore.isLoggedIn) {
    authStore.requireLogin(() => startReply(comment), 'comment')
    return
  }
  replyTargetId.value = comment.id
  replyContent.value = ''
}

function cancelReply() {
  replyTargetId.value = null
  replyContent.value = ''
}

async function submitReply(parentId: string) {
  if (!replyContent.value.trim()) return

  try {
    const res = await api.post('/comments', {
      page: props.page,
      content: replyContent.value,
      parentId,
    })
    if (res.data.code === 0) {
      const created: CommentItem = { ...res.data.data, replies: [], likedBy: [] }
      const parent = findComment(comments.value, parentId)
      if (parent) {
        if (!parent.replies) parent.replies = []
        parent.replies.push(created)
      }
    }
    cancelReply()
  } catch {
    errorMsg.value = t('comments.error')
  }
}

async function doLikeComment(comment: CommentItem) {
  if (likingId.value) return
  likingId.value = comment.id
  try {
    const res = await api.post(`/comments/${comment.id}/like`)
    const { liked } = res.data.data as { liked: boolean }
    if (liked) {
      likedIds.value = new Set([...likedIds.value, comment.id])
      comment.likes += 1
    } else {
      const next = new Set(likedIds.value)
      next.delete(comment.id)
      likedIds.value = next
      comment.likes -= 1
    }
  } catch {
    errorMsg.value = t('comments.error')
  } finally {
    likingId.value = null
  }
}

function likeComment(comment: CommentItem) {
  if (!authStore.isLoggedIn) {
    authStore.requireLogin(() => doLikeComment(comment), 'comment')
    return
  }
  doLikeComment(comment)
}

async function deleteComment(id: string) {
  // Optimistic removal — find and remove from local state immediately
  const removeFromList = (items: CommentItem[]): boolean => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === id) {
        items.splice(i, 1)
        return true
      }
      if (items[i].replies && removeFromList(items[i].replies!)) return true
    }
    return false
  }
  removeFromList(comments.value)

  try {
    await api.delete(`/comments/${id}`)
  } catch {
    errorMsg.value = t('comments.error')
    // Revert by re-fetching from server
    await fetchComments(false)
  }
}

onMounted(() => fetchComments(true))

watch(
  () => props.page,
  () => fetchComments(true),
)
</script>
