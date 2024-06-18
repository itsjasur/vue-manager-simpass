<template>
  <div class="content-container">
    <div class="partition">
      <div class="title">판매점 정보</div>
      <div class="group">
        <label>상호명*</label>
        <input v-model="companyName" placeholder="" />
        <p v-if="!companyName && isSubmitted" class="input-error-message">상호명을 입력하세요.</p>
      </div>

      <div class="group-row">
        <div class="group">
          <label>사업자번호</label>
          <input v-model="companyRegNumber" placeholder="" />
          <p v-if="!companyRegNumber && isSubmitted" class="input-error-message">사업자번호를 정확하게 입력하세요.</p>
        </div>

        <div class="group">
          <label>대표자 명*</label>
          <input v-model="directoryName" placeholder="" />
          <p v-if="!directoryName && isSubmitted" class="input-error-message">대표자 명을 입력해주세요.</p>
        </div>
      </div>

      <div class="group-row">
        <div class="group">
          <label>연락 번호*</label>
          <input v-model="phoneNumber" placeholder="" />
          <p v-if="!phoneNumber && isSubmitted" class="input-error-message">연락 번호를 입력하세요.</p>
        </div>

        <div class="group">
          <label>이메일주소*</label>
          <input type="email" v-model="email" placeholder="" />
          <p v-if="!email && isSubmitted" class="input-error-message">이메일주소를 입력해주세요.</p>
        </div>
      </div>

      <div class="group-row">
        <div class="group">
          <label>매장 전화</label>
          <input v-model="shopPhoneNumber" placeholder="" />
          <p v-if="!shopPhoneNumber && isSubmitted" class="input-error-message">연락 번호를 입력하세요.</p>
        </div>

        <div class="group">
          <label>매장 팩스</label>
          <input type="email" v-model="shopPhoneFax" placeholder="" />
          <p v-if="!shopPhoneFax && isSubmitted" class="input-error-message">이메일주소를 입력해주세요.</p>
        </div>
      </div>

      <div class="group-row">
        <div class="group" style="width: 60%">
          <label>매장 전화</label>
          <input v-model="shopPhoneNumber" placeholder="" />
          <p v-if="!shopPhoneNumber && isSubmitted" class="input-error-message">연락 번호를 입력하세요.</p>
        </div>

        <div class="group" style="width: 40%">
          <label>매장 팩스</label>
          <input type="email" v-model="shopPhoneFax" placeholder="" />
          <p v-if="!shopPhoneFax && isSubmitted" class="input-error-message">이메일주소를 입력해주세요.</p>
        </div>
      </div>
    </div>
    <div class="partition">
      <div class="title">가입 정보</div>

      <div class="group-row">
        <div class="group" style="max-width: 250px">
          <label>아이디*</label>
          <input v-model="username" placeholder="" />
          <p v-if="!username && isSubmitted" class="input-error-message">상호명을 입력하세요.</p>
        </div>

        <button>중복채크</button>
      </div>

      <div class="group-row">
        <div class="group">
          <label>패스워드</label>
          <input v-model="password" placeholder="" />
          <p v-if="!password && isSubmitted" class="input-error-message">연락 번호를 입력하세요.</p>
        </div>

        <div class="group">
          <label>패스워드 확인</label>
          <input type="email" v-model="passwordCheck" placeholder="" />
          <p v-if="!passwordCheck && isSubmitted" class="input-error-message">이메일주소를 입력해주세요.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const companyName = ref()

const companyRegNumber = ref()
const directoryName = ref()

const phoneNumber = ref()
const email = ref()

const shopPhoneNumber = ref()
const shopPhoneFax = ref()

const username = ref()
const password = ref()
const passwordCheck = ref()

const isSubmitted = ref(false)
</script>

<style scoped>
.content-container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 5px #00000013;
  width: 700px;
  padding: 30px;
  margin: 20px;
  min-height: 600px;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  gap: 30px;
}

.title {
  font-size: 18px;
  font-weight: 600;
}

.partition {
  display: flex;
  flex-flow: column;
  gap: 20px;
}

.group {
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  margin-top: 10px;
  width: 100%;
}

.group-row {
  display: flex;
  align-items: flex-end;
  gap: 20px;
  width: 100%;
}

.group-row button {
  max-width: 100px;
}

@media (max-width: 600px) {
  .content-container {
    width: 100%;
    box-shadow: none;
  }

  .group-row {
    display: flex;
    flex-flow: column;
    gap: 20px;
  }
}

.custom-option-font {
  font-size: 10px;
}
</style>
