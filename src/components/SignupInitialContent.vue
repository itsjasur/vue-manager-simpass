<template>
  <div class="content-container">
    <span class="title-note"
      >본 신청서는 심패스에서 직접 운영하는 판매점 전자계약서이며 고객님에 소중한 개인정보는 암호화되어 안전하게
      보호됩니다.
    </span>

    <div class="agree-checkbox">
      <a-checkbox class="checkbox" v-model:checked="agreeToTerms">개인정보 수집이용 동의 (필수)</a-checkbox>
      <span @click="agreementPopupIsOpen = true" class="agree-view">약관내용</span>
    </div>

    <div class="partition">
      <div class="partition-title">
        <span> 영업사원코드 입력</span>
        <a-checkbox v-model:checked="codeUnavailable" @change="codeUnavailable ? (employeeCode = '') : null"
          >코드없음</a-checkbox
        >
      </div>

      <div class="group">
        <label>영업사원코드</label>
        <input
          v-model="employeeCode"
          placeholder="AAA0000"
          @input="employeeCode = employeeCode.toUpperCase()"
          :disabled="codeUnavailable"
        />
        <p v-if="!codeUnavailable && isSubmitted && !employeeCode" class="input-error-message">
          영업사원에게서 전달받은 코드를 입력해주세요.
        </p>
        <p v-if="!codeUnavailable && isSubmitted && !employeeCode" class="input-error-message">
          없을 경우 코드없음을 체크해 주세요.
        </p>
      </div>
    </div>

    <div class="partition">
      <div class="partition-title">
        <span>영업사원코드 입력</span>
      </div>

      <div class="group">
        <label>이름</label>
        <input v-model="name" placeholder="홍길동" @input="name = name.toUpperCase()" />
        <p v-if="isSubmitted && !name" class="input-error-message">이름을 입력하세요.</p>
      </div>

      <div class="group">
        <label>본인명의 휴대폰번호</label>
        <input v-model="phoneNumber" placeholder="010-1234-5678" v-cleave="cleavePatterns.phoneNumberPattern()" />
        <p v-if="isSubmitted && !phoneNumber" class="input-error-message">휴대폰번호를 정확하게 입력하세요.</p>
      </div>

      <div class="group">
        <label>생년월일</label>
        <input v-model="birthday" placeholder="1981-01-31" v-cleave="cleavePatterns.birthdayPattern()" />
        <p v-if="isSubmitted && !birthday" class="input-error-message">올바른 날짜를 입력하십시오.</p>
      </div>
    </div>

    <a-radio-group v-model:value="confirmationType" class="radio-partition">
      <div class="radio-container">
        <img src="../assets/logos/kakao.png" alt="kakao" />
        <div>카카오 인증서</div>
        <a-radio value="KAKAO" class="radio"> </a-radio>
      </div>

      <div class="radio-container">
        <img src="../assets/logos/pass.png" alt="kakao" />
        <div>PASS 인증서</div>
        <a-radio value="PASS" class="radio"> </a-radio>
      </div>
    </a-radio-group>

    <div class="end-note">
      <span class="material-symbols-outlined"> verified_user </span>
      <span> 전자서명 인증을 위해서는 앱이 설치가 되어있어야 되며, 앱에서 인증서가 발급이 되어 있어야 됩니다. </span>
    </div>

    <button @click="submit" :disabled="isLoading">
      <span v-if="isLoading">
        <LoadingSpinner height="20px" color="#ffffff" />
      </span>
      <span v-else class="material-symbols-outlined"> verified_user </span> 전자서명
    </button>
  </div>

  <AgreementPopup v-if="agreementPopupIsOpen" @closePopup="agreementPopupIsOpen = false" />
  <WaitingConfirmationPopup @closePopup="waitingConfirmationPopupOpen = false" v-if="waitingConfirmationPopupOpen" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AgreementPopup from './AgreementPopup.vue'
import * as cleavePatterns from '../utils/cleavePatterns'
import LoadingSpinner from './Loader.vue'
import { useSnackbarStore } from '../stores/snackbar'
import WaitingConfirmationPopup from './WaitingConfirmationPopup.vue'

const agreeToTerms = ref(false)
const employeeCode = ref('')
const codeUnavailable = ref(false)
const agreementPopupIsOpen = ref(false)
const name = ref('SOBIRJONOV JASURBEK ARISLONBEK UGLI')
const phoneNumber = ref('01058189352')
const birthday = ref('19950818')
const confirmationType = ref('PASS')

const isLoading = ref(false)
const isSubmitted = ref(false)

const waitingConfirmationPopupOpen = ref(false)

async function submit(event) {
  isLoading.value = true
  isSubmitted.value = true

  const isAllTruthy = [
    name.value,
    phoneNumber.value,
    birthday.value,
    codeUnavailable.value ? true : employeeCode.value,
  ].every(Boolean)

  if (!isAllTruthy) {
    useSnackbarStore().showSnackbar('채워지지 않은 필드가 있습니다.')
    isLoading.value = false
    return
  }

  try {
    const response = await fetch(import.meta.env.VITE_API_BASE_URL + 'auth/requestSign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value,
        birthday: birthday.value.replace(/-/g, ''),
        cert_phone_number: phoneNumber.value.replace(/-/g, ''),
        id_cert_type: confirmationType.value,
      }),
    })

    const data = await response.json()
    if (data.result === 'ERROR') throw data.message

    waitingConfirmationPopupOpen.value = true

    console.log(data)
  } catch (err) {
    useSnackbarStore().showSnackbar(err.toString())
  }

  isLoading.value = false
}
</script>

<style scoped>
.content-container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 5px #00000013;
  width: 500px;
  padding: 30px;
  margin: 20px;
  min-height: 600px;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  gap: 30px;
  text-align: center;
}

.title-note {
  font-size: 15px;
  color: #6e7881;
  line-height: 1.5;
  /* font-weight: 500; */
}

.checkbox {
  font-size: 16px;
  font-weight: 600;
}

.agree-view {
  color: #0365e6;
  text-decoration: underline;
  cursor: pointer;
}

.partition {
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  font-size: 18px;
  font-weight: 500;
  width: 100%;
  gap: 10px;
}

.partition-title {
  display: flex;
  flex-flow: wrap;
  gap: 20px;
}

.group {
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  margin-top: 10px;
  width: 100%;
}

.radio-partition {
  display: flex;
  flex-flow: wrap;
  gap: 50px;
  justify-content: center;
}

.radio {
  padding: 0;
  margin: 0;
}

.radio-container {
  display: flex;
  flex-flow: column;
  align-items: center;
  gap: 5px;
  font-size: 15px;
  font-weight: 600;
}

.radio-container img {
  height: 45px;
  border-radius: 20px;
}

.end-note {
  font-size: 14px;
  color: #6e7881;
  line-height: 1.5;
  display: flex;
  flex-flow: row;
  align-items: flex-start;
  gap: 5px;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 1;
  color: #30d93c;
}

button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
button .material-symbols-outlined {
  color: #fff;
  font-size: 22px;
}

@media (max-width: 600px) {
  .content-container {
    width: 100%;
    box-shadow: none;
  }
}
</style>
