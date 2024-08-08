<template>
  <div class="sign_seal_container">
    <p class="sign_title">{{ props.title }}</p>
    <div class="group">
      <div class="group_title">서명</div>
      <div class="image_container sign">
        <span v-if="!signData" class="edit_icon material-symbols-outlined" @click="showPopup('sign')">
          stylus_note
        </span>
        <span v-else class="delete_icon material-symbols-outlined" @click="deletePad('sign')"> delete </span>
        <img v-if="signData" class="data_image" :src="signData" alt="서명 오류" @error="signData = null" />
      </div>
    </div>
    <div class="group">
      <div class="group_title">사인</div>
      <div class="image_container seal">
        <span v-if="!sealData" class="edit_icon material-symbols-outlined" @click="showPopup('seal')">
          stylus_note
        </span>
        <span v-else class="delete_icon material-symbols-outlined" @click="deletePad('seal')"> delete </span>

        <img v-if="sealData" class="data_image" :src="sealData" alt="서명 오류" @error="sealData = null" />
      </div>
    </div>

    <GlobalPopupWithOverlay ref="popupRef">
      <SignPadPopupContent @closePopup="closePopup" @savePad="savePadData" :popupFor="popupFor" />
    </GlobalPopupWithOverlay>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GlobalPopupWithOverlay from './GlobalPopupWithOverlay.vue'
import SignPadPopupContent from './SignPadPopupContent.vue'

const popupRef = ref(null)

const signData = ref()
const sealData = ref()

var popupFor = null
const showPopup = (pfor) => {
  popupFor = pfor
  console.log('show popup clicked')
  popupRef.value.showPopup()
}

const closePopup = () => {
  console.log('close popup clicked')
  popupRef.value.closePopup()
}

const props = defineProps({
  errorMessage: { type: String, default: null },
  title: { type: String, default: 'Sign title' },
  type: { type: String, default: 'self' },
  overlayText: { type: String, default: '' },
})

const emits = defineEmits(['updateSignSeal'])

function savePadData(data) {
  if (popupFor === 'sign') signData.value = data
  else sealData.value = data
  emits('updateSignSeal', signData.value, sealData.value)
}

function deletePad(pfor) {
  console.log(pfor)
  if (pfor === 'sign') signData.value = null
  else sealData.value = null
  emits('updateSignSeal', signData.value, sealData.value)
}
</script>

<style scoped>
.sign_title {
  width: 100%;
  padding: 0;
  margin: 0;
  margin-bottom: 5px;
  line-height: 1;
  font-weight: 600;
}

.sign_seal_container {
  display: flex;
  flex-flow: wrap;
  gap: 10px;
}

.group_title {
  font-size: 13px;
  margin-bottom: 2px;
}

.image_container {
  border-radius: 5px;
  border: 1px dashed var(--main-color);
  box-sizing: border-box;
  height: 100px;
  background-color: #ffffff;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image_container.no_data {
  border-color: #ff3535;
}

.image_container.sign {
  width: 300px;
}
.image_container.seal {
  width: 200px;
}

.delete_icon {
  position: absolute;
  top: 5px;
  right: 5px;
  color: #ff3535 !important;
  cursor: pointer !important;
  background-color: #e4e4e4;
  padding: 2px;
  border-radius: 20px;
  font-size: 22px;
}

.edit_icon {
  color: var(--main-color);
  cursor: pointer;
  font-size: 24px;
  padding: 10px;
  border-radius: 50px;
}

.data_image {
  height: 100%;
  width: 100%;
  /* object-fit: contain; */
}
</style>
