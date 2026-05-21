<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section id="hero" class="relative h-screen flex items-center justify-center overflow-hidden -mt-20 -mx-4 w-[calc(100%+2rem)]">
      <div class="absolute inset-0 z-0">
        <img
          src="../assets/images/student-team.jpg"
          :alt="t('about.hero.title')"
          class="w-full h-full object-cover"
          loading="eager"
        />
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      <div class="relative z-10 text-center text-white px-4">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ t('about.hero.title') }}</h1>
        <p class="text-xl mb-6">{{ t('about.hero.subtitle') }}</p>
      </div>
    </section>

    <!-- Team Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12 text-red-600">{{ t('about.sections.team.title') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(member, index) in teamMembers"
            :key="member.id"
            :ref="el => setTeamRef(el, index)"
            class="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-item"
          >
            <div class="flex flex-col items-center">
              <div class="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-4 overflow-hidden">
                <img
                  v-if="member.avatar"
                  :src="member.avatar"
                  :alt="member.name"
                  class="w-16 h-16 object-contain"
                />
                <span v-else class="text-3xl font-bold text-red-600">{{ member.nameInitial }}</span>
              </div>
              <h3 class="text-xl font-bold text-gray-800 mb-1">{{ member.name }}</h3>
              <p class="text-red-600 font-medium mb-3">{{ member.role }}</p>
              <p class="text-gray-600 text-center text-sm">{{ member.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Project Background Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12 text-red-600">{{ t('about.sections.background.title') }}</h2>
        <div ref="backgroundRef" class="flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto animate-item">
          <div class="md:w-1/2">
            <div class="bg-white rounded-lg p-6 shadow-md">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-800">{{ t('about.sections.background.originTitle') }}</h3>
              </div>
              <p class="text-gray-600 leading-relaxed">{{ t('about.sections.background.originDesc') }}</p>
            </div>
          </div>
          <div class="md:w-1/2">
            <div class="bg-white rounded-lg p-6 shadow-md">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-800">{{ t('about.sections.background.goalTitle') }}</h3>
              </div>
              <p class="text-gray-600 leading-relaxed">{{ t('about.sections.background.goalDesc') }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission & Vision Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12 text-red-600">{{ t('about.sections.mission.title') }}</h2>
        <div ref="missionRef" class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto animate-item">
          <!-- Mission Card -->
          <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-8 shadow-md">
            <div class="flex flex-col items-center text-center">
              <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-red-600 mb-4">{{ t('about.sections.mission.missionTitle') }}</h3>
              <p class="text-gray-700 leading-relaxed">{{ t('about.sections.mission.missionDesc') }}</p>
            </div>
          </div>
          <!-- Vision Card -->
          <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-8 shadow-md">
            <div class="flex flex-col items-center text-center">
              <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-red-600 mb-4">{{ t('about.sections.mission.visionTitle') }}</h3>
              <p class="text-gray-700 leading-relaxed">{{ t('about.sections.mission.visionDesc') }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12 text-red-600">{{ t('about.sections.timeline.title') }}</h2>
        <div class="max-w-3xl mx-auto">
          <div class="relative">
            <!-- Timeline Line -->
            <div class="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-red-200"></div>

            <!-- Timeline Items -->
            <div
              v-for="(event, index) in timelineEvents"
              :key="event.id"
              :ref="el => setTimelineRef(el, index)"
              class="relative mb-8 last:mb-0 animate-item"
            >
              <div class="flex flex-col md:flex-row items-start gap-4">
                <!-- Time Marker -->
                <div class="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-red-600 rounded-full border-4 border-white shadow-md z-10"></div>

                <!-- Content -->
                <div
                  class="ml-12 md:ml-0 md:w-1/2"
                  :class="{ 'md:pr-8 md:text-right': index % 2 === 0, 'md:pl-8 md:ml-auto': index % 2 === 1 }"
                >
                  <div class="bg-white rounded-lg p-4 shadow-md">
                    <span class="text-red-600 font-bold text-sm">{{ event.date }}</span>
                    <h4 class="text-lg font-bold text-gray-800 mt-1">{{ event.title }}</h4>
                    <p class="text-gray-600 text-sm mt-2">{{ event.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Partners Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12 text-red-600">{{ t('about.sections.partners.title') }}</h2>
        <div ref="partnersRef" class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-item">
          <!-- Partner 1: Wanzai Wenlv -->
          <div class="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <span class="text-2xl font-bold text-red-600">万</span>
            </div>
            <button @click="showWenlvModal = true" class="text-gray-800 font-medium text-sm text-center hover:text-red-600 transition-colors cursor-pointer">
              {{ t('about.sections.partners.list.partner1.name') }}
            </button>
          </div>
          <!-- Partner 2: Ancient City -->
          <div class="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <span class="text-2xl font-bold text-red-600">古</span>
            </div>
            <a href="http://zgwzgc.com/" target="_blank" rel="noopener noreferrer" class="text-gray-800 font-medium text-sm text-center hover:text-red-600 transition-colors">
              {{ t('about.sections.partners.list.partner2.name') }}
            </a>
          </div>
          <!-- Partner 3: Caitian -->
          <div class="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <span class="text-2xl font-bold text-red-600">彩</span>
            </div>
            <a href="https://wwbnn.lanzouu.com/i5Esy3j90hcb" target="_blank" rel="noopener noreferrer" class="text-gray-800 font-medium text-sm text-center hover:text-red-600 transition-colors">
              {{ t('about.sections.partners.list.partner3.name') }}
            </a>
          </div>
          <!-- Partner 4: Tailin -->
          <div class="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <span class="text-2xl font-bold text-red-600">泰</span>
            </div>
            <a href="http://www.wztlhp.com/" target="_blank" rel="noopener noreferrer" class="text-gray-800 font-medium text-sm text-center hover:text-red-600 transition-colors">
              {{ t('about.sections.partners.list.partner4.name') }}
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12 text-red-600">{{ t('about.sections.contact.title') }}</h2>
        <div ref="contactRef" class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 animate-item">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Email -->
            <div class="flex items-center">
              <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">{{ t('about.sections.contact.emailLabel') }}</p>
                <a href="mailto:whizzzest@outlook.com" class="text-red-600 font-medium hover:underline transition-colors">
                  {{ t('about.sections.contact.email') }}
                </a>
              </div>
            </div>
            <!-- Douyin -->
            <div class="flex items-center">
              <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13a2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1 2.5-2.5V9.1a5.5 5.5 0 0 0-1.1 10.9 5.5 5.5 0 0 0 5.5-5.5V7.27a6.25 6.25 0 0 0 3.32 1.02z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">{{ t('about.sections.contact.douyinLabel') }}</p>
                <a href="https://www.douyin.com/user/MS4wLjABAAAA0fPcuNv5vy46rDu3W1laQUVvZQiyr9MbDl7E60WUnrOKVkG_JKKy68tZiWA_L3A8?from_tab_name=main" target="_blank" rel="noopener noreferrer" class="text-red-600 font-medium hover:underline transition-colors">
                  {{ t('about.sections.contact.douyin') }}
                </a>
              </div>
            </div>
            <!-- WeChat -->
            <div class="flex items-center">
              <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.3c0 2.367 1.557 4.422 3.867 5.711-.125.461-.793 2.746-.816 2.902-.031.211.078.414.266.461.094.023.188.016.273-.023l3.602-1.68c.609.086 1.234.129 1.875.129 4.801 0 8.691-3.289 8.691-7.109s-3.891-7.109-8.691-7.109zm-2.18 8.312c-.609 0-1.109-.5-1.109-1.109s.5-1.109 1.109-1.109 1.109.5 1.109 1.109-.5 1.109-1.109 1.109zm4.359 0c-.609 0-1.109-.5-1.109-1.109s.5-1.109 1.109-1.109 1.109.5 1.109 1.109-.5 1.109-1.109 1.109z"/>
                  <path d="M23.988 14.5c0-3.25-3.289-5.898-7.289-5.898-.902 0-1.773.129-2.59.367-.023.008-.047.016-.07.023-.211.063-.352.273-.313.492.047.25.273.398.523.352.016-.008.031-.008.047-.016.711-.203 1.453-.305 2.227-.305 3.313 0 6.039 2.109 6.039 4.687 0 1.57-1.047 3.023-2.641 3.883-.078.039-.125.117-.125.195 0 .094.047.172.125.211l2.906 1.359c.094.047.188.055.273.023.188-.055.297-.258.266-.461-.023-.148-.609-2.305-.703-2.727 1.961-1.102 3.266-2.906 3.266-4.891zm-5.555 1.5c-.453 0-.828-.375-.828-.828s.375-.828.828-.828.828.375.828.828-.375.828-.828.828zm-3.773 0c-.453 0-.828-.375-.828-.828s.375-.828.828-.828.828.375.828.828-.375.828-.828.828z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">{{ t('about.sections.contact.wechatLabel') }}</p>
                <button @click="showWechatModal = true" class="text-red-600 font-medium hover:underline transition-colors cursor-pointer">
                  {{ t('about.sections.contact.wechat') }}
                </button>
              </div>
            </div>
            <!-- Customer Service -->
            <div class="flex items-center">
              <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">{{ t('about.sections.contact.serviceLabel') }}</p>
                <a href="https://work.weixin.qq.com/kfid/kfc339afcb020ce4dd8" target="_blank" rel="noopener noreferrer" class="text-red-600 font-medium hover:underline transition-colors">
                  {{ t('about.sections.contact.service') }}
                </a>
              </div>
            </div>
            <!-- Video Account -->
            <div class="flex items-center">
              <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">{{ t('about.sections.contact.videoLabel') }}</p>
                <button @click="showVideoModal = true" class="text-red-600 font-medium hover:underline transition-colors cursor-pointer">
                  {{ t('about.sections.contact.video') }}
                </button>
              </div>
            </div>
            <!-- Xiaohongshu -->
            <div class="flex items-center">
              <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.6.05-1.05-.39-1.64-.77-.9-.59-1.43-.96-2.3-1.53-1-.67-.4-1.04.25-1.63.17-.17 3.06-2.84 3.14-3.05.02-.04.04-.16-.06-.23-.1-.07-.23-.04-.33-.02-.14.02-2.37 1.51-3.38 2.13-.2.13-.39.2-.56.2-.33 0-.64-.18-.96-.36-.46-.25-.83-.42-.83-.83 0-.3.33-.6.9-.9 2.22-1.12 5.22-2.13 5.72-2.24.88-.19 1.55.04 1.55.98zm2.86-3.8c-.7 1.1-2.4 5.1-3.2 6.8-.2.4-.4.8-.7 1.1-.3.3-.7.5-1.1.5h-1.1c-.4 0-.8-.2-1.1-.5-.3-.3-.5-.7-.7-1.1-.8-1.7-2.5-5.7-3.2-6.8-.3-.5-.5-1-.5-1.5 0-.6.3-1.1.7-1.5.4-.4.9-.6 1.5-.6h6c.6 0 1.1.2 1.5.6.4.4.7.9.7 1.5 0 .5-.2 1-.5 1.5z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">{{ t('about.sections.contact.xiaohongshuLabel') }}</p>
                <a href="https://www.xiaohongshu.com/user/profile/69a2d84a0000000021023fd4" target="_blank" rel="noopener noreferrer" class="text-red-600 font-medium hover:underline transition-colors">
                  {{ t('about.sections.contact.xiaohongshu') }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- WeChat QR Code Modal -->
    <div v-if="showWechatModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click="showWechatModal = false">
      <div class="bg-white rounded-lg p-6 max-w-sm mx-4" @click.stop>
        <h3 class="text-xl font-bold text-center mb-4 text-red-600">{{ t('about.sections.contact.wechatLabel') }}</h3>
        <img src="../assets/images/wxofficial.jpg" alt="WeChat QR Code" class="w-64 h-64 object-contain mx-auto" />
        <p class="text-center text-gray-600 mt-4 text-sm">{{ t('about.sections.contact.wechat') }}</p>
        <button @click="showWechatModal = false" class="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors">
          关闭
        </button>
      </div>
    </div>

    <!-- Video Account Modal -->
    <div v-if="showVideoModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click="showVideoModal = false">
      <div class="bg-white rounded-lg p-6 max-w-sm mx-4" @click.stop>
        <h3 class="text-xl font-bold text-center mb-4 text-red-600">{{ t('about.sections.contact.videoLabel') }}</h3>
        <img src="../assets/images/videoaccount.jpeg" alt="Video Account QR Code" class="w-64 h-64 object-contain mx-auto" />
        <p class="text-center text-gray-600 mt-4 text-sm">{{ t('about.sections.contact.video') }}</p>
        <button @click="showVideoModal = false" class="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors">
          关闭
        </button>
      </div>
    </div>

    <!-- Wanzai Wenlv Modal -->
    <div v-if="showWenlvModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click="showWenlvModal = false">
      <div class="bg-white rounded-lg p-6 max-w-sm mx-4" @click.stop>
        <h3 class="text-xl font-bold text-center mb-4 text-red-600">{{ t('about.sections.partners.list.partner1.name') }}</h3>
        <img src="../assets/images/wanzai_wenlv_QR.jpeg" alt="Wanzai Wenlv QR Code" class="w-64 h-64 object-contain mx-auto" />
        <button @click="showWenlvModal = false" class="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors">
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

// WeChat modal state
const showWechatModal = ref(false);

// Video Account modal state
const showVideoModal = ref(false);

// Wanzai Wenlv modal state
const showWenlvModal = ref(false);

// Refs for sections
const backgroundRef = ref<HTMLElement | null>(null);
const missionRef = ref<HTMLElement | null>(null);
const partnersRef = ref<HTMLElement | null>(null);
const contactRef = ref<HTMLElement | null>(null);

// Team refs array
const teamRefs = ref<(HTMLElement | null)[]>([]);
const setTeamRef = (el: unknown, index: number) => {
  if (el) teamRefs.value[index] = el as HTMLElement;
};

// Timeline refs array
const timelineRefs = ref<(HTMLElement | null)[]>([]);
const setTimelineRef = (el: unknown, index: number) => {
  if (el) timelineRefs.value[index] = el as HTMLElement;
};

// Team members data
const teamMembers = ref([
  { id: 1, name: '', nameInitial: '', role: '', description: '', avatar: null as string | null },
  { id: 2, name: '', nameInitial: '', role: '', description: '', avatar: null as string | null },
  { id: 3, name: '', nameInitial: '', role: '', description: '', avatar: null as string | null },
  { id: 4, name: '', nameInitial: '', role: '', description: '', avatar: null as string | null },
  { id: 5, name: '', nameInitial: '', role: '', description: '', avatar: null as string | null },
  { id: 6, name: '', nameInitial: '', role: '', description: '', avatar: null as string | null }
]);

// Timeline events data
const timelineEvents = ref([
  { id: 1, date: '', title: '', description: '' },
  { id: 2, date: '', title: '', description: '' },
  { id: 3, date: '', title: '', description: '' },
  { id: 4, date: '', title: '', description: '' }
]);

// Load data from i18n
const loadData = () => {
  // Team members
  const teamKeys = ['member1', 'member2', 'member3', 'member4', 'member5', 'member6'];
  teamMembers.value = teamKeys.map((key, index) => {
    const name = t(`about.sections.team.members.${key}.name`);
    return {
      id: index + 1,
      name,
      nameInitial: name ? name.charAt(0) : '?',
      role: t(`about.sections.team.members.${key}.role`),
      description: t(`about.sections.team.members.${key}.description`),
      avatar: index === 5 ? '/icons/Claude.svg' : null
    } as { id: number; name: string; nameInitial: string; role: string; description: string; avatar: string | null };
  });

  // Timeline events
  const eventKeys = ['event1', 'event2', 'event3', 'event4'];
  timelineEvents.value = eventKeys.map((key, index) => ({
    id: index + 1,
    date: t(`about.sections.timeline.events.${key}.date`),
    title: t(`about.sections.timeline.events.${key}.title`),
    description: t(`about.sections.timeline.events.${key}.description`)
  }));
};

// Intersection Observer for scroll animations
let observer: IntersectionObserver | null = null;

const setupObserver = () => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  // Observe all refs
  if (backgroundRef.value) observer.observe(backgroundRef.value);
  if (missionRef.value) observer.observe(missionRef.value);
  if (partnersRef.value) observer.observe(partnersRef.value);
  if (contactRef.value) observer.observe(contactRef.value);

  teamRefs.value.forEach((el) => {
    if (el && observer) observer.observe(el);
  });

  timelineRefs.value.forEach((el) => {
    if (el && observer) observer.observe(el);
  });
};

onMounted(() => {
  loadData();

  // Delay to ensure DOM is ready
  setTimeout(() => {
    setupObserver();
  }, 100);
});

// 监听语言切换，重新加载翻译数据
watch(locale, () => {
  loadData();
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
.animate-item {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.animate-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>