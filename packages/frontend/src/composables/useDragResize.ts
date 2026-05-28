import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue'

interface DragResizeConfig {
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  initialX?: number
  initialY?: number
  initialWidth?: number
  initialHeight?: number
}

export function useDragResize(isFullscreen: Ref<boolean>, config: DragResizeConfig = {}) {
  const {
    minWidth = 360,
    minHeight = 460,
    maxWidth = 800,
    maxHeight = 800,
    initialX = 24,
    initialY,
    initialWidth = 420,
    initialHeight = 560,
  } = config

  const windowPosition = ref({
    x: initialX,
    y: initialY ?? (typeof window !== 'undefined' ? window.innerHeight - initialHeight - 24 : 100),
  })
  const windowSize = ref({ width: initialWidth, height: initialHeight })

  const isDragging = ref(false)
  const isResizing = ref(false)
  const dragOffset = ref({ x: 0, y: 0 })
  const resizeStart = ref({ x: 0, y: 0, width: 0, height: 0 })

  const windowStyle = computed(() => {
    if (isFullscreen.value) {
      return { left: '0', top: '0', width: '100vw', height: '100vh', borderRadius: '0' }
    }
    return {
      left: `${windowPosition.value.x}px`,
      top: `${windowPosition.value.y}px`,
      width: `${windowSize.value.width}px`,
      height: `${windowSize.value.height}px`,
    }
  })

  function startDrag(event: MouseEvent) {
    if (isFullscreen.value || event.button !== 0) return
    isDragging.value = true
    dragOffset.value = {
      x: event.clientX - windowPosition.value.x,
      y: event.clientY - windowPosition.value.y,
    }
    event.preventDefault()
  }

  function startResize(event: MouseEvent) {
    if (isFullscreen.value || event.button !== 0) return
    isResizing.value = true
    resizeStart.value = {
      x: event.clientX,
      y: event.clientY,
      width: windowSize.value.width,
      height: windowSize.value.height,
    }
    event.preventDefault()
    event.stopPropagation()
  }

  function handleMouseMove(event: MouseEvent) {
    if (isDragging.value) {
      let newX = event.clientX - dragOffset.value.x
      let newY = event.clientY - dragOffset.value.y
      newX = Math.max(0, Math.min(newX, window.innerWidth - windowSize.value.width))
      newY = Math.max(0, Math.min(newY, window.innerHeight - windowSize.value.height))
      windowPosition.value = { x: newX, y: newY }
    }
    if (isResizing.value) {
      const deltaX = event.clientX - resizeStart.value.x
      const deltaY = event.clientY - resizeStart.value.y
      let newWidth = resizeStart.value.width + deltaX
      let newHeight = resizeStart.value.height + deltaY
      newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth))
      newHeight = Math.max(minHeight, Math.min(newHeight, maxHeight))
      windowSize.value = { width: newWidth, height: newHeight }
      let newX = windowPosition.value.x
      let newY = windowPosition.value.y
      newX = Math.max(0, Math.min(newX, window.innerWidth - newWidth))
      newY = Math.max(0, Math.min(newY, window.innerHeight - newHeight))
      windowPosition.value = { x: newX, y: newY }
    }
  }

  function handleMouseUp() {
    isDragging.value = false
    isResizing.value = false
  }

  function handleWindowResize() {
    let newX = windowPosition.value.x
    let newY = windowPosition.value.y
    newX = Math.max(0, Math.min(newX, window.innerWidth - windowSize.value.width))
    newY = Math.max(0, Math.min(newY, window.innerHeight - windowSize.value.height))
    windowPosition.value = { x: newX, y: newY }
  }

  onMounted(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('resize', handleWindowResize)
  })

  onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    window.removeEventListener('resize', handleWindowResize)
  })

  return { windowPosition, windowSize, windowStyle, startDrag, startResize }
}
