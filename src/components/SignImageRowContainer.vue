<template>
  <div class="sign-seal-container">
    <div style="margin-bottom: 5px">{{ title }}</div>
    <div class="containers-wrapper">
      <!-- Signature Container -->
      <div class="image-container" style="width: 200px">
        <template v-if="!signatureImage">
          <a-button class="draw-button" @click="openModal('sign')" type="text" shape="circle" size="middle">
            <span style="text-align: center" class="material-symbols-outlined">stylus_note</span>
          </a-button>
        </template>
        <template v-else>
          <img class="signature-image" :src="signatureImage" @error="handleImageError('sign')" />
          <a-button class="clear-button" type="text" shape="circle" size="small" danger @click="clearImage('sign')">
            <span style="font-size: 20px; text-align: center" class="material-symbols-outlined">delete</span>
          </a-button>
        </template>
      </div>

      <!-- Seal Container -->
      <div class="image-container" style="width: 100px">
        <template v-if="!sealImage">
          <a-button class="draw-button" @click="openModal('seal')" type="text" shape="circle" size="middle">
            <span class="material-symbols-outlined">stylus_note</span>
          </a-button>
        </template>
        <template v-else>
          <img class="seal-image" :src="sealImage" @error="handleImageError('seal')" />
          <a-button class="clear-button" type="text" shape="circle" size="small" danger @click="clearImage('seal')">
            <span style="font-size: 20px; text-align: center" class="material-symbols-outlined">delete</span>
          </a-button>
        </template>
      </div>
    </div>
    <div v-if="errorMessage" class="input-error-message">{{ errorMessage }}</div>
  </div>

  <!-- Drawing Modal -->
  <a-modal
    v-model:open="isModalOpen"
    :title="title"
    destroy-on-close
    width="100%"
    :bodyStyle="{ padding: '20px', margin: 0 }"
    wrap-class-name="full-modal"
    :footer="null"
    @after-close="handleModalClose"
  >
    <div class="signpad-content">
      <div style="display: flex; gap: 20px">
        <a-button style="min-width: 80px" @click="clearCanvas" danger type="primary">지우기</a-button>
        <a-button style="min-width: 80px" @click="saveDrawing" type="primary">저장</a-button>
      </div>

      <div style="display: flex; gap: 10px; align-items: center">
        <span style="font-size: 14" class="pen-label">펜 잉크 멀미: {{ penWidth }}</span>
        <a-slider style="width: 150px" v-model:value="penWidth" :min="2" :max="8" :step="1" />
      </div>

      <span style="margin: 5px 0; line-height: 0; color: orange; font-size: 15px">{{
        modalType == 'sign' ? props.signComment : props.sealComment
      }}</span>

      <div class="canvas_container">
        <canvas
          :style="{ width: '100%', maxWidth: modalType === 'seal' ? '400px' : '700px' }"
          ref="drawingCanvas"
          class="signature-pad"
        ></canvas>
        <span class="placeholder_text">{{ modalType === 'sign' ? '서명' : '사인' }}</span>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, watch, onUnmounted, nextTick } from 'vue'
import SignaturePad from 'signature_pad'
import { message } from 'ant-design-vue'

const props = defineProps({
  overlayText: { type: String, default: '' },
  title: { type: String, default: 'Sign & Seal' },
  errorMessage: { type: String, default: null },
  signImageData: { type: String, default: null },
  sealImageData: { type: String, default: null },
  signComment: { type: String, default: '' },
  sealComment: { type: String, default: '' },
})

const emits = defineEmits(['updateSignSeal'])

// State
const isModalOpen = ref(false)
const modalType = ref(null)
const penWidth = ref(4)
const signatureImage = ref(props.initialSignature)
const sealImage = ref(props.initialSeal)
const drawingCanvas = ref(null)
let signaturePad = null

// Computed
// const modalTitle = computed(() => (modalType.value === 'sign' ? 'Draw Signature' : 'Draw Seal'))

// Methods
const openModal = (type) => {
  modalType.value = type
  isModalOpen.value = true
  nextTick(() => initializeCanvas())
}

const initializeCanvas = () => {
  if (!drawingCanvas.value) return

  const canvas = drawingCanvas.value
  const ratio = Math.max(window.devicePixelRatio || 1, 1)
  const context = canvas.getContext('2d')

  // Set canvas size
  canvas.width = canvas.offsetWidth * ratio
  canvas.height = canvas.offsetHeight * ratio
  context.scale(ratio, ratio)

  // Initialize SignaturePad
  signaturePad = new SignaturePad(canvas, {
    velocityFilterWeight: 0.1,
    minWidth: penWidth.value,
    maxWidth: penWidth.value,

    throttle: 1,
    minPointDistance: 1,
    penColor: 'black',
    backgroundColor: 'rgba(0,0,0,0)',
  })
}

const clearCanvas = () => {
  if (signaturePad) {
    signaturePad.clear()
  }
}

const saveDrawing = async () => {
  if (!signaturePad || signaturePad.isEmpty()) {
    message.error('비어 있을 수 없습니다')
    return
  }

  try {
    const imageData = await signaturePad.toDataURL()

    if (modalType.value === 'sign') {
      signatureImage.value = imageData
      // emit('update:sign', imageData)
    } else {
      sealImage.value = imageData
      // emit('update:seal', imageData)
    }

    emits('updateSignSeal', signatureImage.value, sealImage.value)

    isModalOpen.value = false
  } catch (error) {
    message.error('Failed to save drawing')
    console.error('Save drawing error:', error)
  }
}

const clearImage = (type) => {
  if (type === 'sign') {
    signatureImage.value = null
    // emit('update:sign', null)
  } else {
    sealImage.value = null
    // emit('update:seal', null)
  }
  emits('updateSignSeal', signatureImage.value, sealImage.value)
}

const handleImageError = (type) => {
  message.error(`Failed to load ${type} image`)
  clearImage(type)
}

const handleModalClose = () => {
  signaturePad = null
}

// Watch pen width changes
watch(penWidth, (newWidth) => {
  if (signaturePad) {
    signaturePad.minWidth = newWidth
    signaturePad.maxWidth = newWidth
  }
})

// Clean up on unmount
onUnmounted(() => {
  if (signaturePad) {
    signaturePad.off()
    signaturePad = null
  }
})
</script>

<style scoped>
.sign-seal-container {
  display: flex;
  flex-direction: column;
}

.containers-wrapper {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.image-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed var(--main-color);
  background-color: #ffffff;
  height: 70px;
  border-radius: 5px;
}

.signature-image,
.seal-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.draw-button {
  min-height: unset;
}

.clear-button {
  position: absolute;
  top: 5px;
  right: 5px;
  min-height: unset;
}

.error-message {
  color: #ff4d4f;
  margin-top: -5px;
}

/* Modal Styles */
.signpad-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  gap: 10px;
}

.canvas_container {
  display: flex;
  height: 200px;
  width: 100%;
  justify-content: center;
  position: relative;
  align-items: center;
  /* padding: 10px; */
  box-sizing: border-box;
}

.signature-pad {
  height: 200px;
  background-color: rgba(0, 0, 0, 0.07);
  border-radius: 6px;
  touch-action: none;
  position: absolute;
}

.placeholder_text {
  font-size: 50px;
  font-weight: 700;
  color: #00000020;
}
</style>
