/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import {
  loadTextPresets,
  saveTextPresets,
  rasterizeText,
  textShell,
  Shell,
} from '@/composables/useFireworkEngine'
import type { FireworkEngine } from '@/composables/useFireworkEngine'
import defaultBgImage from '../assets/images/guchen_yanhua.jpeg'
import shootingstarsBgImage from '../assets/images/shootingstars.jpeg'
import moonuniverseBgImage from '../assets/images/moonuniverse.jpeg'
import mountainsBgImage from '../assets/images/mountains.jpeg'

export function useFireworkSettings() {
  const router = useRouter()
  const route = useRoute()
  const { t, locale } = useI18n()

  const currentLocale = computed(() => locale.value)

  // 背景图片选项
  const getBackgroundOptions = () => [
    { value: 'default', label: t('firework.bgDefault'), image: defaultBgImage },
    { value: 'shootingstars', label: t('firework.bgShootingStars'), image: shootingstarsBgImage },
    { value: 'moonuniverse', label: t('firework.bgMoonUniverse'), image: moonuniverseBgImage },
    { value: 'mountains', label: t('firework.bgMountains'), image: mountainsBgImage },
    { value: 'none', label: t('firework.bgNone'), image: null },
  ]

  const backgroundOptions = computed(() => getBackgroundOptions())

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

  // 文字烟花
  const textPresets = ref<string[]>(loadTextPresets())
  const newPreset = ref('')
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

  // 发射文字烟花
  let fireworkEngine: FireworkEngine | null = null
  function setEngine(engine: FireworkEngine | null) {
    fireworkEngine = engine
  }
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

  // Phase B/C/D 状态
  const longExposure = ref(false)
  const launchSequence = ref('random')
  const simSpeed = ref(0.9)
  const showSimSpeedLabel = ref(false)
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
      const cx =
        'touches' in ev ? (ev as TouchEvent).touches[0].clientX : (ev as MouseEvent).clientX
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

  // 控制函数
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
    let newPath: string
    if (currentPath === '/firework') newPath = '/en/firework'
    else if (currentPath === '/en/firework') newPath = '/firework'
    else if (currentPath.startsWith('/en')) newPath = currentPath.replace('/en', '') || '/'
    else newPath = '/en' + currentPath
    const newLocale = newPath.startsWith('/en') ? 'en' : 'zh-CN'
    locale.value = newLocale
    localStorage.setItem('locale', newLocale)
    router.replace(newPath)
  }

  function togglePause() {
    isPaused.value = !isPaused.value
    if (fireworkEngine) fireworkEngine.setPaused(isPaused.value)
  }

  function toggleSound() {
    soundEnabled.value = !soundEnabled.value
    if (fireworkEngine) fireworkEngine.setSoundEnabled(soundEnabled.value)
  }

  function toggleFullscreen() {
    if (fullscreen.value) {
      document.documentElement.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }

  // 配置 watcher
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

  return {
    // state
    loading,
    loadingStatus,
    initError,
    isPaused,
    soundEnabled,
    showSettings,
    shellType,
    shellSize,
    quality,
    skyLighting,
    autoLaunch,
    finaleMode,
    fullscreen,
    backgroundType,
    backgroundOptions,
    textPresets,
    newPreset,
    longExposure,
    launchSequence,
    simSpeed,
    showSimSpeedLabel,
    isRecording,
    timeline,
    recordStartTime,
    totalRecordTime,
    customColor,
    presetColors,
    colorPickerHex,
    gravity,
    particleDensity,
    sparkAmount,
    simSpeedBarRef,
    currentLocale,
    locale,
    // functions
    addTextPreset,
    removeTextPreset,
    launchTextFirework,
    setEngine,
    hideSimSpeedLabel,
    formatDuration,
    clearRecording,
    startSimSpeedDrag,
    goBack,
    toggleLanguage,
    togglePause,
    toggleSound,
    toggleFullscreen,
  }
}
