<template>
  <div class="huanuo-character" :class="`state-${state}`" :title="stateLabel">
    <!-- 头部光环（thinking / celebrating） -->
    <div v-if="state === 'thinking' || state === 'celebrating'" class="aura-ring" />

    <!-- 角色主体 -->
    <div class="character-body">
      <!-- 头发 -->
      <div class="hair-back" />
      <div class="hair-front" />

      <!-- 脸部 -->
      <div class="face">
        <!-- 傩面具（金色半面具） -->
        <div class="nuo-mask">
          <div class="mask-ornament left" />
          <div class="mask-ornament right" />
        </div>

        <!-- 眼睛 -->
        <div class="eyes">
          <div class="eye left" :class="{ sleepy: state === 'night' }">
            <div class="pupil" />
          </div>
          <div class="eye right" :class="{ sleepy: state === 'night' }">
            <div class="pupil" />
          </div>
        </div>

        <!-- 嘴 -->
        <div class="mouth" :class="`mouth-${mouthState}`" />
      </div>

      <!-- 耳饰（会随状态抖动） -->
      <div class="earring left" />
      <div class="earring right" />

      <!-- 身体（简化） -->
      <div class="body-shoulder" />
    </div>

    <!-- 烟花粒子（celebrating） -->
    <div v-if="state === 'celebrating'" class="sparkles">
      <span v-for="i in 8" :key="i" class="spark" :style="sparkStyle(i)" />
    </div>

    <!-- 思考粒子（thinking） -->
    <div v-if="state === 'thinking'" class="thought-particles">
      <span v-for="i in 3" :key="i" class="thought-dot" :style="`animation-delay: ${i * 0.2}s`" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    state?: string
    size?: number
  }>(),
  {
    state: 'idle',
    size: 80,
  },
)

const stateLabel = computed(() => {
  const labels: Record<string, string> = {
    idle: '空闲',
    listening: '聆听中',
    thinking: '思考中',
    speaking: '回复中',
    celebrating: '欢呼',
    night: '休息中',
  }
  return labels[props.state] || props.state
})

const mouthState = computed(() => {
  if (props.state === 'speaking') return 'open'
  if (props.state === 'celebrating') return 'smile'
  if (props.state === 'night') return 'sleep'
  return 'neutral'
})

function sparkStyle(i: number) {
  const angle = (i / 8) * 360
  const dist = 30 + Math.random() * 20
  const x = Math.cos((angle * Math.PI) / 180) * dist
  const y = Math.sin((angle * Math.PI) / 180) * dist
  return {
    '--x': `${x}px`,
    '--y': `${y}px`,
    animationDelay: `${i * 0.1}s`,
    backgroundColor: i % 2 === 0 ? '#f59e0b' : '#ef4444',
  }
}
</script>

<style scoped>
.huanuo-character {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: v-bind('props.size + "px"');
  height: v-bind('props.size + "px"');
}

/* === 角色主体 === */
.character-body {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 2;
}

/* 脸部 */
.face {
  position: absolute;
  inset: 15% 20% 25% 20%;
  background: linear-gradient(170deg, #fce4cc 0%, #f5cba7 100%);
  border-radius: 45% 45% 40% 40%;
  overflow: hidden;
}

/* 傩面具（金色半面具） */
.nuo-mask {
  position: absolute;
  top: 8%;
  left: 10%;
  right: 10%;
  height: 35%;
  background: linear-gradient(180deg, #d4a017 0%, #f0c75e 40%, #e6b422 100%);
  border-radius: 10% 10% 5px 5px;
  box-shadow: 0 2px 8px rgba(180, 120, 20, 0.5);
  z-index: 3;
}

.mask-ornament {
  position: absolute;
  top: 5px;
  width: 6px;
  height: 14px;
  background: #c0392b;
  border-radius: 3px;
}

.mask-ornament.left {
  left: 8px;
}

.mask-ornament.right {
  right: 8px;
}

/* 眼睛 */
.eyes {
  position: absolute;
  top: 38%;
  left: 15%;
  right: 15%;
  height: 18%;
  display: flex;
  justify-content: space-around;
  z-index: 4;
}

.eye {
  width: 28%;
  height: 100%;
  background: white;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.pupil {
  position: absolute;
  width: 55%;
  height: 55%;
  background: radial-gradient(circle, #1a1a2e 40%, #4a3728 100%);
  border-radius: 50%;
  top: 30%;
  left: 20%;
  transition: all 0.3s;
}

.pupil::after {
  content: '';
  position: absolute;
  width: 20%;
  height: 20%;
  background: white;
  border-radius: 50%;
  top: 15%;
  left: 20%;
}

.eye.sleepy .pupil {
  height: 20%;
  top: 50%;
  border-radius: 50% / 30%;
}

/* 嘴 */
.mouth {
  position: absolute;
  bottom: 28%;
  left: 35%;
  right: 35%;
  height: 8%;
  z-index: 4;
  transition: all 0.3s;
}

.mouth-neutral {
  border-bottom: 2px solid #c97a5a;
  border-radius: 0 0 50% 50%;
}

.mouth-open {
  background: #c97a5a;
  border-radius: 50%;
  height: 14%;
  bottom: 26%;
  transform: scaleY(0.6);
}

.mouth-smile {
  border-bottom: 2.5px solid #c97a5a;
  border-radius: 0 0 60% 60%;
  width: 120%;
  left: 30%;
}

.mouth-sleep {
  background: #c97a5a;
  border-radius: 50%;
  width: 20%;
  left: 40%;
  height: 6%;
  bottom: 27%;
}

/* 头发 */
.hair-back {
  position: absolute;
  inset: 0 15% 30% 15%;
  background: linear-gradient(180deg, #2c1810 0%, #1a0a05 70%, #c0392b 95%);
  border-radius: 50% 50% 0 0;
  z-index: 1;
}

.hair-front {
  position: absolute;
  top: 2%;
  left: 18%;
  right: 18%;
  height: 22%;
  background: linear-gradient(180deg, #3d2012 0%, #2c1810 100%);
  border-radius: 0 0 40% 40%;
  z-index: 5;
}

/* 耳饰 */
.earring {
  position: absolute;
  width: 5px;
  height: 10px;
  background: #f0c75e;
  border-radius: 2px 2px 4px 4px;
  top: 50%;
  z-index: 1;
}

.earring.left {
  left: 12%;
}

.earring.right {
  right: 12%;
}

/* 身体 */
.body-shoulder {
  position: absolute;
  bottom: 5%;
  left: 10%;
  right: 10%;
  height: 18%;
  background: linear-gradient(180deg, #c0392b 0%, #e74c3c 30%, #1a1a2e 100%);
  border-radius: 50% 50% 20% 20%;
  z-index: 0;
}

/* 光环 */
.aura-ring {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 2px solid transparent;
  z-index: 0;
}

.state-thinking .aura-ring {
  border-color: rgba(240, 199, 94, 0.4);
  animation: auraPulse 1.5s ease-in-out infinite;
}

.state-celebrating .aura-ring {
  border-color: rgba(239, 68, 68, 0.5);
  animation: auraBurst 0.6s ease-in-out infinite;
}

/* === 状态动画 === */

/* idle — 呼吸 */
.state-idle .character-body {
  animation: breathe 3s ease-in-out infinite, float 4s ease-in-out infinite;
}

/* listening — 前倾 + 耳饰抖动 */
.state-listening .character-body {
  animation: leanForward 0.6s ease-in-out infinite alternate;
}

.state-listening .earring {
  animation: earShake 0.3s ease-in-out infinite;
}

.state-listening .eye .pupil {
  transform: scale(1.15);
}

/* thinking — 歪头 */
.state-thinking .character-body {
  animation: tiltHead 2s ease-in-out infinite;
}

/* speaking — 嘴部动画在 .mouth-open 中 */
.state-speaking .character-body {
  animation: microFloat 0.8s ease-in-out infinite;
}

/* celebrating — 跳跃 */
.state-celebrating .character-body {
  animation: celebrateJump 0.5s ease-in-out infinite;
}

/* night — 变暗 */
.state-night .face {
  filter: brightness(0.7);
}

.state-night .character-body {
  animation: sleepFloat 5s ease-in-out infinite;
}

/* === 粒子 === */
.sparkles {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.spark {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  animation: sparkBurst 0.8s ease-out infinite;
}

.thought-particles {
  position: absolute;
  top: -15px;
  right: -5px;
  z-index: 1;
  display: flex;
  gap: 3px;
}

.thought-dot {
  width: 5px;
  height: 5px;
  background: #f0c75e;
  border-radius: 50%;
  animation: thoughtFloat 1s ease-in-out infinite;
}

/* === Keyframes === */
@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

@keyframes leanForward {
  from { transform: rotate(0deg); }
  to { transform: rotate(2deg); }
}

@keyframes earShake {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(8deg); }
  75% { transform: rotate(-8deg); }
}

@keyframes tiltHead {
  0%, 100% { transform: rotate(0deg); }
  30% { transform: rotate(-5deg); }
  60% { transform: rotate(3deg); }
}

@keyframes microFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

@keyframes celebrateJump {
  0%, 100% { transform: translateY(0) scale(1); }
  30% { transform: translateY(-6px) scale(1.08); }
  60% { transform: translateY(-2px) scale(0.95); }
}

@keyframes auraPulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.15); opacity: 0.7; }
}

@keyframes auraBurst {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.25); opacity: 0.9; }
}

@keyframes sparkBurst {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--x), var(--y)) scale(0); opacity: 0; }
}

@keyframes thoughtFloat {
  0%, 100% { transform: translateY(0); opacity: 0.3; }
  50% { transform: translateY(-8px); opacity: 1; }
}

@keyframes sleepFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-1px); }
}
</style>
