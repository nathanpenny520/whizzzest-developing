<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section id="hero" class="relative h-screen flex items-center justify-center overflow-hidden -mt-20 -mx-4 w-[calc(100%+2rem)]">
      <div class="absolute inset-0 z-0">
        <img
          src="../assets/images/viewingspots_hero.jpeg"
          :alt="t('viewingSpots.hero.title')"
          class="w-full h-full object-cover"
          loading="eager"
        />
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      <div class="relative z-10 text-center text-white px-4">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ t('viewingSpots.hero.title') }}</h1>
        <p class="text-xl mb-6">{{ t('viewingSpots.hero.subtitle') }}</p>
      </div>
    </section>

    <!-- Viewing Spots Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- 万载古城 -->
          <div class="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img
              src="../assets/images/guchen_niaokan.jpeg"
              :alt="t('viewingSpots.spots.ancientCity')"
              class="w-full h-64 object-cover"
              loading="lazy"
            />
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2 text-red-600">{{ t('viewingSpots.spots.ancientCity') }}</h3>
              <p class="text-gray-600 mb-4">
                {{ t('viewingSpots.spots.ancientCityDesc1') }}
              </p>
              <p class="text-gray-600 mb-4">
                <strong>{{ t('viewingSpots.spots.bestViewing') }}：</strong>{{ t('viewingSpots.spots.ancientCityViewing') }}
              </p>
              <p class="text-gray-600">
                <strong>{{ t('viewingSpots.spots.transportation') }}：</strong>{{ t('viewingSpots.spots.ancientCityTransport') }}
              </p>
            </div>
          </div>

          <!-- 龙湖公园 -->
          <div class="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img
              src="../assets/images/longhu_niaokan.jpeg"
              :alt="t('viewingSpots.spots.longhuPark')"
              class="w-full h-64 object-cover"
              loading="lazy"
            />
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2 text-red-600">{{ t('viewingSpots.spots.longhuPark') }}</h3>
              <p class="text-gray-600 mb-4">
                {{ t('viewingSpots.spots.longhuParkDesc1') }}
              </p>
              <p class="text-gray-600 mb-4">
                <strong>{{ t('viewingSpots.spots.bestViewing') }}：</strong>{{ t('viewingSpots.spots.longhuParkViewing') }}
              </p>
              <p class="text-gray-600">
                <strong>{{ t('viewingSpots.spots.transportation') }}：</strong>{{ t('viewingSpots.spots.longhuParkTransport') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tips Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">{{ t('viewingSpots.tips.title') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white rounded-lg p-6 shadow-md">
            <h3 class="text-xl font-bold mb-4 text-red-600">{{ t('viewingSpots.tips.bestTime') }}</h3>
            <ul class="list-disc list-inside space-y-2 text-gray-600">
              <li>{{ t('viewingSpots.tips.time1') }}</li>
              <li>{{ t('viewingSpots.tips.time2') }}</li>
              <li>{{ t('viewingSpots.tips.time3') }}</li>
              <li>{{ t('viewingSpots.tips.time4') }}</li>
              <li>{{ t('viewingSpots.tips.time5') }}</li>
            </ul>
          </div>
          <div class="bg-white rounded-lg p-6 shadow-md">
            <h3 class="text-xl font-bold mb-4 text-red-600">{{ t('viewingSpots.tips.notice') }}</h3>
            <ul class="list-disc list-inside space-y-2 text-gray-600">
              <li>{{ t('viewingSpots.tips.notice1') }}</li>
              <li>{{ t('viewingSpots.tips.notice2') }}</li>
              <li>{{ t('viewingSpots.tips.notice3') }}</li>
              <li>{{ t('viewingSpots.tips.notice4') }}</li>
              <li>{{ t('viewingSpots.tips.notice5') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-red-600 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-4">{{ t('viewingSpots.cta.title') }}</h2>
        <p class="text-xl mb-8 max-w-3xl mx-auto">
          {{ t('viewingSpots.cta.desc') }}
        </p>
        <router-link
          :to="getLocalizedPath('/map')"
          class="inline-block bg-white hover:bg-gray-100 text-red-600 font-bold py-3 px-8 rounded-full transition-colors"
        >
          {{ t('viewingSpots.cta.cta') }}
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useLocalizedPath } from '../composables/useLocalizedPath';

const { t } = useI18n();
const { getLocalizedPath } = useLocalizedPath();
</script>

<style scoped>
/* Add any additional styles here */
</style>