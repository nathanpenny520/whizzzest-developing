<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section id="hero" class="relative h-screen flex items-center justify-center overflow-hidden -mt-20 -mx-4 w-[calc(100%+2rem)]">
      <div class="absolute inset-0 z-0">
        <img
          src="../assets/images/shouhui_map.jpg"
          :alt="t('map.hero.title')"
          class="w-full h-full object-cover"
          loading="eager"
        />
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      <div class="relative z-10 text-center text-white px-4">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ t('map.hero.title') }}</h1>
        <p class="text-xl mb-6">{{ t('map.hero.subtitle') }}</p>
      </div>
    </section>

    <!-- Interactive Map Section -->
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">
          {{ isZh ? '互动地图' : 'Interactive Map' }}
        </h2>
        <p class="text-gray-600 mb-4">
          {{ isZh ? '点击标记点查看景点详情，使用鼠标拖拽和滚轮调整地图视角。' : 'Click markers to view attraction details. Drag and scroll to adjust the map view.' }}
        </p>

        <!-- 筛选分类 -->
        <div class="mb-6 flex flex-wrap gap-3">
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="filterCategory = cat.id"
            :class="[
              'px-4 py-2 rounded-full transition-colors',
              filterCategory === cat.id
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ isZh ? cat.name : cat.nameEn }}
          </button>
        </div>

        <!-- 地图容器 -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="h-[500px]">
            <AmapComponent
              :center="wanzaiCenter"
              :zoom="12"
              :locations="filteredLocations"
              :show-markers="true"
              @marker-click="handleMarkerClick"
              @map-ready="handleMapReady"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Selected Location Info -->
    <section v-if="selectedLocation" class="py-8 bg-gray-100">
      <div class="container mx-auto px-4">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-start gap-4">
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
              :style="{ backgroundColor: getCategoryColor(selectedLocation.category) }"
            >
              {{ getCategoryIcon(selectedLocation.category) }}
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-bold text-gray-800">
                {{ isZh ? selectedLocation.name : selectedLocation.nameEn }}
              </h3>
              <p class="text-gray-600 mt-2">
                {{ isZh ? selectedLocation.description : selectedLocation.descriptionEn }}
              </p>
            </div>
            <button
              @click="selectedLocation = null"
              class="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Static Map Section (Hand-drawn) -->
    <section class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">{{ isZh ? '手绘地图' : 'Hand-drawn Map' }}</h2>
        <div class="bg-gray-100 rounded-lg overflow-hidden shadow-md">
          <div class="w-full aspect-[4/3] relative">
            <img
              src="../assets/images/tra_map.jpg"
              :alt="isZh ? '万载旅游手绘地图' : 'Wanzai Travel Hand-drawn Map'"
              class="w-full h-full object-contain"
              loading="lazy"
            />
            <div class="absolute bottom-4 right-4 bg-white bg-opacity-80 px-4 py-2 rounded-full text-sm">
              {{ isZh ? '万载旅游手绘地图' : 'Wanzai Travel Hand-drawn Map' }}
            </div>
          </div>
          <div class="w-full space-y-6 p-4">
            <img
              src="../assets/images/site_intro_1.jpg"
              :alt="isZh ? '万载景点介绍' : 'Wanzai Attractions'"
              class="w-full h-auto object-contain"
              loading="lazy"
            />
            <img
              src="../assets/images/site_intro_2.jpg"
              :alt="isZh ? '万载景点介绍2' : 'Wanzai Attractions 2'"
              class="w-full h-auto object-contain"
              loading="lazy"
            />
            <img
              src="../assets/images/site_intro_3.jpg"
              :alt="isZh ? '万载景点介绍3' : 'Wanzai Attractions 3'"
              class="w-full h-auto object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 坐标数据说明 -->
    <section class="py-8 bg-yellow-50">
      <div class="container mx-auto px-4">
        <div class="bg-yellow-100 rounded-lg p-4 text-yellow-800">
          <p class="text-sm">
            {{ isZh ? '温馨提示：地图标记点坐标为估算值，可能与实际位置略有偏差。如有准确的景点坐标数据，请联系我们更新。' : 'Note: Map marker coordinates are estimated values and may differ slightly from actual locations. If you have accurate coordinate data, please contact us to update.' }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AmapComponent from '@/components/AmapComponent.vue'
import { locations, viewingSpots, WANZAI_CENTER, type Location } from '@/data/locations'

const { t, locale } = useI18n()
const isZh = computed(() => locale.value === 'zh-CN')

// 万载中心坐标
const wanzaiCenter = WANZAI_CENTER

// 筛选分类
const filterCategory = ref('all')
const categories = [
  { id: 'all', name: '全部', nameEn: 'All' },
  { id: 'attraction', name: '景点', nameEn: 'Attractions' },
  { id: 'culture', name: '文化', nameEn: 'Culture' },
  { id: 'food', name: '美食', nameEn: 'Food' },
  { id: 'viewing', name: '观赏点', nameEn: 'Viewing Spots' },
  { id: 'red', name: '红色景点', nameEn: 'Red Tourism' }
]

// 筛选后的位置点
const filteredLocations = computed(() => {
  const allLocations = [...locations, ...viewingSpots]

  if (filterCategory.value === 'all') {
    return allLocations
  }

  return allLocations.filter(loc => loc.category === filterCategory.value)
})

// 选中的位置
const selectedLocation = ref<Location | null>(null)

// 处理标记点击
const handleMarkerClick = (location: Location) => {
  selectedLocation.value = location
}

// 地图就绪
const handleMapReady = () => {
  console.log('Map ready')
}

// 获取分类颜色
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

// 获取分类图标
const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    attraction: '景',
    food: '食',
    culture: '文',
    viewing: '观',
    red: '红'
  }
  return icons[category] || '•'
}
</script>

<style scoped>
/* Add any additional styles here */
</style>