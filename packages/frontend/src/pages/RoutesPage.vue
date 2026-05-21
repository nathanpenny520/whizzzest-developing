<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section id="hero" class="relative h-screen flex items-center justify-center overflow-hidden -mt-20 -mx-4 w-[calc(100%+2rem)]">
      <div class="absolute inset-0 z-0">
        <img
          src="../assets/images/wanzai_travelling.jpeg"
          :alt="t('routes.hero.title')"
          class="w-full h-full object-cover"
          loading="eager"
        />
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      <div class="relative z-10 text-center text-white px-4">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ t('routes.hero.title') }}</h1>
        <p class="text-xl mb-6">{{ t('routes.hero.subtitle') }}</p>
      </div>
    </section>

    <!-- Interactive Route Map Section -->
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">
          {{ isZh ? '路线地图' : 'Route Map' }}
        </h2>
        <p class="text-gray-600 mb-4">
          {{ isZh ? '点击下方按钮选择旅游路线，在地图上查看行程轨迹。' : 'Click buttons below to select a travel route and view the itinerary on the map.' }}
        </p>

        <!-- 路线选择 -->
        <div class="flex flex-wrap gap-4 mb-6">
          <button
            v-for="route in travelRoutes"
            :key="route.id"
            @click="selectedRouteId = route.id"
            :class="[
              'px-6 py-3 rounded-lg font-medium transition-all cursor-pointer',
              selectedRouteId === route.id
                ? 'text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
            :style="selectedRouteId === route.id ? { backgroundColor: route.color } : {}"
          >
            {{ isZh ? route.name : route.nameEn }}
          </button>
        </div>

        <!-- 地图容器 -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="h-[400px]">
            <AmapComponent
              :center="wanzaiCenter"
              :zoom="11"
              :routes="travelRoutes"
              :show-routes="true"
              :show-markers="false"
              :selected-route-id="selectedRouteId"
              @map-ready="handleMapReady"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Route Details Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold text-gray-800 mb-8">
          {{ isZh ? '行程安排' : 'Itinerary Details' }}
        </h2>

        <!-- 各路线详情卡片 -->
        <div class="space-y-8">
          <div
            v-for="route in travelRoutes"
            :key="route.id"
            class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-shadow hover:shadow-lg"
            @click="selectedRouteId = route.id"
          >
            <!-- 路线标题 -->
            <div
              class="px-6 py-4 font-bold text-xl"
              :style="{ backgroundColor: route.color, color: 'white' }"
            >
              {{ isZh ? route.name : route.nameEn }}
            </div>

            <!-- 路线内容：文字在左，图片在右 -->
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- 左侧：路线节点 -->
                <div class="space-y-4">
                  <div
                    v-for="loc in route.locations"
                    :key="loc.id"
                    class="flex items-start gap-4"
                  >
                    <div
                      class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      :style="{ backgroundColor: route.color }"
                    >
                      {{ loc.order }}
                    </div>
                    <div class="flex-1">
                      <h4 class="font-medium text-gray-800 text-lg">
                        {{ isZh ? loc.name : loc.nameEn }}
                      </h4>
                      <p class="text-gray-600 text-sm mt-1">
                        {{ isZh ? loc.description : loc.descriptionEn }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- 右侧：路线图片 -->
                <div class="flex items-center justify-center">
                  <img
                    :src="routeImages[route.id]"
                    :alt="isZh ? route.name : route.nameEn"
                    class="w-full h-auto max-h-80 object-contain rounded-lg bg-gray-100"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-red-600 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-4">{{ t('routes.cta.title') }}</h2>
        <p class="text-xl mb-8 max-w-3xl mx-auto">
          {{ t('routes.cta.desc') }}
        </p>
        <router-link
          :to="getLocalizedPath('/viewing-spots')"
          class="inline-block bg-white hover:bg-gray-100 text-red-600 font-bold py-3 px-8 rounded-full transition-colors"
        >
          {{ t('routes.cta.cta') }}
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalizedPath } from '../composables/useLocalizedPath'
import AmapComponent from '@/components/AmapComponent.vue'
import { travelRoutes, WANZAI_CENTER } from '@/data/locations'

const { t, locale } = useI18n()
const { getLocalizedPath } = useLocalizedPath()
const isZh = computed(() => locale.value === 'zh-CN')

// 正确导入图片
import gucWenhuaTra from '../assets/images/guc_wenhua_tra.jpg'
import shansWenhuaTra from '../assets/images/shans_wenhua_tra.jpeg'
import hongsWenhuaTra from '../assets/images/hongs_wenhua_tra.jpg'

// 万载中心坐标
const wanzaiCenter = WANZAI_CENTER

// 选中的路线
const selectedRouteId = ref('ancient-culture-tour')

// 路线图片映射
const routeImages: Record<string, string> = {
  'ancient-culture-tour': gucWenhuaTra,
  'mountain-water-tour': shansWenhuaTra,
  'red-culture-tour': hongsWenhuaTra
}

// 地图就绪
const handleMapReady = () => {
  console.log('Route map ready')
}
</script>

<style scoped>
/* Add any additional styles here */
</style>