import mitt from 'mitt'

type Events = {
  'map:navigate': { lng: number; lat: number; label?: string }
  'map:highlight': { merchantId: string }
  'firework:trigger': { type?: string }
  'huanuo:state': { state: string }
  'huanuo:action': { type: string; payload: Record<string, unknown> }
  'show-login-modal': { reason: string }
  'login-cancelled': void
}

export const emitter = mitt<Events>()
