<script setup>
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
    default: '',
  },
})

const emit = defineEmits(['select-piece', 'select-mp3'])

function hasMidi(piece) {
  return Boolean(piece.midi?.full)
}

function hasMp3(piece) {
  return Boolean(piece.mp3)
}
</script>

<template>
  <div class="table-responsive">
    <table class="table align-middle mb-0">
      <thead>
        <tr>
          <th>Brano</th>
          <th v-if="subtitleColumn">{{ subtitleColumn }}</th>

          <!-- Su mobile questa colonna viene nascosta via CSS -->
          <th class="duration-column">Durata</th>

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
            <div class="piece-title">
              {{ piece.title }}
            </div>

            <span v-if="currentPiece?.id === piece.id" class="badge bg-primary ms-2">
              Now Playing
            </span>

            <div v-if="!subtitleColumn && piece.subtitle" class="piece-subtitle">
              {{ piece.subtitle }}
            </div>
          </td>

          <td v-if="subtitleColumn">
            {{ piece.subtitle }}
          </td>

          <!-- Su mobile questa colonna viene nascosta via CSS -->
          <td class="duration-column">
            {{ piece.duration }}
          </td>

          <td>
            <div v-if="hasMidi(piece)" class="action-buttons">
              <span
                class="round-action midi-play-button"
                role="button"
                tabindex="0"
                title="Ascolta MIDI"
                @click="emit('select-piece', piece)"
                @keydown.enter="emit('select-piece', piece)"
                @keydown.space.prevent="emit('select-piece', piece)"
              >
                ▶
              </span>

              <a
                class="round-action download-button"
                :href="piece.midi.full"
                download
                title="Scarica MIDI"
              >
                ⬇
              </a>
            </div>

            <span v-else class="small text-muted">—</span>
          </td>

          <td>
            <div v-if="hasMp3(piece)" class="action-buttons">
              <span
                class="round-action mp3-play-button"
                role="button"
                tabindex="0"
                title="Ascolta MP3"
                @click="emit('select-mp3', piece)"
                @keydown.enter="emit('select-mp3', piece)"
                @keydown.space.prevent="emit('select-mp3', piece)"
              >
                ▶
              </span>

              <a
                class="round-action download-button"
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
  </div>
</template>

<style scoped>
.piece-title {
  font-size: 1rem;
  font-weight: 600;
}

.piece-subtitle {
  font-size: 1rem;
  font-weight: 600;
  color: #6c757d;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.round-action {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 50%;
  color: white;
  font-size: 0.88rem;
  line-height: 1;
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 0;
  margin: 0;
  text-decoration: none;

  appearance: none;
  -webkit-appearance: none;
  user-select: none;
}

.midi-play-button {
  background: #0d6efd;
}

.midi-play-button:hover {
  background: #0b5ed7;
}

.mp3-play-button {
  background: #198754;
}

.mp3-play-button:hover {
  background: #157347;
}

.download-button {
  background: #64748b;
}

.download-button:hover {
  background: #475569;
  color: white;
}

@media (max-width: 768px) {
  .duration-column {
    display: none;
  }

  .round-action {
    width: 30px;
    height: 30px;
    font-size: 0.82rem;
  }

  .action-buttons {
    gap: 6px;
  }
}
</style>
