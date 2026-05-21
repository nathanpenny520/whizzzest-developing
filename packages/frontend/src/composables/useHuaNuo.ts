import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { emitter } from '@/eventBus'
import type { AIResponse, AIActionType } from '@/types/aiChat'

export type HuaNuoState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'celebrating' | 'night'

// 单例状态
const state = ref<HuaNuoState>('idle')

function getTimeBasedState(): HuaNuoState {
  const hour = new Date().getHours()
  return hour >= 22 || hour < 6 ? 'night' : 'idle'
}

// 初始化时根据时间设置状态
if (state.value === 'idle') {
  state.value = getTimeBasedState()
}

// 每分钟检查一次日夜切换
setInterval(() => {
  const timeState = getTimeBasedState()
  if (timeState === 'night' && state.value !== 'celebrating') {
    state.value = 'night'
  } else if (timeState === 'idle' && state.value === 'night') {
    state.value = 'idle'
  }
}, 60_000)

export function useHuaNuo() {
  const router = useRouter()

  function transition(newState: HuaNuoState) {
    // 夜间状态不能被一般交互覆盖
    if (state.value === 'night' && newState !== 'idle' && newState !== 'celebrating') {
      return
    }
    state.value = newState
    emitter.emit('huanuo:state', { state: newState })
  }

  function handleAIResponse(response: AIResponse) {
    transition('speaking')

    // 3 秒后回到空闲
    setTimeout(() => {
      if (state.value === 'speaking') {
        const hour = new Date().getHours()
        state.value = hour >= 22 || hour < 6 ? 'night' : 'idle'
      }
    }, 3000)

    // 检查是否有 action
    const action = response.action
    if (action) {
      dispatchAction(action.type as AIActionType, action.payload)
    }
  }

  function dispatchAction(type: AIActionType, payload: Record<string, unknown>) {
    emitter.emit('huanuo:action', { type, payload })

    switch (type) {
      case 'map_navigation':
        emitter.emit('map:navigate', {
          lng: payload.lng as number,
          lat: payload.lat as number,
          label: payload.label as string | undefined,
        })
        break
      case 'trigger_firework':
        emitter.emit('firework:trigger', {
          type: payload.type as string | undefined,
        })
        // 如果不在烟花页，跳转过去
        if (!window.location.pathname.includes('/firework')) {
          router.push('/firework')
        }
        transition('celebrating')
        break
      case 'open_page':
        if (payload.route && typeof payload.route === 'string') {
          const path = payload.route as string
          // 白名单校验：只允许跳转到已知页面
          const VALID_ROUTES = ['/', '/culture', '/food', '/industry', '/routes', '/viewing-spots', '/map', '/merchant', '/firework', '/about']
          const match = VALID_ROUTES.find(r => path === r || path === `/en${r}` || path.startsWith(`/en${r}/`) || path.startsWith(`${r}/`))
          if (match) {
            router.push(path)
          }
        }
        break
      case 'show_merchant':
        emitter.emit('map:highlight', {
          merchantId: (payload.name as string) || (payload.id as string) || '',
        })
        break
      case 'show_coupon':
        // Phase 4 实现
        break
    }
  }

  // 监听状态变化向外广播
  watch(state, (s) => {
    emitter.emit('huanuo:state', { state: s })
  })

  return {
    state,
    transition,
    handleAIResponse,
    dispatchAction,
  }
}
