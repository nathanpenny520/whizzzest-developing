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
          <path
            d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
          />
        </svg>
        <svg v-else fill="white" width="24" height="24" viewBox="0 0 24 24">
          <path
            d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
          />
        </svg>
      </div>
      <div
        class="btn save-btn"
        @click="handleSave"
        :title="currentLocale === 'zh-CN' ? '保存配方' : 'Save Recipe'"
      >
        <svg fill="white" width="22" height="22" viewBox="0 0 24 24">
          <path
            d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"
          />
        </svg>
      </div>
      <div class="btn settings-btn" @click="showSettings = !showSettings">
        <svg fill="white" width="24" height="24" viewBox="0 0 24 24">
          <path
            d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"
          />
        </svg>
      </div>
    </div>

    <!-- Sim Speed 拖拽条 (Phase B2) -->
    <div
      class="sim-speed-bar"
      ref="simSpeedBarRef"
      @mousedown="startSimSpeedDrag"
      @touchstart.prevent="startSimSpeedDrag"
      @mouseenter="showSimSpeedLabel = true"
      @mouseleave="hideSimSpeedLabel"
    >
      <div class="sim-speed-fill" :style="{ width: simSpeed * 100 + '%' }" />
      <div class="sim-speed-label" :class="{ visible: showSimSpeedLabel }">
        {{ t('firework.simSpeed') }}: {{ (simSpeed * 100).toFixed(0) }}%
      </div>
    </div>

    <div class="menu" :class="{ hide: !showSettings }">
      <div class="menu__inner-wrap">
        <div class="btn btn--bright close-menu-btn" @click="showSettings = false">
          <svg fill="white" width="24" height="24" viewBox="0 0 24 24">
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
          </svg>
        </div>
        <div class="menu__header">{{ t('firework.settings') }}</div>
        <div class="menu__subheader">{{ t('firework.settingsHint') }}</div>
        <form @submit.prevent>
          <div class="form-option form-option--select">
            <label for="firework-shell-type">{{ t('firework.shellType') }}</label>
            <select id="firework-shell-type" v-model="shellType">
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
            <label for="firework-shell-size">{{ t('firework.shellSize') }}</label>
            <select id="firework-shell-size" v-model="shellSize">
              <option value="1">3"</option>
              <option value="2">4"</option>
              <option value="3">6"</option>
              <option value="4">8"</option>
              <option value="5">12"</option>
            </select>
          </div>
          <div class="form-option form-option--select">
            <label for="firework-quality">{{ t('firework.quality') }}</label>
            <select id="firework-quality" v-model="quality">
              <option value="1">{{ t('firework.qualityLow') }}</option>
              <option value="2">{{ t('firework.qualityMedium') }}</option>
              <option value="3">{{ t('firework.qualityHigh') }}</option>
            </select>
          </div>
          <div class="form-option form-option--select">
            <label for="firework-sky-lighting">{{ t('firework.skyLighting') }}</label>
            <select id="firework-sky-lighting" v-model="skyLighting">
              <option value="0">{{ t('firework.skyLightingNone') }}</option>
              <option value="1">{{ t('firework.skyLightingDim') }}</option>
              <option value="2">{{ t('firework.skyLightingNormal') }}</option>
            </select>
          </div>
          <div class="form-option form-option--checkbox">
            <label for="firework-auto-launch">{{ t('firework.autoLaunch') }}</label>
            <input id="firework-auto-launch" type="checkbox" v-model="autoLaunch" />
          </div>
          <div class="form-option form-option--checkbox">
            <label for="firework-finale-mode">{{ t('firework.finaleMode') }}</label>
            <input id="firework-finale-mode" type="checkbox" v-model="finaleMode" />
          </div>
          <div class="form-option form-option--checkbox">
            <label for="firework-long-exposure" :title="t('firework.longExposureHint')">{{
              t('firework.longExposure')
            }}</label>
            <input id="firework-long-exposure" type="checkbox" v-model="longExposure" />
            <span class="form-hint">{{ t('firework.longExposureHint') }}</span>
          </div>
          <div class="form-option form-option--select">
            <label for="firework-launch-seq">{{ t('firework.launchSequence') }}</label>
            <select id="firework-launch-seq" v-model="launchSequence">
              <option value="random">{{ t('firework.seqRandom') }}</option>
              <option value="twoRandom">{{ t('firework.seqTwoRandom') }}</option>
              <option value="triple">{{ t('firework.seqTriple') }}</option>
              <option value="pyramid">{{ t('firework.seqPyramid') }}</option>
              <option value="smallBarrage">{{ t('firework.seqSmallBarrage') }}</option>
            </select>
          </div>
          <div class="form-option form-option--checkbox form-option--fullscreen">
            <label for="firework-fullscreen">{{ t('firework.fullscreen') }}</label>
            <input
              id="firework-fullscreen"
              type="checkbox"
              v-model="fullscreen"
              @change="toggleFullscreen"
            />
          </div>
          <div class="form-option form-option--select">
            <label for="firework-background">{{ t('firework.background') }}</label>
            <select id="firework-background" v-model="backgroundType">
              <option v-for="opt in backgroundOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
          <!-- 文字预设 -->
          <div class="form-option">
            <label for="firework-text-preset">{{ t('firework.textPresets.label') }}</label>
            <div class="text-presets-row">
              <input
                id="firework-text-preset"
                v-model="newPreset"
                maxlength="4"
                :placeholder="t('firework.textPresets.placeholder')"
                class="text-firework-input"
                @keyup.enter="addTextPreset"
              />
              <button
                @click="addTextPreset"
                class="text-firework-btn"
                :disabled="!newPreset.trim() || textPresets.length >= 8"
              >
                {{ t('firework.textPresets.add') }}
              </button>
            </div>
            <div class="text-presets-tags" v-if="textPresets.length">
              <span
                v-for="(p, i) in textPresets"
                :key="i"
                class="preset-tag"
                @click="launchTextFirework(p)"
              >
                {{ p }}
                <button class="preset-remove" @click.stop="removeTextPreset(i)">×</button>
              </span>
            </div>
          </div>
          <!-- 颜色选择器 Phase D1 -->
          <div class="form-option">
            <label for="firework-custom-color">{{ t('firework.customColor') }}</label>
            <div class="color-picker-row">
              <button
                v-for="c in presetColors"
                :key="c"
                class="color-swatch"
                :style="{ background: c }"
                :class="{ active: customColor === c }"
                @click="customColor = customColor === c ? null : c"
              />
              <input
                id="firework-custom-color"
                type="color"
                v-model="colorPickerHex"
                class="color-hex-input"
                @change="customColor = colorPickerHex"
              />
              <button v-if="customColor" class="color-reset" @click="customColor = null">×</button>
            </div>
          </div>
          <!-- 录制模式 Phase C1 -->
          <div class="form-option form-option--checkbox">
            <label for="firework-record-mode">{{ t('firework.recordMode') }}</label>
            <input id="firework-record-mode" type="checkbox" v-model="isRecording" />
          </div>
          <div v-if="isRecording" class="record-status">
            {{
              t('firework.recording', {
                count: timeline.length,
                time: formatDuration(totalRecordTime),
              })
            }}
            <button class="text-firework-btn" @click="clearRecording">
              {{ t('firework.clearRecording') }}
            </button>
          </div>
          <!-- 高级参数 Phase D3 -->
          <details class="advanced-params">
            <summary>{{ t('firework.advancedParams') }}</summary>
            <div class="form-option">
              <label for="firework-gravity">{{ t('firework.gravity') }} ({{ gravity }})</label>
              <input
                id="firework-gravity"
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                v-model.number="gravity"
                class="param-slider"
              />
            </div>
            <div class="form-option">
              <label for="firework-particle-density"
                >{{ t('firework.particleDensity') }} ({{ particleDensity }})</label
              >
              <input
                id="firework-particle-density"
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                v-model.number="particleDensity"
                class="param-slider"
              />
            </div>
            <div class="form-option">
              <label for="firework-spark-amount"
                >{{ t('firework.sparkAmount') }} ({{ sparkAmount }})</label
              >
              <input
                id="firework-spark-amount"
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                v-model.number="sparkAmount"
                class="param-slider"
              />
            </div>
            <p class="param-hint">{{ t('firework.advancedHint') }}</p>
          </details>
        </form>
      </div>
    </div>

    <div class="back-btn" @click="goBack">
      <svg fill="white" width="24" height="24" viewBox="0 0 24 24">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
      </svg>
      <span>{{ t('firework.back') }}</span>
    </div>

    <router-link
      :to="currentLocale === 'zh-CN' ? '/firework/leaderboard' : '/en/firework/leaderboard'"
      class="leaderboard-entry-btn"
    >
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
        <input
          id="firework-save-title"
          v-model="saveTitle"
          class="save-input"
          maxlength="30"
          :placeholder="t('firework.saveDialog.placeholder')"
          :aria-label="t('firework.saveDialog.placeholder')"
        />
        <div class="save-btns">
          <button class="save-submit" @click="doSave" :disabled="saveLoading">
            {{ saveLoading ? t('firework.saveDialog.saving') : t('firework.saveDialog.save') }}
          </button>
          <button class="save-cancel" @click="showSaveDialog = false">
            {{ t('firework.saveDialog.cancel') }}
          </button>
        </div>
      </div>
      <div class="save-card" v-else>
        <h3>{{ t('firework.saveDialog.success') }}</h3>
        <p class="save-slug">{{ t('firework.saveDialog.shareGenerated') }}</p>
        <div class="share-url-box">
          <code>{{ shareUrl }}</code>
        </div>
        <div class="save-btns">
          <button class="save-submit" @click="copyShareLink">
            {{ t('firework.saveDialog.copyLink') }}
          </button>
          <button class="save-cancel" @click="showSaveDialog = false">
            {{ t('firework.saveDialog.close') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { createRecipe } from '@/api/fireworks'
import {
  FireworkEngine,
  Shell,
  loadTextPresets,
  saveTextPresets,
  rasterizeText,
  textShell,
} from '@/composables/useFireworkEngine'
import defaultBgImage from '../assets/images/guchen_yanhua.jpeg'
import shootingstarsBgImage from '../assets/images/shootingstars.jpeg'
import moonuniverseBgImage from '../assets/images/moonuniverse.jpeg'
import mountainsBgImage from '../assets/images/mountains.jpeg'

// 背景图片选项
const getBackgroundOptions = (t: any) => [
  { value: 'default', label: t('firework.bgDefault'), image: defaultBgImage },
  { value: 'shootingstars', label: t('firework.bgShootingStars'), image: shootingstarsBgImage },
  { value: 'moonuniverse', label: t('firework.bgMoonUniverse'), image: moonuniverseBgImage },
  { value: 'mountains', label: t('firework.bgMountains'), image: mountainsBgImage },
  { value: 'none', label: t('firework.bgNone'), image: null },
]

const backgroundOptions = computed(() => getBackgroundOptions(t))

const router = useRouter()
const route = useRoute()
const { t, locale } = useI18n()

const currentLocale = computed(() => locale.value)

// 状态
const loading = ref(true)
const loadingStatus = ref(t('firework.loadingStatus'))
const initError = ref('')
const isPaused = ref(false)
const soundEnabled = ref(true)
const showSettings = ref(false)
const shellType = ref('Random')
const shellSize = ref('2')
const quality = ref('2')
const skyLighting = ref('2')
const autoLaunch = ref(true)
const finaleMode = ref(false)
const fullscreen = ref(false)

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
const timeline = ref<
  {
    delay: number
    shellType: string
    shellSize: number
    x: number
    height: number
    text?: string
  }[]
>([])
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
    if (recordTimer) {
      clearInterval(recordTimer)
      recordTimer = null
    }
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
  simSpeedLabelTimer = setTimeout(() => {
    showSimSpeedLabel.value = false
  }, 800)
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
    // @ts-expect-error config is dynamic engine state, not typed as IFireworkConfig
    const recipe = await createRecipe({ title: saveTitle.value, config })
    shareSlug.value = recipe.shareSlug
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
const stageContainer = ref<HTMLElement | null>(null)
const backgroundLayer = ref<HTMLElement | null>(null)
const skyLightLayer = ref<HTMLElement | null>(null)
const canvasContainer = ref<HTMLElement | null>(null)
const trailsCanvas = ref<HTMLCanvasElement | null>(null)
const mainCanvas = ref<HTMLCanvasElement | null>(null)
// 烟花引擎实例
let fireworkEngine: FireworkEngine | null = null

onMounted(() => {
  const path = route.path
  if (path.startsWith('/en')) {
    locale.value = 'en'
    localStorage.setItem('locale', 'en')
  } else {
    locale.value = 'zh-CN'
    localStorage.setItem('locale', 'zh-CN')
  }
  initFirework()

  // 8 秒超时兜底
  setTimeout(() => {
    if (loading.value) {
      loading.value = false
      if (!fireworkEngine) {
        initError.value =
          currentLocale.value === 'zh-CN'
            ? '引擎初始化超时，请刷新页面重试'
            : 'Engine init timeout, please refresh'
      }
    }
  }, 8000)
})

onUnmounted(() => {
  if (recordTimer) {
    clearInterval(recordTimer)
    recordTimer = null
  }
  if (fireworkEngine) {
    fireworkEngine.destroy()
    fireworkEngine = null
  }
})

function goBack() {
  const currentPath = route.path
  if (currentPath.startsWith('/en')) {
    router.push('/en#firework-section')
  } else {
    router.push('/#firework-section')
  }
}

function toggleLanguage() {
  const currentPath = route.path
  let newPath = ''

  if (currentPath === '/firework') {
    newPath = '/en/firework'
  } else if (currentPath === '/en/firework') {
    newPath = '/firework'
  } else if (currentPath.startsWith('/en')) {
    newPath = currentPath.replace('/en', '') || '/'
  } else {
    newPath = '/en' + currentPath
  }

  const newLocale = newPath.startsWith('/en') ? 'en' : 'zh-CN'
  locale.value = newLocale
  localStorage.setItem('locale', newLocale)
  router.replace(newPath)
}

function togglePause() {
  isPaused.value = !isPaused.value
  if (fireworkEngine) {
    fireworkEngine.setPaused(isPaused.value)
  }
}

function toggleSound() {
  soundEnabled.value = !soundEnabled.value
  if (fireworkEngine) {
    fireworkEngine.setSoundEnabled(soundEnabled.value)
  }
}

function toggleFullscreen() {
  if (fullscreen.value) {
    document.documentElement.requestFullscreen?.()
  } else {
    document.exitFullscreen?.()
  }
}

watch(
  [
    shellType,
    shellSize,
    quality,
    skyLighting,
    autoLaunch,
    finaleMode,
    backgroundType,
    longExposure,
    launchSequence,
    simSpeed,
    gravity,
    particleDensity,
    sparkAmount,
    customColor,
  ],
  () => {
    if (fireworkEngine) {
      const selectedBg = backgroundOptions.value.find(
        (opt: any) => opt.value === backgroundType.value,
      )
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
        backgroundImage: selectedBg?.image || null,
      })
    }
  },
)

function initFirework() {
  loadingStatus.value = t('firework.initializing')

  if (
    !trailsCanvas.value ||
    !mainCanvas.value ||
    !canvasContainer.value ||
    !stageContainer.value ||
    !backgroundLayer.value ||
    !skyLightLayer.value
  ) {
    return
  }

  const selectedBg = backgroundOptions.value.find((opt: any) => opt.value === backgroundType.value)

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
      loading.value = false
    },
  )

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
  color: rgba(255, 255, 255, 0.7);
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
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s;
  border: none;
}

.btn:hover {
  background: rgba(255, 255, 255, 0.4);
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
  background: rgba(0, 0, 0, 0.9);
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
  color: rgba(255, 255, 255, 0.6);
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
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;
}

.form-option select option {
  background: rgba(0, 0, 0, 0.9);
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
  color: rgba(255, 255, 255, 0.35);
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
  background: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  z-index: 100;
  transition: background 0.3s;
  border: none;
}

.back-btn:hover {
  background: rgba(255, 0, 0, 0.7);
}

.lang-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: rgba(0, 0, 0, 0.5);
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
  background: rgba(255, 0, 0, 0.7);
}

/* 排行榜入口按钮 */
.leaderboard-entry-btn {
  position: absolute;
  top: 80px;
  left: 20px;
  color: #f59e0b;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  z-index: 100;
  transition: background 0.3s;
}
.leaderboard-entry-btn:hover {
  background: rgba(245, 158, 11, 0.3);
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
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  line-height: 1;
}
.preset-remove:hover {
  color: #ef4444;
}

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
  transition:
    transform 0.15s,
    border-color 0.15s;
}
.color-swatch:hover {
  transform: scale(1.15);
}
.color-swatch.active {
  border-color: #fff;
  transform: scale(1.15);
}
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
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  font-size: 18px;
  padding: 0 4px;
}
.color-reset:hover {
  color: #ef4444;
}

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
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 12px;
}
.advanced-params summary {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  padding: 4px 0;
}
.advanced-params summary:hover {
  color: #fff;
}
.param-slider {
  width: 100%;
  accent-color: #f59e0b;
  cursor: pointer;
}
.param-hint {
  color: rgba(255, 255, 255, 0.35);
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
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  z-index: 110;
  transition: height 0.15s;
}
.sim-speed-bar:hover {
  height: 14px;
}
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
  background: rgba(0, 0, 0, 0.8);
  color: #f59e0b;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 10px;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}
.sim-speed-label.visible {
  opacity: 1;
}
</style>
