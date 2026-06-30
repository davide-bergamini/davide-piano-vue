<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

import AppHeader from './components/AppHeader.vue'
import Sidebar from './components/Sidebar.vue'
import MidiPlayer from './components/MidiPlayer.vue'

const route = useRoute()

const hideSidebar = computed(() => {
  return route.path.startsWith('/discoteca')
})

const currentPiece = ref(null)
const currentMp3 = ref(null)

function setCurrentPiece(piece) {
  currentPiece.value = piece
  currentMp3.value = null
}

function setCurrentMp3(piece) {
  currentMp3.value = piece
  currentPiece.value = null
}

function stopPiece() {
  currentPiece.value = null
}

function stopMp3() {
  currentMp3.value = null
}
</script>

<template>
  <AppHeader />

  <div class="page-layout">
    <Sidebar v-if="!hideSidebar" />

    <main class="content">
      <RouterView
        :current-piece="currentPiece"
        @select-piece="setCurrentPiece"
        @select-mp3="setCurrentMp3"
      />
    </main>
  </div>

  <MidiPlayer
    v-if="currentPiece || currentMp3"
    :current-piece="currentPiece"
    :current-mp3="currentMp3"
    @stop="stopPiece"
    @stop-mp3="stopMp3"
  />
</template>
