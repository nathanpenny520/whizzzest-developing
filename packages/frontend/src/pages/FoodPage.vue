<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section id="hero" class="relative h-screen flex items-center justify-center overflow-hidden -mt-20 -mx-4 w-[calc(100%+2rem)]">
      <div class="absolute inset-0 z-0">
        <img
          src="../assets/images/liudawan.jpeg"
          :alt="t('food.hero.title')"
          class="w-full h-full object-cover"
          loading="eager"
        />
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      <div class="relative z-10 text-center text-white px-4">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ t('food.hero.title') }}</h1>
        <p class="text-xl mb-6">{{ t('food.hero.subtitle') }}</p>
      </div>
    </section>

    <!-- 六大碗 Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">{{ t('food.sections.liuDaWan.title') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          <!-- 万载六大碗-富贵油卷 -->
          <div class="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img
              src="../assets/images/fuguiyoujuan.jpeg"
              :alt="t('food.sections.fuGuiYouJuan.title')"
              class="w-full h-auto object-contain"
              loading="lazy"
            />
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2 text-red-600">{{ t('food.sections.fuGuiYouJuan.title') }}</h3>
              <p class="text-gray-600 mb-4">
                {{ t('food.sections.fuGuiYouJuan.desc1') }}
              </p>
            </div>
          </div>

          <!-- 万载六大碗-万载扎肉 -->
          <div class="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img
              src="../assets/images/wanzaizha1rou.jpeg"
              :alt="t('food.sections.wanzaiZhaRou.title')"
              class="w-full h-auto object-contain"
              loading="lazy"
            />
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2 text-red-600">{{ t('food.sections.wanzaiZhaRou.title') }}</h3>   
              <p class="text-gray-600 mb-4">
                {{ t('food.sections.wanzaiZhaRou.desc1') }}
              </p>
            </div>
          </div>

          <!-- 万载六大碗-万载诈肉 -->
          <div class="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img
              src="../assets/images/wanzaizha4rou.jpeg"
              :alt="t('food.sections.wanzaiZhaRou2.title')"
              class="w-full h-auto object-contain"
              loading="lazy"
            />
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2 text-red-600">{{ t('food.sections.wanzaiZhaRou2.title') }}</h3> 
              <p class="text-gray-600 mb-4">
                {{ t('food.sections.wanzaiZhaRou2.desc1') }}
              </p>
            </div>
          </div>

          <!-- 万载六大碗-万载块鱼 -->
          <div class="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img
              src="../assets/images/wanzaikuaiyu.jpeg"
              :alt="t('food.sections.wanzaiKuaiYu.title')"
              class="w-full h-auto object-contain"
              loading="lazy"
            />
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2 text-red-600">{{ t('food.sections.wanzaiKuaiYu.title') }}</h3>
              <p class="text-gray-600 mb-4">
                {{ t('food.sections.wanzaiKuaiYu.desc1') }}
              </p>
            </div>
          </div>

           <!-- 万载六大碗-康乐三黄鸡 -->
          <div class="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img
              src="../assets/images/kanglesanhuangji.jpeg"
              :alt="t('food.sections.kangLeSanHuangJi.title')"
             class="w-full h-auto object-contain"
             loading="lazy"
            />
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2 text-red-600">{{ t('food.sections.kangLeSanHuangJi.title') }}</h3> 
              <p class="text-gray-600 mb-4">
                {{ t('food.sections.kangLeSanHuangJi.desc1') }}
              </p>
            </div>
          </div>

           <!-- 万载六大碗-清炖黑山羊 -->
          <div class="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img
              src="../assets/images/qingdunheishanyang.jpeg"
              :alt="t('food.sections.qingDunHeiShanYang.title')"
             class="w-full h-auto object-contain"
             loading="lazy"
            />
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2 text-red-600">{{ t('food.sections.qingDunHeiShanYang.title') }}</h3>
              <p class="text-gray-600 mb-4">
                {{ t('food.sections.qingDunHeiShanYang.desc1') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 其他美食 Section -->
     <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">{{ t('food.sections.otherFood.title') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <!-- 罗城扎粉 -->
          <div class="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img
              src="../assets/images/luochenzhafen.jpeg"
              :alt="t('food.sections.luoChenZhaFen.title')"
              class="w-full h-80 object-cover"
              loading="lazy"
            />
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2 text-red-600">{{ t('food.sections.luoChenZhaFen.title') }}</h3>
              <p class="text-gray-600 mb-4">
               {{ t('food.sections.luoChenZhaFen.desc1') }}
              </p>
            </div>
          </div>

          <!-- 万载剁肉 -->
          <div class="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img
              src="../assets/images/wanzaiduorou.jpeg"
              :alt="t('food.sections.wanzaiDuoRou.title')"
              class="w-full h-80 object-cover"
              loading="lazy"
            />
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2 text-red-600">{{ t('food.sections.wanzaiDuoRou.title') }}</h3>
              <p class="text-gray-600 mb-4">
                {{ t('food.sections.wanzaiDuoRou.desc1') }}
              </p>
            </div>
          </div>

          <!-- 万载番鸭 -->
          <div class="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img
              src="../assets/images/wanzaifanya.jpeg"
              :alt="t('food.sections.wanzaiFanYa.title')"
              class="w-full h-80 object-cover"
              loading="lazy"
            />
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2 text-red-600">{{ t('food.sections.wanzaiFanYa.title') }}</h3>
              <p class="text-gray-600 mb-4">
                {{ t('food.sections.wanzaiFanYa.desc1') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Specialty Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">{{ t('food.sections.traditionalSpecialties.title') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- 万载百合 -->
          <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img
              src="../assets/images/baiheshenkai.jpeg"
              :alt="t('food.sections.wanzaiBaiHe.title')"
              class="w-full h-64 object-cover"
              loading="lazy"
            />
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2 text-red-600">{{ t('food.sections.wanzaiBaiHe.title') }}</h3>
              <p class="text-gray-600 mb-4">
                {{ t('food.sections.wanzaiBaiHe.desc1') }}
              </p>
            </div>
          </div>

          <!-- 表芯纸 -->
          <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img
              src="../assets/images/biaoxingzhi.jpeg"
              :alt="t('food.sections.biaoXinZhi.title')"
              class="w-full h-64 object-cover"
              loading="lazy"
            />
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2 text-red-600">{{ t('food.sections.biaoXinZhi.title') }}</h3>
              <p class="text-gray-600 mb-4">
                {{ t('food.sections.biaoXinZhi.desc1') }}
              </p>
            </div>
          </div>

          <!-- 南酸枣糕 -->
          <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img
              src="../assets/images/nansuanzaogao.jpeg"
              :alt="t('food.sections.nanSuanZaoGao.title')"
              class="w-full h-64 object-cover"
              loading="lazy"
            />
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2 text-red-600">{{ t('food.sections.nanSuanZaoGao.title') }}</h3>
              <p class="text-gray-600 mb-4">
               {{ t('food.sections.nanSuanZaoGao.desc1') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-red-600 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-4">{{ t('food.cta.title') }}</h2>
        <p class="text-xl mb-8 max-w-3xl mx-auto">
          {{ t('food.cta.desc') }}
        </p>
        <router-link
          :to="getLocalizedPath('/routes')"
          class="inline-block bg-white hover:bg-gray-100 text-red-600 font-bold py-3 px-8 rounded-full transition-colors"
        >
          {{ t('food.cta.cta') }}
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