<template>
  <div class="overlay">
    <div class="popup-content">
      <div class="innerHeader">
        <h3 class="title">계약서 내용</h3>
        <span @click="$emit('closePopup')" class="material-symbols-outlined close-button"> cancel </span>
      </div>

      <div class="scrollable-content">
        <template v-if="props.agentCd == 'SJ'">
          <img v-for="(image, index) in jImages" :key="index" class="background-image" :src="image" alt="" />
          <!-- <div class="sj-text-overlay">{{ props.partnerNm }}</div> -->
        </template>

        <!-- Simpass contract -->
        <template v-else>
          <img v-for="(image, index) in sImages" :key="index" class="background-image" :src="image" alt="" />
          <!-- <div class="ik-text-overlay">{{ props.partnerNm }}</div> -->
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import j1 from '../assets/contracts/j/j1.jpg'
import j2 from '../assets/contracts/j/j2.jpg'
import j3 from '../assets/contracts/j/j3.jpg'
import j4 from '../assets/contracts/j/j4.jpg'
import j5 from '../assets/contracts/j/j5.jpg'
import j6 from '../assets/contracts/j/j6.jpg'

import s1 from '../assets/contracts/s/s1.png'
import s2 from '../assets/contracts/s/s2.png'

const jImages = ref([j1, j2, j3, j4, j5, j6])
const sImages = ref([s1, s2, s3, s4, s5, s6])

const props = defineProps({ partnerNm: { type: String, required: true }, agentCd: { type: String, required: true } })
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
  height: 50px;
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
  /* padding: 0 20px; */
  height: 100%;

  position: relative;
}

.background-image {
  width: 100%;
  height: auto;
}

.sj-text-overlay {
  top: 81px;
  left: 420px;
  position: absolute;
  font-size: 12px;
  font-weight: 600;
  color: #474747;
}

.ik-text-overlay {
  /* top: 260px; */
  /* left: 440px; */

  top: 30%;
  left: 50%;
  position: absolute;
  font-size: 1em;
  font-weight: 700;
  color: #646464;
}

.close-button {
  font-size: 30px;
}

.text-overlay {
  position: absolute;
}
</style>
