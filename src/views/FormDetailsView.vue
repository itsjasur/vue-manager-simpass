<template>
  <div v-if="isSearchAddressOpen">
    <AddressSearchPopup
      @closePopup="isSearchAddressOpen = false"
      @selectAddress="addressSelected"
    />
  </div>

  <div v-if="isPlansPopupOpen">
    <SelectPlanPopup
      :selectedType="selectedType"
      :mvnoInfo="selectedMvno"
      @closePopup="isPlansPopupOpen = false"
    />
  </div>

  <div class="container">
    <p class="title">고객정보</p>
    <div class="infoContainer">
      <div class="row">
        <div v-if="isFormAvailable('cust_type_cd')" class="groups" style="width: 25%">
          <label>고객유형</label>
          <a-select
            v-model:key="DATASAMPLE.cust_type_cd.label"
            v-model:value="customerType"
            :style="{ width: '100%' }"
            placeholder="고객유형을 선택하세요"
            :options="
              DATASAMPLE.cust_type_cd.map((item) => ({ value: item?.cd, label: item?.value }))
            "
          >
          </a-select>
        </div>

        <div v-if="isFormAvailable('contact')" class="groups" style="width: 25%">
          <label>개통번호외 연락번호</label>
          <input v-model="contact" placeholder="010-0000-0000" />
        </div>

        <div v-if="true" class="groups" style="width: 20%">
          <label>신분증번호/여권번호 </label>
          <input v-model="idPassportNumber" placeholder="910131-0000000" />
        </div>
      </div>

      <div class="row">
        <div class="groups" style="width: 45%">
          <label>가입자명</label>
          <input v-model="applicantName" placeholder="홍길동" />
        </div>

        <div v-if="true" class="groups" style="width: 20%">
          <label>생년월일</label>

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

        <div v-if="true" class="groups" style="width: 10%">
          <label>성별 </label>

          <a-select
            v-model:key="DATASAMPLE.gender_cd.label"
            v-model:value="gender"
            :style="{ width: '100%' }"
            placeholder="남"
            :options="DATASAMPLE.gender_cd.map((item) => ({ value: item?.cd, label: item?.value }))"
          >
          </a-select>
        </div>
      </div>

      <div class="row">
        <div v-if="isFormAvailable('address')" class="groups" style="width: 45%">
          <label>주소</label>
          <input
            v-model="address"
            @click="isSearchAddressOpen = true"
            readonly
            placeholder="우림이비지센터 1차 1210호"
          />
        </div>

        <div v-if="isFormAvailable('address_additions')" class="groups" style="width: 30%">
          <label>상세주소</label>
          <input v-model="addressAdditions" placeholder="우림이비지센터 1차 1210호" />
        </div>
      </div>
    </div>

    <p class="title">고객정보</p>
    <div class="infoContainer">
      <div class="row">
        <div v-if="true" class="groups" style="width: 45%">
          <label>요금제</label>

          <input
            v-model="usimPlanName"
            @click="isPlansPopupOpen = true"
            readonly
            placeholder="요금제을 선택하세요"
          />
        </div>
      </div>

      <div class="row">
        <div v-if="true" class="groups" style="width: 25%">
          <label>USIM 모델명</label>

          <a-select
            v-model:key="DATASAMPLE.usim_model_list.label"
            v-model:value="usimNo"
            :style="{ width: '100%' }"
            placeholder="모델명을 선택하세요"
            :options="
              DATASAMPLE.usim_model_list.map((item) => ({ value: item?.cd, label: item?.value }))
            "
          >
          </a-select>
        </div>

        <div v-if="isFormAvailable('address')" class="groups" style="width: 25%">
          <label>일련번호</label>
          <input v-model="usimModelNo" placeholder="00000000" />
        </div>
        <div v-if="true" class="groups" style="width: 20%">
          <label>유심비용청구</label>
          <a-select
            v-model:key="DATASAMPLE.usim_fee_cd.label"
            v-model:value="usimFeeCd"
            :style="{ width: '100%' }"
            placeholder="유심비용청구을 선택하세요"
            :options="
              DATASAMPLE.usim_fee_cd.map((item) => ({ value: item?.cd, label: item?.value }))
            "
          >
          </a-select>
        </div>
      </div>

      <div class="row">
        <div v-if="true" class="groups" style="width: 25%">
          <label>부가서비스</label>
          <a-select
            v-model:key="DATASAMPLE.extra_service_cd.label"
            v-model:value="extraEervice"
            :style="{ width: '100%' }"
            placeholder="부가서비스을 선택하세요"
            :options="
              DATASAMPLE.extra_service_cd.map((item) => ({ value: item?.cd, label: item?.value }))
            "
          >
          </a-select>
        </div>

        <div v-if="true" class="groups" style="width: 20%">
          <label>해외데이터로밍</label>
          <a-select
            v-model:key="DATASAMPLE.data_roming_block_cd.label"
            v-model:value="dataBlockCd"
            :style="{ width: '100%' }"
            placeholder="해외데이터로밍을 선택하세요"
            :options="
              DATASAMPLE.data_roming_block_cd.map((item) => ({
                value: item?.cd,
                label: item?.value,
              }))
            "
          >
          </a-select>
        </div>

        <div v-if="true" class="groups" style="width: 25%">
          <label>가입비</label>
          <a-select
            v-model:key="DATASAMPLE.plan_fee_cd.label"
            v-model:value="planFeeCd"
            :style="{ width: '100%' }"
            placeholder="가입비을 선택하세요"
            :options="
              DATASAMPLE.plan_fee_cd.map((item) => ({
                value: item?.cd,
                label: item?.value,
              }))
            "
          >
          </a-select>
        </div>
      </div>

      <div class="row">
        <div v-if="true" class="groups" style="width: 25%">
          <label>휴대폰결제</label>
          <a-select
            v-model:key="DATASAMPLE.phone_bill_block_cd.label"
            v-model:value="phoneBillBlockCd"
            :style="{ width: '100%' }"
            placeholder="휴대폰결제을 선택하세요"
            :options="
              DATASAMPLE.phone_bill_block_cd.map((item) => ({
                value: item?.cd,
                label: item?.value,
              }))
            "
          >
          </a-select>
        </div>

        <div v-if="true" class="groups" style="width: 25%">
          <label>개통구분</label>
          <a-select
            v-model:key="DATASAMPLE.usim_act_cd.label"
            v-model:value="usimActCd"
            :style="{ width: '100%' }"
            placeholder="개통구분을 선택하세요"
            :options="
              DATASAMPLE.usim_act_cd.map((item) => ({
                value: item?.cd,
                label: item?.value,
              }))
            "
          >
          </a-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AddressSearchPopup from '../components/AddressSearchPopup.vue'
import SelectPlanPopup from '../components/SelectPlanPopup.vue'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { FORMLABELS } from '../assets/constants.js'
import { DATASAMPLE, PLANSINFO } from '../assets/constants.js'

const isSearchAddressOpen = ref(false)
const isPlansPopupOpen = ref(false)

const selectedType = ref('PO')
const selectedCarrier = ref('KT')
const selectedMvno = ref('KTM')

const customerType = ref()
const birthdate = ref('')
const contact = ref('')
const applicantName = ref('')
const country = ref('')
const gender = ref(DATASAMPLE?.gender_cd[0]?.cd ?? '')
const idPassportNumber = ref('')
const address = ref('')
const addressAdditions = ref('')

const usimPlanName = ref()
const usimNo = ref()
const usimModelNo = ref('')
const usimFeeCd = ref(DATASAMPLE?.usim_fee_cd[0]?.cd ?? '')
const extraEervice = ref(DATASAMPLE?.extra_service_cd[0]?.cd ?? '')
const dataBlockCd = ref(DATASAMPLE?.data_roming_block_cd[0]?.cd ?? '')
const planFeeCd = ref(DATASAMPLE?.plan_fee_cd[0]?.cd ?? '')
const phoneBillBlockCd = ref(DATASAMPLE?.phone_bill_block_cd[0]?.cd ?? '')
const usimActCd = ref(DATASAMPLE?.usim_act_cd[0]?.cd ?? '')

const data = ref(DATASAMPLE)

function showContact() {}

console.log(window.innerWidth)

function isFormAvailable(formId) {
  return (
    PLANSINFO.find((item) => item.code === selectedType.value) // which type (postpaid or prepaid)
      ?.carriers.find((carrier) => carrier.code === selectedCarrier.value) // which carrier
      ?.mvnos.find((mvno) => mvno.code === selectedMvno.value) //which mvno
      ?.availableForms.some((form) => form === formId) || false //if available returns true
  )
}

const addressSelected = (selectedAddress, buildingName) => {
  address.value = selectedAddress
  addressAdditions.value = buildingName
}
</script>

<style scoped>
.container {
  max-width: 1400px;
  padding: 0 15px;
  box-sizing: border-box;
  /* background-color: yellow; */
}

@media (max-width: 1200px) {
  .container {
    width: 100%;
    max-width: none;
  }
}

.title {
  font-size: 18px;
  font-weight: 600;
  line-height: 1;
  padding: 0;
  margin-top: 30px;
  margin-bottom: 15px;
}

.infoContainer {
  display: flex;
  flex-direction: column;
  gap: 25px;
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
  /* width: 100%; */
  /* background-color: green; */
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
