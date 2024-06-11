<template>
  <SearchAddressPopup v-if="addressPopup.active" />

  <div class="container">
    <div class="title">가입신청/고객정보</div>

    <div class="forms">
      <div class="group" style="max-width: 500px">
        <label>가입자명</label>
        <input v-model="registrer" placeholder="홍길동" />
        <p v-if="registrer.value">가입자명 입력하세요.</p>
      </div>

      <div class="group" style="max-width: 200px">
        <label>생년월일</label>
        <input v-model="registrerBirthday" placeholder="1991-01-31" v-cleave="cleavePatterns.birthdayPattern()" />
        <p v-if="registrer.value">생년월일 입력하세요.</p>
      </div>

      <div class="group" style="max-width: 200px">
        <label>개통번호외 연락번호</label>
        <input v-model="registrerBirthday" placeholder="010-0000-0000" v-cleave="cleavePatterns.phoneNumberPattern()" />
        <p v-if="registrer.value">연락처 입력하세요.</p>
      </div>

      <div class="group" style="max-width: 500px">
        <label>주소</label>
        <input @click="addressPopup.active = true" v-model="address" placeholder="서울시 구로구 디지털로33길 28" />
        <p v-if="registrer.value">주소 입력하세요.</p>
      </div>

      <div class="group" style="max-width: 300px">
        <label>상세주소</label>
        <input v-model="addressDetails" placeholder="1001호" />
        <p v-if="registrer.value">상세주소 입력하세요.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import * as cleavePatterns from '../utils/cleavePatterns'
import SearchAddressPopup from '../components/SearchAddressPopup.vue'
import { useSearchaddressStore } from '../stores/select-address-popup'

const addressPopup = useSearchaddressStore()
const registrer = ref('')
const registrerBirthday = ref('')
const registrerPhoneNumber = ref('')

const address = ref('')
const addressDetails = ref('')
watch(
  () => addressPopup.address,
  () => {
    address.value = addressPopup.address
    addressDetails.value = addressPopup.buildingName
  }
)
</script>

<style scoped>
.container {
  max-width: 1400px;
  width: 100%;
  box-sizing: border-box;
  margin: 15px;
  display: flex;
  flex-flow: column;
  gap: 20px;
}

.forms {
  width: 100%;
  display: flex;
  flex-flow: wrap;
  gap: 20px;
}

.title {
  font-size: 18px;
  font-weight: 600;
  /* margin-bottom: 20px; */
  margin-top: 10px;
  width: 100%;
}

.group {
  width: 100%;
}
</style>
