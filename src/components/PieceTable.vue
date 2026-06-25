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

function isComingSoon(piece) {
  return !hasMidi(piece) && !hasMp3(piece)
}

function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('it-IT')
}
</script>

<template>
  <div class="discogs-list">
    <div class="discogs-list-head">
      <div>Brano</div>
      <div>Pubblicato</div>
      <div>MIDI</div>
      <div>MP3</div>
    </div>

    <div
      v-for="piece in pieces"
      :key="piece.id"
      class="discogs-row"
      :class="{
        'is-playing': currentPiece?.id === piece.id,
      }"
    >
      <div class="piece-main">
        <div class="piece-title">
          {{ piece.title }}

          <span v-if="currentPiece?.id === piece.id" class="playing-label"> Now Playing </span>
        </div>

        <div v-if="piece.subtitle" class="piece-subtitle">
          {{ piece.subtitle }}
        </div>

        <div v-if="isComingSoon(piece)" class="coming-soon">Coming Soon</div>
      </div>

      <div class="published-date">
        <span v-if="piece.publishedAt">
          {{ formatDate(piece.publishedAt) }}
        </span>

        <span v-else class="muted"> — </span>
      </div>

      <div class="media-actions">
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

        <span v-else class="muted"> — </span>
      </div>

      <div class="media-actions">
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

        <span v-else class="muted"> — </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.discogs-list {
  background: white;
  border-top: 1px solid #d7d7d7;
}

.discogs-list-head {
  display: grid;
  grid-template-columns: 1fr 130px 90px 90px;
  gap: 16px;
  padding: 9px 12px;
  border-bottom: 1px solid #d7d7d7;
  color: #666;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.discogs-row {
  display: grid;
  grid-template-columns: 1fr 130px 90px 90px;
  gap: 16px;
  align-items: center;
  padding: 11px 12px;
  border-bottom: 1px solid #e5e5e5;
}

.discogs-row:hover {
  background: #fafafa;
}

.discogs-row.is-playing {
  background: #f3f7ff;
}

.piece-main {
  min-width: 0;
}

.piece-title {
  font-size: 0.98rem;
  font-weight: 700;
  color: #222;
  line-height: 1.25;
}

.piece-subtitle {
  margin-top: 2px;
  font-size: 0.92rem;
  color: #666;
  line-height: 1.25;
}

.playing-label {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 7px;
  border-radius: 999px;
  background: #2563eb;
  color: white;
  font-size: 0.68rem;
  font-weight: 700;
  vertical-align: middle;
}

.coming-soon {
  margin-top: 4px;
  font-size: 0.82rem;
  color: #9a6a00;
  font-weight: 700;
}

.published-date {
  color: #555;
  font-size: 0.9rem;
  white-space: nowrap;
}

.media-actions {
  display: flex;
  align-items: center;
  gap: 9px;
  white-space: nowrap;
}

.icon-action {
  border: 0;
  background: transparent;
  padding: 0;
  margin: 0;
  width: 22px;
  height: 22px;
  color: #444;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  line-height: 1;
  font-size: 0.84rem;
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
  .discogs-list-head {
    display: none;
  }

  .discogs-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 13px 12px;
  }

  .piece-title {
    font-size: 1rem;
  }

  .piece-subtitle {
    font-size: 0.95rem;
  }

  .published-date {
    font-size: 0.86rem;
  }

  .media-actions {
    display: inline-flex;
  }

  .discogs-row {
    grid-template-areas:
      'main'
      'mobile';
  }

  .piece-main {
    grid-area: main;
  }

  .published-date,
  .media-actions {
    grid-area: mobile;
  }

  .discogs-row > .published-date {
    display: inline-flex;
    align-items: center;
    margin-right: 10px;
  }

  .discogs-row > .media-actions:nth-of-type(1)::before {
    content: 'MIDI';
    color: #777;
    font-size: 0.75rem;
    font-weight: 700;
    margin-right: 2px;
  }

  .discogs-row > .media-actions:nth-of-type(2)::before {
    content: 'MP3';
    color: #777;
    font-size: 0.75rem;
    font-weight: 700;
    margin-right: 2px;
  }

  .discogs-row {
    grid-template-columns: 1fr;
  }

  .discogs-row > .published-date,
  .discogs-row > .media-actions {
    grid-row: 2;
  }

  .discogs-row > .published-date {
    grid-column: 1;
    justify-self: start;
  }

  .discogs-row > .media-actions:nth-of-type(1) {
    grid-column: 1;
    justify-self: center;
  }

  .discogs-row > .media-actions:nth-of-type(2) {
    grid-column: 1;
    justify-self: end;
  }

  .icon-action {
    width: 21px;
    height: 21px;
  }
}
</style>
