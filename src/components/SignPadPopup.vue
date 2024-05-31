<template>
  <div class="overlay">
    <div class="popup-content">
      <span @click="$emit('closePopup')" class="material-symbols-outlined close-button"> cancel </span>
      <div class="group">
        <p class="title">고객님 서명(Name)란</p>
        <canvas ref="nameCanvas" @mousedown="onBeginName" @mouseup="onEndName"></canvas>
      </div>

      <div class="group">
        <p class="title">고객님 사인(Sign)란</p>
        <canvas ref="signCanvas" @mousedown="onBeginSign" @mouseup="onEndSign"></canvas>
      </div>

      <div class="buttons">
        <button class="button clear" @click="clearCanvases">지우기</button>
        <button class="button save" @click="savePads">서명 저장</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import SignaturePad from 'signature_pad'
import { ref, onMounted } from 'vue'

const emit = defineEmits(['savePads', 'closePopup'])
const props = defineProps(['type'])

const nameCanvas = ref(null)
const namePad = ref(null)

const signCanvas = ref(null)
console.log(props.type)
const signPad = ref(null)

onMounted(() => {
  initializeName()
  initializeSign()
})

const initializeName = () => {
  const canvas = nameCanvas.value
  const ratio = Math.max(window.devicePixelRatio || 1, 1)
  canvas.width = canvas.offsetWidth * ratio
  canvas.height = canvas.offsetHeight * ratio
  canvas.getContext('2d').scale(ratio, ratio)

  namePad.value = new SignaturePad(nameCanvas.value, {
    velocityFilterWeight: 0.1, // Adjust the velocity filter weight
    minWidth: 1.5, // Set the minimum width of the stroke
    maxWidth: 1.5, // Set the maximum width of the stroke
    throttle: 1, // Throttle the stroke coordinate updates
    minPointDistance: 1, // Minimum distance to draw a new point
    dotSize: undefined, // Define the dot size
    penColor: 'black', // Set the pen color
    onBegin: onBeginName, // Add event handlers
    onEnd: onEndName,
    backgroundColor: 'rgba(0,0,0,0)', // Set the background color (transparent)
  })
}

const initializeSign = () => {
  const canvas = signCanvas.value
  const ratio = Math.max(window.devicePixelRatio || 1, 1)
  canvas.width = canvas.offsetWidth * ratio
  canvas.height = canvas.offsetHeight * ratio
  canvas.getContext('2d').scale(ratio, ratio)

  signPad.value = new SignaturePad(signCanvas.value, {
    velocityFilterWeight: 0.1, // Adjust the velocity filter weight
    minWidth: 1.5, // Set the minimum width of the stroke
    maxWidth: 1.5, // Set the maximum width of the stroke
    throttle: 1, // Throttle the stroke coordinate updates
    minPointDistance: 1, // Minimum distance to draw a new point
    dotSize: undefined, // Define the dot size
    penColor: 'black', // Set the pen color
    onBegin: onBeginSign, // Add event handlers
    onEnd: onEndSign,
    backgroundColor: 'rgba(0,0,0,0)', // Set the background color (transparent)
  })
}

const onBeginName = () => {
  namePad.value.on()
}

const onEndName = () => {
  namePad.value.off()
}

const onBeginSign = () => {
  signPad.value.on()
}

const onEndSign = () => {
  signPad.value.off()
}

const clearCanvases = () => {
  signPad.value.clear()
  namePad.value.clear()
}
const savePads = () => {
  if (signPad.value.isEmpty() || namePad.value.isEmpty()) {
    console.log('Please provide a signature first.')
  } else {
    const nameData = namePad.value.toDataURL()
    const signData = signPad.value.toDataURL()
    console.log(props.type)
    emit('savePads', props.type, nameData, signData)
    emit('closePopup')
  }
}
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
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  z-index: 1100;
  background-color: rgba(0, 0, 0, 0.552);
  padding: 20px;
  overflow-y: scroll;
}

.popup-content {
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  overflow: auto;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  flex-flow: column;
  gap: 20px;
  position: relative;
  height: 100%;
  max-height: 750px;
  overflow: auto;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #333;
  font-size: 30px;
  cursor: pointer;
}

canvas {
  width: 100%;
  height: 250px;
  border-radius: 3px;
  background-color: #f1f1f1;
}

.title {
  font-weight: 600;
  line-height: 1;
  margin-bottom: 10px;
}

.buttons {
  display: flex;
  flex-flow: wrap;
  gap: 20px;
  justify-content: end;
}

.button {
  min-width: 100px;
  height: 45px;
}

.clear {
  background-color: #8d8d8d;
}
.save {
  background-color: var(--main-color);
}
</style>
