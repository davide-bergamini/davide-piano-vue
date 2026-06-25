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

function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('it-IT')
}
</script>

<template>
  <div class="piece-list">
    <div class="piece-list-head">
      <div>Brano</div>
      <div>Data</div>
      <div>MIDI</div>
      <div>MP3</div>
    </div>

    <div
      v-for="piece in pieces"
      :key="piece.id"
      class="piece-row"
      :class="{ 'is-playing': currentPiece?.id === piece.id }"
    >
      <div class="piece-top">
        <div class="piece-title-area">
          <span class="piece-title">
            {{ piece.title }}
          </span>

          <span v-if="piece.subtitle" class="piece-subtitle desktop-subtitle">
            {{ piece.subtitle }}
          </span>

          <span v-if="currentPiece?.id === piece.id" class="playing-label"> Now Playing </span>
        </div>

        <div class="piece-date">
          <span v-if="piece.publishedAt">
            {{ formatDate(piece.publishedAt) }}
          </span>

          <span v-else class="coming-soon-date"> Coming Soon </span>
        </div>

        <div class="piece-actions">
          <template v-if="hasMidi(piece)">
            <button
              class="icon-action midi-play"
              type="button"
              title="Ascolta MIDI"
              @click="emit('select-piece', piece)"
            >
              ▶
            </button>

            <a class="icon-action download" :href="piece.midi.full" download title="Scarica MIDI">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 3v12m0 0l4-4m-4 4l-4-4M5 21h14"
                />
              </svg>
            </a>
          </template>

          <span v-else class="muted">—</span>
        </div>

        <div class="piece-actions">
          <template v-if="hasMp3(piece)">
            <button
              class="icon-action mp3-play"
              type="button"
              title="Ascolta MP3"
              @click="emit('select-mp3', piece)"
            >
              ▶
            </button>

            <a class="icon-action download" :href="piece.mp3" download title="Scarica MP3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 3v12m0 0l4-4m-4 4l-4-4M5 21h14"
                />
              </svg>
            </a>
          </template>

          <span v-else class="muted">—</span>
        </div>
      </div>

      <div v-if="piece.subtitle" class="piece-subtitle mobile-subtitle">
        {{ piece.subtitle }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.piece-list {
  background: #fff;
  border-top: 1px solid #d7d7d7;
}

.piece-list-head {
  display: grid;
  grid-template-columns: 1fr 130px 90px 90px;
  gap: 16px;
  padding: 9px 0;
  border-bottom: 1px solid #d7d7d7;
  color: #666;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.piece-row {
  border-bottom: 1px solid #e5e5e5;
  padding: 11px 0;
}

.piece-row:hover {
  background: #fafafa;
}

.piece-row.is-playing {
  background: #f7faff;
}

.piece-top {
  display: grid;
  grid-template-columns: 1fr 130px 90px 90px;
  gap: 16px;
  align-items: center;
}

.piece-title-area {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
}

.piece-title {
  font-size: 0.98rem;
  font-weight: 700;
  color: #222;
  white-space: nowrap;
}

.piece-subtitle {
  font-size: 0.92rem;
  color: #666;
}

.desktop-subtitle {
  white-space: nowrap;
}

.mobile-subtitle {
  display: none;
}

.playing-label {
  margin-left: 8px;
  color: #2563eb;
  font-size: 0.75rem;
  font-weight: 700;
}

.piece-date {
  color: #555;
  font-size: 0.9rem;
  white-space: nowrap;
}

.coming-soon-date {
  color: #888;
  font-style: italic;
  font-size: 0.88rem;
}

.piece-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.icon-action {
  width: 22px;
  height: 22px;
  border: 0;
  background: transparent;
  color: #444;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  text-decoration: none;
  appearance: none;
  -webkit-appearance: none;
}

.icon-action:hover {
  color: #000;
}

.midi-play {
  color: #2563eb;
}

.mp3-play {
  color: #198754;
}

.download {
  color: #555;
}

.muted {
  color: #aaa;
}

@media (max-width: 768px) {
  .piece-list-head {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto auto;
    gap: 8px;
    padding: 8px 0;
    border-bottom: 1px solid #d7d7d7;
    color: #666;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .piece-row {
    padding: 12px 0;
  }

  .piece-top {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto auto;
    gap: 8px;
    align-items: center;
  }

  .piece-title-area {
    min-width: 0;
  }

  .piece-title {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.96rem;
  }

  .desktop-subtitle {
    display: none;
  }

  .mobile-subtitle {
    display: block;
    margin-top: 3px;
    font-size: 0.9rem;
    color: #666;
  }

  .piece-date {
    font-size: 0.78rem;
  }

  .coming-soon-date {
    font-size: 0.78rem;
  }

  .piece-actions {
    gap: 4px;
  }

  .icon-action {
    width: 20px;
    height: 20px;
    font-size: 0.78rem;
  }

  .playing-label {
    display: none;
  }
}
</style>
