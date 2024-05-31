<template>
  <div class="overlay">
    <div class="popup-content">
      <span @click="$emit('closePopup')" class="material-symbols-outlined close-button"> cancel </span>
      <div class="group">
        <p class="title">{{ title }}</p>
        <canvas ref="canvasRef" @mousedown="onBegin" @mouseup="onEnd"></canvas>
      </div>

      <div class="buttons">
        <button class="button clear" @click="clearCanvase">지우기</button>
        <button class="button save" @click="savePad">서명 저장</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import SignaturePad from 'signature_pad'
import { ref, onMounted } from 'vue'

const emit = defineEmits(['savePad', 'closePopup'])

// const props = defineProps({
//   type: {
//     type: String,
//     default: '',
//   },
// })

const props = defineProps(['type'])

const title = ref(props?.type === 'name' ? '고객님 서명(Name)란' : '고객님 사인(Sign)란')

const canvasRef = ref(null)
const padRef = ref(null)

onMounted(() => {
  const canvas = canvasRef.value
  const ratio = Math.max(window.devicePixelRatio || 1, 1)
  canvas.width = canvas.offsetWidth * ratio
  canvas.height = canvas.offsetHeight * ratio
  canvas.getContext('2d').scale(ratio, ratio)

  padRef.value = new SignaturePad(canvasRef.value, {
    velocityFilterWeight: 0.1, // Adjust the velocity filter weight
    minWidth: 1.5, // Set the minimum width of the stroke
    maxWidth: 1.5, // Set the maximum width of the stroke
    throttle: 1, // Throttle the stroke coordinate updates
    minPointDistance: 1, // Minimum distance to draw a new point
    dotSize: undefined, // Define the dot size
    penColor: 'black', // Set the pen color
    onBegin: onBegin, // Add event handlers
    onEnd: onEnd,
    backgroundColor: 'rgba(0,0,0,0)', // Set the background color (transparent)
  })
})

const onBegin = () => {
  padRef.value.onBegin()
}

const onEnd = () => {
  padRef.value.onEnd()
}

const clearCanvase = () => {
  padRef.value.clear()
}
const savePad = () => {
  if (padRef.value.isEmpty()) {
    console.log('Please provide a signature first.')
  } else {
    const data = padRef.value.toDataURL()
    emit('savePad', props.type, data)
    emit('closePopup')
    console.log('emitted')
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
  max-height: 560px;
  overflow: auto;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  color: #333;
  font-size: 30px;
  cursor: pointer;
}

canvas {
  width: 100%;
  height: 400px;
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
