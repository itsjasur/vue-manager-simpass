<template>
  <AddressSearchPopup ref="addressSearchPopupRef" />
  <div class="container">
    <p class="title">고객정보</p>
    <div class="mainInfo">
      <div class="row">
        <div id="plan-type" class="groups" style="width: 25%">
          <label>고객유형</label>
          <!-- <input v-model="cust_type_cd" placeholder="" /> -->
          <a-select
            v-model:key="DATASAMPLE.cust_type_cd.label"
            v-model:value="customerType"
            :style="{ width: '100%' }"
            placeholder="Please select"
            :options="
              DATASAMPLE.cust_type_cd.map((item) => ({ value: item?.cd, label: item?.value }))
            "
            :onChange="console.log(customerType)"
          >
          </a-select>
        </div>

        <div v-if="isFormAvailable('contact')" class="groups" style="width: 25%">
          <label>개통번호외 연락번호</label>
          <input v-model="contact" placeholder="010-0000-0000" />
        </div>

        <div id="name" class="groups" style="width: 50%">
          <label>가입자명</label>
          <input v-model="applicant_name" placeholder="홍길동" />
        </div>
      </div>

      <div class="row">
        <div id="birthdate" class="groups" style="width: 20%">
          <label for="birthdate">생년월일</label>

          <input
            name="text"
            v-model="birthdate"
            placeholder="1991-01-31"
            v-cleave="{
              date: true,
              delimiter: '-',
              datePattern: ['Y', 'm', 'd'],
            }"
          />
        </div>

        <div id="address" class="groups" style="width: 50%">
          <label>주소</label>
          <input v-model="contact" placeholder="우림이비지센터 1차 1210호" />
        </div>

        <div id="address-details" class="groups" style="width: 30%">
          <label>상세주소</label>
          <input v-model="applicant_name" placeholder="" />
        </div>
      </div>
      <button @click="openPop">click me for address</button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { FORMLABELS } from '../assets/constants.js'
import { DATASAMPLE, PLANSINFO } from '../assets/constants.js'
import AddressSearchPopup from '../components/AddressSearchPopup.vue'

function openPop() {
  addressSearchPopupRef.value.openMe()
}

const addressSearchPopupRef = ref(null)

const selectedType = ref('PO')
const selectedCarrier = ref('KT')
const selectedMvnoCode = ref('KTM')

const customerType = ref('')
const birthdate = ref('')
const contact = ref('')
const address = ref('')
const address_additions = ref('')

const applicant_name = ref('')
const id_passport_number = ref('')
const country = ref('')
const gender = ref('')
const usim_plan_nm = ref('')
const usim_model_no = ref('')
const usim_no = ref('')
const usim_fee_cd = ref('')
const extra_service = ref('')
const usim_act_cd = ref('')
const plan_fee_cd = ref('')
const data_block_cd = ref('')
const phone_bill_block_cd = ref('')

const data = ref(DATASAMPLE)

function showContact() {}

function isFormAvailable(formId) {
  return (
    PLANSINFO.find((item) => item.code === selectedType.value) // which type (postpaid or prepaid)
      ?.carriers.find((carrier) => carrier.code === selectedCarrier.value) // which carrier
      ?.mvnos.find((mvno) => mvno.code === selectedMvnoCode.value) //which mvno
      ?.userInfoForms.some((form) => form === formId) || false //if available returns true
  )
}
</script>

<style scoped>
.container {
  /* width: 80%; */
  /* min-width: 800px; */
  max-width: 1200px;
  margin-top: 20px;
  padding: 0 15px;
  box-sizing: border-box;
}

.title {
  font-size: 20px;
  font-weight: 600;
  line-height: 1;
  padding: 0;
  margin-bottom: 20px;
  /* background-color: aqua; */
}

.mainInfo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.row {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  gap: 20px;
  flex-flow: row;
  /* background-color: yellow; */
}

.groups {
  width: 100%;
}

@media (max-width: 768px) {
  .container {
    width: 100%;
  }

  .row {
    flex-direction: column;
    width: 100%;
    margin-bottom: 20px;
  }

  .groups {
    width: 100% !important;
  }
}
</style>
