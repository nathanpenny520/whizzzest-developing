<template>
  <div ref="containerRef" class="three-ai-model" :style="containerStyle">
    <div v-if="loading" class="loading-overlay">
      <div class="spinner" />
      <span v-if="loadingProgress > 0 && loadingProgress < 100" class="progress-text"
        >{{ loadingProgress }}%</span
      >
    </div>
    <div v-else-if="error" class="error-overlay">
      <span class="error-icon">!</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import type { HuaNuoState } from '@/composables/useHuaNuo'

const props = withDefaults(
  defineProps<{
    modelPath: string
    width: number
    height: number
    currentState: HuaNuoState
    scale?: number
    autoRotate?: boolean
  }>(),
  {
    scale: 1,
    autoRotate: false,
  },
)

const emit = defineEmits<{
  'model-click': []
  'load-error': []
  'webgl-error': []
}>()

const containerRef = ref<HTMLDivElement | null>(null)
const loading = ref(true)
const loadingProgress = ref(0)
const error = ref(false)

const containerStyle = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
}))

// Three.js objects
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let mixer: THREE.AnimationMixer | null = null
let timer: THREE.Timer
let animationFrameId = 0
let currentAction: THREE.AnimationAction | null = null
const clipMap = new Map<string, THREE.AnimationClip>()
// Click vs drag detection
let pointerDownPos = { x: 0, y: 0 }
let pointerMoved = false
const DRAG_THRESHOLD = 3

// Raycaster
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

// Hover tracking
let hoveredObject: THREE.Object3D | null = null
const hoveredOriginals = new Map<
  THREE.Object3D,
  { emissive: THREE.Color; emissiveIntensity: number }
>()

const ANIMATION_MAP: Record<HuaNuoState, string> = {
  idle: 'idle',
  listening: 'listening',
  thinking: 'thinking',
  speaking: 'speaking',
  celebrating: 'celebrating',
  night: 'night',
}

function playAnimation(name: string) {
  if (!mixer) return
  const clip = clipMap.get(name)
  if (!clip) return

  const action = mixer.clipAction(clip)
  if (currentAction && currentAction !== action) {
    currentAction.crossFadeTo(action, 0.3, false)
  }
  action.reset().play()
  currentAction = action
}

function playClickFeedback() {
  if (!mixer) return
  // Try talk/nod/greeting, fall back to any available clip
  const feedbackNames = ['talk', 'nod', 'greeting']
  let clip: THREE.AnimationClip | undefined
  for (const name of feedbackNames) {
    clip = clipMap.get(name)
    if (clip) break
  }
  // Last resort: use speaking if available
  if (!clip) clip = clipMap.get('speaking')

  if (clip) {
    // Stop current action
    if (currentAction) currentAction.stop()

    const action = mixer.clipAction(clip)
    action.setLoop(THREE.LoopOnce, 1)
    action.clampWhenFinished = true
    action.reset().play()
    currentAction = action

    // Return to idle after feedback
    const onFinished = () => {
      mixer!.removeEventListener('finished', onFinished)
      const idleClip = clipMap.get('idle')
      if (idleClip) {
        const idleAction = mixer!.clipAction(idleClip)
        idleAction.reset().play()
        currentAction = idleAction
      }
    }
    mixer.addEventListener('finished', onFinished)
  }
}

// ---- Hover helpers ----

function highlightObject(obj: THREE.Object3D) {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh && (child.material as THREE.MeshStandardMaterial).isMaterial) {
      const mat = child.material as THREE.MeshStandardMaterial
      if (!hoveredOriginals.has(child)) {
        hoveredOriginals.set(child, {
          emissive: mat.emissive ? mat.emissive.clone() : new THREE.Color(0),
          emissiveIntensity: mat.emissiveIntensity ?? 0,
        })
      }
      mat.emissive = new THREE.Color(0x442200)
      mat.emissiveIntensity = 0.5
    }
  })
}

function resetHighlight(obj: THREE.Object3D) {
  obj.traverse((child) => {
    const orig = hoveredOriginals.get(child)
    if (orig && child instanceof THREE.Mesh) {
      const mat = child.material as THREE.MeshStandardMaterial
      mat.emissive = orig.emissive
      mat.emissiveIntensity = orig.emissiveIntensity
      hoveredOriginals.delete(child)
    }
  })
}

function checkHover(e: PointerEvent) {
  const rect = renderer.domElement.getBoundingClientRect()
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  raycaster.setFromCamera(mouse, camera)

  const intersects = raycaster.intersectObjects(scene.children, true)
  if (intersects.length > 0) {
    const obj = intersects[0].object
    if (hoveredObject !== obj) {
      if (hoveredObject) resetHighlight(hoveredObject)
      highlightObject(obj)
      hoveredObject = obj
      if (containerRef.value) containerRef.value.style.cursor = 'pointer'
    }
  } else {
    if (hoveredObject) {
      resetHighlight(hoveredObject)
      hoveredObject = null
      if (containerRef.value) containerRef.value.style.cursor = 'grab'
    }
  }
}

function checkModelClick(e: PointerEvent): boolean {
  const rect = renderer.domElement.getBoundingClientRect()
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  raycaster.setFromCamera(mouse, camera)

  const intersects = raycaster.intersectObjects(scene.children, true)
  return intersects.length > 0
}

// ---- Pointer events ----

function onPointerDown(e: PointerEvent) {
  pointerDownPos = { x: e.clientX, y: e.clientY }
  pointerMoved = false
}

function onPointerMove(e: PointerEvent) {
  if (
    Math.abs(e.clientX - pointerDownPos.x) > DRAG_THRESHOLD ||
    Math.abs(e.clientY - pointerDownPos.y) > DRAG_THRESHOLD
  ) {
    pointerMoved = true
  }
  // Hover detection (only when not dragging)
  if (!pointerMoved) {
    checkHover(e)
  }
}

function onPointerUp(e: PointerEvent) {
  if (!pointerMoved) {
    const hitModel = checkModelClick(e)
    if (hitModel) {
      playClickFeedback()
      emit('model-click')
    }
  }
}

function initScene() {
  if (!containerRef.value) return

  const container = containerRef.value
  const w = props.width
  const h = props.height

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100)
  camera.position.set(0, 0.3, 4)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.setClearColor(0x000000, 0)
  container.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.enablePan = false
  controls.minDistance = 1.5
  controls.maxDistance = 8
  controls.target.set(0, 0, 0)
  controls.autoRotate = props.autoRotate
  controls.autoRotateSpeed = 0.6
  controls.update()

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
  dirLight.position.set(2, 4, 3)
  scene.add(dirLight)
  const backLight = new THREE.DirectionalLight(0xffffff, 0.4)
  backLight.position.set(-1, 1, -2)
  scene.add(backLight)

  // Pointer events for click vs drag + hover
  const canvas = renderer.domElement
  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerup', onPointerUp)
}

function loadModel() {
  const loader = new GLTFLoader()

  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')
  loader.setDRACOLoader(dracoLoader)

  loader.load(
    props.modelPath,
    (gltf) => {
      const model = gltf.scene
      model.scale.set(props.scale, props.scale, props.scale)

      const box = new THREE.Box3().setFromObject(model)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      model.position.set(-center.x, -center.y, -center.z)

      const maxDim = Math.max(size.x, size.y, size.z)
      camera.position.set(0, center.y * 0.3, maxDim * 2.5)
      controls.target.set(0, center.y * 0.3, 0)
      controls.update()

      scene.add(model)

      if (gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model)
        for (const clip of gltf.animations) {
          clipMap.set(clip.name, clip)
        }

        console.log(
          '[ThreeAiModel] Available animations:',
          gltf.animations.map((a) => a.name),
        )

        const idleClip = clipMap.get('idle') ?? gltf.animations[0]
        if (idleClip) {
          const action = mixer.clipAction(idleClip)
          action.play()
          currentAction = action
        }
      }

      loading.value = false
    },
    (progress) => {
      if (progress.total > 0) {
        loadingProgress.value = Math.round((progress.loaded / progress.total) * 100)
      }
    },
    () => {
      loading.value = false
      error.value = true
      emit('load-error')
    },
  )
}

function animate() {
  animationFrameId = requestAnimationFrame(animate)
  const delta = timer.getDelta()
  if (mixer) mixer.update(delta)
  controls.update()
  renderer.render(scene, camera)
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  timer = new THREE.Timer()

  const testCanvas = document.createElement('canvas')
  const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl')
  if (!gl) {
    error.value = true
    emit('webgl-error')
    return
  }

  initScene()
  loadModel()
  animate()

  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      if (!containerRef.value) return
      const w = containerRef.value.clientWidth
      const h = containerRef.value.clientHeight
      if (w === 0 || h === 0) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    })
    resizeObserver.observe(containerRef.value)
  }
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
  resizeObserver?.disconnect()
  // Clean up hover state
  if (hoveredObject) {
    resetHighlight(hoveredObject)
    hoveredObject = null
  }
  hoveredOriginals.clear()
  controls?.dispose()
  renderer?.dispose()
  mixer?.stopAllAction()
  scene?.clear()

  const canvas = renderer?.domElement
  if (canvas) {
    canvas.removeEventListener('pointerdown', onPointerDown)
    canvas.removeEventListener('pointermove', onPointerMove)
    canvas.removeEventListener('pointerup', onPointerUp)
  }
})

watch(
  () => props.currentState,
  (newState) => {
    const animName = ANIMATION_MAP[newState]
    if (animName && clipMap.has(animName)) {
      playAnimation(animName)
    }
  },
)

defineExpose({
  playAnimation,
  playClickFeedback,
})
</script>

<style scoped>
.three-ai-model {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: grab;
}
.three-ai-model:active {
  cursor: grabbing;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px);
  border-radius: 16px;
  z-index: 10;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(220, 38, 38, 0.2);
  border-top-color: #dc2626;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.progress-text {
  margin-top: 8px;
  font-size: 12px;
  color: #dc2626;
  font-weight: 600;
}

.error-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  z-index: 10;
}

.error-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(220, 38, 38, 0.15);
  color: #dc2626;
  font-weight: 700;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
