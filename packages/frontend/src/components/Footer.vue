<template>
  <footer class="bg-gray-800 text-white py-12" role="contentinfo">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- About Section -->
        <div class="flex flex-col justify-center text-center">
          <h3 class="text-xl font-bold mb-4">{{ t('footer.about') }}</h3>
          <p class="text-gray-400">
            {{ t('footer.aboutDesc') }}
          </p>
        </div>

        <!-- Friendship Links -->
        <div class="flex flex-col justify-center text-center">
          <h3 class="text-xl font-bold mb-4">{{ t('footer.friendLinks') }}</h3>
          <ul class="space-y-2">
            <li>
              <a href="http://www.wanzai.gov.cn/" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white hover:underline transition-colors">
                {{ t('footer.wanzaiGov') }}
              </a>
            </li>
            <li>
              <a href="https://www.douyin.com/user/MS4wLjABAAAAhy0jc-hMIansK5QmD-5fikKmvNrSA2qUn9qmDNFTsqOoVZX0TJa4VoLiNU-bBP_f?from_tab_name=main" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white hover:underline transition-colors">
                {{ t('footer.wanzaiDouyin') }}
              </a>
            </li>
            <li>
              <a href="https://www.chinafireworks.org.cn/" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white hover:underline transition-colors">
                {{ t('footer.chinaFireworks') }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="flex flex-col justify-center text-center">
          <h3 class="text-xl font-bold mb-4">{{ t('footer.contact') }}</h3>
          <ul class="space-y-2">
            <li class="text-gray-400">
              <a href="mailto:whizzzest@outlook.com" class="hover:text-white hover:underline transition-colors">
                whizzzest@outlook.com
              </a>
            </li>
            <li class="text-gray-400">
              <a href="https://github.com/nathanpenny520/WhizzZest.git" class="hover:text-white hover:underline transition-colors">
                {{ t('footer.github') }}
              </a>
            </li>
             <li class="text-gray-400">
              <a href="https://gitee.com/nathanpenny520/WhizzZest.git" class="hover:text-white hover:underline transition-colors">
                {{ t('footer.gitee') }}
              </a>
            </li>
            <li class="text-gray-400">
              <a href="https://www.douyin.com/user/MS4wLjABAAAA0fPcuNv5vy46rDu3W1laQUVvZQiyr9MbDl7E60WUnrOKVkG_JKKy68tZiWA_L3A8?from_tab_name=main" target="_blank" rel="noopener noreferrer" class="hover:text-white hover:underline transition-colors">
                {{ t('footer.officialDouyin') }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- WeChat Public Accounts QR Codes -->
      <div class="mt-8 pt-6 border-t border-gray-700">
        <h3 class="text-xl font-bold mb-6 text-center">{{ t('footer.wechatAccounts') }}</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
          <div class="flex flex-col items-center">
            <img src="@/assets/images/wanzai_gov_QR.jpg" alt="万载人民政府微信公众号" class="w-24 h-24 object-contain" loading="lazy">
            <p class="mt-2 text-sm text-gray-400 text-center">{{ t('footer.wechatGov') }}</p>
          </div>
          <div class="flex flex-col items-center">
            <img src="@/assets/images/wanzai_wenlv_QR.jpeg" alt="万载文旅微信公众号" class="w-24 h-24 object-contain" loading="lazy">
            <p class="mt-2 text-sm text-gray-400 text-center">{{ t('footer.wechatWenlv') }}</p>
          </div>
          <div class="flex flex-col items-center">
            <img src="@/assets/images/wxofficial.jpg" alt="焰境·万载官方微信公众号" class="w-24 h-24 object-contain" loading="lazy">
            <p class="mt-2 text-sm text-gray-400 text-center">{{ t('footer.officialWechat') }}</p>
          </div>
          <div class="flex flex-col items-center">
            <img src="@/assets/images/customer-group-updated-weekly.png" alt="焰境万载客户交流群" class="w-24 h-24 object-contain" loading="lazy">
            <p class="mt-2 text-sm text-gray-400 text-center">{{ t('footer.customerGroup') }}</p>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>{{ t('footer.copyright') }} {{ new Date().getFullYear() }} {{ t('siteName') }} {{ t('footer.allRightsReserved') }}</p>
          <p class="mt-2 flex items-center justify-center gap-2">
            <img src="@/assets/images/police.jpg" alt="公安备案" class="h-4">
            <span>{{ t('footer.police') }}</span>
            <span class="mx-2">|</span>
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" class="hover:text-white hover:underline transition-colors">
              {{ t('footer.icp') }}
            </a>
          </p>
        </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
