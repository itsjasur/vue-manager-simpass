<template>
  <div class="overlay">
    <div class="popup-content">
      <div class="innerHeader">
        <h3 class="title">주소 검색</h3>

        <span @click="$emit('closePopup')" class="material-symbols-outlined close-button">
          cancel
        </span>
      </div>

      <div style="margin-top: 10px; width: 100%; height: 100%" ref="embed"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
const emit = defineEmits(['closePopup', 'selectAddress'])

const embed = ref(null)

//this handles keyboard actions
function keydownHandle(event) {
  if (event.key === 'Escape') {
    emit('selectAddress')
  }
}

onMounted(async () => {
  document.addEventListener('keydown', keydownHandle)

  new window.daum.Postcode({
    width: '100%', //width of the iframe
    height: '100%',
    oncomplete: (data) => {
      let selectedType = data.userSelectedType
      let roadAddr = data.roadAddress
      let jibunAddr = data.jibunAddress
      let buildingName = data.buildingName

      // console.log('jubunaddress' + jibunAddr)
      // console.log('roadaddress' + roadAddr)

      emit('selectAddress', selectedType === 'R' ? roadAddr : jibunAddr, buildingName)
      emit('closePopup')
    },
  }).embed(embed.value)
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
  width: 600px;
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
