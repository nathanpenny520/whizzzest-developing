// 动态路径生成 composable
// 根据当前语言生成正确的路由路径
import { useI18n } from 'vue-i18n';

export function useLocalizedPath() {
  const { locale } = useI18n();

  const getLocalizedPath = (path: string): string => {
    if (locale.value === 'en') {
      return path === '/' ? '/en' : `/en${path}`;
    }
    return path;
  };

  return { getLocalizedPath };
}