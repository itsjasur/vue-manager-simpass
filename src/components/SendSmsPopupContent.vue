<template>
  <div class="overlay">
    <div v-if="!smsSent" class="popup-content">
      <div class="title">{{ props.phoneNumber }} 휴대폰번호로 모바일 서명/사인 URL 문자전송</div>
      <div class="text">
        PC에서는 서명/사인이 불가합니다. 해당 URL을 통해 모바일 또는 테블릿에서 서명/사인 부탁드립니다.
      </div>

      <div class="buttons">
        <button @click="$emit('closePopup')" class="cancel">취소</button>
        <button @click="sendSMS">SMS 보내기</button>
      </div>
    </div>

    <div v-if="smsSent" class="popup-content">
      <div class="title">문자메시지를 확인하시고 서명을 완료해주세요.</div>

      <div class="buttons">
        <button @click="$emit('closePopup')" class="cancel">취소</button>
        <button @click="checkSignSeal">서명완료</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSnackbarStore } from '@/stores/snackbar'
import { ref } from 'vue'

const smsSent = ref(false)

const props = defineProps({
  phoneNumber: { type: String, required: true },
  partnerCd: { type: String, required: true },
})

const uniqueKey = ref(null)

const emits = defineEmits(['closePopup'])

async function sendSMS() {
  try {
    const response = await fetch(import.meta.env.VITE_CHAT_SERVER_URL + 'send-single-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        receiver_phone_number: props.phoneNumber,
        // receiver_phone_number: '01058189352',
        message: '아래URL에 접속하셔서, 판매점거래계약 서명부탁드립니다.',
        title: '판매점서명',
        partner_code: props.partnerCd,
        base_url: window.location.host + '/sign-seal-submit/',
      }),
    })

    if (!response.ok) throw 'SMS 전송 중 오류 발생'
    const data = await response.json()
    if (data.success) uniqueKey.value = data.key
    useSnackbarStore().show('메시지가 전송되었습니다. 문자 메시지를 확인해 주세요.')
    smsSent.value = true
  } catch (err) {
    useSnackbarStore().show(err.toString())
  }
}

async function checkSignSeal() {
  try {
    const response = await fetch(import.meta.env.VITE_CHAT_SERVER_URL + 'check-sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: uniqueKey.value }),
    })

    if (!response.ok) throw '서명이 완료되지 않았습니다'

    const data = await response.json()
    if (data.success) {
      emits('closePopup', data?.sign_data, data.seal_data)
    } else {
      useSnackbarStore().show('서명이 완료되지 않았습니다')
    }
  } catch (err) {
    useSnackbarStore().show(err.toString())
  }
}
</script>

<style scoped>
.overlay {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background-color: white;
  border-radius: 8px;
  box-sizing: border-box;
  max-width: 450px;
  width: 90%;
  min-height: 200px;
  display: flex;
  flex-flow: column;
  gap: 5px;

  align-items: center;
  justify-content: center;
  overflow-y: auto;
  position: relative;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
}

.close-button {
  position: absolute;
  top: 0;
  right: 0;
  align-self: flex-end;
  color: #333;
  font-size: 30px;
  cursor: pointer;
  padding: 5px;
  border-radius: 30px;
  background-color: #ffffff71;
}

.title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}

.text {
  font-size: 15px;
  color: #3cc207;
  line-height: 1.5;
  white-space: pre-line;
}

.buttons {
  display: flex;
  flex-flow: row;
  gap: 20px;
}

button {
  margin-top: 20px;
  min-width: 110px;
}

button.cancel {
  background-color: #818181;
}
</style>
