import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useIsZh() {
  const { locale } = useI18n()
  const isZh = computed(() => (locale.value as string) === 'zh-CN')
  return { isZh, locale }
}
