<template>
  <div v-if="iAmOpen" class="overlay">
    <div class="popup-content">
      <div class="innerHeader">
        <h3 class="title">요금제선택</h3>
        <span @click="iAmOpen = false" class="material-symbols-outlined close-button">
          cancel
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'

const iAmOpen = ref(false)

//this handles keyboard actions
function keydownHandle(event) {
  if (event.key === 'Escape') {
    iAmOpen.value = false
  }
}

function openMe() {
  iAmOpen = true
  console.log('i am opened!!!!!!!!')
}

onMounted(() => {
  document.addEventListener('keydown', keydownHandle)
})

onUnmounted(() => {
  document.removeEventListener('keydown', keydownHandle)
})
</script>

<style scoped>
.overlay {
  display: flex;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  z-index: 1100;
  background-color: rgba(0, 0, 0, 0.552);
  padding: 20px;
}

.popup-content {
  background-color: white;
  border-radius: 8px;
  height: 800px;
  width: 800px;
  overflow: auto;
}

.innerHeader {
  position: sticky;
  top: 0;
  height: 60px;
  padding: 0 20px;
  align-items: center;
  display: flex;
  justify-content: space-between;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Bottom shadow */
  z-index: 1101;
}
</style>
