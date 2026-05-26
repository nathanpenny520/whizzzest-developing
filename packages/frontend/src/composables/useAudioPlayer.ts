import { ref, onScopeDispose } from 'vue'

export function useAudioPlayer(src: string) {
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const isDragging = ref(false)
  const hasError = ref(false)
  const isLoaded = ref(false)

  let audioElement: HTMLAudioElement | null = null
  let simulatedInterval: number | null = null

  const stopSimulatedPlayback = () => {
    if (simulatedInterval !== null) {
      clearInterval(simulatedInterval)
      simulatedInterval = null
    }
  }

  const startSimulatedPlayback = () => {
    stopSimulatedPlayback()

    simulatedInterval = window.setInterval(() => {
      if (!isPlaying.value || isDragging.value) {
        return
      }
      if (currentTime.value < duration.value) {
        currentTime.value += 1
      } else {
        isPlaying.value = false
        stopSimulatedPlayback()
        currentTime.value = 0
      }
    }, 1000)
  }

  const initAudio = () => {
    audioElement = new Audio()
    audioElement.src = src

    audioElement.addEventListener('timeupdate', () => {
      if (audioElement && !isDragging.value) {
        currentTime.value = Math.floor(audioElement.currentTime)
      }
    })

    audioElement.addEventListener('ended', () => {
      isPlaying.value = false
      stopSimulatedPlayback()
      currentTime.value = 0
    })

    audioElement.addEventListener('loadedmetadata', () => {
      if (audioElement) {
        duration.value = Math.floor(audioElement.duration)
        isLoaded.value = true
      }
    })

    audioElement.addEventListener('error', () => {
      hasError.value = true
      isPlaying.value = false
      stopSimulatedPlayback()
    })
  }

  const play = () => {
    if (!audioElement) initAudio()

    if (audioElement) {
      audioElement.play().catch(() => {
        startSimulatedPlayback()
      })
      isPlaying.value = true
    }
  }

  const pause = () => {
    if (audioElement) {
      audioElement.pause()
    }
    stopSimulatedPlayback()
    isPlaying.value = false
  }

  const toggle = () => {
    if (isPlaying.value) {
      pause()
    } else {
      play()
    }
  }

  const seekTo = (time: number) => {
    currentTime.value = time
    if (audioElement) {
      audioElement.currentTime = time
    }
  }

  // Pause underlying audio without changing isPlaying state (used during drag)
  const suspendAudio = () => {
    if (audioElement && !audioElement.paused) {
      audioElement.pause()
    }
  }

  // Resume underlying audio if isPlaying is true (used after drag)
  const resumeAudio = () => {
    if (audioElement && isPlaying.value) {
      audioElement.play().catch(() => {
        startSimulatedPlayback()
      })
    }
  }

  const destroy = () => {
    stopSimulatedPlayback()
    if (audioElement) {
      audioElement.pause()
      audioElement.src = ''
      audioElement = null
    }
  }

  initAudio()
  onScopeDispose(destroy)

  return {
    isPlaying,
    currentTime,
    duration,
    isDragging,
    hasError,
    isLoaded,
    play,
    pause,
    toggle,
    seekTo,
    suspendAudio,
    resumeAudio,
    destroy,
  }
}
