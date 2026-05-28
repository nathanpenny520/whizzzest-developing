import { useIsZh } from '@/composables/useIsZh'

export function useAdmin() {
  const { isZh } = useIsZh()

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString(isZh.value ? 'zh-CN' : 'en-US')
  }

  return { formatDate }
}
