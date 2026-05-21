declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Vite 环境变量类型声明
interface ImportMetaEnv {
  readonly VITE_AMAP_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// 全局声明 - 高德地图 SDK
declare global {
  interface Window {
    AMap: any
  }
}

export {}
