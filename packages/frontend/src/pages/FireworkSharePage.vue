<template>
  <div class="share-page">
    <div v-if="loading" class="share-loading">
      <div class="spinner" />
      <p>{{ t('firework.share.loading') }}</p>
    </div>

    <div v-else-if="!recipe" class="share-error">
      <h2>{{ t('firework.share.notFound') }}</h2>
      <router-link to="/firework" class="back-link">{{ t('firework.share.createOwn') }}</router-link>
    </div>

    <div v-else class="share-content">
      <div class="recipe-hero">
        <h1 class="recipe-title">{{ recipe.title }}</h1>
        <p class="recipe-author">
          {{ recipe.authorName || t('firework.share.visitor') }}
          · {{ recipe.viewCount }} {{ t('firework.share.views') }}
          · {{ recipe.likeCount ?? 0 }} ❤️
        </p>
      </div>

      <div class="recipe-card">
        <h2 class="card-title">{{ t('firework.share.configTitle') }}</h2>
        <div class="config-grid">
          <div class="config-item">
            <span class="config-label">{{ t('firework.shellType') }}</span>
            <span class="config-value">{{ recipe.config?.shellType || '-' }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">{{ t('firework.shellSize') }}</span>
            <span class="config-value">{{ recipe.config?.shellSize || '-' }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">{{ t('firework.quality') }}</span>
            <span class="config-value">{{ recipe.config?.quality || '-' }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">{{ t('firework.skyLighting') }}</span>
            <span class="config-value">{{ recipe.config?.skyLighting ?? '-' }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">{{ t('firework.autoLaunch') }}</span>
            <span class="config-value">{{ recipe.config?.autoLaunch ? '✓' : '✗' }}</span>
          </div>
          <div class="config-item" v-if="recipe.config?.timeline?.length">
            <span class="config-label">Timeline</span>
            <span class="config-value">{{ recipe.config.timeline.length }} events</span>
          </div>
        </div>
      </div>

      <div class="share-actions">
        <button @click="startReplay" class="btn-primary">
          {{ replaying ? 'Replaying...' : 'Watch Replay' }}
        </button>
        <button @click="handleLike" class="btn-like" :disabled="liked">
          {{ liked ? '❤️ Liked' : '🤍 Like' }}
          <span v-if="currentLikeCount">({{ currentLikeCount }})</span>
        </button>
        <button @click="copyLink" class="btn-secondary">
          {{ t('firework.share.copyLink') }}
        </button>
        <template v-if="isOwner">
          <button @click="startEdit" class="btn-secondary">{{ editMode ? 'Cancel' : 'Edit Title' }}</button>
          <button @click="handleDelete" class="btn-danger" :disabled="deleting">
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </template>
      </div>

      <!-- Edit inline -->
      <div v-if="editMode" class="edit-row">
        <input v-model="editTitle" class="save-input" maxlength="30" />
        <button @click="doEdit" class="save-submit" :disabled="editSaving">
          {{ editSaving ? 'Saving...' : 'Save' }}
        </button>
      </div>

      <!-- Replay overlay -->
      <div v-if="replaying" class="replay-overlay" @click.self="stopReplay">
        <div class="replay-canvas-wrap" ref="replayWrap">
          <canvas ref="replayTrails" class="replay-canvas" />
          <canvas ref="replayMain" class="replay-canvas" />
        </div>
        <div class="replay-info">
          {{ recipe.title }} · {{ recipe.authorName || t('firework.share.visitor') }}
        </div>
        <div class="replay-progress" v-if="replayDuration > 0">
          <div class="replay-progress-fill" :style="{ width: (replayProgress / replayDuration * 100) + '%' }" />
        </div>
        <button @click="stopReplay" class="replay-close">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { api } from '@/api/client'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const route = useRoute()
const authStore = useAuthStore()

const loading = ref(true)
const recipe = ref<any>(null)
const liked = ref(false)
const currentLikeCount = ref(0)
const isOwner = ref(false)
const editMode = ref(false)
const editTitle = ref('')
const editSaving = ref(false)
const deleting = ref(false)

onMounted(async () => {
  const slug = route.params.slug as string
  try {
    const res = await api.get(`/fireworks/${slug}`)
    if (res.data.code === 0 && res.data.data) {
      recipe.value = res.data.data
      currentLikeCount.value = res.data.data.likeCount ?? 0
      // Check liked
      const likedMap = JSON.parse(localStorage.getItem('wanzai_liked') || '{}')
      liked.value = !!likedMap[slug]
      // Check owner
      if (authStore.user && authStore.user.id === res.data.data.userId) {
        isOwner.value = true
      }
    }
  } finally {
    loading.value = false
  }
})

function copyLink() {
  navigator.clipboard.writeText(window.location.href).catch(() => {})
}

async function handleLike() {
  const slug = route.params.slug as string
  if (liked.value) return
  try {
    const res = await api.post(`/fireworks/${slug}/like`)
    if (res.data.code === 0) {
      currentLikeCount.value = res.data.data.likeCount
      liked.value = true
      const likedMap = JSON.parse(localStorage.getItem('wanzai_liked') || '{}')
      likedMap[slug] = true
      localStorage.setItem('wanzai_liked', JSON.stringify(likedMap))
    }
  } catch { /* ignore */ }
}

function startEdit() {
  if (editMode.value) {
    editMode.value = false
    return
  }
  editTitle.value = recipe.value?.title || ''
  editMode.value = true
}

async function doEdit() {
  if (editSaving.value || !recipe.value) return
  editSaving.value = true
  try {
    const res = await api.put(`/fireworks/${recipe.value.id}`, { title: editTitle.value })
    recipe.value.title = res.data.data.title
    editMode.value = false
  } catch { alert('Failed to update') }
  finally { editSaving.value = false }
}

async function handleDelete() {
  if (deleting.value || !recipe.value) return
  if (!confirm(t('aiChat.confirmDelete'))) return
  deleting.value = true
  try {
    await api.delete(`/fireworks/${recipe.value.id}`)
    recipe.value = null
  } catch { alert('Failed to delete') }
  finally { deleting.value = false }
}

// --- Replay engine (minimal, inline) ---
const replaying = ref(false)
const replayWrap = ref<HTMLElement | null>(null)
const replayTrails = ref<HTMLCanvasElement | null>(null)
const replayMain = ref<HTMLCanvasElement | null>(null)
const replayProgress = ref(0)
const replayDuration = ref(0)
let replayEngine: any = null

async function startReplay() {
  if (!recipe.value) return
  replaying.value = true
  replayProgress.value = 0
  await nextTick()

  const config = recipe.value.config || {}
  const timeline = config.timeline
  if (timeline && timeline.length > 0) {
    replayDuration.value = Math.max(...timeline.map((e: any) => e.delay)) + 3000
  } else {
    replayDuration.value = 3000
  }

  // Create mini engine for replay
  const trails = replayTrails.value
  const main = replayMain.value
  const wrap = replayWrap.value
  if (!trails || !main || !wrap) return

  wrap.style.width = window.innerWidth + 'px'
  wrap.style.height = window.innerHeight + 'px'
  trails.width = window.innerWidth
  trails.height = window.innerHeight
  main.width = window.innerWidth
  main.height = window.innerHeight

  const tctx = trails.getContext('2d')!
  const mctx = main.getContext('2d')!

  // Mini engine: launch a shell at each timeline event
  const shellTypes = getMiniShellTypes()
  const startTime = Date.now()
  const events = timeline || [{ delay: 500, shellType: config.shellType || 'Random', shellSize: config.shellSize || 2, x: 0.5, height: 0.35 }]

  let fired = new Set<number>()

  replayEngine = { active: true }
  const loop = () => {
    if (!replayEngine.active) return
    const elapsed = Date.now() - startTime
    replayProgress.value = elapsed

    // Fire pending events
    for (let i = 0; i < events?.length; i++) {
      if (fired.has(i)) continue
      if (elapsed >= (events[i]?.delay || 0)) {
        fired.add(i)
        const ev = events[i]
        const sc = shellTypes[ev.shellType] || shellTypes['Random']
        if (sc) {
          const s = new MiniShell(sc(ev.shellSize || 2))
          launchMiniShell(s, ev.x || 0.5, ev.height || 0.35, window.innerWidth, window.innerHeight)
        }
      }
    }

    // Physics
    updateMiniParticles(16.67)

    // Render
    tctx.fillStyle = 'rgba(0,0,0,0.15)'
    tctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
    tctx.globalCompositeOperation = 'lighten'
    tctx.lineWidth = 2
    tctx.lineCap = 'round'
    const colors = ['#ff0043', '#14fc56', '#1e7fff', '#e60aff', '#ffbf36', '#ffffff']
    for (const c of colors) {
      tctx.strokeStyle = c
      tctx.beginPath()
      for (const s of miniStarActive.filter((s: any) => s.color === c)) {
        tctx.moveTo(s.x, s.y); tctx.lineTo(s.prevX, s.prevY)
      }
      tctx.stroke()
      tctx.beginPath()
      for (const s of miniSparkActive.filter((s: any) => s.color === c)) {
        tctx.moveTo(s.x, s.y); tctx.lineTo(s.prevX, s.prevY)
      }
      tctx.stroke()
    }
    tctx.globalCompositeOperation = 'source-over'

    mctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

    if (elapsed < replayDuration.value) {
      requestAnimationFrame(loop)
    }
  }
  requestAnimationFrame(loop)
}

function stopReplay() {
  if (replayEngine) replayEngine.active = false
  replaying.value = false
  miniStarActive = []
  miniSparkActive = []
}

// Minimal particle system for replay
let miniStarActive: any[] = []
let miniSparkActive: any[] = []
const G = 0.9

class MiniShell {
  spreadSize: number; starCount: number; starLife: number
  color: string | string[]; glitter: string; glitterColor: string
  constructor(o: any) {
    this.spreadSize = o.spreadSize || 400
    this.starCount = o.starCount || Math.max(6, (this.spreadSize / 54) ** 2 * (o.starDensity || 1))
    this.starLife = o.starLife || 1200
    this.color = o.color || '#ffbf36'
    this.glitter = o.glitter || ''
    this.glitterColor = o.glitterColor || '#ffbf36'
  }
}

function launchMiniShell(shell: MiniShell, posX: number, posH: number, w: number, h: number) {
  const x = posX * w
  const y = posH * h
  const speed = shell.spreadSize / 96
  const count = shell.starCount
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const sm = Math.random()
    const s = {
      x, y, prevX: x, prevY: y, color: Array.isArray(shell.color) ? shell.color[i % 2] : shell.color,
      speedX: Math.sin(angle) * speed * sm, speedY: Math.cos(angle) * speed * sm,
      life: shell.starLife + Math.random() * shell.starLife * 0.3, sparkTimer: 0, sparkFreq: 200,
    }
    miniStarActive.push(s)
  }
}

function updateMiniParticles(dt: number) {
  const g = (dt / 1000) * G
  for (let i = miniStarActive.length - 1; i >= 0; i--) {
    const s = miniStarActive[i]
    s.life -= dt
    if (s.life <= 0) { miniStarActive.splice(i, 1); continue }
    s.prevX = s.x; s.prevY = s.y
    s.x += s.speedX; s.y += s.speedY
    s.speedX *= 0.98; s.speedY *= 0.98
    s.speedY += g
    if (s.sparkFreq) {
      s.sparkTimer -= dt
      while (s.sparkTimer < 0) {
        s.sparkTimer += s.sparkFreq
        miniSparkActive.push({ x: s.x, y: s.y, prevX: s.x, prevY: s.y, color: '#ffbf36', speedX: (Math.random() - 0.5) * 0.5, speedY: Math.random() * 0.5, life: 400 })
      }
    }
  }
  for (let i = miniSparkActive.length - 1; i >= 0; i--) {
    const sp = miniSparkActive[i]
    sp.life -= dt
    if (sp.life <= 0) { miniSparkActive.splice(i, 1); continue }
    sp.prevX = sp.x; sp.prevY = sp.y
    sp.x += sp.speedX; sp.y += sp.speedY
    sp.speedX *= 0.9; sp.speedY *= 0.9
    sp.speedY += g
  }
}

function getMiniShellTypes(): Record<string, (size: number) => any> {
  const c = () => ['#ff0043', '#14fc56', '#1e7fff', '#e60aff', '#ffbf36', '#ffffff'][Math.floor(Math.random() * 6)]
  return {
    Random: (s) => ({ spreadSize: 300 + s * 100, starDensity: 1.25, starLife: 900 + s * 200, color: c() }),
    Crysanthemum: (s) => ({ spreadSize: 300 + s * 100, starDensity: 1.25, starLife: 900 + s * 200, color: c(), glitter: 'light', glitterColor: '#ffbf36' }),
    Crackle: (s) => ({ spreadSize: 380 + s * 75, starDensity: 1, starLife: 600 + s * 100, color: Math.random() < 0.75 ? '#ffbf36' : c(), glitter: 'light', glitterColor: '#ffbf36' }),
    Crossette: (s) => ({ spreadSize: 300 + s * 100, starDensity: 0.85, starLife: 750 + s * 160, color: c() }),
    FallingLeaves: (s) => ({ spreadSize: 300 + s * 120, starDensity: 0.12, starLife: 500 + s * 50, color: '_INVISIBLE_', glitter: 'medium', glitterColor: '#ffbf36' }),
    Floral: (s) => ({ spreadSize: 300 + s * 120, starDensity: 0.12, starLife: 500 + s * 50, color: c() }),
    Ghost: (s) => ({ spreadSize: 300 + s * 100, starDensity: 1.1, starLife: 1400 + s * 200, color: c() }),
    HorseTail: (s) => ({ spreadSize: 250 + s * 38, starDensity: 0.9, starLife: 2500 + s * 300, color: c() }),
    Palm: (s) => ({ spreadSize: 250 + s * 75, starDensity: 0.4, starLife: 1800 + s * 200, color: c() }),
    Ring: (s) => ({ spreadSize: 300 + s * 100, starDensity: 0.8, starLife: 900 + s * 200, color: c(), glitter: 'light', glitterColor: '#ffffff' }),
    Strobe: (s) => ({ spreadSize: 280 + s * 92, starDensity: 1.1, starLife: 1100 + s * 200, color: c(), glitter: 'light', glitterColor: '#ffffff' }),
    Willow: (s) => ({ spreadSize: 300 + s * 100, starDensity: 0.6, starLife: 3000 + s * 300, color: '_INVISIBLE_', glitter: 'willow', glitterColor: '#ffbf36' }),
  }
}

onUnmounted(() => {
  if (replayEngine) replayEngine.active = false
})
</script>

<style scoped>
.share-page { min-height: 100vh; background: #0a0a1a; display: flex; flex-direction: column; align-items: center; }
.share-loading, .share-error { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 16px; color: #fff; }
.spinner { width: 40px; height: 40px; border: 3px solid rgba(255,255,255,.1); border-top-color: #f59e0b; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.share-error h2 { font-size: 20px; margin: 0; color: #fff; }
.back-link { color: #f59e0b; text-decoration: none; }
.share-content { max-width: 600px; width: 100%; padding: 60px 24px; }
.recipe-hero { text-align: center; margin-bottom: 32px; }
.recipe-title { font-size: 28px; font-weight: 700; color: #fff; margin: 0 0 8px; }
.recipe-author { font-size: 14px; color: #9ca3af; margin: 0; }
.recipe-card { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08); border-radius: 16px; padding: 24px; margin-bottom: 32px; }
.card-title { font-size: 16px; color: #f59e0b; margin: 0 0 16px; }
.config-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.config-item { display: flex; flex-direction: column; gap: 2px; }
.config-label { font-size: 11px; color: #6b7280; text-transform: uppercase; }
.config-value { font-size: 14px; color: #e2e8f0; font-weight: 500; }
.share-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.btn-primary { padding: 12px 28px; background: linear-gradient(135deg, #dc2626, #d97706); color: #fff; border-radius: 12px; font-size: 15px; font-weight: 600; text-decoration: none; border: none; cursor: pointer; }
.btn-primary:hover { opacity: 0.9; }
.btn-secondary { padding: 12px 20px; background: rgba(255,255,255,.08); color: #e2e8f0; border: 1px solid rgba(255,255,255,.1); border-radius: 12px; font-size: 14px; cursor: pointer; }
.btn-secondary:hover { background: rgba(255,255,255,.12); }
.btn-like { padding: 12px 20px; background: rgba(239,68,68,.15); color: #fca5a5; border: 1px solid rgba(239,68,68,.3); border-radius: 12px; font-size: 14px; cursor: pointer; }
.btn-like:disabled { opacity: 0.7; cursor: default; }
.btn-like:hover:not(:disabled) { background: rgba(239,68,68,.25); }
.btn-danger { padding: 12px 20px; background: rgba(239,68,68,.2); color: #ef4444; border: 1px solid rgba(239,68,68,.4); border-radius: 12px; font-size: 14px; cursor: pointer; }
.btn-danger:hover { background: rgba(239,68,68,.35); }
.btn-danger:disabled { opacity: 0.5; }
.edit-row { display: flex; gap: 8px; margin-top: 16px; max-width: 340px; margin-left: auto; margin-right: auto; }
.save-input { flex: 1; padding: 10px 14px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.15); border-radius: 10px; color: #fff; font-size: 14px; outline: none; }
.save-input:focus { border-color: #f59e0b; }
.save-submit { padding: 10px 20px; background: linear-gradient(135deg, #dc2626, #d97706); color: #fff; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; }

/* Replay overlay */
.replay-overlay { position: fixed; inset: 0; z-index: 9999; background: #000; display: flex; align-items: center; justify-content: center; }
.replay-canvas-wrap { position: absolute; inset: 0; }
.replay-canvas { position: absolute; inset: 0; mix-blend-mode: lighten; }
.replay-info { position: absolute; top: 20px; left: 50%; transform: translateX(-50%); color: rgba(255,255,255,.7); font-size: 14px; background: rgba(0,0,0,.6); padding: 6px 20px; border-radius: 20px; }
.replay-progress { position: absolute; bottom: 30px; left: 10%; width: 80%; height: 4px; background: rgba(255,255,255,.15); border-radius: 2px; overflow: hidden; }
.replay-progress-fill { height: 100%; background: linear-gradient(90deg, #f59e0b, #ef4444); transition: width .1s; }
.replay-close { position: absolute; top: 20px; right: 20px; width: 44px; height: 44px; border-radius: 50%; background: rgba(0,0,0,.6); color: #fff; font-size: 20px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10; }
.replay-close:hover { background: rgba(239,68,68,.7); }
</style>
