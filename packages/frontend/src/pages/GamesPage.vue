<template>
  <div class="min-h-screen games-bg">
    <!-- Hero -->
    <section class="relative pt-24 pb-12 px-4 text-center">
      <h1 class="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3 hero-title">
        {{ t('games.title') }}
      </h1>
      <p class="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
        {{ t('games.subtitle') }}
      </p>
    </section>

    <!-- Game Cards -->
    <section class="max-w-4xl mx-auto px-4 pb-24">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Minecraft 1.8.8 Card -->
        <div class="game-card group cursor-pointer" @click="openGame('minecraft-1.8.8')">
          <!-- Card Preview Image -->
          <div class="card-preview">
            <img :src="minecraftImg" alt="Minecraft 1.8.8" class="preview-img" />
          </div>

          <!-- Card Info -->
          <div class="card-info">
            <h3 class="text-lg font-bold text-gray-800 mb-1">
              {{ t('games.minecraft188') }}
            </h3>
            <p class="text-gray-500 text-xs leading-relaxed mb-4">
              {{ t('games.desc188') }}
            </p>
            <span class="play-btn">
              {{ t('games.play') }}
              <svg
                class="w-4 h-4 ml-1 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </div>
        </div>

        <!-- Future Game Placeholder -->
        <div class="game-card placeholder-card">
          <div class="card-preview">
            <div class="placeholder-icon">?</div>
          </div>
          <div class="card-info">
            <h3 class="text-lg font-bold text-gray-400 mb-1">
              {{ t('games.moreComing') }}
            </h3>
            <p class="text-gray-400 text-xs leading-relaxed mb-4">
              {{ t('games.moreComingDesc') }}
            </p>
            <span class="text-gray-400 text-xs">{{ t('common.comingSoon') }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Fullscreen Game Overlay -->
    <Transition name="overlay">
      <div v-if="activeGame" class="fixed inset-0 z-[100] bg-black flex flex-col">
        <!-- Top bar -->
        <div
          class="flex items-center justify-between px-4 py-2 bg-white/95 backdrop-blur border-b border-gray-200 shrink-0"
        >
          <button
            @click="closeGame"
            class="flex items-center gap-2 text-gray-500 hover:text-amber-500 transition-colors text-sm"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {{ t('games.back') }}
          </button>
          <span class="text-gray-700 text-sm font-medium">
            {{ t('games.minecraft188') }}
          </span>
          <div class="w-16" />
          <!-- spacer -->
        </div>

        <!-- Game iframe -->
        <iframe
          :src="`/games/${activeGame}.html`"
          class="flex-1 w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; cross-origin-isolated"
          title="Minecraft"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'GamesPage' })
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import minecraftImg from '@/assets/images/Minecraft.jpg'

const { t } = useI18n()
const activeGame = ref<string | null>(null)

function openGame(id: string) {
  activeGame.value = id
}

function closeGame() {
  activeGame.value = null
}
</script>

<style scoped>
.games-bg {
  background: linear-gradient(180deg, rgba(245, 158, 11, 0.05) 0%, #f9fafb 160px);
}

.hero-title {
  position: relative;
  display: inline-block;
}
.hero-title::after {
  content: '';
  display: block;
  width: 56px;
  height: 3px;
  background: #f59e0b;
  border-radius: 2px;
  margin: 12px auto 0;
}

.game-card {
  background: #fff;
  border: 1px solid #f3f4f6;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
.game-card.cursor-pointer:hover {
  border-color: #e5e7eb;
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.placeholder-card {
  opacity: 0.6;
  cursor: default;
}

.card-preview {
  height: 180px;
  overflow: hidden;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.game-card.cursor-pointer:hover .preview-img {
  transform: scale(1.05);
}

.placeholder-icon {
  font-size: 48px;
  font-weight: 700;
  color: #d1d5db;
}

.card-info {
  padding: 20px;
}

.play-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #f59e0b;
  color: #fff;
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
}
.game-card.cursor-pointer:hover .play-btn {
  background: #d97706;
}

/* Overlay transition */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
