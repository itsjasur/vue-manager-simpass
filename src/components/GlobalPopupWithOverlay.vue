<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="isVisible" class="popup-overlay">
        <slot></slot>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref } from 'vue'

const isVisible = ref(false)

const showPopup = () => {
  isVisible.value = true
  document.body.style.overflow = 'hidden' // Prevent body scrolling when popup is open
}

const closePopup = () => {
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
  width: 100%;
  height: 100%;

  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;

  display: flex;
  justify-content: center;
  /* align-items: center; */
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
