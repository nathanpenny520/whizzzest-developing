// 高德地图 JS API 2.0 最小类型声明

declare class AMapMap {
  constructor(container: HTMLDivElement | string, opts?: Record<string, unknown>)
  addControl(control: unknown): void
  add(overlay: unknown): void
  remove(overlay: unknown): void
  setFitView(overlays: unknown[], immediately?: boolean, padding?: number[]): void
  setZoomAndCenter(zoom: number, center: [number, number]): void
  destroy(): void
  on(event: string, callback: (e: unknown) => void): void
}

declare class AMapMarker {
  constructor(opts?: Record<string, unknown>)
  on(event: string, callback: () => void): void
  getPosition(): { lng: number; lat: number } | null
  getExtData(): { id: string }
  emit(event: string, e: unknown): void
}

declare class AMapInfoWindow {
  constructor(opts?: Record<string, unknown>)
  open(map: AMapMap, position: { lng: number; lat: number }): void
}

declare class AMapPolyline {
  constructor(opts?: Record<string, unknown>)
}

declare class AMapScale {
  constructor()
}

declare class AMapToolBar {
  constructor(opts?: Record<string, unknown>)
}

declare class AMapLngLat {
  constructor(lng: number, lat: number)
}

declare class AMapPixel {
  constructor(x: number, y: number)
}

declare class AMapDriving {
  constructor(opts?: Record<string, unknown>)
  search(
    origin: AMapLngLat,
    destination: AMapLngLat,
    opts: { waypoints: AMapLngLat[] },
    callback: (status: string, result: AMapDrivingResult) => void,
  ): void
}

declare const AMapDrivingPolicy: {
  LEAST_TIME: number
}

interface AMapDrivingResult {
  routes?: AMapDrivingRoute[]
}

interface AMapDrivingRoute {
  steps?: AMapDrivingStep[]
}

interface AMapDrivingStep {
  path?: Array<{ lng: number; lat: number }>
}

declare module '@amap/amap-jsapi-loader' {
  interface AMapLoaderOptions {
    key: string
    version: string
    plugins?: string[]
  }

  function load(options: AMapLoaderOptions): Promise<Record<string, unknown>>
  export = { load }
}

interface Window {
  _AMapSecurityConfig?: {
    securityJsCode: string
  }
}
