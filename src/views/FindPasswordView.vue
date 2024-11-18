<template>
  <div class="password_find_main_container">
    <div class="content_container_box">
      <div></div>

      <template v-if="verificationSuccessful">
        <template v-if="passwordChangeSuccess">
          <span class="material-symbols-outlined center_large_icon"> check_circle </span>
          <span style="text-align: center">비밀번호 재설정이 완료되었습니다.</span>
          <button @click="router.replace('/login')" style="width: 120px; align-self: center">확인</button>
        </template>

        <template v-else>
          <div style="display: flex; flex-flow: column; gap: 10px; align-items: center; color: #555555">
            <span style="font-size: 18px; font-weight: 600">비밀번호 재설정</span>
            <span style="font-size: 15px">새롭게 사용할 비밀번호를 입력해주세요.</span>
          </div>

          <div class="group">
            <label>비밀번호</label>
            <input type="password" v-model="password" />
            <p v-if="submitted && validatePass(password) !== null" class="input-error-message">
              {{ validatePass(password) }}
            </p>
          </div>

          <div class="group">
            <label>비밀번호 확인</label>
            <input type="password" v-model="passwordRentry" />
            <p v-if="submitted && validateRentryPass(password, passwordRentry) !== null" class="input-error-message">
              {{ validateRentryPass(password, passwordRentry) }}
            </p>
          </div>
          <div></div>
          <button @click="updatePassword">비밀번호 재설정 완료</button>
        </template>
      </template>

      <template v-else>
        <h3 style="padding: 0; margin: 0; align-self: center">비밀번호 찾기</h3>

        <p class="note_text">
          회원정보에 등록한 휴대전화 번호와 입력한 휴대전화번호가 같아야, 인증번호를 받을 수 있습니다.
        </p>

        <div class="group">
          <label>아이디</label>
          <input type="text" v-model="partnerId" />
          <p v-if="submitted && !partnerId" class="input-error-message">아이디를 입력하세요</p>
        </div>

        <div class="group">
          <label>휴대전화</label>
          <div class="phone_number_ver_group" style="display: flex; gap: 10px">
            <CleaveInput
              style="flex: 4"
              placeholder="010-1234-5678"
              :options="cleavePatterns.phoneNumberPattern"
              @maskedValue="phoneNumber = $event"
            />
            <button @click="getSmsCode()" style="flex: 2">인증번호 받기</button>
          </div>
          <p v-if="submitted && validatePhoneNumber(phoneNumber) !== null" class="input-error-message">
            {{ validatePhoneNumber(phoneNumber) }}
          </p>
        </div>

        <div v-if="smsCodeSent" class="group">
          <label>인증번호 (6자리)</label>
          <input
            type="text"
            v-model="confirmationCode"
            maxlength="6"
            @input="(event) => (confirmationCode = event.target.value.replace(/[^0-9]/g, ''))"
          />
          <p v-if="submitted && !confirmationCode" class="input-error-message">인증번호를 입력하세요</p>
        </div>

        <div></div>
        <button v-if="smsCodeSent" @click="verifySmsCode" class="find_pass_button">본인인증</button>
        <div></div>
      </template>

      <div></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as cleavePatterns from '../utils/cleavePatterns'
import { validatePhoneNumber, validatePass, validateRentryPass } from '@/utils/validators'
import { useSnackbarStore } from '@/stores/snackbar'
import { useRouter } from 'vue-router'
const router = useRouter()

const smsCodeSent = ref(false)
const verificationSuccessful = ref(false)

const submitted = ref(false)
const phoneNumber = ref()
const partnerId = ref()
const confirmationCode = ref()
const password = ref()
const passwordRentry = ref()
const passwordChangeSuccess = ref(false)

// STEP 1 get sms code
async function getSmsCode() {
  submitted.value = true

  console.log('clicked')

  if (!partnerId.value || validatePhoneNumber(phoneNumber.value) !== null) return

  try {
    const response = await fetch(import.meta.env.VITE_API_BASE_URL + 'auth/reqCertNo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: partnerId.value, // 아이디
        phone_number: phoneNumber.value.replaceAll('-', ''), //휴대폰 번호
        agent_cd: hostnameCode.value,
      }),
    })
    const decodedResponse = await response.json()
    console.log(decodedResponse)

    if (decodedResponse.result === 'SUCCESS') {
      smsCodeSent.value = true
    } else {
      throw decodedResponse.message ?? '잘못된 정보입니다'
    }
  } catch (err) {
    useSnackbarStore().show(err.toString())
  }
}

const receiptId = ref()
// STEP 2 verify sms code
async function verifySmsCode() {
  submitted.value = true

  if (!partnerId.value || validatePhoneNumber(phoneNumber.value) !== null || confirmationCode.value.length < 6) return

  try {
    const response = await fetch(import.meta.env.VITE_API_BASE_URL + 'auth/chkCertNo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: partnerId.value, // 아이디
        phone_number: phoneNumber.value.replaceAll('-', ''), //휴대폰 번호
        cert_no: confirmationCode.value,
      }),
    })
    const decodedResponse = await response.json()
    console.log(decodedResponse)

    if (decodedResponse.result === 'SUCCESS') {
      receiptId.value = decodedResponse.receipt_id
      verificationSuccessful.value = true
    } else {
      throw decodedResponse.message ?? '잘못된 정보입니다'
    }
  } catch (err) {
    useSnackbarStore().show(err.toString())
  }
}
async function updatePassword() {
  submitted.value = true

  if (
    !receiptId.value ||
    validatePass(password.value) !== null ||
    validateRentryPass(password.value, passwordRentry.value) !== null
  ) {
    return
  }

  try {
    const response = await fetch(import.meta.env.VITE_API_BASE_URL + 'auth/initPw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: partnerId.value, // 아이디
        phone_number: phoneNumber.value.replaceAll('-', ''), //휴대폰 번호
        password: password.value,
        receipt_id: receiptId.value,
      }),
    })
    const decodedResponse = await response.json()
    console.log(decodedResponse)

    if (decodedResponse.result === 'SUCCESS') {
      passwordChangeSuccess.value = true
    } else {
      throw decodedResponse.message ?? '잘못된 정보입니다'
    }
  } catch (err) {
    useSnackbarStore().show(err.toString())
  }
}

const hostnameCode = ref('')
onMounted(() => {
  hostnameCode.value = window.location.hostname.includes('sjnetwork') ? 'SJ' : ''
})
</script>

<style scoped>
.password_find_main_container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.content_container_box {
  display: flex;
  flex-flow: column;
  gap: 20px;
  background-color: #ffffff;
  padding: 0 30px;
  box-sizing: border-box;
  border-radius: 10px;
  width: 420px;
  box-shadow: 0 0 5px #00000013;
}

.note_text {
  padding: 0;
  margin: 0;
  font-size: 14px;
  color: #6d6d6d;
  text-align: center;
}

.center_large_icon {
  font-variation-settings:
    'FILL' 1,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
  color: rgb(0, 198, 0);
  font-size: 45px;
  text-align: center;
}
.result_text {
  text-align: center;
  padding: 0;
  margin: 0;
}

.result_warning_note {
  background-color: rgba(255, 0, 0, 0.178);
  border-radius: 6px;
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  padding: 20px 5px;
}

@media (max-width: 600px) {
  .password_find_main_container {
    background-color: #fff;
  }
  .content_container_box {
    background-color: #fff;
    box-shadow: none;
    width: 100%;
  }
}
</style>
