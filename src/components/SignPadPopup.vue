<template>
  <div class="overlay">
    <div class="popup-content">
      <span @click="$emit('closePopup')" class="material-symbols-outlined close-button"> cancel </span>
      <div class="group">
        <p class="title">고객님 서명(Name)란</p>
        <div class="canvas-container">
          <div class="overlay-text" :style="nameStyle">{{ overlayText }}</div>
          <!-- <div class="overlay-text">SOBIRJONOV JASURBEK ARISLONBEK UGLI</div> -->
          <canvas class="nameCanvas" ref="nameCanvas" @mousedown="onBeginName" @mouseup="onEndName"></canvas>
        </div>
      </div>

      <div class="group">
        <p class="title">고객님 사인(Sign)란</p>
        <canvas class="signCanvas" ref="signCanvas" @mousedown="onBeginSign" @mouseup="onEndSign"></canvas>
      </div>

      <div class="pen-style">
        <span class="title">펜 잉크 멀미: {{ signPenSickness }} </span>
        <a-slider v-model:value="signPenSickness" :min="0.5" :max="5" :step="0.25" />
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
import { ref, onMounted, onUnmounted, watch } from 'vue'

const emit = defineEmits(['savePads', 'closePopup'])
const props = defineProps(['type', 'userName'])

//pen sickness
const signPenSickness = ref(2)
watch(signPenSickness, (newValue) => {
  // destroys old instances (if they exist)
  if (namePad.value) {
    namePad.value.off() // Detach event handlers
    namePad.value = null
  }
  if (signPad.value) {
    signPad.value.off()
    signPad.value = null
  }

  // rinitializes with the new pen sickness
  initializeName()
  initializeSign()
})

//PLACEHOLDER NAME
const nameStyle = ref()
const overlayText = ref('홍길동')
// overlayText.value = 'SOBIRJONOV JASURBEK'
// overlayText.value = 'SOBIRJONOV JASURBEK ARISLONBEK UGLI'

console.log(overlayText.value.length)

const nameCanvas = ref('')
const namePad = ref(null)

const signCanvas = ref(null)
const signPad = ref(null)

const length = overlayText.value.length

const setNameStyle = () => {
  const screenWidth = window.innerWidth

  //mobile
  if (screenWidth <= 768) {
    nameStyle.value = {
      fontSize: '5vw',
      letterSpacing: '2px',
    }

    if (length <= 4) {
      nameStyle.value = {
        fontSize: '20vw',
        letterSpacing: '12px',
      }
    }

    if (length > 4 && length < 20) {
      nameStyle.value = {
        fontSize: '11vw',
        letterSpacing: '5px',
      }
    }
    if (length >= 20 && length < 40) {
      nameStyle.value = {
        fontSize: '8vw',
        letterSpacing: '3px',
      }
    }
  }

  //desktop
  if (screenWidth > 768) {
    nameStyle.value = {
      fontSize: '40px',
      letterSpacing: '10px',
    }

    if (length <= 4) {
      nameStyle.value = {
        fontSize: '130px',
        letterSpacing: '10px',
      }
    }

    if (length > 4 && length < 20) {
      nameStyle.value = {
        fontSize: '80px',
        letterSpacing: '5px',
      }
    }
    if (length >= 20 && length < 40) {
      nameStyle.value = {
        fontSize: '60px',
        letterSpacing: '5px',
      }
    }
  }

  initializeName()
  initializeSign()
}

onMounted(() => {
  document.addEventListener('keydown', keydownHandle)
  window.addEventListener('resize', setNameStyle)

  setNameStyle()
})

onUnmounted(() => {
  document.removeEventListener('keydown', keydownHandle)
  window.removeEventListener('resize', setNameStyle)
})

function keydownHandle(event) {
  if (event.key === 'Escape') {
    emit('closePopup')
  }
}

const initializeName = () => {
  const canvas = nameCanvas.value
  const ratio = Math.max(window.devicePixelRatio || 1, 1)
  canvas.width = canvas.offsetWidth * ratio
  canvas.height = canvas.offsetHeight * ratio
  canvas.getContext('2d').scale(ratio, ratio)

  namePad.value = new SignaturePad(nameCanvas.value, {
    velocityFilterWeight: 0.1, // Adjust the velocity filter weight
    minWidth: signPenSickness.value, // Set the minimum width of the stroke
    maxWidth: signPenSickness.value, // Set the maximum width of the stroke
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
    minWidth: signPenSickness.value, // Set the minimum width of the stroke
    maxWidth: signPenSickness.value, // Set the maximum width of the stroke
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
  max-width: 800px;
  overflow: auto;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  flex-flow: column;
  gap: 20px;
  position: relative;
  height: 100%;
  max-height: 800px;
  overflow: auto;
}

.pen-style {
  margin-top: 10px;
}

.canvas-container {
  position: relative;
  width: 100%;
}

.overlay-text {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #000000; /* Set the desired text color */
  font-weight: 900;
  padding: 0 10px;
  pointer-events: none; /* Makes the text non-interactive */
  white-space: normal; /* Allow text to wrap */
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
  /* text-align: center; */
}

canvas {
  width: 100%;
  height: 250px;
  border-radius: 3px;
  background-color: #f1f1f1ee;
  position: relative; /* Add this line */
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #333;
  font-size: 30px;
  cursor: pointer;
}

.signCanvas {
  width: 60%;
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

@media (max-width: 768px) {
  .signCanvas {
    width: 100%;
  }
}
</style>
