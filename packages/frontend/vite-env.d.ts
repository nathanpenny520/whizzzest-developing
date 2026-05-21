/// <reference types="vite/client" />

// 高德地图安全配置类型声明
interface Window {
  _AMapSecurityConfig?: {
    securityJsCode: string
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}