import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { createRecipe } from '@/api/fireworks'

export function useFireworkRecipe(
  getConfig: () => Record<string, unknown>,
  currentLocale: { value: string },
) {
  const authStore = useAuthStore()
  const showSaveDialog = ref(false)
  const saveTitle = ref('')
  const shareSlug = ref('')
  const saveSuccess = ref(false)
  const saveLoading = ref(false)

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
      const config = getConfig()
      // @ts-expect-error config is dynamic engine state
      const recipe = await createRecipe({ title: saveTitle.value, config })
      shareSlug.value = recipe.shareSlug
      saveSuccess.value = true
    } finally {
      saveLoading.value = false
    }
  }

  const shareUrl = computed(() => `${window.location.origin}/firework/share/${shareSlug.value}`)

  function copyShareLink() {
    navigator.clipboard.writeText(shareUrl.value).catch(() => {})
  }

  return {
    showSaveDialog,
    saveTitle,
    shareSlug,
    saveSuccess,
    saveLoading,
    handleSave,
    doSave,
    shareUrl,
    copyShareLink,
  }
}
