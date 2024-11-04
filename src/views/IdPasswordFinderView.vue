<template>
  <div class="pass_id_main_container">
    <div class="content_container_box">
      <div></div>

      <template v-if="idRequested">
        <template v-if="foundId">
          <span class="material-symbols-outlined center_large_icon"> check_circle </span>
          <span class="result_text">
            {{ partnerId }} 아이디는 <span style="color: #0059e8">{{ foundId }} </span> 입니다.
          </span>

          <div class="result_warning_note">
            <span class="material-symbols-outlined"> error </span>
            <span>정보 보호를 위해 아이디의 일부만 보여집니다.</span>
          </div>
          <div style="margin-top: 10px; display: flex; gap: 20px">
            <button>로그인</button>
            <button @click="findIdFunc" style="background-color: #a5a5a5">비밀번호 찾기</button>
          </div>
        </template>
        <template v-else>
          <span class="material-symbols-outlined center_large_icon" style="color: red"> error </span>
          <span style="text-align: center">고객님의 아이디가 존재하지 않습니다</span>
          <button style="width: 120px; align-self: center">뒤로</button>
        </template>
      </template>
      <template v-if="smsCodeVerified">
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

      <template v-else>
        <div class="type_buttons" style="display: flex; gap: 15px">
          <button @click="selectedAction = 'findId'" :class="{ selected: selectedAction !== 'findId' }">
            아이디 찾기
          </button>
          <button @click="selectedAction = 'findPassword'" :class="{ selected: selectedAction !== 'findPassword' }">
            비밀번호 찾기
          </button>
        </div>

        <template v-if="selectedAction === 'findId'">
          <div class="group">
            <label>사업자번호 </label>
            <CleaveInput
              v-model="businessNumber"
              placeholder="000-00-00000"
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
              placeholder="010-1234-5678"
              :options="cleavePatterns.phoneNumberPattern"
              @maskedValue="phoneNumber = $event"
            />
            <p v-if="submitted && validatePhoneNumber(phoneNumber) !== null" class="input-error-message">
              {{ validatePhoneNumber(phoneNumber) }}
            </p>
          </div>
          <div></div>
          <button @click="findIdFunc">아이디 확인</button>
        </template>

        <template v-else>
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
              <button @click="getSmsCode" style="flex: 2">인증번호 받기</button>
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
          <button @click="verifySmsCode" class="find_pass_button" style="background-color: rgb(201, 0, 0)">
            본인인증
          </button>
        </template>
      </template>

      <div></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import * as cleavePatterns from '../utils/cleavePatterns'
import { validatePhoneNumber, validatePass, validateRentryPass } from '@/utils/validators'

const selectedAction = ref('findId') //findPassword
// const selectedAction = ref('findPassword')

const idRequested = ref(false)
const foundId = ref()

const smsCodeSent = ref(false)
const smsCodeVerified = ref(false)

const submitted = ref(false)
const businessNumber = ref()
const partnerName = ref()
const phoneNumber = ref()
const partnerId = ref()
const confirmationCode = ref()

const password = ref()
const passwordRentry = ref()
const passwordUpdateSuccess = ref(false)

function findIdFunc() {
  foundId.value = null
  submitted.value = true
}
function verifySmsCode() {
  smsCodeVerified.value = true
  submitted.value = true
}

function getSmsCode() {
  smsCodeSent.value = true
}
function updatePassword() {
  submitted.value = true
}
</script>

<style scoped>
.pass_id_main_container {
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
  .pass_id_main_container {
    background-color: #fff;
  }
  .content_container_box {
    background-color: #fff;
    box-shadow: none;
    width: 100%;
  }
}
</style>
