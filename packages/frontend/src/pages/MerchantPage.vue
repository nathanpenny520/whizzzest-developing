<template>
  <div class="min-h-screen bg-gray-50">
    <section id="hero" class="relative h-screen flex items-center justify-center overflow-hidden -mt-20 -mx-4 w-[calc(100%+2rem)]">
      <div class="absolute inset-0 z-0">
        <img
          src="../assets/images/commerce.jpg"
          :alt="t('merchant.hero.title')"
          class="w-full h-full object-cover"
          loading="eager"
        />
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      <div class="relative z-10 text-center text-white px-4">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ t('merchant.hero.title') }}</h1>
        <p class="text-xl mb-6">{{ t('merchant.hero.subtitle') }}</p>
      </div>
    </section>

    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12 text-red-600">{{ t('merchant.sections.featured.title') }}</h2>
        <div class="space-y-8">
          <div 
            v-for="merchant in merchants" 
            :key="merchant.id"
            class="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div class="relative">
              <div class="grid grid-cols-3 gap-0">
                <template v-if="merchant.images">
                  <img
                    v-for="(img, idx) in merchant.images"
                    :key="idx"
                    :src="img"
                    :alt="merchant.name"
                    class="w-full h-64 object-cover bg-gray-100"
                    loading="lazy"
                  />
                </template>
                <template v-else>
                  <img
                    :src="merchant.logo"
                    :alt="merchant.name"
                    class="w-full h-64 object-cover"
                    loading="lazy"
                  />
                  <img
                    :src="merchant.image"
                    :alt="merchant.name"
                    class="w-full h-64 object-cover"
                    loading="lazy"
                  />
                  <img
                    :src="teamImg"
                    :alt="merchant.name"
                    class="w-full h-64 object-cover"
                    loading="lazy"
                  />
                </template>
              </div>
              <div class="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {{ merchant.category }}
              </div>
            </div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-3">
                <a v-if="merchant.website" :href="merchant.website" target="_blank" rel="noopener noreferrer" class="text-xl font-bold text-gray-800 hover:text-red-600 transition-colors">{{ merchant.name }}</a>
                <h3 v-else class="text-xl font-bold text-gray-800">{{ merchant.name }}</h3>
                <div class="flex items-center text-yellow-500">
                  <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= merchant.rating ? 'text-yellow-500' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span class="ml-1 text-gray-600 text-sm">{{ merchant.rating }}</span>
                </div>
              </div>
              <p class="text-gray-600 mb-4 line-clamp-2">{{ merchant.description }}</p>
              
              <div class="mb-4">
                <h4 class="text-sm font-semibold text-gray-700 mb-2">{{ t('merchant.sections.featured.products') }}</h4>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="(product, index) in merchant.products.slice(0, 3)" 
                    :key="index"
                    class="bg-red-50 text-red-600 px-2 py-1 rounded text-xs"
                  >
                    {{ product }}
                  </span>
                </div>
              </div>

              <div class="mb-4">
                <h4 class="text-sm font-semibold text-gray-700 mb-2">{{ t('merchant.sections.featured.advantages') }}</h4>
                <ul class="text-sm text-gray-600 space-y-1">
                  <li v-for="(advantage, index) in merchant.advantages.slice(0, 2)" :key="index" class="flex items-start">
                    <svg class="w-4 h-4 text-green-500 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    {{ advantage }}
                  </li>
                </ul>
              </div>

              <div class="border-t pt-4">
                <h4 class="text-sm font-semibold text-gray-700 mb-2">{{ t('merchant.sections.featured.contact') }}</h4>
                <div class="space-y-1 text-sm text-gray-600">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    {{ merchant.address }}
                  </div>
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    {{ merchant.phone }}
                  </div>
                  <div v-if="merchant.weixin" class="mt-3">
                    <p class="text-xs text-gray-500 mb-1">微信公众号</p>
                    <img :src="merchant.weixin" alt="微信公众号" class="w-24 h-24 object-contain border rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16" :style="{ backgroundImage: `url(${commentBackgroundImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12 text-red-600">{{ t('merchant.sections.reviews.title') }}</h2>
        
        <div class="relative max-w-4xl mx-auto">
          <div class="overflow-hidden rounded-lg">
            <div 
              class="flex transition-transform duration-500 ease-in-out"
              :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
            >
              <div 
                v-for="review in reviews" 
                :key="review.id"
                class="w-full flex-shrink-0"
              >
                <div class="bg-white/80 backdrop-blur-sm rounded-lg p-8 md:p-10 shadow-md mx-4">
                  <div class="flex items-center mb-6">
                    <div class="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xl">
                      {{ review.authorInitial }}
                    </div>
                    <div class="ml-4">
                      <h4 class="font-semibold text-gray-800 text-lg">{{ review.author }}</h4>
                      <div class="flex items-center text-yellow-500 mt-1">
                        <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= review.rating ? 'text-yellow-500' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p class="text-gray-600 text-lg leading-relaxed mb-4">{{ review.content }}</p>
                  <p class="text-sm text-gray-400">{{ review.date }}</p>
                </div>
              </div>
            </div>
          </div>

          <button 
            @click="prevSlide"
            class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white/30 hover:bg-white/50 backdrop-blur-sm shadow-lg text-red-600 rounded-full p-3 transition-colors z-10"
            aria-label="上一条评价"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button 
            @click="nextSlide"
            class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white/30 hover:bg-white/50 backdrop-blur-sm shadow-lg text-red-600 rounded-full p-3 transition-colors z-10"
            aria-label="下一条评价"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div class="flex justify-center mt-8 space-x-2">
            <button 
              v-for="(review, index) in reviews" 
              :key="review.id"
              @click="goToSlide(index)"
              class="w-3 h-3 rounded-full transition-all duration-300"
              :class="currentSlide === index ? 'bg-red-600/70 w-8' : 'bg-gray-300/50 hover:bg-gray-400/70'"
              :aria-label="`跳转到第${index + 1}条评价`"
            ></button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import wanzaihuapaoImg from '../assets/images/changfang.png';
import huapaoqingImg from '../assets/images/hezuoqiye.png';
import teamImg from '../assets/images/team.png';
import qnspImg1 from '../assets/images/qnsp (1).png';
import qnspImg2 from '../assets/images/qnsp (2).png';
import qnspImg3 from '../assets/images/qnsp (3).png';
import yzxfBswzImg from '../assets/images/yzxf_bswz.jpeg';
import commentBackgroundImg from '../assets/images/comment-backgroud.jpeg';
import tailinLogoImg from '../assets/images/tailin-logo.jpg';
import tailinWenziImg from '../assets/images/tailin-wenzi.jpeg';
import tailinGongchangImg from '../assets/images/tailin-gongchang.jpg';
import tailinWeixinImg from '../assets/images/tailin-accountweixin.jpeg';

const { t } = useI18n();

const currentSlide = ref(0);
let autoPlayInterval: ReturnType<typeof setInterval> | null = null;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % reviews.value.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + reviews.value.length) % reviews.value.length;
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
};

const startAutoPlay = () => {
  stopAutoPlay();
  autoPlayInterval = setInterval(nextSlide, 5000);
};

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
  }
};

const getMerchantData = (key: string, field: string): string => {
  try {
    const value = t(`merchant.merchants.${key}.${field}`);
    if (value && !value.includes('merchant.merchants')) {
      return value;
    }
    if (field.startsWith('products.') || field.startsWith('advantages.')) {
      const arrayKey = field.split('.')[0];
      const index = parseInt(field.split('.')[1]);
      const arrayValue = t(`merchant.merchants.${key}.${arrayKey}`);
      if (Array.isArray(arrayValue) && arrayValue[index]) {
        return arrayValue[index];
      }
    }
    return '';
  } catch (e) {
    console.warn('Error getting merchant data:', e);
    return '';
  }
};

const getReviewData = (key: string, field: string): string => {
  try {
    const value = t(`merchant.reviews.${key}.${field}`);
    return value && !value.includes('merchant.reviews') ? value : '';
  } catch (e) {
    console.warn('Error getting review data:', e);
    return '';
  }
};

interface MerchantImage {
  id: number;
  logo: string;
  image: string;
  images?: string[];
  weixin?: string;
}

const merchantImages: MerchantImage[] = [
  { id: 1, logo: wanzaihuapaoImg, image: huapaoqingImg },
  { id: 2, logo: huapaoqingImg, image: yzxfBswzImg, images: [qnspImg1, qnspImg2, qnspImg3] },
  { id: 3, logo: tailinLogoImg, image: tailinWenziImg, images: [tailinLogoImg, tailinWenziImg, tailinGongchangImg], weixin: tailinWeixinImg }
];

const merchants = computed(() => {
  return merchantImages.map((img, index) => {
    const merchantKey = index === 0 ? 'caiTian' : index === 1 ? 'qianNian' : 'tailin';
    return {
      id: img.id,
      name: getMerchantData(merchantKey, 'name'),
      logo: img.logo,
      image: img.image,
      images: img.images,
      category: getMerchantData(merchantKey, 'category'),
      description: getMerchantData(merchantKey, 'description'),
      products: [
        getMerchantData(merchantKey, 'products[0]'),
        getMerchantData(merchantKey, 'products[1]'),
        getMerchantData(merchantKey, 'products[2]')
      ].filter(Boolean),
      advantages: [
        getMerchantData(merchantKey, 'advantages[0]'),
        getMerchantData(merchantKey, 'advantages[1]'),
        getMerchantData(merchantKey, 'advantages[2]')
      ].filter(Boolean),
      address: getMerchantData(merchantKey, 'address'),
      phone: getMerchantData(merchantKey, 'phone'),
      website: index === 0 ? 'https://wwbnn.lanzouu.com/i5Esy3j90hcb' : index === 1 ? 'http://www.qnsp.cn/' : 'http://www.wztlhp.com/',
      weixin: img.weixin,
      rating: 5
    };
  });
});

const getAuthorInitial = (author: string): string => {
  return author && author.length > 0 ? author.charAt(0) : '?';
};

const reviews = computed(() => {
  return [
    {
      id: 1,
      author: getReviewData('zhang', 'author'),
      authorInitial: getAuthorInitial(getReviewData('zhang', 'author')),
      content: getReviewData('zhang', 'content'),
      rating: 5,
      date: getReviewData('zhang', 'date')
    },
    {
      id: 2,
      author: getReviewData('wang', 'author'),
      authorInitial: getAuthorInitial(getReviewData('wang', 'author')),
      content: getReviewData('wang', 'content'),
      rating: 5,
      date: getReviewData('wang', 'date')
    },
    {
      id: 3,
      author: getReviewData('li', 'author'),
      authorInitial: getAuthorInitial(getReviewData('li', 'author')),
      content: getReviewData('li', 'content'),
      rating: 5,
      date: getReviewData('li', 'date')
    }
  ];
});

onMounted(() => {
  startAutoPlay();
});

onUnmounted(() => {
  stopAutoPlay();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
