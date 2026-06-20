<script setup>
import { ref } from 'vue'

defineProps({
  pieces: {
    type: Array,
    required: true,
  },
  currentPiece: {
    type: Object,
    default: null,
  },
  subtitleColumn: {
    type: String,
    default: 'Tempo',
  },
})

const emit = defineEmits(['select-piece'])

const currentMp3 = ref(null)

function hasMidi(piece) {
  return Boolean(piece.midi?.full)
}

function hasMp3(piece) {
  return Boolean(piece.mp3)
}

function playMp3(piece) {
  currentMp3.value = piece
}
</script>

<template>
  <div class="table-responsive">
    <table class="table align-middle mb-0">
      <thead>
        <tr>
          <th>Brano</th>
          <th>{{ subtitleColumn }}</th>
          <th>Durata</th>
          <th>MIDI</th>
          <th>MP3</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="piece in pieces"
          :key="piece.id"
          :class="{
            'table-primary': currentPiece?.id === piece.id,
          }"
        >
          <td>
            <strong>{{ piece.title }}</strong>

            <span v-if="currentPiece?.id === piece.id" class="badge bg-primary ms-2">
              Now Playing
            </span>
          </td>

          <td>{{ piece.subtitle }}</td>

          <td>{{ piece.duration }}</td>

          <td>
            <button
              v-if="hasMidi(piece)"
              class="btn btn-sm btn-primary"
              @click="emit('select-piece', piece)"
            >
              Play
            </button>

            <span v-else class="small text-muted">—</span>
          </td>

          <td>
            <div v-if="hasMp3(piece)" class="d-flex gap-2 align-items-center">
              <button
                class="btn btn-sm btn-success"
                type="button"
                title="Ascolta MP3"
                @click="playMp3(piece)"
              >
                ▶
              </button>

              <a
                class="btn btn-sm btn-outline-secondary"
                :href="piece.mp3"
                download
                title="Scarica MP3"
              >
                ⬇
              </a>
            </div>

            <span v-else class="small text-muted">—</span>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="currentMp3" class="card mt-3">
      <div class="card-header">MP3 in ascolto: {{ currentMp3.title }}</div>

      <div class="card-body">
        <audio :src="currentMp3.mp3" controls autoplay class="w-100"></audio>
      </div>
    </div>
  </div>
</template>
