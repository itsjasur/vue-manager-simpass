<template>
  <div v-if="popup.loading" class="overlay">
    <LoadingSpinner height="40px" color="#ffffff" />
  </div>
</template>

<script setup>
import { usePageLoadingStore } from '../stores/page-loading-store'
import LoadingSpinner from '../components/Loader.vue'

const popup = usePageLoadingStore()
</script>

<style scoped>
.overlay {
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000000c2;
  z-index: 3000;
}
</style>
