import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import './style.css'
import App from './App.vue'
import router from './router'
import i18n from './locales'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()
const head = createHead()

app.use(router)
app.use(i18n)
app.use(pinia)
app.use(head)

// 恢复登录态（在 mount 前执行，让路由守卫能读到用户状态）
const authStore = useAuthStore()
authStore.init().then(() => {
  app.mount('#app')
})
