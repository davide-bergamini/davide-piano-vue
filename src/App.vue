<script setup>
import { ref } from 'vue'

import AppHeader from './components/AppHeader.vue'
import Sidebar from './components/Sidebar.vue'
import MidiPlayer from './components/MidiPlayer.vue'

const currentPiece = ref(null)

function setCurrentPiece(piece) {
  currentPiece.value = piece
}

function stopPiece() {
  currentPiece.value = null
}
</script>

<template>
  <AppHeader />

  <div class="page-layout">
    <Sidebar />

    <main class="content">
      <RouterView :current-piece="currentPiece" @select-piece="setCurrentPiece" />
    </main>
  </div>

  <MidiPlayer :current-piece="currentPiece" @stop="stopPiece" />
</template>
