<template>
  <div class="content-container">
    <!-- <span class="title-note"
      >본 신청서는 심패스에서 직접 운영하는 판매점 전자계약서이며 고객님에 소중한 개인정보는 암호화되어 안전하게
      보호됩니다.
    </span> -->

    <div class="title-note">판매점 회원 가입</div>

    <div class="agree-checkbox">
      <a-checkbox class="checkbox" v-model:checked="useTermsCheck">이용약관 (필수)</a-checkbox>
      <span @click="showPopupAgreement('useterms')" class="agree-view">전문보기</span>
    </div>

    <div class="agree-checkbox">
      <a-checkbox class="checkbox" v-model:checked="privacyCheck">개인정보보호정책 (필수)</a-checkbox>
      <span @click="showPopupAgreement('privacy')" class="agree-view">전문보기</span>
    </div>

    <div class="partition">
      <div class="partition-title">
        <span> 영업사원코드 입력</span>
        <a-checkbox v-model:checked="codeUnavailable" @change="codeUnavailable ? (salesCd = '') : null"
          >코드없음</a-checkbox
        >
      </div>

      <div class="group">
        <label>영업사원코드</label>
        <input
          v-model="salesCd"
          placeholder="AAA0000"
          maxlength="10"
          @input="salesCd = salesCd.toUpperCase()"
          :disabled="codeUnavailable"
        />
        <p v-if="!codeUnavailable && isSubmitted && !salesCd" class="input-error-message">
          영업사원에게서 전달받은 코드를 입력해주세요.
        </p>
        <p v-if="!codeUnavailable && isSubmitted && !salesCd" class="input-error-message">
          없을 경우 코드없음을 체크해 주세요.
        </p>
      </div>
    </div>

    <div class="partition">
      <div class="partition-title">
        <span>본인인증</span>
      </div>

      <div class="group">
        <label>이름</label>
        <input v-model="name" placeholder="홍길동" @input="name = name.toUpperCase()" />
        <p v-if="isSubmitted && !name" class="input-error-message">이름을 입력하세요.</p>
      </div>

      <div class="group">
        <label>본인명의 휴대폰번호</label>
        <input
          placeholder="010-1234-5678"
          v-cleave="cleavePatterns.phoneNumberPattern"
          @cleave:input="(event) => (phoneNumber = event.detail.raw)"
        />
        <p v-if="isSubmitted && !phoneNumber" class="input-error-message">휴대폰번호를 정확하게 입력하세요.</p>
      </div>

      <div class="group">
        <label>생년월일</label>
        <input
          placeholder="1981-01-31"
          v-cleave="cleavePatterns.birthdayPatternFull"
          @cleave:input="(event) => (birthday = event.detail.raw)"
        />
        <p v-if="isSubmitted && !birthday" class="input-error-message">올바른 날짜를 입력하십시오.</p>
      </div>
    </div>

    <a-radio-group v-model:value="idCertType" class="radio-partition">
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
      <template v-if="isLoading">
        <LoadingSpinner height="20px" color="#ffffff" />
      </template>
      <template v-else>
        <span class="material-symbols-outlined"> verified_user </span>
        <span>전자서명</span>
      </template>
    </button>
  </div>

  <GlobalPopupWithOverlay ref="userTermsRef">
    <AgreementPopup @closePopup="closePopupAgreement" title="이용약관" type="useterms" />
  </GlobalPopupWithOverlay>
  <GlobalPopupWithOverlay ref="privacyRef">
    <AgreementPopup @closePopup="closePopupAgreement" title="개인정보보호정책" type="privacy" />
  </GlobalPopupWithOverlay>

  <GlobalPopupWithOverlay ref="popupRef">
    <WaitingConfirmationPopup
      @closePopup="closePopup"
      :data="{
        name: name,
        // birthday: removeDashes(birthday.replace(/-/g, '')),
        birthday: birthday,
        // phoneNumber: removeDashes(phoneNumber.replace(/-/g, '')),
        phoneNumber: phoneNumber,
        receiptId: receiptId,
        salesCd: salesCd,
        idCertType: idCertType,
      }"
    />
  </GlobalPopupWithOverlay>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AgreementPopup from './AgreementPopup.vue'
import * as cleavePatterns from '../utils/cleavePatterns'
import LoadingSpinner from '../components/Loader.vue'
import { useSnackbarStore } from '../stores/snackbar'
import WaitingConfirmationPopup from './WaitingConfirmationPopup.vue'
import { useSignUpstore } from '@/stores/signup-store'
import GlobalPopupWithOverlay from './GlobalPopupWithOverlay.vue'

const userTermsRef = ref(null)
const privacyRef = ref(null)

const showPopupAgreement = (whichOne) => {
  if (whichOne === 'useterms') userTermsRef.value.showPopup()
  if (whichOne === 'privacy') privacyRef.value.showPopup()
}

const closePopupAgreement = () => {
  userTermsRef.value.closePopup()
  privacyRef.value.closePopup()
}

const popupRef = ref(null)
const showPopup = () => {
  popupRef.value.showPopup()
}

const closePopup = () => {
  popupRef.value.closePopup()
}

const useTermsCheck = ref(false)
const privacyCheck = ref(false)

const salesCd = ref('') //sales_cd
const codeUnavailable = ref(true)
const name = ref('')
const phoneNumber = ref('')
const birthday = ref('')
const idCertType = ref('KAKAO')

const isLoading = ref(false)
const isSubmitted = ref(false)

const receiptId = ref() //response returns

//cleaning up store
onMounted(useSignUpstore().clear)

async function submit(event) {
  isSubmitted.value = true

  console.log(birthday.value, phoneNumber.value)

  if (!useTermsCheck.value) {
    useSnackbarStore().show('이용약관에 동의해주세요.')
    return
  }

  if (!privacyCheck.value) {
    useSnackbarStore().show('개인정보보호정책에 동의해주세요.')
    return
  }

  const isAllTruthy = [
    name.value,
    phoneNumber.value,
    birthday.value,
    codeUnavailable.value ? true : salesCd.value,
  ].every(Boolean)

  if (!isAllTruthy) {
    useSnackbarStore().show('채워지지 않은 필드가 있습니다.')
    isLoading.value = false
    return
  }

  try {
    isLoading.value = true

    const response = await fetch(import.meta.env.VITE_API_BASE_URL + 'auth/requestSign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value,
        // birthday: birthday.value.replace(/-/g, ''),
        birthday: birthday.value,
        // cert_phone_number: phoneNumber.value.replace(/-/g, ''),
        cert_phone_number: phoneNumber.value,
        id_cert_type: idCertType.value,
        sales_cd: salesCd.value ?? '',
      }),
    })
    const data = await response.json()

    console.log(data)

    if (data.result === 'ERROR') throw data.message
    if (data.result === 'SUCCESS') {
      receiptId.value = data.receipt_id
      showPopup()
    }
  } catch (err) {
    useSnackbarStore().show(err.toString())
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.content-container {
  width: 100%;
  height: 100%;

  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 5px #00000013;
  width: 500px;
  padding: 30px;
  min-height: 600px;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  gap: 20px;
  /* text-align: center; */
}

.title-note {
  font-size: 17px;
  font-weight: 500;
  color: #202020;
  align-self: center;
  /* line-height: 1.5; */
}

.checkbox {
  font-size: 15px;
  font-weight: 500;
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
  font-size: 16px;
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
