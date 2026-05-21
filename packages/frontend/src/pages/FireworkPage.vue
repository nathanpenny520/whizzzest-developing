<template>
  <div class="firework-page" ref="pageRef">
    <!-- SEO H1 Tag (visually hidden for full-screen experience) -->
    <h1 class="sr-only">{{ t('firework.title') }} - {{ t('siteName') }}</h1>
    <div class="loading-init" v-if="loading">
      <div class="loading-init__header">{{ t('firework.loading') }}</div>
      <div class="loading-init__status">{{ loadingStatus }}</div>
    </div>

    <div class="stage-container" ref="stageContainer">
      <div class="background-layer" ref="backgroundLayer"></div>
      <div class="sky-light-layer" ref="skyLightLayer"></div>
      <div class="canvas-container" ref="canvasContainer">
        <canvas id="trails-canvas" ref="trailsCanvas"></canvas>
        <canvas id="main-canvas" ref="mainCanvas"></canvas>
      </div>
    </div>

    <div class="controls" v-if="!loading">
      <div class="btn pause-btn" @click="togglePause">
        <svg v-if="isPaused" fill="white" width="24" height="24" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
        <svg v-else fill="white" width="24" height="24" viewBox="0 0 24 24">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
      </div>
      <div class="btn sound-btn" @click="toggleSound">
        <svg v-if="soundEnabled" fill="white" width="24" height="24" viewBox="0 0 24 24">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        </svg>
        <svg v-else fill="white" width="24" height="24" viewBox="0 0 24 24">
          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
        </svg>
      </div>
      <div class="btn save-btn" @click="handleSave" :title="currentLocale === 'zh-CN' ?'保存配方' : 'Save Recipe'">
        <svg fill="white" width="22" height="22" viewBox="0 0 24 24">
          <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
        </svg>
      </div>
      <div class="btn settings-btn" @click="showSettings = !showSettings">
        <svg fill="white" width="24" height="24" viewBox="0 0 24 24">
          <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
        </svg>
      </div>
    </div>

    <!-- Sim Speed 拖拽条 (Phase B2) -->
    <div class="sim-speed-bar" ref="simSpeedBarRef"
      @mousedown="startSimSpeedDrag" @touchstart.prevent="startSimSpeedDrag"
      @mouseenter="showSimSpeedLabel = true" @mouseleave="hideSimSpeedLabel">
      <div class="sim-speed-fill" :style="{ width: (simSpeed * 100) + '%' }" />
      <div class="sim-speed-label" :class="{ visible: showSimSpeedLabel }">
        {{ t('firework.simSpeed') }}: {{ (simSpeed * 100).toFixed(0) }}%
      </div>
    </div>

    <div class="menu" :class="{ hide: !showSettings }">
      <div class="menu__inner-wrap">
        <div class="btn btn--bright close-menu-btn" @click="showSettings = false">
          <svg fill="white" width="24" height="24" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </div>
        <div class="menu__header">{{ t('firework.settings') }}</div>
        <div class="menu__subheader">{{ t('firework.settingsHint') }}</div>
        <form @submit.prevent>
          <div class="form-option form-option--select">
            <label>{{ t('firework.shellType') }}</label>
            <select v-model="shellType">
              <option value="Random">{{ t('firework.types.random') }}</option>
              <option value="Crackle">{{ t('firework.types.crackle') }}</option>
              <option value="Crossette">{{ t('firework.types.crossette') }}</option>
              <option value="Crysanthemum">{{ t('firework.types.crysanthemum') }}</option>
              <option value="Falling Leaves">{{ t('firework.types.fallingLeaves') }}</option>
              <option value="Floral">{{ t('firework.types.floral') }}</option>
              <option value="Ghost">{{ t('firework.types.ghost') }}</option>
              <option value="Horse Tail">{{ t('firework.types.horseTail') }}</option>
              <option value="Palm">{{ t('firework.types.palm') }}</option>
              <option value="Ring">{{ t('firework.types.ring') }}</option>
              <option value="Strobe">{{ t('firework.types.strobe') }}</option>
              <option value="Willow">{{ t('firework.types.willow') }}</option>
              <option value="Text">{{ t('firework.types.text') }}</option>
            </select>
          </div>
          <div class="form-option form-option--select">
            <label>{{ t('firework.shellSize') }}</label>
            <select v-model="shellSize">
              <option value="1">3"</option>
              <option value="2">4"</option>
              <option value="3">6"</option>
              <option value="4">8"</option>
              <option value="5">12"</option>
            </select>
          </div>
          <div class="form-option form-option--select">
            <label>{{ t('firework.quality') }}</label>
            <select v-model="quality">
              <option value="1">{{ t('firework.qualityLow') }}</option>
              <option value="2">{{ t('firework.qualityMedium') }}</option>
              <option value="3">{{ t('firework.qualityHigh') }}</option>
            </select>
          </div>
          <div class="form-option form-option--select">
            <label>{{ t('firework.skyLighting') }}</label>
            <select v-model="skyLighting">
              <option value="0">{{ t('firework.skyLightingNone') }}</option>
              <option value="1">{{ t('firework.skyLightingDim') }}</option>
              <option value="2">{{ t('firework.skyLightingNormal') }}</option>
            </select>
          </div>
          <div class="form-option form-option--checkbox">
            <label>{{ t('firework.autoLaunch') }}</label>
            <input type="checkbox" v-model="autoLaunch" />
          </div>
          <div class="form-option form-option--checkbox">
            <label>{{ t('firework.finaleMode') }}</label>
            <input type="checkbox" v-model="finaleMode" />
          </div>
          <div class="form-option form-option--checkbox">
            <label :title="t('firework.longExposureHint')">{{ t('firework.longExposure') }}</label>
            <input type="checkbox" v-model="longExposure" />
            <span class="form-hint">{{ t('firework.longExposureHint') }}</span>
          </div>
          <div class="form-option form-option--select">
            <label>{{ t('firework.launchSequence') }}</label>
            <select v-model="launchSequence">
              <option value="random">{{ t('firework.seqRandom') }}</option>
              <option value="twoRandom">{{ t('firework.seqTwoRandom') }}</option>
              <option value="triple">{{ t('firework.seqTriple') }}</option>
              <option value="pyramid">{{ t('firework.seqPyramid') }}</option>
              <option value="smallBarrage">{{ t('firework.seqSmallBarrage') }}</option>
            </select>
          </div>
          <div class="form-option form-option--checkbox form-option--fullscreen">
            <label>{{ t('firework.fullscreen') }}</label>
            <input type="checkbox" v-model="fullscreen" @change="toggleFullscreen" />
          </div>
          <div class="form-option form-option--select">
            <label>{{ t('firework.background') }}</label>
            <select v-model="backgroundType">
              <option v-for="opt in backgroundOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
          <!-- 文字预设 -->
          <div class="form-option">
            <label>{{ t('firework.textPresets.label') }}</label>
            <div class="text-presets-row">
              <input v-model="newPreset" maxlength="4"
                :placeholder="t('firework.textPresets.placeholder')"
                class="text-firework-input" @keyup.enter="addTextPreset" />
              <button @click="addTextPreset" class="text-firework-btn"
                :disabled="!newPreset.trim() || textPresets.length >= 8">
                {{ t('firework.textPresets.add') }}
              </button>
            </div>
            <div class="text-presets-tags" v-if="textPresets.length">
              <span v-for="(p, i) in textPresets" :key="i" class="preset-tag"
                @click="launchTextFirework(p)">
                {{ p }}
                <button class="preset-remove" @click.stop="removeTextPreset(i)">×</button>
              </span>
            </div>
          </div>
          <!-- 颜色选择器 Phase D1 -->
          <div class="form-option">
            <label>{{ t('firework.customColor') }}</label>
            <div class="color-picker-row">
              <button v-for="c in presetColors" :key="c" class="color-swatch"
                :style="{ background: c }"
                :class="{ active: customColor === c }"
                @click="customColor = customColor === c ? null : c" />
              <input type="color" v-model="colorPickerHex" class="color-hex-input"
                @change="customColor = colorPickerHex" />
              <button v-if="customColor" class="color-reset" @click="customColor = null">×</button>
            </div>
          </div>
          <!-- 录制模式 Phase C1 -->
          <div class="form-option form-option--checkbox">
            <label>{{ t('firework.recordMode') }}</label>
            <input type="checkbox" v-model="isRecording" />
          </div>
          <div v-if="isRecording" class="record-status">
            {{ t('firework.recording', { count: timeline.length, time: formatDuration(totalRecordTime) }) }}
            <button class="text-firework-btn" @click="clearRecording">{{ t('firework.clearRecording') }}</button>
          </div>
          <!-- 高级参数 Phase D3 -->
          <details class="advanced-params">
            <summary>{{ t('firework.advancedParams') }}</summary>
            <div class="form-option">
              <label>{{ t('firework.gravity') }} ({{ gravity }})</label>
              <input type="range" min="0.5" max="1.5" step="0.1" v-model.number="gravity" class="param-slider" />
            </div>
            <div class="form-option">
              <label>{{ t('firework.particleDensity') }} ({{ particleDensity }})</label>
              <input type="range" min="0.5" max="2.0" step="0.1" v-model.number="particleDensity" class="param-slider" />
            </div>
            <div class="form-option">
              <label>{{ t('firework.sparkAmount') }} ({{ sparkAmount }})</label>
              <input type="range" min="0.5" max="2.0" step="0.1" v-model.number="sparkAmount" class="param-slider" />
            </div>
            <p class="param-hint">{{ t('firework.advancedHint') }}</p>
          </details>
        </form>
      </div>
    </div>

    <div class="back-btn" @click="goBack">
      <svg fill="white" width="24" height="24" viewBox="0 0 24 24">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
      </svg>
      <span>{{ t('firework.back') }}</span>
    </div>

    <router-link :to="currentLocale === 'zh-CN' ? '/firework/leaderboard' : '/en/firework/leaderboard'"
      class="leaderboard-entry-btn">
      🏆 {{ currentLocale === 'zh-CN' ? '排行榜' : 'Rankings' }}
    </router-link>

    <div class="lang-btn" @click="toggleLanguage">
      <span>{{ currentLocale === 'zh-CN' ? 'EN' : '中文' }}</span>
    </div>

    <!-- 保存对话框 -->
    <div v-if="showSaveDialog" class="save-overlay" @click.self="showSaveDialog = false">
      <div class="save-card" v-if="!saveSuccess">
        <h3>{{ t('firework.saveDialog.title') }}</h3>
        <p class="save-desc">{{ t('firework.saveDialog.description') }}</p>
        <input v-model="saveTitle" class="save-input" maxlength="30"
          :placeholder="t('firework.saveDialog.placeholder')" />
        <div class="save-btns">
          <button class="save-submit" @click="doSave" :disabled="saveLoading">
            {{ saveLoading ? t('firework.saveDialog.saving') : t('firework.saveDialog.save') }}
          </button>
          <button class="save-cancel" @click="showSaveDialog = false">{{ t('firework.saveDialog.cancel') }}</button>
        </div>
      </div>
      <div class="save-card" v-else>
        <h3>{{ t('firework.saveDialog.success') }}</h3>
        <p class="save-slug">{{ t('firework.saveDialog.shareGenerated') }}</p>
        <div class="share-url-box">
          <code>{{ shareUrl }}</code>
        </div>
        <div class="save-btns">
          <button class="save-submit" @click="copyShareLink">{{ t('firework.saveDialog.copyLink') }}</button>
          <button class="save-cancel" @click="showSaveDialog = false">{{ t('firework.saveDialog.close') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/*
 * 烟花引擎 - 复刻自 Firework_Simulator
 * Copyright © 2022 NianBroken. All rights reserved.
 * Github：https://github.com/NianBroken/Firework_Simulator
 * 本项目采用 Apache-2.0 许可证
 */
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/api/client'
import defaultBgImage from '../assets/images/guchen_yanhua.jpeg'
import shootingstarsBgImage from '../assets/images/shootingstars.jpeg';
import moonuniverseBgImage from '../assets/images/moonuniverse.jpeg';
import mountainsBgImage from '../assets/images/mountains.jpeg';

// 背景图片选项
const getBackgroundOptions = (t: any) => [
  { value: 'default', label: t('firework.bgDefault'), image: defaultBgImage },
  { value: 'shootingstars', label: t('firework.bgShootingStars'), image: shootingstarsBgImage },
  { value: 'moonuniverse', label: t('firework.bgMoonUniverse'), image: moonuniverseBgImage },
  { value: 'mountains', label: t('firework.bgMountains'), image: mountainsBgImage },
  { value: 'none', label: t('firework.bgNone'), image: null },
];

const backgroundOptions = computed(() => getBackgroundOptions(t));

const router = useRouter();
const route = useRoute();
const { t, locale } = useI18n();

const currentLocale = computed(() => locale.value);

// 状态
const loading = ref(true)
const loadingStatus = ref(t('firework.loadingStatus'))
const initError = ref('')
const isPaused = ref(false);
const soundEnabled = ref(true);
const showSettings = ref(false);
const shellType = ref('Random');
const shellSize = ref('2');
const quality = ref('2');
const skyLighting = ref('2');
const autoLaunch = ref(true);
const finaleMode = ref(false);
const fullscreen = ref(false);

const backgroundType = ref('default')

// 文字烟花（Phase A1/A2: 整合为主引擎 Shell 类型）
const textPresets = ref<string[]>(loadTextPresets())
const newPreset = ref('')

// 在 window 上暴露预设列表供引擎 textShell 使用
;(window as any).__wanzaiTextPresets = textPresets.value

function addTextPreset() {
  const val = newPreset.value.trim()
  if (!val || textPresets.value.length >= 8) return
  textPresets.value.push(val)
  saveTextPresets(textPresets.value)
  ;(window as any).__wanzaiTextPresets = textPresets.value
  newPreset.value = ''
}
function removeTextPreset(i: number) {
  textPresets.value.splice(i, 1)
  saveTextPresets(textPresets.value)
  ;(window as any).__wanzaiTextPresets = textPresets.value
}

// 发射文字烟花：创建 Text Shell 直接爆在屏幕中间
function launchTextFirework(text: string) {
  if (!text || !fireworkEngine) return

  const lattice = rasterizeText(text, 3)
  if (!lattice || lattice.points.length === 0) return

  const cx = 0.5
  const cy = 0.35
  const x = cx * fireworkEngine.width
  const y = cy * fireworkEngine.height

  const config = textShell(0, text) as any
  if (!config) return
  config.textLattice = lattice

  // 录制文字烟花
  if (isRecording.value) {
    timeline.value.push({
      delay: Date.now() - recordStartTime.value,
      shellType: 'Text',
      shellSize: 3,
      x: cx,
      height: cy,
      text,
    })
  }

  const shell = new Shell(config)
  shell.burst(x, y, fireworkEngine)
}

// Phase B/C/D 新增状态
const longExposure = ref(false)
const launchSequence = ref('random')
const simSpeed = ref(0.9)
const showSimSpeedLabel = ref(false)
const isRecording = ref(false)
const timeline = ref<{ delay: number; shellType: string; shellSize: number; x: number; height: number; text?: string }[]>([])
const recordStartTime = ref(0)
const totalRecordTime = ref(0)
let recordTimer: ReturnType<typeof setInterval> | null = null

watch(isRecording, (val) => {
  if (val) {
    recordStartTime.value = Date.now()
    totalRecordTime.value = 0
    recordTimer = setInterval(() => {
      totalRecordTime.value = Date.now() - recordStartTime.value
    }, 200)
  } else {
    if (recordTimer) { clearInterval(recordTimer); recordTimer = null }
  }
})

const customColor = ref<string | null>(null)
const presetColors = ['#ff0043', '#14fc56', '#1e7fff', '#e60aff', '#ffbf36', '#ffffff']
const colorPickerHex = ref('#ff0043')
const gravity = ref(0.9)
const particleDensity = ref(1.0)
const sparkAmount = ref(1.0)
const simSpeedBarRef = ref<HTMLElement | null>(null)
let simSpeedLabelTimer: ReturnType<typeof setTimeout> | null = null

function hideSimSpeedLabel() {
  simSpeedLabelTimer = setTimeout(() => { showSimSpeedLabel.value = false }, 800)
}

function formatDuration(ms: number) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, '0')}`
}

function clearRecording() {
  timeline.value = []
  recordStartTime.value = 0
}

// Sim Speed 拖拽
function startSimSpeedDrag(e: MouseEvent | TouchEvent) {
  e.preventDefault()
  showSimSpeedLabel.value = true
  if (simSpeedLabelTimer) clearTimeout(simSpeedLabelTimer)
  const update = (clientX: number) => {
    if (!simSpeedBarRef.value) return
    const rect = simSpeedBarRef.value.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    simSpeed.value = Math.round(ratio * 100) / 100
    if (fireworkEngine) fireworkEngine.config.simSpeed = simSpeed.value
  }
  if ('touches' in e) update(e.touches[0].clientX)
  else update(e.clientX)

  const onMove = (ev: MouseEvent | TouchEvent) => {
    const cx = 'touches' in ev ? (ev as TouchEvent).touches[0].clientX : (ev as MouseEvent).clientX
    update(cx)
  }
  const onUp = () => {
    hideSimSpeedLabel()
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('touchmove', onMove)
    document.removeEventListener('mouseup', onUp)
    document.removeEventListener('touchend', onUp)
  }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('touchmove', onMove)
  document.addEventListener('mouseup', onUp)
  document.addEventListener('touchend', onUp)
}

// 保存配方
const showSaveDialog = ref(false)
const saveTitle = ref('')
const shareSlug = ref('')
const saveSuccess = ref(false)
const saveLoading = ref(false)

const authStore = useAuthStore()

function handleSave() {
  authStore.requireLogin(() => {
    showSaveDialog.value = true
    saveSuccess.value = false
    saveTitle.value = currentLocale.value === 'zh-CN' ? '我的烟花秀' : 'My Firework Show'
    shareSlug.value = ''
  }, 'save_firework')
}

async function doSave() {
  if (saveLoading.value) return
  saveLoading.value = true
  try {
    const config = {
      shellType: shellType.value,
      shellSize: Number(shellSize.value),
      quality: Number(quality.value),
      skyLighting: Number(skyLighting.value),
      autoLaunch: autoLaunch.value,
      finaleMode: finaleMode.value,
      soundEnabled: soundEnabled.value,
      backgroundImage: backgroundType.value === 'none' ? null : backgroundType.value,
      longExposure: longExposure.value,
      simSpeed: simSpeed.value,
      launchSequence: launchSequence.value,
      textFirework: { enabled: textPresets.value.length > 0, preset: textPresets.value },
      customColor: customColor.value,
      textPresets: textPresets.value,
      gravity: gravity.value,
      particleDensity: particleDensity.value,
      sparkAmount: sparkAmount.value,
      timeline: timeline.value.length > 0 ? timeline.value : undefined,
    }
    const res = await api.post('/fireworks', { title: saveTitle.value, config })
    shareSlug.value = res.data.data.shareSlug
    saveSuccess.value = true
  } catch {
    alert(t('common.saveFailed'))
  } finally {
    saveLoading.value = false
  }
}

const shareUrl = computed(() => `${window.location.origin}/firework/share/${shareSlug.value}`)

function copyShareLink() {
  navigator.clipboard.writeText(shareUrl.value).catch(() => {})
}

// DOM refs
const stageContainer = ref<HTMLElement | null>(null);
const backgroundLayer = ref<HTMLElement | null>(null);
const skyLightLayer = ref<HTMLElement | null>(null);
const canvasContainer = ref<HTMLElement | null>(null);
const trailsCanvas = ref<HTMLCanvasElement | null>(null)
const mainCanvas = ref<HTMLCanvasElement | null>(null)
// 烟花引擎实例
let fireworkEngine: FireworkEngine | null = null;

onMounted(() => {
  const path = route.path;
  if (path.startsWith('/en')) {
    locale.value = 'en';
    localStorage.setItem('locale', 'en');
  } else {
    locale.value = 'zh-CN';
    localStorage.setItem('locale', 'zh-CN');
  }
  initFirework()

  // 8 秒超时兜底
  setTimeout(() => {
    if (loading.value) {
      loading.value = false
      if (!fireworkEngine) {
        initError.value = currentLocale.value === 'zh-CN'
          ? '引擎初始化超时，请刷新页面重试'
          : 'Engine init timeout, please refresh'
      }
    }
  }, 8000)
})

onUnmounted(() => {
  if (recordTimer) { clearInterval(recordTimer); recordTimer = null }
  if (fireworkEngine) {
    fireworkEngine.destroy();
    fireworkEngine = null;
  }
});

function goBack() {
  const currentPath = route.path;
  if (currentPath.startsWith('/en')) {
    router.push('/en#firework-section');
  } else {
    router.push('/#firework-section');
  }
}

function toggleLanguage() {
  const currentPath = route.path;
  let newPath = '';

  if (currentPath === '/firework') {
    newPath = '/en/firework';
  } else if (currentPath === '/en/firework') {
    newPath = '/firework';
  } else if (currentPath.startsWith('/en')) {
    newPath = currentPath.replace('/en', '') || '/';
  } else {
    newPath = '/en' + currentPath;
  }

  const newLocale = newPath.startsWith('/en') ? 'en' : 'zh-CN';
  locale.value = newLocale;
  localStorage.setItem('locale', newLocale);
  router.replace(newPath);
}

function togglePause() {
  isPaused.value = !isPaused.value;
  if (fireworkEngine) {
    fireworkEngine.setPaused(isPaused.value);
  }
}

function toggleSound() {
  soundEnabled.value = !soundEnabled.value;
  if (fireworkEngine) {
    fireworkEngine.setSoundEnabled(soundEnabled.value);
  }
}

function toggleFullscreen() {
  if (fullscreen.value) {
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}

watch([shellType, shellSize, quality, skyLighting, autoLaunch, finaleMode, backgroundType, longExposure, launchSequence, simSpeed, gravity, particleDensity, sparkAmount, customColor], () => {
  if (fireworkEngine) {
    const selectedBg = backgroundOptions.value.find((opt: any) => opt.value === backgroundType.value);
    fireworkEngine.updateConfig({
      shellType: shellType.value,
      shellSize: parseInt(shellSize.value),
      quality: parseInt(quality.value),
      skyLighting: parseInt(skyLighting.value),
      autoLaunch: autoLaunch.value,
      finaleMode: finaleMode.value,
      longExposure: longExposure.value,
      launchSequence: launchSequence.value,
      simSpeed: simSpeed.value,
      gravity: gravity.value,
      particleDensity: particleDensity.value,
      sparkAmount: sparkAmount.value,
      customColor: customColor.value,
      backgroundImage: selectedBg?.image || null
    });
  }
});

function initFirework() {
  loadingStatus.value = t('firework.initializing');

  if (!trailsCanvas.value || !mainCanvas.value || !canvasContainer.value || !stageContainer.value || !backgroundLayer.value || !skyLightLayer.value) {
    return;
  }

  const selectedBg = backgroundOptions.value.find((opt: any) => opt.value === backgroundType.value);

  fireworkEngine = new FireworkEngine(
    trailsCanvas.value,
    mainCanvas.value,
    canvasContainer.value,
    stageContainer.value,
    backgroundLayer.value,
    skyLightLayer.value,
    {
      shellType: shellType.value,
      shellSize: parseInt(shellSize.value),
      quality: parseInt(quality.value),
      skyLighting: parseInt(skyLighting.value),
      autoLaunch: autoLaunch.value,
      finaleMode: finaleMode.value,
      soundEnabled: soundEnabled.value,
      backgroundImage: selectedBg?.image || null,
      longExposure: longExposure.value,
      simSpeed: simSpeed.value,
      launchSequence: launchSequence.value,
      gravity: gravity.value,
      particleDensity: particleDensity.value,
      sparkAmount: sparkAmount.value,
      customColor: customColor.value,
    },
    () => {
      loading.value = false;
    }
  );

  // Phase C1: 录制模式回调（所有通过 launchShell 的发射都会被记录）
  fireworkEngine.onShellLaunch = (shellType, shellSize, x, height) => {
    if (isRecording.value) {
      timeline.value.push({
        delay: Date.now() - recordStartTime.value,
        shellType,
        shellSize,
        x,
        height,
      })
    }
  }
}

// ========== 烟花引擎类（复刻自原始代码） ==========

// 常量
const INVISIBLE = '_INVISIBLE_';
const PI_HALF = Math.PI * 0.5;
const PI_2 = Math.PI * 2;
const GRAVITY = 0.9;

// 颜色定义
const COLOR = {
  Red: "#ff0043",
  Green: "#14fc56",
  Blue: "#1e7fff",
  Purple: "#e60aff",
  Gold: "#ffbf36",
  White: "#ffffff",
};

// 颜色代码数组
const COLOR_CODES = Object.values(COLOR);
const COLOR_CODES_W_INVIS = [...COLOR_CODES, INVISIBLE];

// 颜色RGB元组映射
const COLOR_TUPLES: Record<string, { r: number; g: number; b: number }> = {};
COLOR_CODES.forEach((hex: string) => {
  COLOR_TUPLES[hex] = {
    r: parseInt(hex.substr(1, 2), 16),
    g: parseInt(hex.substr(3, 2), 16),
    b: parseInt(hex.substr(5, 2), 16),
  };
});

// 随机颜色选择
let lastColor: string | null = null;
function randomColorSimple(): string {
  return COLOR_CODES[(Math.random() * COLOR_CODES.length) | 0];
}

function randomColor(options?: { notSame?: boolean; notColor?: string; limitWhite?: boolean }): string {
  const notSame = options && options.notSame;
  const notColor = options && options.notColor;
  const limitWhite = options && options.limitWhite;
  let color = randomColorSimple();

  if (limitWhite && color === COLOR.White && Math.random() < 0.6) {
    color = randomColorSimple();
  }

  if (notSame) {
    while (color === lastColor) {
      color = randomColorSimple();
    }
  } else if (notColor) {
    while (color === notColor) {
      color = randomColorSimple();
    }
  }

  lastColor = color;
  return color;
}

function whiteOrGold(): string {
  return Math.random() < 0.5 ? COLOR.Gold : COLOR.White;
}

function makePistilColor(shellColor: string): string {
  return shellColor === COLOR.White || shellColor === COLOR.Gold
    ? randomColor({ notColor: shellColor })
    : whiteOrGold();
}

// 文字栅格化（Phase A1：文字烟花融入主引擎）
function rasterizeText(text: string, density = 3): { width: number; height: number; points: { x: number; y: number }[] } {
  const offCanvas = document.createElement('canvas')
  const fontSize = 80 + Math.random() * 50
  offCanvas.width = Math.ceil(text.length * fontSize * 0.8 + 20)
  offCanvas.height = Math.ceil(fontSize * 1.4)
  const ctx = offCanvas.getContext('2d')
  if (!ctx) return { width: 0, height: 0, points: [] }

  ctx.fillStyle = '#ffffff'
  ctx.font = `bold ${fontSize}px "PingFang SC","Microsoft YaHei",sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, offCanvas.width / 2, offCanvas.height / 2)

  const imageData = ctx.getImageData(0, 0, offCanvas.width, offCanvas.height)
  const points: { x: number; y: number }[] = []
  for (let y = 0; y < offCanvas.height; y += density) {
    for (let x = 0; x < offCanvas.width; x += density) {
      const idx = (y * offCanvas.width + x) * 4
      if (imageData.data[idx + 3] > 100) {
        points.push({ x, y })
      }
    }
  }
  return { width: offCanvas.width, height: offCanvas.height, points }
}

// 文字烟花 Shell 工厂（与其他 12 种 Shell 类型平级）
function textShell(_size: number, text: string): any {
  const lattice = rasterizeText(text)
  if (lattice.points.length === 0) return null
  const color = Math.random() < 0.5 ? [COLOR.Gold, COLOR.Red] : [COLOR.Gold, randomColor({ notColor: COLOR.Gold })]
  return {
    shellSize: 3,
    spreadSize: Math.max(lattice.width, lattice.height) * 0.8,
    starLife: 1200,
    starLifeVariation: 0.3,
    starDensity: 0.3,
    color,
    glitter: 'light',
    glitterColor: COLOR.Gold,
    textLattice: lattice,
    textStrobe: Math.random() < 0.5,
  }
}

// 文字烟花预设（localStorage 持久化）
function loadTextPresets(): string[] {
  try {
    const stored = localStorage.getItem('wanzai_text_presets')
    if (stored) return JSON.parse(stored)
  } catch {}
  return ['万载', '花傩', '焰境', '烟花']
}
function saveTextPresets(presets: string[]) {
  localStorage.setItem('wanzai_text_presets', JSON.stringify(presets))
}

// 创建粒子集合（按颜色分组）
function createParticleCollection(): Record<string, any[]> {
  const collection: Record<string, any[]> = {};
  COLOR_CODES_W_INVIS.forEach((color: string) => {
    collection[color] = [];
  });
  return collection;
}

// Star 对象池管理（复刻原始代码）
const StarManager = {
  airDrag: 0.98,
  airDragHeavy: 0.992,
  active: createParticleCollection(),
  _pool: [] as any[],

  _new(): any {
    return {};
  },

  add(
    x: number, y: number, color: string, angle: number, speed: number, life: number,
    speedOffX = 0, speedOffY = 0, size = 3
  ): any {
    const instance = this._pool.pop() || this._new();
    instance.visible = true;
    instance.heavy = false;
    instance.x = x;
    instance.y = y;
    instance.prevX = x;
    instance.prevY = y;
    instance.color = color === 'random' ? randomColor() : color;
    instance.speedX = Math.sin(angle) * speed + speedOffX;
    instance.speedY = Math.cos(angle) * speed + speedOffY;
    instance.life = life;
    instance.fullLife = life;
    instance.size = size;
    instance.spinAngle = Math.random() * PI_2;
    instance.spinSpeed = 0.8;
    instance.spinRadius = 0;
    instance.sparkFreq = 0;
    instance.sparkSpeed = 1;
    instance.sparkTimer = 0;
    instance.sparkColor = color === 'random' ? randomColor() : color;
    instance.sparkLife = 750;
    instance.sparkLifeVariation = 0.25;
    instance.strobe = false;
    instance.onDeath = null;
    instance.secondColor = null;
    instance.transitionTime = 0;
    instance.colorChanged = false;
    instance.updateFrame = 0;

    this.active[instance.color].push(instance);
    return instance;
  },

  returnInstance(instance: any) {
    if (instance.onDeath) instance.onDeath(instance);
    instance.onDeath = null;
    instance.secondColor = null;
    instance.transitionTime = 0;
    instance.colorChanged = false;
    this._pool.push(instance);
  },

  reset() {
    COLOR_CODES_W_INVIS.forEach((color: string) => {
      this.active[color] = [];
    });
    this._pool = [];
  }
};

// Spark 对象池管理
const SparkManager = {
  drawWidth: 1,
  airDrag: 0.9,
  active: createParticleCollection(),
  _pool: [] as any[],

  _new(): any {
    return {};
  },

  add(x: number, y: number, color: string, angle: number, speed: number, life: number): any {
    const instance = this._pool.pop() || this._new();
    instance.x = x;
    instance.y = y;
    instance.prevX = x;
    instance.prevY = y;
    instance.color = color;
    instance.speedX = Math.sin(angle) * speed;
    instance.speedY = Math.cos(angle) * speed;
    instance.life = life;
    this.active[color].push(instance);
    return instance;
  },

  returnInstance(instance: any) {
    this._pool.push(instance);
  },

  reset() {
    COLOR_CODES_W_INVIS.forEach((color: string) => {
      this.active[color] = [];
    });
    this._pool = [];
  }
};

// BurstFlash 爆炸闪光效果
const BurstFlashManager = {
  active: [] as any[],
  _pool: [] as any[],

  add(x: number, y: number, radius: number): any {
    const instance = this._pool.pop() || {};
    instance.x = x;
    instance.y = y;
    instance.radius = radius;
    this.active.push(instance);
    return instance;
  },

  returnInstance(instance: any) {
    this._pool.push(instance);
  },

  reset() {
    this.active = [];
    this._pool = [];
  }
};

// 创建球形爆发
function createBurst(
  count: number, particleFactory: (angle: number, speedMult: number) => void,
  startAngle = 0, arcLength = PI_2
): void {
  const R = 0.5 * Math.sqrt(count / Math.PI);
  const C = 2 * R * Math.PI;
  const C_HALF = C / 2;

  for (let i = 0; i <= C_HALF; i++) {
    const ringAngle = (i / C_HALF) * PI_HALF;
    const ringSize = Math.cos(ringAngle);
    const partsPerFullRing = C * ringSize;
    const partsPerArc = partsPerFullRing * (arcLength / PI_2);

    const angleInc = PI_2 / partsPerFullRing;
    const angleOffset = Math.random() * angleInc + startAngle;
    const maxRandomAngleOffset = angleInc * 0.33;

    for (let j = 0; j < partsPerArc; j++) {
      const randomAngleOffset = Math.random() * maxRandomAngleOffset;
      const angle = angleInc * j + angleOffset + randomAngleOffset;
      particleFactory(angle, ringSize);
    }
  }
}

// 创建粒子弧
function createParticleArc(
  start: number, arcLength: number, count: number, randomness: number,
  particleFactory: (angle: number) => void
): void {
  const angleDelta = arcLength / count;
  const end = start + arcLength - angleDelta * 0.5;

  if (end > start) {
    for (let angle = start; angle < end; angle += angleDelta) {
      particleFactory(angle + Math.random() * angleDelta * randomness);
    }
  } else {
    for (let angle = start; angle > end; angle += angleDelta) {
      particleFactory(angle + Math.random() * angleDelta * randomness);
    }
  }
}

// 烟花类型工厂函数
function crysanthemumShell(quality: number, size: number): any {
  const glitter = Math.random() < 0.25;
  const singleColor = Math.random() < 0.72;
  const color = singleColor ? randomColor({ limitWhite: true }) : [randomColor(), randomColor({ notSame: true })];
  const pistil = singleColor && Math.random() < 0.42;
  const pistilColor = pistil && makePistilColor(color as string);
  const secondColor = singleColor && (Math.random() < 0.2 || color === COLOR.White)
    ? pistilColor || randomColor({ notColor: color as string, limitWhite: true })
    : null;
  const streamers = !pistil && color !== COLOR.White && Math.random() < 0.42;

  let starDensity = glitter ? 1.1 : 1.25;
  if (quality === 1) starDensity *= 0.8;
  if (quality === 3) starDensity = 1.2;

  return {
    shellSize: size,
    spreadSize: 300 + size * 100,
    starLife: 900 + size * 200,
    starDensity,
    color,
    secondColor,
    glitter: glitter ? 'light' : '',
    glitterColor: whiteOrGold(),
    pistil,
    pistilColor,
    streamers,
  };
}

function ghostShell(quality: number, size: number): any {
  const shell = crysanthemumShell(quality, size);
  shell.starLife *= 1.5;
  shell.streamers = true;
  shell.color = INVISIBLE;
  shell.secondColor = randomColor({ notColor: COLOR.White });
  shell.glitter = '';
  return shell;
}

function strobeShell(size: number): any {
  const color = randomColor({ limitWhite: true });
  return {
    shellSize: size,
    spreadSize: 280 + size * 92,
    starLife: 1100 + size * 200,
    starLifeVariation: 0.4,
    starDensity: 1.1,
    color,
    glitter: 'light',
    glitterColor: COLOR.White,
    strobe: true,
    strobeColor: Math.random() < 0.5 ? COLOR.White : null,
    pistil: Math.random() < 0.5,
    pistilColor: makePistilColor(color),
  };
}

function palmShell(size: number): any {
  const color = randomColor();
  const thick = Math.random() < 0.5;
  return {
    shellSize: size,
    color,
    spreadSize: 250 + size * 75,
    starDensity: thick ? 0.15 : 0.4,
    starLife: 1800 + size * 200,
    glitter: thick ? 'thick' : 'heavy',
  };
}

function ringShell(size: number): any {
  const color = randomColor();
  const pistil = Math.random() < 0.75;
  return {
    shellSize: size,
    ring: true,
    color,
    spreadSize: 300 + size * 100,
    starLife: 900 + size * 200,
    starCount: 2.2 * PI_2 * (size + 1),
    pistil,
    pistilColor: makePistilColor(color),
    glitter: !pistil ? 'light' : '',
    glitterColor: color === COLOR.Gold ? COLOR.Gold : COLOR.White,
    streamers: Math.random() < 0.3,
  };
}

function crossetteShell(size: number): any {
  const color = randomColor({ limitWhite: true });
  return {
    shellSize: size,
    spreadSize: 300 + size * 100,
    starLife: 750 + size * 160,
    starLifeVariation: 0.4,
    starDensity: 0.85,
    color,
    crossette: true,
    pistil: Math.random() < 0.5,
    pistilColor: makePistilColor(color),
  };
}

function floralShell(size: number): any {
  return {
    shellSize: size,
    spreadSize: 300 + size * 120,
    starDensity: 0.12,
    starLife: 500 + size * 50,
    starLifeVariation: 0.5,
    color: Math.random() < 0.65 ? 'random' : Math.random() < 0.15 ? randomColor() : [randomColor(), randomColor({ notSame: true })],
    floral: true,
  };
}

function fallingLeavesShell(size: number): any {
  return {
    shellSize: size,
    color: INVISIBLE,
    spreadSize: 300 + size * 120,
    starDensity: 0.12,
    starLife: 500 + size * 50,
    starLifeVariation: 0.5,
    glitter: 'medium',
    glitterColor: COLOR.Gold,
    fallingLeaves: true,
  };
}

function willowShell(size: number): any {
  return {
    shellSize: size,
    spreadSize: 300 + size * 100,
    starDensity: 0.6,
    starLife: 3000 + size * 300,
    glitter: 'willow',
    glitterColor: COLOR.Gold,
    color: INVISIBLE,
  };
}

function crackleShell(quality: number, size: number): any {
  const color = Math.random() < 0.75 ? COLOR.Gold : randomColor();
  return {
    shellSize: size,
    spreadSize: 380 + size * 75,
    starDensity: quality === 1 ? 0.65 : 1,
    starLife: 600 + size * 100,
    starLifeVariation: 0.32,
    glitter: 'light',
    glitterColor: COLOR.Gold,
    color,
    crackle: true,
    pistil: Math.random() < 0.65,
    pistilColor: makePistilColor(color),
  };
}

function horsetailShell(size: number): any {
  const color = randomColor();
  return {
    shellSize: size,
    horsetail: true,
    color,
    spreadSize: 250 + size * 38,
    starDensity: 0.9,
    starLife: 2500 + size * 300,
    glitter: 'medium',
    glitterColor: Math.random() < 0.5 ? whiteOrGold() : color,
    strobe: color === COLOR.White,
  };
}

// 烟花类型映射
function getShellTypes(quality: number): Record<string, (size: number) => any> {
  const shellTypes: Record<string, (size: number) => any> = {
    'Crackle': (size) => crackleShell(quality, size),
    'Crossette': (size) => crossetteShell(size),
    'Crysanthemum': (size) => crysanthemumShell(quality, size),
    'Falling Leaves': (size) => fallingLeavesShell(size),
    'Floral': (size) => floralShell(size),
    'Ghost': (size) => ghostShell(quality, size),
    'Horse Tail': (size) => horsetailShell(size),
    'Palm': (size) => palmShell(size),
    'Ring': (size) => ringShell(size),
    'Strobe': (size) => strobeShell(size),
    'Willow': (size) => willowShell(size),
    'Text': (size) => {
      const presets = (window as any).__wanzaiTextPresets || []
      if (presets.length === 0) return null // 无预设时不发射
      const text = presets[(Math.random() * presets.length) | 0]
      return textShell(size, text)
    },
  };

  shellTypes['Random'] = (size) => {
    const shellNames = Object.keys(shellTypes).filter(n => n !== 'Random');
    const randomName = shellNames[(Math.random() * shellNames.length) | 0];
    return shellTypes[randomName](size);
  };

  return shellTypes;
}

// Shell 类
class Shell {
  shellSize!: number;
  spreadSize!: number;
  starLife!: number;
  starLifeVariation: number;
  starDensity!: number;
  starCount!: number;
  color!: string | string[] | 'random';
  secondColor: string | null = null;
  glitter!: string;
  glitterColor!: string;
  pistil!: boolean;
  pistilColor: string | false = false;
  streamers!: boolean;
  crossette!: boolean;
  crackle!: boolean;
  floral!: boolean;
  fallingLeaves!: boolean;
  ring!: boolean;
  strobe!: boolean;
  strobeColor: string | null = null;
  horsetail!: boolean;
  textLattice: any = null;
  textStrobe: boolean = false;
  comet: any = null;

  constructor(options: any) {
    Object.assign(this, options);
    this.starLifeVariation = options.starLifeVariation || 0.125;
    this.color = options.color || randomColor();
    this.glitterColor = options.glitterColor || this.color;

    if (!this.starCount) {
      const density = options.starDensity || 1;
      const scaledSize = this.spreadSize / 54;
      this.starCount = Math.max(6, scaledSize * scaledSize * density);
    }
  }

  launch(position: number, launchHeight: number, engine: FireworkEngine) {
    const width = engine.width;
    const height = engine.height;
    const quality = engine.config.quality;

    const hpad = 60;
    const vpad = 50;
    const minHeightPercent = 0.45;
    const minHeight = height - height * minHeightPercent;

    const launchX = position * (width - hpad * 2) + hpad;
    const launchY = height;
    const burstY = minHeight - launchHeight * (minHeight - vpad);

    const launchDistance = launchY - burstY;
    const launchVelocity = Math.pow(launchDistance * 0.04, 0.64);

    const cometColor = typeof this.color === 'string' && this.color !== 'random' ? this.color : COLOR.White;

    this.comet = StarManager.add(
      launchX,
      launchY,
      cometColor,
      Math.PI,
      launchVelocity * (this.horsetail ? 1.2 : 1),
      launchVelocity * (this.horsetail ? 100 : 400)
    );

    this.comet.heavy = true;
    this.comet.spinRadius = 0.32 + Math.random() * 0.53;
    this.comet.sparkFreq = quality === 3 ? 8 : 32 / quality;
    this.comet.sparkLife = 320;
    this.comet.sparkLifeVariation = 3;

    if (this.glitter === 'willow' || this.fallingLeaves) {
      this.comet.sparkFreq = 20 / quality;
      this.comet.sparkSpeed = 0.5;
      this.comet.sparkLife = 500;
    }

    if (this.color === INVISIBLE) {
      this.comet.sparkColor = COLOR.Gold;
    }

    // 随机燃烧消失效果
    if (Math.random() > 0.4 && !this.horsetail) {
      this.comet.secondColor = INVISIBLE;
      this.comet.transitionTime = Math.pow(Math.random(), 1.5) * 700 + 500;
    }

    this.comet.onDeath = () => this.burst(this.comet.x, this.comet.y, engine);
    engine.playSound('lift');
  }

  burst(x: number, y: number, engine: FireworkEngine) {
    const quality = engine.config.quality;
    const speed = this.spreadSize / 96;
    const isHighQuality = quality === 3;

    let color: string | undefined;
    let onDeath: ((star: any) => void) | undefined;
    let sparkFreq = 0, sparkSpeed = 1, sparkLife = 750, sparkLifeVariation = 0.25;
    let playedDeathSound = false;

    // 死亡效果
    if (this.crossette) {
      onDeath = (star) => {
        if (!playedDeathSound) {
          engine.playSound('crackle');
          playedDeathSound = true;
        }
        const startAngle = Math.random() * PI_HALF;
        createParticleArc(startAngle, PI_2, 4, 0.5, (angle) => {
          const baseSpeed = Math.sqrt(star.speedX * star.speedX + star.speedY * star.speedY) * 0.6;
          StarManager.add(star.x, star.y, star.color, angle, baseSpeed * (Math.random() * 0.6 + 0.75), 600);
        });
      };
    }

    if (this.crackle) {
      onDeath = (star) => {
        if (!playedDeathSound) {
          engine.playSound('crackle');
          playedDeathSound = true;
        }
        const count = isHighQuality ? 32 : 16;
        createParticleArc(0, PI_2, count, 1.8, (angle) => {
          SparkManager.add(star.x, star.y, COLOR.Gold, angle, Math.pow(Math.random(), 0.45) * 2.4, 300 + Math.random() * 200);
        });
      };
    }

    if (this.floral) {
      onDeath = (star) => {
        const count = 12 + 6 * quality;
        createBurst(count, (angle, speedMult) => {
          StarManager.add(star.x, star.y, star.color, angle, speedMult * 2.4, 1000 + Math.random() * 300, star.speedX, star.speedY);
        });
        BurstFlashManager.add(star.x, star.y, 46);
        engine.playSound('burst');
      };
    }

    if (this.fallingLeaves) {
      onDeath = (star) => {
        createBurst(7, (angle, speedMult) => {
          const newStar = StarManager.add(star.x, star.y, INVISIBLE, angle, speedMult * 2.4, 2400 + Math.random() * 600, star.speedX, star.speedY);
          newStar.sparkColor = COLOR.Gold;
          newStar.sparkFreq = 144 / quality;
          newStar.sparkSpeed = 0.28;
          newStar.sparkLife = 750;
          newStar.sparkLifeVariation = 3.2;
        });
        BurstFlashManager.add(star.x, star.y, 46);
        engine.playSound('burst');
      };
    }

    // Glitter 设置
    if (this.glitter === 'light') {
      sparkFreq = 400; sparkSpeed = 0.3; sparkLife = 300; sparkLifeVariation = 2;
    } else if (this.glitter === 'medium') {
      sparkFreq = 200; sparkSpeed = 0.44; sparkLife = 700; sparkLifeVariation = 2;
    } else if (this.glitter === 'heavy') {
      sparkFreq = 80; sparkSpeed = 0.8; sparkLife = 1400; sparkLifeVariation = 2;
    } else if (this.glitter === 'thick') {
      sparkFreq = 16; sparkSpeed = isHighQuality ? 1.65 : 1.5; sparkLife = 1400; sparkLifeVariation = 3;
    } else if (this.glitter === 'streamer') {
      sparkFreq = 32; sparkSpeed = 1.05; sparkLife = 620; sparkLifeVariation = 2;
    } else if (this.glitter === 'willow') {
      sparkFreq = 120; sparkSpeed = 0.34; sparkLife = 1400; sparkLifeVariation = 3.8;
    }

    sparkFreq = sparkFreq / quality;

    const starLife = this.starLife || 1000;
    const starLifeVar = this.starLifeVariation || 0.125;

    // 星花工厂函数
    const starFactory = (angle: number, speedMult: number) => {
      const standardInitialSpeed = this.spreadSize / 1800;
      const starColor = color || randomColor();

      const star = StarManager.add(
        x, y, starColor, angle, speedMult * speed,
        starLife + Math.random() * starLife * starLifeVar,
        this.horsetail ? this.comet?.speedX || 0 : 0,
        this.horsetail ? this.comet?.speedY || 0 : -standardInitialSpeed
      );

      if (this.secondColor) {
        star.transitionTime = starLife * (Math.random() * 0.05 + 0.32);
        star.secondColor = this.secondColor;
      }

      if (this.strobe) {
        star.transitionTime = starLife * (Math.random() * 0.08 + 0.46);
        star.strobe = true;
        star.strobeFreq = Math.random() * 20 + 40;
        if (this.strobeColor) star.secondColor = this.strobeColor;
      }

      star.onDeath = onDeath;

      if (this.glitter) {
        star.sparkFreq = sparkFreq;
        star.sparkSpeed = sparkSpeed;
        star.sparkLife = sparkLife;
        star.sparkLifeVariation = sparkLifeVariation;
        star.sparkColor = this.color === INVISIBLE ? COLOR.Gold : this.glitterColor;
        star.sparkTimer = Math.random() * star.sparkFreq;
      }
    };

    // 处理颜色配置
    if (typeof this.color === 'string') {
      if (this.color === 'random') {
        color = undefined;
      } else {
        color = this.color;
      }

      if (this.ring) {
        const ringStartAngle = Math.random() * Math.PI;
        const ringSquash = Math.pow(Math.random(), 2) * 0.85 + 0.15;

        createParticleArc(0, PI_2, this.starCount, 0, (angle) => {
          const initSpeedX = Math.sin(angle) * speed * ringSquash;
          const initSpeedY = Math.cos(angle) * speed;
          const newSpeed = Math.sqrt(initSpeedX * initSpeedX + initSpeedY * initSpeedY);
          const newAngle = Math.atan2(initSpeedY, initSpeedX) + ringStartAngle;

          const star = StarManager.add(
            x, y, color || randomColor(), newAngle, newSpeed,
            starLife + Math.random() * starLife * starLifeVar
          );

          if (this.glitter) {
            star.sparkFreq = sparkFreq;
            star.sparkSpeed = sparkSpeed;
            star.sparkLife = sparkLife;
            star.sparkLifeVariation = sparkLifeVariation;
            star.sparkColor = this.glitterColor;
            star.sparkTimer = Math.random() * star.sparkFreq;
          }
        });
      } else {
        createBurst(this.starCount, starFactory);
      }
    } else if (Array.isArray(this.color)) {
      if (Math.random() < 0.5) {
        const start = Math.random() * Math.PI;
        color = this.color[0];
        createBurst(this.starCount, starFactory, start, Math.PI);
        color = this.color[1];
        createBurst(this.starCount, starFactory, start + Math.PI, Math.PI);
      } else {
        color = this.color[0];
        createBurst(this.starCount / 2, starFactory);
        color = this.color[1];
        createBurst(this.starCount / 2, starFactory);
      }
    }

    // 文字烟花：为每个采样点创建 Star/Spark（Phase A1）
    if (this.textLattice) {
      const lattice = this.textLattice
      const dcenterX = lattice.width / 2
      const dcenterY = lattice.height / 2
      const useStrobe = this.textStrobe

      for (const pt of lattice.points) {
        const px = x + (pt.x - dcenterX) * 0.7
        const py = y + (pt.y - dcenterY) * 0.7

        if (useStrobe) {
          const star = StarManager.add(px, py, color || randomColor(), 0, Math.random() * 0.15, 800 + Math.random() * 400)
          star.strobe = true
          star.strobeFreq = Math.random() * 20 + 40
          star.transitionTime = star.fullLife * (Math.random() * 0.3 + 0.2)
          star.secondColor = this.glitterColor || COLOR.Gold
        } else {
          const sparkSpeed = Math.pow(Math.random(), 0.15) * 1.4
          const angle = Math.random() * PI_2
          SparkManager.add(px, py, color || randomColor(), angle, sparkSpeed, 600 + Math.random() * 400)
          // 尾影
          const tailAngle = Math.random() * PI_2
          SparkManager.add(px + 5, py + 10, color || COLOR.Gold, tailAngle, Math.pow(Math.random(), 0.05) * 0.4, 400 + Math.random() * 300)
        }
      }
    }

    // Pistil
    if (this.pistil && this.pistilColor) {
      const innerShell = new Shell({
        spreadSize: this.spreadSize * 0.5,
        starLife: starLife * 0.6,
        starLifeVariation: starLifeVar,
        starDensity: 1.4,
        color: this.pistilColor,
        glitter: 'light',
        glitterColor: this.pistilColor === COLOR.Gold ? COLOR.Gold : COLOR.White,
      });
      innerShell.burst(x, y, engine);
    }

    // Streamers
    if (this.streamers) {
      const streamerCount = Math.floor(Math.max(6, this.spreadSize / 45));
      createBurst(streamerCount, (angle, speedMult) => {
        const star = StarManager.add(x, y, COLOR.White, angle, speedMult * speed * 0.9, starLife * 0.8);
        star.sparkFreq = 32 / quality;
        star.sparkSpeed = 1.05;
        star.sparkLife = 620;
        star.sparkColor = COLOR.White;
      });
    }

    // 爆炸闪光
    BurstFlashManager.add(x, y, this.spreadSize / 4);

    // 播放爆炸声音（仅针对原始发射的烟花）
    if (this.comet) {
      const maxDiff = 2;
      const sizeDifferenceFromMaxSize = Math.min(maxDiff, engine.config.shellSize - this.shellSize);
      const soundScale = (1 - sizeDifferenceFromMaxSize / maxDiff) * 0.3 + 0.7;
      engine.playSound('burst', soundScale);
    }
  }
}

// 主引擎类
class FireworkEngine {
  trailsCanvas: HTMLCanvasElement;
  mainCanvas: HTMLCanvasElement;
  canvasContainer: HTMLElement;
  stageContainer: HTMLElement;
  backgroundLayer: HTMLElement;
  skyLightLayer: HTMLElement;
  trailsCtx: CanvasRenderingContext2D;
  mainCtx: CanvasRenderingContext2D;
  width: number = 0;
  height: number = 0;
  dpr: number = 1;
  config: any;
  onReady: () => void;
  isRunning: boolean = false;
  isPaused: boolean = false;
  soundEnabled: boolean = true;

  audioCtx: AudioContext | null = null;
  audioBuffers: Record<string, AudioBuffer[]> = {};
  audioSourcesConfig: Record<string, { volume: number; playbackRateMin: number; playbackRateMax: number }> = {};
  _lastBurstTime: number = 0;
  _lastCrackleTime: number = 0;

  autoLaunchTimer: number = 0;
  animationId: number = 0;
  resizeHandler: () => void;
  pointerHandler: (e: MouseEvent | TouchEvent) => void;
  currentFrame: number = 0;

  // 天空颜色状态
  currentSkyColor = { r: 0, g: 0, b: 0 };
  targetSkyColor = { r: 0, g: 0, b: 0 };

  constructor(
    trailsCanvas: HTMLCanvasElement,
    mainCanvas: HTMLCanvasElement,
    canvasContainer: HTMLElement,
    stageContainer: HTMLElement,
    backgroundLayer: HTMLElement,
    skyLightLayer: HTMLElement,
    config: any,
    onReady: () => void
  ) {
    this.trailsCanvas = trailsCanvas;
    this.mainCanvas = mainCanvas;
    this.canvasContainer = canvasContainer;
    this.stageContainer = stageContainer;
    this.backgroundLayer = backgroundLayer;
    this.skyLightLayer = skyLightLayer;
    this.config = config;
    this.onReady = onReady;

    this.trailsCtx = trailsCanvas.getContext('2d')!;
    this.mainCtx = mainCanvas.getContext('2d')!;
    this.dpr = window.devicePixelRatio || 1;

    this.setBackground();

    this.resizeHandler = () => this.resize();
    window.addEventListener('resize', this.resizeHandler);
    this.resize();

    this.pointerHandler = (e) => this.handlePointer(e);
    this.mainCanvas.addEventListener('click', this.pointerHandler);
    this.mainCanvas.addEventListener('touchstart', this.pointerHandler);

    this.loadAudio().then(() => {
      this.isRunning = true;
      this.onReady();
      this.startLoop();
    }).catch(() => {
      this.isRunning = true;
      this.onReady();
      this.startLoop();
    });
  }

  setBackground() {
    if (this.config.backgroundImage) {
      this.backgroundLayer.style.backgroundImage = `url(${this.config.backgroundImage})`;
      this.backgroundLayer.style.backgroundSize = 'cover';
      this.backgroundLayer.style.backgroundPosition = 'center';
      this.backgroundLayer.style.opacity = '0.2';
    } else {
      this.backgroundLayer.style.backgroundImage = '';
      this.backgroundLayer.style.opacity = '0';
    }
    this.canvasContainer.style.backgroundColor = 'transparent';
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.trailsCanvas.width = this.width * this.dpr;
    this.trailsCanvas.height = this.height * this.dpr;
    this.trailsCanvas.style.width = this.width + 'px';
    this.trailsCanvas.style.height = this.height + 'px';

    this.mainCanvas.width = this.width * this.dpr;
    this.mainCanvas.height = this.height * this.dpr;
    this.mainCanvas.style.width = this.width + 'px';
    this.mainCanvas.style.height = this.height + 'px';

    this.stageContainer.style.width = this.width + 'px';
    this.stageContainer.style.height = this.height + 'px';
  }

  async loadAudio() {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    this.audioCtx = new AudioCtx();

    this.audioSourcesConfig = {
      lift: { volume: 1, playbackRateMin: 0.85, playbackRateMax: 0.95 },
      burst: { volume: 1, playbackRateMin: 0.8, playbackRateMax: 0.9 },
      crackle: { volume: 0.2, playbackRateMin: 1, playbackRateMax: 1 },
    };

    const audioFiles = {
      lift: ['lift1.mp3', 'lift2.mp3', 'lift3.mp3'],
      burst: ['burst1.mp3', 'burst2.mp3'],
      crackle: ['crackle1.mp3']
    };

    for (const [type, files] of Object.entries(audioFiles)) {
      this.audioBuffers[type] = [];
      for (const file of files) {
        try {
          const response = await fetch(`/firework/audio/${file}`);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
          this.audioBuffers[type].push(audioBuffer);
        } catch (e) {}
      }
    }
  }

  playSound(type: string, scale = 1) {
    if (!this.soundEnabled || !this.audioCtx || !this.audioBuffers[type]?.length) return;

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    // 节流机制
    const now = Date.now();
    if (type === 'burst') {
      if (now - this._lastBurstTime < 20) return;
      this._lastBurstTime = now;
    }
    if (type === 'crackle') {
      if (now - this._lastCrackleTime < 50) return;
      this._lastCrackleTime = now;
    }

    const source = this.audioSourcesConfig[type] || { volume: 1, playbackRateMin: 1, playbackRateMax: 1 };
    const buffer = this.audioBuffers[type][Math.floor(Math.random() * this.audioBuffers[type].length)];

    const scaledVolume = source.volume * Math.max(0, Math.min(1, scale));
    const playbackRate = (source.playbackRateMin + Math.random() * (source.playbackRateMax - source.playbackRateMin)) * (2 - scale);

    const gainNode = this.audioCtx.createGain();
    gainNode.gain.value = scaledVolume;

    const bufferSource = this.audioCtx.createBufferSource();
    bufferSource.playbackRate.value = playbackRate;
    bufferSource.buffer = buffer;
    bufferSource.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);
    bufferSource.start(0);
  }

  onShellLaunch: ((shellType: string, shellSize: number, x: number, height: number) => void) | null = null

  handlePointer(e: MouseEvent | TouchEvent) {
    if (this.isPaused) return;

    let x: number, y: number;
    if ('touches' in e) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }

    const posX = x / this.width;
    const posY = 1 - y / this.height;

    this.launchShell(posX, posY);
  }

  launchShell(x: number, height: number) {
    const size = this.config.shellSize || 2;
    const shellTypeName = this.config.shellType || 'Random';
    const quality = this.config.quality || 2;

    const shellTypes = getShellTypes(quality);
    const shellConfigFunc = shellTypes[shellTypeName] || shellTypes['Random'];
    const shellConfig = shellConfigFunc(size);

    // Text shell 在无预设时返回 null，跳过发射
    if (!shellConfig) return;

    // Phase D1: customColor 覆盖颜色（修复：处理数组/random/INVISIBLE）
    const cc = this.config.customColor
    if (cc) {
      if (Array.isArray(shellConfig.color)) {
        shellConfig.color = [cc, cc]
      } else if (shellConfig.color === 'random' || shellConfig.color === INVISIBLE) {
        shellConfig.color = cc
      } else if (typeof shellConfig.color === 'string') {
        shellConfig.color = cc
      }
      if (shellConfig.glitterColor) shellConfig.glitterColor = cc
      if (shellConfig.secondColor) shellConfig.secondColor = cc
      if (shellConfig.strobeColor) shellConfig.strobeColor = cc
    }

    const shell = new Shell(shellConfig);
    shell.launch(x, height, this);

    if (this.onShellLaunch) {
      this.onShellLaunch(this.config.shellType, this.config.shellSize, x, height);
    }
  }

  // Phase B3: Launch Sequences
  executeSequence(seq: string) {
    const width = this.width
    const hw = width / 2
    const isDesktop = width > 768

    switch (seq) {
      case 'twoRandom': {
        this.autoLaunchTimer = 1800 + Math.random() * 1200
        this.launchShell(0.3 + Math.random() * 0.1, 0.3 + Math.random() * 0.4)
        this.launchShell(0.6 + Math.random() * 0.1, 0.3 + Math.random() * 0.4)
        break
      }
      case 'triple': {
        this.autoLaunchTimer = 2800 + Math.random() * 1500
        this.launchShell(0.5, 0.4 + Math.random() * 0.2)
        setTimeout(() => this.launchShell(0.25 + Math.random() * 0.1, 0.2 + Math.random() * 0.3), 1000 + Math.random() * 400)
        setTimeout(() => this.launchShell(0.65 + Math.random() * 0.1, 0.2 + Math.random() * 0.3), 1000 + Math.random() * 400)
        break
      }
      case 'pyramid': {
        this.autoLaunchTimer = 5000
        const count = isDesktop ? 7 : 4
        const startX = (1 - (count - 1) * 0.08) / 2
        for (let i = 0; i < count; i++) {
          const posX = startX + i * 0.08
          setTimeout(() => this.launchShell(posX, 0.3 + Math.random() * 0.3), i * 80)
          setTimeout(() => this.launchShell(posX, 0.1 + Math.random() * 0.2), i * 80 + 200)
        }
        break
      }
      case 'smallBarrage': {
        this.autoLaunchTimer = 8000
        const bc = isDesktop ? 11 : 5
        const stepX = 0.9 / bc
        const startX = 0.05
        for (let i = 0; i < bc; i++) {
          const posX = startX + stepX * i
          const h = 0.2 + Math.cos((i / bc) * Math.PI * 2) * 0.15 + Math.random() * 0.1
          setTimeout(() => this.launchShell(posX, h), i * 60 + Math.random() * 30)
        }
        break
      }
      default: { // random
        this.autoLaunchTimer = this.config.finaleMode ? 200 : 1500 + Math.random() * 1000
        const x = 0.2 + Math.random() * 0.6
        const height = 0.2 + Math.random() * 0.5
        this.launchShell(x, height)
      }
    }
  }

  startLoop() {
    let lastTimestamp = 0;

    const frameHandler = (timestamp: number) => {
      if (!this.isRunning) return;

      let frameTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (frameTime < 0) frameTime = 17;
      else if (frameTime > 68) frameTime = 68;

      const lag = frameTime / 16.6667;

      if (!this.isPaused) {
        this.update(frameTime, lag);
        this.render(lag);
      }

      this.animationId = requestAnimationFrame(frameHandler);
    };

    this.animationId = requestAnimationFrame(frameHandler);
  }

  update(frameTime: number, lag: number) {
    this.currentFrame++;

    const simSpeed = this.config.simSpeed ?? 0.9
    const timeStep = frameTime * simSpeed
    const speed = lag * simSpeed

    // 自动发射（Phase B3: Launch Sequences）
    if (this.config.autoLaunch) {
      this.autoLaunchTimer -= timeStep;
      if (this.autoLaunchTimer <= 0) {
        const seq = this.config.launchSequence || 'random'
        this.executeSequence(seq)
      }
    }

    // 物理常量（Phase D3: 自定义参数）
    const gravityMult = this.config.gravity ?? 0.9
    const densityMult = this.config.particleDensity ?? 1.0
    const sparkMult = this.config.sparkAmount ?? 1.0

    const starDrag = 1 - (1 - StarManager.airDrag) * speed;
    const starDragHeavy = 1 - (1 - StarManager.airDragHeavy) * speed;
    const sparkDrag = 1 - (1 - SparkManager.airDrag) * speed;
    const gAcc = (timeStep / 1000) * (GRAVITY * gravityMult / 0.9);

    // 粒子密度 → 动态调整 spark 频率
    const densitySparkMod = 1 / Math.max(0.3, densityMult)

    // 更新所有颜色的星星
    COLOR_CODES_W_INVIS.forEach((colorCode: string) => {
      const stars = StarManager.active[colorCode];
      for (let i = stars.length - 1; i >= 0; i--) {
        const star = stars[i];

        if (star.updateFrame === this.currentFrame) continue;
        star.updateFrame = this.currentFrame;

        star.life -= timeStep;
        if (star.life <= 0) {
          stars.splice(i, 1);
          StarManager.returnInstance(star);
        } else {
          const burnRate = Math.pow(star.life / star.fullLife, 0.5);
          const burnRateInverse = 1 - burnRate;

          star.prevX = star.x;
          star.prevY = star.y;
          star.x += star.speedX * speed;
          star.y += star.speedY * speed;

          if (!star.heavy) {
            star.speedX *= starDrag;
            star.speedY *= starDrag;
          } else {
            star.speedX *= starDragHeavy;
            star.speedY *= starDragHeavy;
          }
          star.speedY += gAcc;

          if (star.spinRadius) {
            star.spinAngle += star.spinSpeed * speed;
            star.x += Math.sin(star.spinAngle) * star.spinRadius * speed;
            star.y += Math.cos(star.spinAngle) * star.spinRadius * speed;
          }

          if (star.sparkFreq) {
            star.sparkTimer -= timeStep;
            while (star.sparkTimer < 0) {
              star.sparkTimer += (star.sparkFreq * 0.75 + star.sparkFreq * burnRateInverse * 4) * sparkMult / densitySparkMod;
              SparkManager.add(
                star.x, star.y, star.sparkColor,
                Math.random() * PI_2,
                Math.random() * star.sparkSpeed * burnRate,
                star.sparkLife * 0.8 + Math.random() * star.sparkLifeVariation * star.sparkLife
              );
            }
          }

          if (star.life < star.transitionTime) {
            if (star.secondColor && !star.colorChanged) {
              star.colorChanged = true;
              star.color = star.secondColor;
              stars.splice(i, 1);
              StarManager.active[star.secondColor].push(star);
              if (star.secondColor === INVISIBLE) {
                star.sparkFreq = 0;
              }
            }

            if (star.strobe) {
              star.visible = Math.floor(star.life / star.strobeFreq) % 3 === 0;
            }
          }
        }
      }

      // 更新火花
      const sparks = SparkManager.active[colorCode];
      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];
        spark.life -= timeStep;
        if (spark.life <= 0) {
          sparks.splice(i, 1);
          SparkManager.returnInstance(spark);
        } else {
          spark.prevX = spark.x;
          spark.prevY = spark.y;
          spark.x += spark.speedX * speed;
          spark.y += spark.speedY * speed;
          spark.speedX *= sparkDrag;
          spark.speedY *= sparkDrag;
          spark.speedY += gAcc;
        }
      }
    });
  }

  // 点亮天空功能
  colorSky(speed: number) {
    const skyLighting = this.config.skyLighting || 0;
    const hasBackground = this.config.backgroundImage && this.config.backgroundImage !== null;

    if (skyLighting === 0) {
      this.skyLightLayer.style.backgroundColor = 'transparent';
      this.canvasContainer.style.backgroundColor = 'transparent';
      return;
    }

    const maxSkySaturation = skyLighting * 15;
    const maxStarCount = 500;
    let totalStarCount = 0;

    this.targetSkyColor.r = 0;
    this.targetSkyColor.g = 0;
    this.targetSkyColor.b = 0;

    COLOR_CODES.forEach((colorCode: string) => {
      const tuple = COLOR_TUPLES[colorCode];
      const count = StarManager.active[colorCode].length;
      totalStarCount += count;
      this.targetSkyColor.r += tuple.r * count;
      this.targetSkyColor.g += tuple.g * count;
      this.targetSkyColor.b += tuple.b * count;
    });

    const intensity = Math.pow(Math.min(1, totalStarCount / maxStarCount), 0.3);
    const maxColorComponent = Math.max(1, this.targetSkyColor.r, this.targetSkyColor.g, this.targetSkyColor.b);

    this.targetSkyColor.r = (this.targetSkyColor.r / maxColorComponent) * maxSkySaturation * intensity;
    this.targetSkyColor.g = (this.targetSkyColor.g / maxColorComponent) * maxSkySaturation * intensity;
    this.targetSkyColor.b = (this.targetSkyColor.b / maxColorComponent) * maxSkySaturation * intensity;

    const colorChange = 10;
    this.currentSkyColor.r += ((this.targetSkyColor.r - this.currentSkyColor.r) / colorChange) * speed;
    this.currentSkyColor.g += ((this.targetSkyColor.g - this.currentSkyColor.g) / colorChange) * speed;
    this.currentSkyColor.b += ((this.targetSkyColor.b - this.currentSkyColor.b) / colorChange) * speed;

    const r = Math.floor(this.currentSkyColor.r);
    const g = Math.floor(this.currentSkyColor.g);
    const b = Math.floor(this.currentSkyColor.b);

    // 有背景图片时使用 sky-light-layer + screen 混合模式
    // 无背景图片时直接设置 canvas-container 背景色（原始代码方式）
    if (hasBackground) {
      this.skyLightLayer.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
      this.skyLightLayer.style.mixBlendMode = 'screen';
      this.canvasContainer.style.backgroundColor = 'transparent';
    } else {
      this.skyLightLayer.style.backgroundColor = 'transparent';
      this.canvasContainer.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }
  }

  render(lag: number) {
    const ctx = this.trailsCtx;
    const quality = this.config.quality || 2;
    const isHighQuality = quality === 3;
    const hasBackground = this.config.backgroundImage && this.config.backgroundImage !== null;

    ctx.save();
    ctx.scale(this.dpr, this.dpr);

    // 点亮天空（总是调用，函数内部会处理 skyLighting === 0 的情况）
    this.colorSky(lag);

    // 淡出效果
    ctx.globalCompositeOperation = 'source-over';
    if (hasBackground) {
      // 有背景图片时清除为透明，让 CSS 背景可见
      ctx.clearRect(0, 0, this.width, this.height);
    } else {
      const fadeAlpha = this.config.longExposure ? 0.005 * lag : 0.175 * lag
      ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
      ctx.fillRect(0, 0, this.width, this.height);
    }

    // 绘制爆炸闪光
    while (BurstFlashManager.active.length) {
      const bf = BurstFlashManager.active.pop();
      const burstGradient = ctx.createRadialGradient(bf.x, bf.y, 0, bf.x, bf.y, bf.radius);
      burstGradient.addColorStop(0.024, 'rgba(255, 255, 255, 1)');
      burstGradient.addColorStop(0.125, 'rgba(255, 160, 20, 0.2)');
      burstGradient.addColorStop(0.32, 'rgba(255, 140, 20, 0.11)');
      burstGradient.addColorStop(1, 'rgba(255, 120, 20, 0)');
      ctx.fillStyle = burstGradient;
      ctx.fillRect(bf.x - bf.radius, bf.y - bf.radius, bf.radius * 2, bf.radius * 2);
      BurstFlashManager.returnInstance(bf);
    }

    // 绘制星星
    ctx.globalCompositeOperation = 'lighten';
    ctx.lineWidth = quality === 1 ? 2 : 3;
    ctx.lineCap = quality === 1 ? 'square' : 'round';

    COLOR_CODES.forEach((colorCode: string) => {
      const stars = StarManager.active[colorCode];
      ctx.strokeStyle = colorCode;
      ctx.beginPath();
      stars.forEach((star) => {
        if (star.visible && star.color !== INVISIBLE) {
          ctx.lineWidth = star.size || 3;
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(star.prevX, star.prevY);
        }
      });
      ctx.stroke();
    });

    // 绘制火花
    ctx.lineWidth = isHighQuality ? 0.75 : 1;
    ctx.lineCap = 'butt';

    COLOR_CODES.forEach((colorCode: string) => {
      const sparks = SparkManager.active[colorCode];
      ctx.strokeStyle = colorCode;
      ctx.beginPath();
      sparks.forEach((spark) => {
        ctx.moveTo(spark.x, spark.y);
        ctx.lineTo(spark.prevX, spark.prevY);
      });
      ctx.stroke();
    });

    ctx.restore();

    // 清除主画布
    this.mainCtx.clearRect(0, 0, this.width * this.dpr, this.height * this.dpr);
  }

  setPaused(paused: boolean) {
    this.isPaused = paused;
    if (this.audioCtx) {
      if (paused) {
        this.audioCtx.suspend();
      } else {
        this.audioCtx.resume();
      }
    }
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  updateConfig(config: any) {
    const oldBg = this.config.backgroundImage;
    this.config = { ...this.config, ...config };
    if (config.backgroundImage !== undefined && config.backgroundImage !== oldBg) {
      this.setBackground();
    }

    // 更新 Spark drawWidth
    SparkManager.drawWidth = config.quality === 3 ? 0.75 : 1;
  }

  destroy() {
    this.isRunning = false;
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.resizeHandler);
    this.mainCanvas.removeEventListener('click', this.pointerHandler);
    this.mainCanvas.removeEventListener('touchstart', this.pointerHandler);
    if (this.audioCtx) {
      this.audioCtx.close();
    }
    StarManager.reset();
    SparkManager.reset();
    BurstFlashManager.reset();
  }
}
</script>

<style scoped>
.firework-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #111;
  z-index: 9999;
  overflow: hidden;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.loading-init {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
  z-index: 300;
}

.loading-init__header {
  font-size: 32px;
  margin-bottom: 10px;
}

.loading-init__status {
  font-size: 16px;
  color: rgba(255,255,255,0.7);
}

.stage-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: transparent;
}

.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0.2;
  z-index: 1;
}

.sky-light-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  background: transparent;
}

.canvas-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  background: transparent;
}

.canvas-container canvas {
  position: absolute;
  top: 0;
  left: 0;
  background: transparent;
  mix-blend-mode: lighten;
  transform: translateZ(0);
}

.controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 100;
}

.btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s;
  border: none;
}

.btn:hover {
  background: rgba(255,255,255,0.4);
}

.btn--bright {
  background: #ff4444;
}

.menu {
  position: absolute;
  top: 0;
  right: 0;
  width: 350px;
  height: 100%;
  background: rgba(0,0,0,0.9);
  z-index: 200;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
}

.menu.hide {
  display: none;
}

.menu__header {
  color: white;
  font-size: 24px;
  margin-bottom: 10px;
}

.menu__subheader {
  color: rgba(255,255,255,0.6);
  font-size: 14px;
  margin-bottom: 20px;
}

.close-menu-btn {
  position: absolute;
  top: 10px;
  right: 10px;
}

.form-option {
  margin-bottom: 15px;
}

.form-option label {
  display: block;
  color: white;
  margin-bottom: 5px;
  cursor: pointer;
}

.form-option select {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.1);
  color: white;
  font-size: 14px;
}

.form-option select option {
  background: rgba(0,0,0,0.9);
  color: white;
}

.form-option--checkbox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.form-option--checkbox label {
  margin-bottom: 0;
  flex: 1;
  font-size: 15px;
}

.form-option--checkbox input {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.form-hint {
  display: block;
  color: rgba(255,255,255,0.35);
  font-size: 11px;
  margin-top: 2px;
}

.form-option--fullscreen {
  display: none;
}

@media (min-width: 768px) {
  .form-option--fullscreen {
    display: flex;
  }
}

.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  background: rgba(0,0,0,0.5);
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  z-index: 100;
  transition: background 0.3s;
  border: none;
}

.back-btn:hover {
  background: rgba(255,0,0,0.7);
}

.lang-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: rgba(0,0,0,0.5);
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  z-index: 100;
  transition: background 0.3s;
  border: none;
  font-size: 14px;
  font-weight: 500;
}

.lang-btn:hover {
  background: rgba(255,0,0,0.7);
}

/* 排行榜入口按钮 */
.leaderboard-entry-btn {
  position: absolute;
  top: 80px;
  left: 20px;
  color: #f59e0b;
  background: rgba(0,0,0,0.5);
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  z-index: 100;
  transition: background 0.3s;
}
.leaderboard-entry-btn:hover {
  background: rgba(245,158,11,0.3);
}

/* 保存对话框 */
.save-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}
.save-card {
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 28px 24px;
  width: 340px;
  max-width: 90vw;
  text-align: center;
  color: #fff;
}
.save-card h3 {
  margin: 0 0 12px;
  font-size: 18px;
}
.save-slug {
  color: #9ca3af;
  font-size: 13px;
  margin: 0 0 12px;
}
.share-url-box {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 16px;
}
.share-url-box code {
  font-size: 12px;
  color: #f59e0b;
  word-break: break-all;
}
.save-desc {
  color: #9ca3af;
  font-size: 12px;
  margin: 0 0 14px;
  line-height: 1.5;
}
.save-input {
  width: 100%;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  margin-bottom: 16px;
  outline: none;
  box-sizing: border-box;
}
.save-input:focus {
  border-color: #f59e0b;
}
.save-btns {
  display: flex;
  gap: 10px;
}
.save-submit {
  flex: 1;
  padding: 10px;
  background: linear-gradient(135deg, #dc2626, #d97706);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.save-submit:disabled {
  opacity: 0.5;
}
.save-cancel {
  padding: 10px 16px;
  background: transparent;
  color: #9ca3af;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
}

/* 文字预设标签 */
.text-firework-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.text-firework-input {
  flex: 1;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
}
.text-firework-input:focus {
  border-color: #f59e0b;
}
/* 文字预设标签 */
.text-presets-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.text-presets-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}
.preset-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 20px;
  color: #f59e0b;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
}
.preset-tag:hover {
  background: rgba(245, 158, 11, 0.3);
}
.preset-remove {
  background: none;
  border: none;
  color: rgba(255,255,255,0.4);
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  line-height: 1;
}
.preset-remove:hover { color: #ef4444; }

/* 颜色选择器 */
.color-picker-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.color-swatch {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.15s, border-color 0.15s;
}
.color-swatch:hover { transform: scale(1.15); }
.color-swatch.active { border-color: #fff; transform: scale(1.15); }
.color-hex-input {
  width: 28px;
  height: 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: transparent;
}
.color-reset {
  background: none;
  border: none;
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  font-size: 18px;
  padding: 0 4px;
}
.color-reset:hover { color: #ef4444; }

/* 录制状态 */
.record-status {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  margin-bottom: 12px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.4);
  border-radius: 8px;
  color: #fca5a5;
  font-size: 13px;
}

/* 高级参数 */
.advanced-params {
  margin-top: 16px;
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 12px;
}
.advanced-params summary {
  color: rgba(255,255,255,0.6);
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  padding: 4px 0;
}
.advanced-params summary:hover { color: #fff; }
.param-slider {
  width: 100%;
  accent-color: #f59e0b;
  cursor: pointer;
}
.param-hint {
  color: rgba(255,255,255,0.35);
  font-size: 11px;
  margin: 8px 0 0;
}

/* Sim Speed 拖拽条 (Phase B2) */
.sim-speed-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 8px;
  background: rgba(255,255,255,0.8);
  cursor: pointer;
  z-index: 110;
  transition: height 0.15s;
}
.sim-speed-bar:hover { height: 14px; }
.sim-speed-fill {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #ef4444);
  border-radius: 0 4px 4px 0;
}
.sim-speed-label {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.8);
  color: #f59e0b;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 10px;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}
.sim-speed-label.visible { opacity: 1; }
</style>