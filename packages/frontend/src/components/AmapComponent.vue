<template>
  <div class="amap-container" ref="mapContainer">
    <div v-if="loading" class="map-loading">
      <div class="loading-spinner"></div>
      <span>{{ isZh ? '地图加载中...' : 'Loading map...' }}</span>
      <span class="loading-hint">{{ debugMsg }}</span>
    </div>
    <div v-if="error" class="map-error">
      <span>{{ errorMsg }}</span>
      <button @click="initMap" class="retry-btn">{{ isZh ? '重试' : 'Retry' }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import AMapLoader from '@amap/amap-jsapi-loader'
import type { Location, TravelRoute } from '@/data/locations'

// Props 定义
interface Props {
  center?: { longitude: number; latitude: number }
  zoom?: number
  locations?: Location[]
  routes?: TravelRoute[]
  showMarkers?: boolean
  showRoutes?: boolean
  selectedRouteId?: string
}

const props = withDefaults(defineProps<Props>(), {
  center: () => ({ longitude: 114.365, latitude: 28.105 }),
  zoom: 12,
  locations: () => [],
  routes: () => [],
  showMarkers: true,
  showRoutes: false,
  selectedRouteId: ''
})

// Emits
const emit = defineEmits<{
  (e: 'marker-click', location: Location): void
  (e: 'map-ready'): void
}>()

const { locale } = useI18n()
const isZh = computed(() => locale.value === 'zh-CN')

const mapContainer = ref<HTMLDivElement>()
const loading = ref(true)
const error = ref(false)
const errorMsg = ref('')
const debugMsg = ref('')

// 地图实例
let mapInstance: any = null
let markers: any[] = []        // 景点标记
let routeMarkers: any[] = []   // 路线起点终点标记
let polylines: any[] = []      // 路线折线
let AMap: any = null

// 初始化地图（使用官方推荐的 AMapLoader）
const initMap = async () => {
  if (!mapContainer.value) return

  loading.value = true
  error.value = false
  errorMsg.value = ''
  debugMsg.value = isZh.value ? '初始化...' : 'Initializing...'

  try {
    // 设置安全密钥（必须在 load 之前设置）
    const securityJsCode = import.meta.env.VITE_AMAP_SECURITY_CODE || ''

    window._AMapSecurityConfig = {
      securityJsCode: securityJsCode
    }

    debugMsg.value = isZh.value ? '加载地图...' : 'Loading map...'

    // 使用官方 AMapLoader 加载（包含驾车路线规划插件）
    AMap = await AMapLoader.load({
      key: import.meta.env.VITE_AMAP_KEY || 'f3ffabd511cffc5f19781d3f2df45d20',
      version: '2.0',
      plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.Driving']
    })

    debugMsg.value = isZh.value ? '创建地图实例...' : 'Creating map instance...'

    // 创建地图实例
    mapInstance = new AMap.Map(mapContainer.value, {
      viewMode: '2D',
      zoom: props.zoom,
      center: [props.center.longitude, props.center.latitude],
      mapStyle: 'amap://styles/normal'
    })

    // 添加控件
    mapInstance.addControl(new AMap.Scale())
    mapInstance.addControl(new AMap.ToolBar({
      position: 'RB'
    }))

    debugMsg.value = isZh.value ? '等待地图就绪...' : 'Waiting for map ready...'

    // 地图加载完成
    mapInstance.on('complete', () => {
      loading.value = false
      debugMsg.value = ''
      console.log('[Amap] 地图就绪')
      emit('map-ready')

      // 初始添加标记点
      if (props.showMarkers && props.locations.length > 0) {
        addMarkers(props.locations)
      }

      // 初始添加路线
      if (props.showRoutes && props.routes.length > 0) {
        addRoutes(props.routes, props.selectedRouteId)
      }
    })

    // 监听地图错误
    mapInstance.on('error', (e: any) => {
      console.error('[Amap] 地图错误:', e)
      loading.value = false
      error.value = true
      errorMsg.value = isZh.value ? '地图加载失败' : 'Map load failed'
    })

  } catch (err: any) {
    console.error('[Amap] 初始化失败:', err)
    loading.value = false
    error.value = true
    errorMsg.value = err.message || (isZh.value ? '地图初始化失败' : 'Map initialization failed')
  }
}

// 添加景点标记点
const addMarkers = (locations: Location[]) => {
  if (!AMap || !mapInstance) return
  clearMarkers()

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      attraction: '#dc2626',
      food: '#f59e0b',
      culture: '#8b5cf6',
      viewing: '#10b981',
      red: '#b91c1c'
    }
    return colors[category] || '#dc2626'
  }

  locations.forEach((location) => {
    const marker = new AMap.Marker({
      position: [location.longitude, location.latitude],
      title: isZh.value ? location.name : location.nameEn,
      content: `
        <div class="custom-marker" style="background-color: ${getCategoryColor(location.category)}">
          <div class="marker-dot"></div>
        </div>
      `,
      offset: new AMap.Pixel(-10, -10)
    })

    marker.on('click', () => {
      emit('marker-click', location)
      const infoWindow = new AMap.InfoWindow({
        content: `
          <div class="info-window">
            <h4>${isZh.value ? location.name : location.nameEn}</h4>
            <p>${isZh.value ? location.description : location.descriptionEn}</p>
          </div>
        `,
        offset: new AMap.Pixel(0, -30)
      })
      infoWindow.open(mapInstance, marker.getPosition())
    })

    mapInstance.add(marker)
    markers.push(marker)
  })

  // 自动调整视野
  if (locations.length > 1) {
    mapInstance.setFitView(markers, false, [50, 50, 50, 50])
  }
}

// 清除景点标记点
const clearMarkers = () => {
  markers.forEach(marker => {
    if (mapInstance) mapInstance.remove(marker)
  })
  markers = []
}

// 添加路线（使用真实驾车导航路线）
const addRoutes = (routes: TravelRoute[], selectedId?: string) => {
  if (!AMap || !mapInstance) return
  clearAllRouteElements()

  const selectedRoute = selectedId
    ? routes.find(r => r.id === selectedId)
    : routes[0]

  if (!selectedRoute || selectedRoute.locations.length < 2) return

  // 创建驾车路线规划实例
  const driving = new AMap.Driving({
    policy: AMap.DrivingPolicy.LEAST_TIME
  })

  // 添加起点终点标记
  const firstLoc = selectedRoute.locations[0]
  const lastLoc = selectedRoute.locations[selectedRoute.locations.length - 1]

  const startMarker = new AMap.Marker({
    position: [firstLoc.longitude, firstLoc.latitude],
    content: `<div class="route-marker start" style="background-color: ${selectedRoute.color}">起</div>`,
    offset: new AMap.Pixel(-12, -12)
  })
  mapInstance.add(startMarker)
  routeMarkers.push(startMarker)

  const endMarker = new AMap.Marker({
    position: [lastLoc.longitude, lastLoc.latitude],
    content: `<div class="route-marker end" style="background-color: ${selectedRoute.color}">终</div>`,
    offset: new AMap.Pixel(-12, -12)
  })
  mapInstance.add(endMarker)
  routeMarkers.push(endMarker)

  // 添加中间途经点标记（显示序号）
  selectedRoute.locations.slice(1, -1).forEach((loc) => {
    const waypointMarker = new AMap.Marker({
      position: [loc.longitude, loc.latitude],
      content: `<div class="waypoint-marker" style="background-color: ${selectedRoute.color}">${loc.order}</div>`,
      offset: new AMap.Pixel(-12, -12)
    })
    mapInstance.add(waypointMarker)
    routeMarkers.push(waypointMarker)
  })

  // 计算整条路线的驾车路径
  const waypoints = selectedRoute.locations.slice(1, -1).map(loc =>
    new AMap.LngLat(loc.longitude, loc.latitude)
  )

  driving.search(
    new AMap.LngLat(firstLoc.longitude, firstLoc.latitude),
    new AMap.LngLat(lastLoc.longitude, lastLoc.latitude),
    { waypoints: waypoints },
    (status: string, result: any) => {
      if (status === 'complete' && result.routes && result.routes.length > 0) {
        // 检查 mapInstance 是否仍然存在
        if (!mapInstance) {
          console.warn('[Amap] 地图实例已销毁，跳过路线绘制')
          return
        }
        // 绘制驾车路线 - JS API 2.0结构：routes[].steps[].path
        result.routes.forEach((routeData: any) => {
          // 从所有步骤中提取路径点
          const allPathPoints: any[] = []
          if (routeData.steps && Array.isArray(routeData.steps)) {
            routeData.steps.forEach((step: any) => {
              if (step.path && Array.isArray(step.path)) {
                step.path.forEach((point: any) => {
                  allPathPoints.push([point.lng, point.lat])
                })
              }
            })
          }

          if (allPathPoints.length > 0) {
            const polyline = new AMap.Polyline({
              path: allPathPoints,
              strokeColor: selectedRoute.color,
              strokeWeight: 6,
              strokeOpacity: 0.8,
              lineJoin: 'round',
              lineCap: 'round',
              showDir: true
            })
            if (mapInstance) {
              mapInstance.add(polyline)
              polylines.push(polyline)
            }
          }
        })

        // 调整视野包含整条路线
        if (polylines.length > 0 && mapInstance) {
          mapInstance.setFitView([...polylines, ...routeMarkers], false, [50, 50, 50, 50])
        }
        console.log('[Amap] 驾车路线规划成功')
      } else {
        console.warn('[Amap] 驾车路线规划失败，使用直线连接:', status)
        // 如果驾车路线规划失败，使用直线连接作为备用
        if (!mapInstance) return
        const fallbackPath = selectedRoute.locations.map(loc => [loc.longitude, loc.latitude])
        const fallbackPolyline = new AMap.Polyline({
          path: fallbackPath,
          strokeColor: selectedRoute.color,
          strokeWeight: 4,
          strokeOpacity: 0.6,
          lineJoin: 'round'
        })
        mapInstance.add(fallbackPolyline)
        polylines.push(fallbackPolyline)
        mapInstance.setFitView([...polylines, ...routeMarkers], false, [50, 50, 50, 50])
      }
    }
  )
}

// 清除所有路线相关元素
const clearAllRouteElements = () => {
  polylines.forEach(polyline => {
    if (mapInstance) mapInstance.remove(polyline)
  })
  polylines = []

  routeMarkers.forEach(marker => {
    if (mapInstance) mapInstance.remove(marker)
  })
  routeMarkers = []
}

// 监听筛选变化
watch(() => props.locations, (newLocations) => {
  if (props.showMarkers && mapInstance && newLocations.length > 0) {
    nextTick(() => addMarkers(newLocations))
  }
}, { deep: true })

// 监听路线选择变化
watch(() => props.selectedRouteId, (newId) => {
  if (props.showRoutes && mapInstance) {
    nextTick(() => addRoutes(props.routes, newId))
  }
})

// 监听路线数据变化
watch(() => props.routes, (newRoutes) => {
  if (props.showRoutes && mapInstance && newRoutes.length > 0) {
    nextTick(() => addRoutes(newRoutes, props.selectedRouteId))
  }
}, { deep: true })

// 生命周期
onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (mapInstance) {
    mapInstance.destroy()
    mapInstance = null
  }
  markers = []
  routeMarkers = []
  polylines = []
})
</script>

<style scoped>
.amap-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
}

.map-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e5e5;
  border-top-color: #dc2626;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.map-loading span {
  margin-top: 12px;
  color: #666;
}

.loading-hint {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

.map-error {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  padding: 20px;
}

.map-error span {
  color: #dc2626;
  margin-bottom: 12px;
  text-align: center;
}

.retry-btn {
  padding: 8px 16px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.retry-btn:hover {
  background: #b91c1c;
}
</style>

<style>
.custom-marker {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.custom-marker:hover {
  transform: scale(1.2);
}

.marker-dot {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
}

.route-marker {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.route-marker.start {
  border-radius: 4px 4px 4px 0;
}

.route-marker.end {
  border-radius: 4px 4px 0 4px;
}

.waypoint-marker {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.info-window {
  padding: 12px;
  min-width: 150px;
  max-width: 300px;
}

.info-window h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: bold;
  color: #dc2626;
}

.info-window p {
  margin: 0;
  font-size: 12px;
  color: #666;
  line-height: 1.5;
}
</style>