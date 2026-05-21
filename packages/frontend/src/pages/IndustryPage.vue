<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section id="hero" class="relative h-screen flex items-center justify-center overflow-hidden -mt-20 -mx-4 w-[calc(100%+2rem)]">
      <div class="absolute inset-0 z-0">
        <img
          src="../assets/images/longhu_yanhuowanhui.jpeg"
          :alt="t('industry.hero.title')"
          class="w-full h-full object-cover"
          loading="eager"
        />
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      <div class="relative z-10 text-center text-white px-4">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ t('industry.hero.title') }}</h1>
        <p class="text-xl mb-6">{{ t('industry.hero.subtitle') }}</p>
      </div>
    </section>

    <!-- History Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">{{ t('industry.sections.history.title') }}</h2>
        <div class="flex flex-col md:flex-row items-center gap-8">
          <div class="md:w-1/2">
            <div class="video-container relative w-full rounded-lg shadow-lg overflow-hidden bg-gray-900" style="height: 400px; position: relative;">
              <video 
                controls
                class="w-full h-full object-cover"
                preload="metadata"
              >
                <source :src="huapaoqingVideo" type="video/mp4">
                {{ t('common.videoNotSupported') }}
              </video>
            </div>
            <p class="text-sm text-gray-600 mt-3">{{ t('common.videoHint') }}</p>
          </div>
          <div class="md:w-1/2">
            <p class="text-gray-600 mb-4">
              {{ t('industry.sections.history.desc1') }}
            </p>
            <p class="text-gray-600 mb-4">
              {{ t('industry.sections.history.desc2') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Current Status Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">{{ t('industry.sections.currentStatus.title') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <!-- Industry Scale -->
          <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <h3 class="text-xl font-bold mb-4 text-red-600">{{ t('industry.sections.currentStatus.scale') }}</h3>
            <div class="mb-6">
              <canvas ref="industryChart" width="400" height="300"></canvas>
            </div>
            <p class="text-gray-600 mb-4">
              {{ t('industry.sections.currentStatus.scaleDesc1') }}
            </p>
            <p class="text-gray-600">
              {{ t('industry.sections.currentStatus.scaleDesc2') }}
            </p>
          </div>

          <!-- Market Distribution -->
          <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <h3 class="text-xl font-bold mb-4 text-red-600">{{ t('industry.sections.currentStatus.market') }}</h3>
            <div class="mb-6">
              <canvas ref="marketChart" width="400" height="300"></canvas>
            </div>
            <p class="text-gray-600 mb-4">
              {{ t('industry.sections.currentStatus.marketDesc1') }}
            </p>
            <p class="text-gray-600">
              {{ t('industry.sections.currentStatus.marketDesc2') }}
            </p>
          </div>
        </div>

        <!-- Technology Upgrade -->
        <div class="bg-white rounded-lg p-8 shadow-md">
          <h3 class="text-xl font-bold mb-4 text-red-600">{{ t('industry.sections.techUpgrade.title') }}</h3>
          <p class="text-gray-600 mb-4">
            {{ t('industry.sections.techUpgrade.desc1') }}
          </p>
          <p class="text-gray-600 mb-4">
            {{ t('industry.sections.techUpgrade.desc2') }}
          </p>
          <p class="text-gray-600">
            {{ t('industry.sections.techUpgrade.desc3') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Cultural Integration Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">{{ t('industry.sections.cultureTourism.title') }}</h2>
        <div class="flex flex-col md:flex-row items-center gap-8">
          <div class="md:w-1/2">
            <img
              src="../assets/images/guchen_yanhua.jpeg"
              :alt="t('industry.sections.cultureTourism.title')"
              class="w-full h-auto rounded-lg shadow-lg"
              loading="lazy"
            />
          </div>
          <div class="md:w-1/2">
            <p class="text-gray-600 mb-4">
              {{ t('industry.sections.cultureTourism.desc1') }}
            </p>
            <p class="text-gray-600 mb-4">
              {{ t('industry.sections.cultureTourism.desc2') }}
            </p>
            <p class="text-gray-600">
              {{ t('industry.sections.cultureTourism.desc3') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Future Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">{{ t('industry.sections.future.title') }}</h2>
        <div class="bg-white rounded-lg p-8 shadow-md">
          <!-- 图片插入区域 -->
          <div class="mb-6">
            <img 
              src="../assets/images/huapao_future.jpeg" 
              :alt="t('industry.sections.future.title')" 
              class="w-full h-auto rounded-lg shadow-lg"
              loading="lazy"
              :title="t('industry.sections.future.title')"
            />
          </div>
          <p class="text-gray-600 mb-4">
            {{ t('industry.sections.future.desc1') }}
          </p>
          <p class="text-gray-600">
            {{ t('industry.sections.future.desc2') }}
          </p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-red-600 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-4">{{ t('industry.cta.title') }}</h2>
        <p class="text-xl mb-8 max-w-3xl mx-auto">
          {{ t('industry.cta.desc') }}
        </p>
        <router-link
          :to="getLocalizedPath('/viewing-spots')"
          class="inline-block bg-white hover:bg-gray-100 text-red-600 font-bold py-3 px-8 rounded-full transition-colors"
        >
          {{ t('industry.cta.cta') }}
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLocalizedPath } from '../composables/useLocalizedPath';
import Chart from 'chart.js/auto';

const { t, locale } = useI18n();
const { getLocalizedPath } = useLocalizedPath();

import huapaoqingVideo from '../assets/videos/huapaoqing.mp4';

const industryChart = ref<HTMLCanvasElement | null>(null);
const marketChart = ref<HTMLCanvasElement | null>(null);
let industryChartInstance: Chart | null = null;
let marketChartInstance: Chart | null = null;

onMounted(() => {
  
  // 初始化图表
  nextTick(() => {
    initIndustryChart();
    initMarketChart();
  });
});

// 监听语言变化，重新渲染图表
watch(locale, () => {
  nextTick(() => {
    initIndustryChart();
    initMarketChart();
  });
});

// 初始化产业规模图表
const initIndustryChart = () => {
  if (industryChart.value) {
    const ctx = industryChart.value.getContext('2d');
    if (ctx) {
      // 销毁现有图表实例
      if (industryChartInstance) {
        industryChartInstance.destroy();
      }
      
      // 创建新图表
      industryChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: [
            t('industry.sections.currentStatus.chartProduction'),
            t('industry.sections.currentStatus.chartTrade'),
            t('industry.sections.currentStatus.chartSupply')
          ],
          datasets: [{
            data: [170, 86, 200],
            backgroundColor: [
              '#ef4444',
              '#3b82f6',
              '#10b981'
            ],
            borderColor: '#ffffff',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: t('industry.sections.currentStatus.chartTitle'),
              font: {
                size: 16,
                weight: 'bold'
              }
            },
            legend: {
              position: 'bottom'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.parsed || 0;
                  const total = context.dataset.data.reduce((a, b) => (a as number) + (b as number), 0);
                  const percentage = Math.round(((value as number) / total) * 100);
                  return `${label}: ${value}${t('industry.sections.currentStatus.chartUnit')} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    }
  }
};

// 初始化市场布局图表
const initMarketChart = () => {
  if (marketChart.value) {
    const ctx = marketChart.value.getContext('2d');
    if (ctx) {
      // 销毁现有图表实例
      if (marketChartInstance) {
        marketChartInstance.destroy();
      }
      
      // 创建新图表
      marketChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['2020', '2021', '2022', '2023', '2024'],
          datasets: [{
            label: t('industry.sections.currentStatus.exportLabel') + ' (' + t('industry.sections.currentStatus.exportUnit') + ')',
            data: [0.75, 1.30, 1.10, 2.50, 2.64],
            backgroundColor: '#ef4444',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: t('industry.sections.currentStatus.exportTitle'),
              font: {
                size: 16,
                weight: 'bold'
              }
            },
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.parsed.y || 0;
                  return `${t('industry.sections.currentStatus.exportLabel')}: ${value}${t('industry.sections.currentStatus.exportUnit')}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: t('industry.sections.currentStatus.exportLabel') + ' (' + t('industry.sections.currentStatus.exportUnit') + ')'
              }
            },
            x: {
              title: {
                display: true,
                text: t('industry.sections.currentStatus.yearLabel')
              }
            }
          }
        }
      });
    }
  }
};
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