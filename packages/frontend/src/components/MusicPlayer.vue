<template>
  <section class="py-16 bg-white text-gray-900">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto bg-gray-100 rounded-lg p-6 flex items-center gap-6">
        <div class="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
          <img 
            src="../assets/images/one_place_wanzai.png" 
            :alt="t('musicPlayer.title')" 
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        
        <div class="flex-1">
          <h3 class="text-xl font-bold mb-1">{{ t('musicPlayer.title') }}</h3>
          <p class="text-gray-600 text-sm mb-4">{{ t('musicPlayer.artist') }}</p>
          
          <div class="mb-4">
            <div class="flex justify-between text-xs text-gray-600 mb-1">
              <span>{{ formatTime(currentTime) }}</span>
              <span>{{ formatTime(duration) }}</span>
            </div>
            <div 
              class="w-full h-2 bg-gray-200 rounded-full cursor-pointer relative"
              @click="seek"
            >
              <div 
                class="h-full bg-red-600 rounded-full" 
                :style="{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }"
              ></div>
              <div 
                class="w-4 h-4 bg-red-600 rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 absolute cursor-pointer"
                :style="{ left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }"
                @mousedown="startDrag"
              ></div>
            </div>
          </div>
          
          <div class="flex items-center">
            <button 
              @click="togglePlay" 
              class="text-gray-900 hover:text-red-600 transition-colors focus:outline-none"
              :aria-label="t('musicPlayer.playPause')"
            >
              <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="flex-shrink-0">
          <div v-if="isPlaying" class="flex gap-1">
            <div class="w-1 h-6 bg-red-500 rounded-full animate-pulse" style="animation-delay: 0ms"></div>
            <div class="w-1 h-8 bg-red-500 rounded-full animate-pulse" style="animation-delay: 100ms"></div>
            <div class="w-1 h-6 bg-red-500 rounded-full animate-pulse" style="animation-delay: 200ms"></div>
            <div class="w-1 h-10 bg-red-500 rounded-full animate-pulse" style="animation-delay: 300ms"></div>
          </div>
        </div>
      </div>
      <div class="text-center mt-4 text-3xl font-bold text-gray-900">
        {{ t('musicPlayer.theme') }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import audioFile from '../assets/audio/one_place_wanzai.mp3';

const { t } = useI18n();

const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(264);
const isDragging = ref(false);
const audioElement = ref<HTMLAudioElement | null>(null);

const initAudio = () => {
  audioElement.value = new Audio();
  audioElement.value.src = audioFile;
  
  audioElement.value.addEventListener('timeupdate', () => {
    if (audioElement.value && !isDragging.value) {
      currentTime.value = Math.floor(audioElement.value.currentTime);
    }
  });
  
  audioElement.value.addEventListener('ended', () => {
    isPlaying.value = false;
    currentTime.value = 0;
  });
  
  audioElement.value.addEventListener('loadedmetadata', () => {
    if (audioElement.value) {
      duration.value = Math.floor(audioElement.value.duration);
    }
  });
};

const togglePlay = () => {
  if (!audioElement.value) {
    initAudio();
  }
  
  if (audioElement.value) {
    if (isPlaying.value) {
      audioElement.value.pause();
    } else {
      audioElement.value.play().catch(() => {
        startSimulatedPlayback();
      });
    }
    isPlaying.value = !isPlaying.value;
  }
};

let simulatedInterval: number | null = null;

const startSimulatedPlayback = () => {
  if (simulatedInterval) return;
  
  simulatedInterval = window.setInterval(() => {
    if (currentTime.value < duration.value) {
      currentTime.value += 1;
    } else {
      isPlaying.value = false;
      stopSimulatedPlayback();
      currentTime.value = 0;
    }
  }, 1000);
};

const stopSimulatedPlayback = () => {
  if (simulatedInterval) {
    clearInterval(simulatedInterval);
    simulatedInterval = null;
  }
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const seek = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const percentage = clickX / rect.width;
  const newTime = Math.floor(percentage * duration.value);
  
  currentTime.value = newTime;
  
  if (audioElement.value) {
    audioElement.value.currentTime = newTime;
  }
};

const startDrag = (event: MouseEvent) => {
  isDragging.value = true;
  event.preventDefault();
  
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', endDrag);
  
  if (audioElement.value && !audioElement.value.paused) {
    audioElement.value.pause();
  }
};

const drag = (event: MouseEvent) => {
  if (!isDragging.value) return;
  
  const progressBar = document.querySelector('.w-full.h-2.bg-gray-200.rounded-full') as HTMLElement;
  if (!progressBar) return;
  
  const rect = progressBar.getBoundingClientRect();
  let dragX = event.clientX - rect.left;
  
  dragX = Math.max(0, Math.min(dragX, rect.width));
  
  const percentage = dragX / rect.width;
  currentTime.value = Math.floor(percentage * duration.value);
};

const endDrag = () => {
  isDragging.value = false;
  
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', endDrag);
  
  if (audioElement.value) {
    audioElement.value.currentTime = currentTime.value;
    
    if (isPlaying.value) {
      audioElement.value.play().catch(() => {
        startSimulatedPlayback();
      });
    }
  }
};

onMounted(() => {
  initAudio();
});

onUnmounted(() => {
  stopSimulatedPlayback();
  
  if (audioElement.value) {
    audioElement.value.pause();
    audioElement.value.src = '';
  }
  
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', endDrag);
});
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    transform: scaleY(0.5);
  }
  50% {
    transform: scaleY(1);
  }
}

.animate-pulse {
  animation: pulse 1s infinite ease-in-out;
}
</style>