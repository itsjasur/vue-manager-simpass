<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="isVisible" class="popup-overlay">
        <div class="overlay_content">
          <slot></slot>
          <span @click="closePopup" class="material-symbols-outlined close-button"> cancel </span>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref } from 'vue'

const isVisible = ref(false)

const showPopup = () => {
  console.log('showPopup called, setting isVisible to true')
  isVisible.value = true
  document.body.style.overflow = 'hidden' // Prevent body scrolling when popup is open
}

const closePopup = () => {
  console.log('closePopup called, setting isVisible to false')
  isVisible.value = false
  document.body.style.overflow = '' // Restore body scrolling when popup is closed
}

defineExpose({ showPopup, closePopup })
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;

  /* display: flex; */
  /* justify-content: center; */
  /* align-items: center; */
}

.overlay_content {
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #333;
  font-size: 30px;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
