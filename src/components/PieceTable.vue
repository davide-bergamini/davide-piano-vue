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
    default: 'Tempo',
  },
})

const emit = defineEmits(['select-piece'])

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
            'text-muted': !hasMidi(piece),
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

            <span v-else class="small text-muted"> Non disponibile </span>
          </td>

          <td>
            <a
              v-if="hasMp3(piece)"
              class="btn btn-sm btn-outline-secondary"
              :href="piece.mp3"
              download
              title="Scarica MP3"
            >
              ⬇
            </a>

            <span v-else class="small text-muted"> — </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
