<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import * as Tone from 'tone'
import { Midi } from '@tonejs/midi'

const props = defineProps({
  currentPiece: {
    type: Object,
    default: null,
  },
  currentMp3: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['stop', 'stop-mp3'])

const isPlaying = ref(false)
const status = ref('Nessun brano selezionato')
const currentTime = ref(0)
const totalDuration = ref(0)
const tempoPercent = ref(100)

let synth = null
let parts = []
let animationFrame = null
let loadedMidiKey = null

function getMidiUrl(piece) {
  return piece?.midi?.full || ''
}

function getMidiKey(piece) {
  return piece?.id || 'none'
}

function createSynth() {
  return new Tone.PolySynth(Tone.Synth).toDestination()
}

async function unlockAudio() {
  await Tone.start()

  const context = Tone.getContext().rawContext

  if (context.state !== 'running') {
    await context.resume()
  }

  console.log('Audio context:', context.state)
}

async function ensureSynth() {
  if (synth) return

  synth = createSynth()
}

async function testAudio() {
  try {
    status.value = 'Test audio...'

    await unlockAudio()
    await ensureSynth()

    synth.triggerAttackRelease('C4', '8n')

    status.value = 'Test audio eseguito'
  } catch (err) {
    console.error(err)
    status.value = 'Test audio fallito'
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)

  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const formattedCurrentTime = computed(() => formatTime(currentTime.value))
const formattedTotalDuration = computed(() => formatTime(totalDuration.value))
const hasPlayableMidi = computed(() => Boolean(getMidiUrl(props.currentPiece)))

function updateProgress() {
  currentTime.value = Tone.Transport.seconds

  if (totalDuration.value > 0 && currentTime.value >= totalDuration.value) {
    stop()
    return
  }

  animationFrame = requestAnimationFrame(updateProgress)
}

function clearCurrentMidi() {
  Tone.Transport.stop()
  Tone.Transport.cancel()
  Tone.Transport.position = 0

  currentTime.value = 0

  parts.forEach((part) => part.dispose())
  parts = []

  loadedMidiKey = null
}

async function loadMidi(piece) {
  const midiUrl = getMidiUrl(piece)
  const midiKey = getMidiKey(piece)

  if (!midiUrl) return

  if (loadedMidiKey === midiKey) return

  clearCurrentMidi()

  status.value = 'Carico MIDI...'

  const response = await fetch(midiUrl)

  if (!response.ok) {
    throw new Error(`Errore caricamento MIDI: ${response.status}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const midi = new Midi(arrayBuffer)

  totalDuration.value = midi.duration

  parts = midi.tracks
    .filter((track) => track.notes.length)
    .map((track) => {
      const part = new Tone.Part((time, note) => {
        synth.triggerAttackRelease(note.name, note.duration, time, note.velocity)
      }, track.notes).start(0)

      return part
    })

  loadedMidiKey = midiKey
}

async function play() {
  if (!getMidiUrl(props.currentPiece)) return

  try {
    status.value = 'Avvio audio...'

    await unlockAudio()
    await ensureSynth()

    status.value = 'Carico MIDI...'
    await loadMidi(props.currentPiece)

    Tone.Transport.stop()
    Tone.Transport.position = 0
    Tone.Transport.bpm.value = 120 * (tempoPercent.value / 100)

    Tone.Transport.start('+0.2')

    isPlaying.value = true
    status.value = 'In riproduzione'

    cancelAnimationFrame(animationFrame)
    updateProgress()
  } catch (err) {
    console.error(err)

    isPlaying.value = false
    status.value = 'Errore audio/MIDI'
  }
}

async function playButtonClick() {
  if (isPlaying.value) {
    pause()
    return
  }

  await play()
}

function pause() {
  Tone.Transport.pause()

  isPlaying.value = false
  status.value = 'In pausa'

  cancelAnimationFrame(animationFrame)
}

function stopAudio() {
  Tone.Transport.stop()
  Tone.Transport.cancel()
  Tone.Transport.position = 0

  currentTime.value = 0

  parts.forEach((part) => part.dispose())
  parts = []

  isPlaying.value = false

  cancelAnimationFrame(animationFrame)
}

function stop() {
  stopAudio()

  loadedMidiKey = null
  status.value = 'Nessun brano selezionato'

  emit('stop')
}

function stopMp3() {
  emit('stop-mp3')
}

function seek(event) {
  const value = Number(event.target.value)

  currentTime.value = value
  Tone.Transport.seconds = value
}

function changeTempo(event) {
  tempoPercent.value = Number(event.target.value)
  Tone.Transport.bpm.value = 120 * (tempoPercent.value / 100)
}

watch(
  () => props.currentPiece,
  (newPiece) => {
    stopAudio()
    loadedMidiKey = null
    totalDuration.value = 0
    currentTime.value = 0

    if (!getMidiUrl(newPiece)) {
      status.value = 'Nessun brano selezionato'
      return
    }

    status.value = 'MIDI selezionato - premi Play'
  },
)

watch(
  () => props.currentMp3,
  (newMp3) => {
    if (newMp3) {
      stopAudio()
      loadedMidiKey = null
      status.value = 'Riproduzione MP3'
    }
  },
)

onMounted(() => {
  status.value = 'Nessun brano selezionato'
})

onUnmounted(() => {
  stopAudio()

  if (synth) {
    synth.dispose()
    synth = null
  }
})
</script>

<template>
  <div class="midi-player">
    <div class="player-info">
      <strong v-if="currentPiece">
        {{ currentPiece.title }}
      </strong>

      <strong v-else-if="currentMp3">
        {{ currentMp3.title }}
      </strong>

      <span v-else>Nessun brano selezionato</span>

      <small class="d-block">
        <span v-if="currentMp3">Registrazione MP3</span>
        <span v-else>{{ status }}</span>
      </small>
    </div>

    <audio v-if="currentMp3" :src="currentMp3.mp3" controls autoplay class="mp3-audio"></audio>

    <div v-if="!currentMp3" class="progress-wrapper">
      <span>{{ formattedCurrentTime }}</span>

      <input
        type="range"
        min="0"
        :max="totalDuration"
        step="0.01"
        :value="currentTime"
        @input="seek"
        class="progress-slider"
      />

      <span>{{ formattedTotalDuration }}</span>
    </div>

    <div v-if="!currentMp3" class="player-controls">
      <label class="tempo-label">
        Tempo

        <input
          type="range"
          min="50"
          max="150"
          step="5"
          :value="tempoPercent"
          @input="changeTempo"
        />

        {{ tempoPercent }}%
      </label>

      <button class="btn btn-sm btn-warning" @click="testAudio">Test audio</button>

      <button class="btn btn-sm btn-light" :disabled="!hasPlayableMidi" @click="playButtonClick">
        {{ isPlaying ? '⏸' : '▶︎' }}
      </button>

      <button class="btn btn-sm btn-light" :disabled="!currentPiece" @click="stop">■</button>
    </div>

    <div v-if="currentMp3" class="player-controls">
      <button class="btn btn-sm btn-light" @click="stopMp3">■</button>
    </div>
  </div>
</template>
