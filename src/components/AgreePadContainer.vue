<template>
  <div class="sign_seal_container">
    <div style="margin-bottom: 5px">{{ props.title }}</div>

    <div class="image_container">
      <a-button
        v-if="!padImage"
        style="min-height: unset"
        @click="isModalOpen = true"
        type="text"
        shape="circle"
        size="middle"
      >
        <span style="text-align: center" class="material-symbols-outlined"> stylus_note </span>
      </a-button>
      <a-button
        v-else
        style="position: absolute; min-height: unset; top: 5px; right: 5px"
        type="text"
        shape="circle"
        size="small"
        danger
        @click="deleteImages"
      >
        <span style="font-size: 20px; text-align: center" class="material-symbols-outlined"> delete </span>
      </a-button>

      <template v-if="padImage">
        <img height="100%" width="100%" :src="padImage" @error="padImage = null" />
      </template>
    </div>

    <div v-if="errorMessage" class="input-error-message">{{ errorMessage }}</div>
  </div>
  <a-modal
    destroy-on-close
    v-model:open="isModalOpen"
    :title="null"
    width="100%"
    wrap-class-name="full-modal"
    :footer="null"
  >
    <div class="signpad_main_content">
      <div style="display: flex; gap: 20px; margin-bottom: 15px">
        <a-button style="min-width: 80px" @click="clear" danger type="primary">지우기</a-button>
        <a-button style="min-width: 80px" @click="save" type="primary">저장</a-button>
      </div>

      <div class="pen_style">
        <span style="font-size: 13px; width: auto">펜 잉크 멀미: {{ signPenSickness }} </span>
        <a-slider v-model:value="signPenSickness" :min="4" :max="10" :step="1" />
      </div>

      <div class="canvas_wrapper">
        <img src="../assets/umobile_agree_seal.png" @load="initializeTerm1" width="100%" />
        <canvas ref="signatureCanvas1" class="signature_pad"></canvas>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import SignaturePad from 'signature_pad'
import { message } from 'ant-design-vue'

const props = defineProps({
  errorMessage: { type: String, default: null },
  title: { type: String, default: 'Sign title' },
  imageData: { type: String, default: null },
})

const emits = defineEmits(['updateAgreePadData'])

const isModalOpen = ref(false)
const signPenSickness = ref(6)
const padImage = ref(props.imageData)

const signatureCanvas1 = ref(null)

let padData = null

watch(signPenSickness, (newValue) => {
  if (padData) {
    padData.minWidth = newValue
    padData.maxWidth = newValue
  }
})
const initializeTerm1 = () => {
  const canvas = signatureCanvas1.value
  const ratio = Math.max(window.devicePixelRatio || 1, 1)
  canvas.width = canvas.offsetWidth * ratio
  canvas.height = canvas.offsetHeight * ratio
  canvas.getContext('2d').scale(ratio, ratio)

  padData = new SignaturePad(canvas, {
    velocityFilterWeight: 0.1,
    minWidth: signPenSickness.value,
    maxWidth: signPenSickness.value,
    throttle: 1,
    minPointDistance: 1,
    dotSize: undefined,
    penColor: 'black',
    backgroundColor: 'rgba(0,0,0,0)',
  })
}

const clear = () => {
  if (padData) padData.clear()
}

const save = async () => {
  if (padData.isEmpty()) {
    message.error('비어있습니다')
  } else {
    padImage.value = await padData.toDataURL()

    emits('updateAgreePadData', padImage.value)
    isModalOpen.value = false
  }
}

function deleteImages() {
  padImage.value = null
  emits('updateAgreePadData', padImage.value)
}
</script>

<style scoped>
.sign_seal_container {
  display: flex;
  flex-flow: column;
  /* gap: 10px; */
}

.image_container {
  display: flex;
  border-radius: 5px;
  border: 1px dashed var(--main-color);
  box-sizing: border-box;
  height: 70px;
  width: 250px;
  background-color: #ffffff;
  position: relative;
  justify-content: center;
  align-items: center;
}

/* POPUP MODEL */
.signpad_main_content {
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
}

.signpad_main_content .buttons {
  display: flex;
  flex-flow: row;
  gap: 20px;
  margin-bottom: 15px;
}

.pen_style {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.ant-slider {
  width: 200px;
  margin: 0;
}
.canvas_wrapper {
  display: flex;
  justify-content: center;
  position: relative;
  align-items: center;
  user-select: none;
  width: 90%;
  max-width: 1000px;
}

.signature_pad {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #00000012;
  border-radius: 6px;
}
</style>
