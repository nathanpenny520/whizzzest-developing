import { ref, onMounted, onUnmounted } from 'vue'

const VERSION_KEY = 'app-version'
const CHECK_INTERVAL = 2 * 60 * 1000 // 2 minutes

export function useVersionCheck() {
  const versionChanged = ref(false)
  let timer: ReturnType<typeof setInterval> | null = null

  async function checkNow(): Promise<boolean> {
    try {
      const res = await fetch('/version.json', { cache: 'no-store' })
      if (!res.ok) return false

      const data: { version?: string; commit?: string } = await res.json()
      const remoteVersion = data.version || ''
      if (!remoteVersion) return false

      const localVersion = localStorage.getItem(VERSION_KEY)

      if (!localVersion) {
        // First visit — store current version, no update prompt
        localStorage.setItem(VERSION_KEY, remoteVersion)
        return false
      }

      if (localVersion !== remoteVersion) {
        versionChanged.value = true
        return true
      }

      return false
    } catch {
      // Network error or JSON parse failure — ignore silently
      return false
    }
  }

  function applyUpdate() {
    // Fetch the new version string to store before reload
    fetch('/version.json', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (data.version) localStorage.setItem(VERSION_KEY, data.version)
      })
      .catch(() => {
        // If we can't fetch, still clear to force re-check after reload
        localStorage.removeItem(VERSION_KEY)
      })
      .finally(() => {
        window.location.reload()
      })
  }

  function dismissUpdate() {
    versionChanged.value = false
    // Store current remote version so we don't nag again until the NEXT deploy
    fetch('/version.json', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (data.version) localStorage.setItem(VERSION_KEY, data.version)
      })
      .catch(() => {})
  }

  onMounted(() => {
    checkNow()
    timer = setInterval(checkNow, CHECK_INTERVAL)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return { versionChanged, checkNow, applyUpdate, dismissUpdate }
}
