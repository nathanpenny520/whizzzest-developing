<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section id="hero" class="relative h-screen flex items-center justify-center overflow-hidden -mt-20 -mx-4 w-[calc(100%+2rem)]">
      <div class="absolute inset-0 z-0">
        <img
          src="../assets/images/nuowu.jpeg"
          :alt="t('culture.hero.title')"
          class="w-full h-full object-cover"
          loading="eager"
        />
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      <div class="relative z-10 text-center text-white px-4">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ t('culture.hero.title') }}</h1>
        <p class="text-xl mb-6">{{ t('culture.hero.subtitle') }}</p>
      </div>
    </section>

    <!-- Culture List Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <!-- 万载花炮 -->
        <div class="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div class="md:w-1/2">
            <div class="video-container relative w-full rounded-lg shadow-lg overflow-hidden bg-gray-900 aspect-video">
              <video 
                controls
                class="w-full h-full object-cover"
                preload="metadata"
              >
                <source :src="yanhuaVideo" type="video/mp4">
                {{ t('common.videoNotSupported') }}
              </video>
            </div>
            <p class="text-sm text-gray-600 mt-3">{{ t('common.videoHint') }}</p>
          </div>
          <div class="md:w-1/2">
            <h2 class="text-2xl font-bold mb-4 text-red-600">{{ t('culture.sections.fireworks.title') }}</h2>
            <p class="text-gray-600 mb-4">
              {{ t('culture.sections.fireworks.desc1') }}
            </p>
            <p class="text-gray-600 mb-4">
              {{ t('culture.sections.fireworks.desc2') }}
            </p>
            <p class="text-gray-600">
              {{ t('culture.sections.fireworks.desc3') }}
            </p>
          </div>
        </div>

        <!-- 得胜鼓 -->
         <div class="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div class="md:w-1/2">
            <div class="video-container relative w-full rounded-lg shadow-lg overflow-hidden bg-gray-900 aspect-video">
              <video 
                controls
                class="w-full h-full object-cover"
                preload="metadata"
              >
                <source :src="deshengguVideo" type="video/mp4">
                {{ t('common.videoNotSupported') }}
              </video>
            </div>
            <p class="text-sm text-gray-600 mt-3">{{ t('common.videoHint') }}</p>
          </div>
          <div class="md:w-1/2">
            <h2 class="text-2xl font-bold mb-4 text-red-600">{{ t('culture.sections.deshenggu.title') }}</h2>
            <p class="text-gray-600 mb-4">
              {{ t('culture.sections.deshenggu.desc1') }}
            </p>
            <p class="text-gray-600 mb-4">
              {{ t('culture.sections.deshenggu.desc2') }}
            </p>
            <p class="text-gray-600">
              {{ t('culture.sections.deshenggu.desc3') }}
            </p>
          </div>
        </div>

       <!-- 夏布织造 -->
        <div class="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div class="md:w-1/2">
            <div class="video-container relative w-full rounded-lg shadow-lg overflow-hidden bg-gray-900 aspect-video">
              <video 
                controls
                class="w-full h-full object-cover"
                preload="metadata"
              >
                <source :src="xiabuVideo" type="video/mp4">
                {{ t('common.videoNotSupported') }}
              </video>
            </div>
            <p class="text-sm text-gray-600 mt-3">{{ t('common.videoHint') }}</p>
          </div>
          <div class="md:w-1/2">
            <h2 class="text-2xl font-bold mb-4 text-red-600">{{ t('culture.sections.xiaBu.title') }}</h2>
            <p class="text-gray-600 mb-4">
              {{ t('culture.sections.xiaBu.desc1') }}
            </p>
            <p class="text-gray-600 mb-4">
              {{ t('culture.sections.xiaBu.desc2') }}
            </p>
            <p class="text-gray-600">
              {{ t('culture.sections.xiaBu.desc3') }}
            </p>
          </div>

        </div>

        <!-- 万载开口傩 -->
        <div class="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div class="md:w-1/2">
            <div class="video-container relative w-full rounded-lg shadow-lg overflow-hidden bg-gray-900 aspect-video">
              <video 
                controls
                class="w-full h-full object-cover"
                preload="metadata"
              >
                <source :src="kaikounuoVideo" type="video/mp4">
                {{ t('common.videoNotSupported') }}
              </video>
            </div>
            <p class="text-sm text-gray-600 mt-3">{{ t('common.videoHint') }}</p>
          </div>
          <div class="md:w-1/2">
            <h2 class="text-2xl font-bold mb-4 text-red-600">{{ t('culture.sections.kaiKouNuo.title') }}</h2>
            <p class="text-gray-600 mb-4">
              {{ t('culture.sections.kaiKouNuo.desc1') }}
            </p>
            <p class="text-gray-600 mb-4">
              {{ t('culture.sections.kaiKouNuo.desc2') }}
            </p>
            <p class="text-gray-600">
              {{ t('culture.sections.kaiKouNuo.desc3') }}
            </p>
          </div>
        </div>

       <!-- 纸棚山歌 -->
        <div class="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div class="md:w-1/2">
            <div class="video-container relative w-full rounded-lg shadow-lg overflow-hidden bg-gray-900 aspect-video">
              <video 
                controls
                class="w-full h-full object-cover"
                preload="metadata"
              >
                <source :src="zhipengshangeVideo" type="video/mp4">
                {{ t('common.videoNotSupported') }}
              </video>
            </div>
            <p class="text-sm text-gray-600 mt-3">{{ t('common.videoHint') }}</p>
          </div>
          <div class="md:w-1/2">
            <h2 class="text-2xl font-bold mb-4 text-red-600">{{ t('culture.sections.zhiPeng.title') }}</h2>
            <p class="text-gray-600 mb-4">
              {{ t('culture.sections.zhiPeng.desc1') }}
            </p>
            <p class="text-gray-600 mb-4">
              {{ t('culture.sections.zhiPeng.desc2') }}
            </p>
            <p class="text-gray-600">
              {{ t('culture.sections.zhiPeng.desc3') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    
    <!-- CTA Section -->
    <section class="py-16 bg-red-600 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-4">{{ t('culture.cta.title') }}</h2>
        <p class="text-xl mb-8 max-w-3xl mx-auto">
          {{ t('culture.cta.desc') }}
        </p>
        <router-link
          :to="getLocalizedPath('/routes')"
          class="inline-block bg-white hover:bg-gray-100 text-red-600 font-bold py-3 px-8 rounded-full transition-colors"
        >
          {{ t('common.viewRoutes') }}
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

import yanhuaVideo from '../assets/videos/yanhua.mp4';
import deshengguVideo from '../assets/videos/deshengu.mp4';
import xiabuVideo from '../assets/videos/xiabu.mp4';
import kaikounuoVideo from '../assets/videos/kaikounuo（bilibili）.mp4';
import zhipengshangeVideo from '../assets/videos/zhipengshange.mp4';
</script>

<style scoped>
.video-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

@media (max-width: 768px) {
  .video-container {
    aspect-ratio: 16/9;
  }
}

@media (max-width: 640px) {
  .video-container {
    min-height: 200px;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .video-container {
    min-height: 300px;
  }
}

@media (min-width: 1025px) {
  .video-container {
    min-height: 400px;
  }
}
</style>