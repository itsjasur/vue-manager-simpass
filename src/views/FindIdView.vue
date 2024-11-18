<template>
  <div class="find_id_main_container">
    <div class="content_container_box">
      <div></div>

      <h3 style="padding: 0; margin: 0; align-self: center">아이디 찾기</h3>

      <template v-if="idRequested">
        <template v-if="foundPartnerId">
          <span class="material-symbols-outlined center_large_icon"> check_circle </span>
          <span class="result_text">
            {{ partnerId }} 아이디는 <span style="color: #0059e8">{{ foundPartnerId }} </span> 입니다.
          </span>

          <div class="result_warning_note">
            <span class="material-symbols-outlined"> error </span>
            <span>정보 보호를 위해 아이디의 일부만 보여집니다.</span>
          </div>
          <div style="margin-top: 10px; display: flex; gap: 20px">
            <button @click="router.push('/login')">로그인</button>
            <button @click="router.push('/find-password')" style="background-color: #a5a5a5">비밀번호 찾기</button>
          </div>
        </template>
        <template v-else>
          <span class="material-symbols-outlined center_large_icon" style="color: red"> error </span>
          <span style="text-align: center">고객님의 아이디가 존재하지 않습니다</span>
          <button @click="goBack" style="width: 120px; align-self: center">뒤로</button>
        </template>
      </template>

      <template v-else>
        <div class="group">
          <label>사업자번호 </label>
          <CleaveInput
            placeholder="000-00-00000"
            v-model="businessNumber"
            :options="cleavePatterns.businessNumberPattern"
          />

          <p v-if="submitted && !businessNumber" class="input-error-message">사업자번호를 입력하세요</p>
        </div>
        <div class="group">
          <label>판매자명</label>
          <input type="text" v-model="partnerName" />
          <p v-if="submitted && !partnerName" class="input-error-message">판매자명를 입력하세요</p>
        </div>

        <!-- this used twice -->
        <div class="group">
          <label>휴대전화</label>
          <CleaveInput
            :modelValue="phoneNumber"
            placeholder="010-1234-5678"
            :options="cleavePatterns.phoneNumberPattern"
            v-model="phoneNumber"
          />
          <!-- @rawValue="phoneNumber = $event" -->
          <!-- @maskedValue="phoneNumber = $event" -->
          <p v-if="submitted && validatePhoneNumber(phoneNumber) !== null" class="input-error-message">
            {{ validatePhoneNumber(phoneNumber) }}
          </p>
        </div>
        <div></div>
        <button @click="checkPartnerId()">아이디 확인</button>
      </template>

      <div></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import * as cleavePatterns from '../utils/cleavePatterns'
import { validatePhoneNumber } from '@/utils/validators'
import { useSnackbarStore } from '@/stores/snackbar'
import { useRouter } from 'vue-router'
const router = useRouter()

const idRequested = ref(false)
const foundPartnerId = ref()

const submitted = ref(false)
const businessNumber = ref()
const partnerName = ref()
const phoneNumber = ref()

const partnerId = ref()

async function checkPartnerId() {
  // console.log(businessNumber.value.replaceAll('-', ''))
  // console.log(phoneNumber.value.value.replaceAll('-', ''))

  submitted.value = true

  if (
    businessNumber?.value?.replace(/-/g, '').length !== 10 ||
    !partnerName.value ||
    validatePhoneNumber(phoneNumber.value) !== null
  ) {
    return
  }

  idRequested.value = true

  try {
    const response = await fetch(import.meta.env.VITE_API_BASE_URL + 'auth/findId', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        business_num: businessNumber.value.replaceAll('-', ''), // 사업자번호
        contractor: partnerName.value, // 대표자(판매자)명
        phone_number: phoneNumber.value.replaceAll('-', ''), //휴대폰 번호
      }),
    })
    const decodedResponse = await response.json()

    if (decodedResponse.result === 'SUCCESS') {
      foundPartnerId.value = decodedResponse.username
    } else {
      throw decodedResponse.message ?? '잘못된 정보입니다'
    }

    console.log('it came to here')
  } catch (err) {
    useSnackbarStore().show(err.toString())
  }
}

function goBack() {
  idRequested.value = false
}
</script>

<style scoped>
.find_id_main_container {
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

.type_buttons button {
  background-color: rgb(72, 72, 72);
}
.type_buttons .selected {
  background-color: rgb(172, 172, 172);
  background-color: transparent;
  color: black;
  border: 1px solid black;
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
  .find_id_main_container {
    background-color: #fff;
  }
  .content_container_box {
    background-color: #fff;
    box-shadow: none;
    width: 100%;
  }
}
</style>
