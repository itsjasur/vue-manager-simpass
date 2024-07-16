<template>
  <div class="overlay">
    <div class="popup-content">
      <div class="innerHeader">
        <h3 class="title">Hanpass</h3>
        <span @click="$emit('closePopup')" class="material-symbols-outlined close-button"> cancel </span>
      </div>

      <!-- <div v-if="images.length > 0" class="scrollable-content">
        <img v-for="(image, index) in images" :key="index" class="image" :src="image" alt="" loading="lazy" />
    </div> -->
      <div class="scrollable-content">
        <!-- <img class="background-image" src="/src/assets/j1.png" alt="" /> -->
        <img v-for="(image, index) in images" :key="index" class="background-image" :src="image" alt="" />
        <div class="text-overlay">{{ props.partnerNm }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const images = ref([
  //
  '/src/assets/contracts/j/j1.jpg',
  '/src/assets/contracts/j/j2.jpg',
  '/src/assets/contracts/j/j3.jpg',
  '/src/assets/contracts/j/j4.jpg',
  '/src/assets/contracts/j/j5.jpg',
  '/src/assets/contracts/j/j6.jpg',
])

const props = defineProps({ partnerNm: { type: String, required: true } })
const emit = defineEmits(['closePopup'])

// Function to print the content
</script>
<style scoped>
.overlay {
  display: flex;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  z-index: 1100;
  background-color: rgba(0, 0, 0, 0.552);
  padding: 20px;
}

.popup-content {
  background-color: white;
  border-radius: 8px;
  height: 100%;
  width: 1000px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background-color: #efefef;
  position: relative;
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
}

.scrollable-content {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 0 20px;
  height: 100%;

  position: relative;
}

.background-image {
  width: 100%;
  height: auto;
}

.text-overlay {
  top: 82px;
  left: 450px;
  position: absolute;
  font-size: 12px;
  color: #707070;
}

.close-button {
  font-size: 30px;
}

.text-overlay {
  position: absolute;
}
</style>
