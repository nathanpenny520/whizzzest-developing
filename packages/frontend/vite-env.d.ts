/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/vue" />

// 高德地图安全配置类型声明
interface Window {
  _AMapSecurityConfig?: {
    securityJsCode: string
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any
  const component: DefineComponent<{}, {}, any>
  export default component
}
