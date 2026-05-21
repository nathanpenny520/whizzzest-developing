import { createRouter, createWebHistory } from 'vue-router';
import i18n from '../locales';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/HomePage.vue'),
    meta: {
      title: '焰境·万载 - 花炮之乡 | 江西万载文旅宣传平台',
      locale: 'zh-CN'
    }
  },
  {
    path: '/en',
    name: 'HomeEn',
    component: () => import('../pages/HomePage.vue'),
    meta: {
      title: 'WhizzZest - Hometown of Fireworks | Wanzai Tourism Platform',
      locale: 'en'
    }
  },
  {
    path: '/culture',
    name: 'Culture',
    component: () => import('../pages/CulturePage.vue'),
    meta: {
      title: '万载非遗文化 - 千年传承 | 焰境·万载',
      locale: 'zh-CN'
    }
  },
  {
    path: '/en/culture',
    name: 'CultureEn',
    component: () => import('../pages/CulturePage.vue'),
    meta: {
      title: 'Wanzai Intangible Heritage - Millennium Traditions | WhizzZest',
      locale: 'en'
    }
  },
  {
    path: '/food',
    name: 'Food',
    component: () => import('../pages/FoodPage.vue'),
    meta: {
      title: '万载美食特产 - 赣西风味 | 焰境·万载',
      locale: 'zh-CN'
    }
  },
  {
    path: '/en/food',
    name: 'FoodEn',
    component: () => import('../pages/FoodPage.vue'),
    meta: {
      title: 'Wanzai Food & Specialties - Western Jiangxi Cuisine | WhizzZest',
      locale: 'en'
    }
  },
  {
    path: '/industry',
    name: 'Industry',
    component: () => import('../pages/IndustryPage.vue'),
    meta: {
      title: '万载烟花产业 - 中国花炮之乡 | 焰境·万载',
      locale: 'zh-CN'
    }
  },
  {
    path: '/en/industry',
    name: 'IndustryEn',
    component: () => import('../pages/IndustryPage.vue'),
    meta: {
      title: 'Wanzai Fireworks Industry - China\'s Fireworks Hometown | WhizzZest',
      locale: 'en'
    }
  },
  {
    path: '/routes',
    name: 'Routes',
    component: () => import('../pages/RoutesPage.vue'),
    meta: {
      title: '万载旅游线路 - 精选路线推荐 | 焰境·万载',
      locale: 'zh-CN'
    }
  },
  {
    path: '/en/routes',
    name: 'RoutesEn',
    component: () => import('../pages/RoutesPage.vue'),
    meta: {
      title: 'Wanzai Travel Routes - Recommended Itineraries | WhizzZest',
      locale: 'en'
    }
  },
  {
    path: '/viewing-spots',
    name: 'ViewingSpots',
    component: () => import('../pages/ViewingSpotsPage.vue'),
    meta: {
      title: '万载赏烟地点 - 最佳观赏位置 | 焰境·万载',
      locale: 'zh-CN'
    }
  },
  {
    path: '/en/viewing-spots',
    name: 'ViewingSpotsEn',
    component: () => import('../pages/ViewingSpotsPage.vue'),
    meta: {
      title: 'Wanzai Fireworks Viewing Spots - Best Locations | WhizzZest',
      locale: 'en'
    }
  },
  {
    path: '/map',
    name: 'Map',
    component: () => import('../pages/MapPage.vue'),
    meta: {
      title: '万载地图导览 - 旅游景点分布 | 焰境·万载',
      locale: 'zh-CN'
    }
  },
  {
    path: '/en/map',
    name: 'MapEn',
    component: () => import('../pages/MapPage.vue'),
    meta: {
      title: 'Wanzai Map Guide - Tourism Attractions Map | WhizzZest',
      locale: 'en'
    }
  },
  {
    path: '/merchant',
    name: 'Merchant',
    component: () => import('../pages/MerchantPage.vue'),
    meta: {
      title: '万载商家展示 - 特色企业一览 | 焰境·万载',
      locale: 'zh-CN'
    }
  },
  {
    path: '/en/merchant',
    name: 'MerchantEn',
    component: () => import('../pages/MerchantPage.vue'),
    meta: {
      title: 'Wanzai Merchants Showcase - Featured Businesses | WhizzZest',
      locale: 'en'
    }
  },
  {
    path: '/firework',
    name: 'Firework',
    component: () => import('../pages/FireworkPage.vue'),
    meta: {
      title: '万载数字烟花体验 | 焰境·万载',
      locale: 'zh-CN'
    }
  },
  {
    path: '/en/firework',
    name: 'FireworkEn',
    component: () => import('../pages/FireworkPage.vue'),
    meta: {
      title: 'Digital Fireworks Experience - Interactive | WhizzZest',
      locale: 'en'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../pages/AboutPage.vue'),
    meta: {
      title: '关于焰境·万载 - 团队介绍 | 焰境·万载',
      locale: 'zh-CN'
    }
  },
  {
    path: '/en/about',
    name: 'AboutEn',
    component: () => import('../pages/AboutPage.vue'),
    meta: {
      title: 'About WhizzZest - Team Introduction & Mission | WhizzZest',
      locale: 'en'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    // 如果有hash，优先滚动到hash位置（比如从数字烟花退出到 #firework-section）
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      };
    }

    // 语言切换时保持滚动位置
    const state = history.state as { preserveScroll?: boolean; scrollY?: number } | null;
    if (state?.preserveScroll && state.scrollY !== undefined) {
      return {
        top: state.scrollY,
        behavior: 'instant'
      };
    }

    if (savedPosition) {
      return savedPosition;
    }

    // 滚动到页面最顶部
    return {
      top: 0,
      behavior: 'smooth'
    };
  }
});

// Set document title and language based on route meta
router.beforeEach((to, _from, next) => {
  document.title = to.meta.title as string || '焰境·万载';

  // 根据路由 meta 设置语言，URL 决定语言
  const routeLocale = to.meta.locale as string;
  if (routeLocale) {
    i18n.global.locale.value = routeLocale as 'zh-CN' | 'en';
    // 同步保存到 localStorage，供下次访问使用
    localStorage.setItem('locale', routeLocale);
  }

  next();
});

export default router;