<template>
  <SelectPlanPopup />

  <AddressSearchPopup
    v-if="isSearchAddressOpen"
    @closePopup="isSearchAddressOpen = false"
    @selectAddress="addressSelected"
  />

  <SignPadPopup v-if="isDrawPadOpen" :type="drawType" @savePads="savePads" @closePopup="isDrawPadOpen = false" />

  <div class="container">
    <p class="title">요금제 정보</p>
    <div class="infoContainer">
      <div v-if="isFormAvailable('usim_plan_nm')" class="groups" style="max-width: 400px">
        <label>요금제</label>
        <input
          v-model="usimPlanName"
          @click="popup.open(selectedCarrierCd, selectedMvnoCd, selectedTypeCd)"
          readonly
          placeholder="요금제을 선택하세요"
        />
        <p v-if="!usimPlanName && formSubmitted" class="input-error-message">요금제 선택하세요.</p>
      </div>

      <div v-if="fetchedDataContainsList('usim_model_list')" class="groups" style="max-width: 300px">
        <label>USIM 모델명</label>

        <a-select
          v-model:value="usimModelList"
          :style="{ width: '100%' }"
          placeholder="모델명을 선택하세요"
          :options="fetchedData?.usim_model_list.map((item) => ({ value: item?.cd, label: item?.value }))"
        >
        </a-select>
        <p v-if="usimModelListRequired && !usimModelList && formSubmitted" class="input-error-message">
          USIM 모델명을 선택하세요.
        </p>
      </div>

      <div v-if="isFormAvailable('usim_no')" class="groups" style="max-width: 300px">
        <label>일련번호</label>
        <input v-model="usimNo" placeholder="00000000" />
        <p v-if="!usimNo && formSubmitted" class="input-error-message">일련번호 입력하세요.</p>
      </div>
      <div v-if="fetchedDataContainsList('usim_fee_cd')" class="groups" style="max-width: 300px">
        <label>유심비용청구</label>
        <a-select
          v-model:value="usimFeeCd"
          :style="{ width: '100%' }"
          placeholder="유심비용청구을 선택하세요"
          :options="fetchedData?.usim_fee_cd.map((item) => ({ value: item?.cd, label: item?.value }))"
        >
        </a-select>
        <p v-if="!usimFeeCd && formSubmitted" class="input-error-message">유심비용청구을 선택하세요.</p>
      </div>

      <div v-if="fetchedDataContainsList('extra_service_cd')" class="groups" style="max-width: 300px">
        <label>부가서비스</label>
        <a-select
          v-model:value="extraServiceCd"
          :style="{ width: '100%' }"
          placeholder="부가서비스을 선택하세요"
          :options="fetchedData?.extra_service_cd.map((item) => ({ value: item?.cd, label: item?.value }))"
        >
        </a-select>
        <p v-if="!fetchedData && formSubmitted" class="input-error-message">부가서비스을 선택하세요.</p>
      </div>

      <div v-if="fetchedDataContainsList('data_roming_block_cd')" class="groups" style="max-width: 300px">
        <label>해외데이터로밍</label>
        <a-select
          v-model:value="dataRomingBlockCd"
          :style="{ width: '100%' }"
          placeholder="해외데이터로밍을 선택하세요"
          :options="
            fetchedData?.data_roming_block_cd.map((item) => ({
              value: item?.cd,
              label: item?.value,
            }))
          "
        >
        </a-select>
        <p v-if="!dataRomingBlockCd && formSubmitted" class="input-error-message">해외데이터로밍을 선택하세요.</p>
      </div>

      <div v-if="fetchedDataContainsList('plan_fee_cd')" class="groups" style="max-width: 300px">
        <label>가입비</label>
        <a-select
          v-model:value="planFeeCd"
          :style="{ width: '100%' }"
          placeholder="가입비을 선택하세요"
          :options="
            fetchedData?.plan_fee_cd.map((item) => ({
              value: item?.cd,
              label: item?.value,
            }))
          "
        >
        </a-select>
        <p v-if="!planFeeCd && formSubmitted" class="input-error-message">가입비을 선택하세요.</p>
      </div>

      <div v-if="fetchedDataContainsList('phone_bill_block_cd')" class="groups" style="max-width: 300px">
        <label>휴대폰결제</label>
        <a-select
          v-model:value="phoneBillBlockCd"
          :style="{ width: '100%' }"
          placeholder="휴대폰결제을 선택하세요"
          :options="
            fetchedData?.phone_bill_block_cd.map((item) => ({
              value: item?.cd,
              label: item?.value,
            }))
          "
        >
        </a-select>
        <p v-if="!phoneBillBlockCd && formSubmitted" class="input-error-message">휴대폰결제을 선택하세요.</p>
      </div>

      <div v-if="fetchedDataContainsList('usim_act_cd')" class="groups" style="max-width: 300px">
        <label>개통구분</label>
        <a-select
          v-model:value="usimActCd"
          :style="{ width: '100%' }"
          placeholder="개통구분을 선택하세요"
          :options="
            fetchedData?.usim_act_cd.map((item) => ({
              value: item?.cd,
              label: item?.value,
            }))
          "
        >
        </a-select>
        <p v-if="!usimActCd && formSubmitted" class="input-error-message">개통구분을 선택하세요.</p>
      </div>
      <!-- <button @click="formSubmitted = true">Submit me</button> -->
    </div>
    <p class="title">고객 정보</p>
    <div class="infoContainer">
      <div v-if="fetchedDataContainsList('cust_type_cd')" class="groups" style="max-width: 200px">
        <label>고객유형</label>
        <a-select
          v-model:value="customerType"
          :style="{ width: '100%' }"
          placeholder="고객유형을 선택하세요"
          :options="fetchedData?.cust_type_cd.map((item) => ({ value: item?.cd, label: item?.value }))"
        >
        </a-select>

        <p v-if="!customerType && formSubmitted" class="input-error-message">고객유형 선택하세요.</p>
      </div>

      <div v-if="isFormAvailable('contact')" class="groups" style="max-width: 200px">
        <label>개통번호외 연락번호</label>
        <input v-model="contact" placeholder="010-0000-0000" />
        <p v-if="!contact && formSubmitted" class="input-error-message">연락처 입력하세요.</p>
      </div>

      <div v-if="isFormAvailable('id_passport_number')" class="groups" style="max-width: 200px">
        <label>신분증번호/여권번호 </label>
        <input v-model="idPassportNumber" placeholder="910131-0000000" />
        <p v-if="!idPassportNumber && formSubmitted" class="input-error-message">신분증번호/여권번호 입력하세요.</p>
      </div>

      <div v-if="isFormAvailable('applicant_name')" class="groups" style="max-width: 500px">
        <label>가입자명</label>
        <input v-model="applicantName" placeholder="홍길동" />
        <p v-if="!applicantName && formSubmitted" class="input-error-message">가입자명 입력하세요.</p>
      </div>
      <div v-if="isFormAvailable('application_birthday')" class="groups" style="max-width: 200px">
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

        <p v-if="!birthdate && formSubmitted" class="input-error-message">생년월일 입력하세요.</p>
      </div>

      <div v-if="fetchedDataContainsList('gender')" class="groups" style="max-width: 100px">
        <label>성별 </label>

        <a-select
          v-model:value="gender"
          :style="{ width: '100%' }"
          placeholder="남"
          :options="fetchedData?.gender_cd.map((item) => ({ value: item?.cd, label: item?.value }))"
        >
        </a-select>

        <p v-if="!gender && formSubmitted" class="input-error-message">성별 입력하세요.</p>
      </div>

      <div v-if="isFormAvailable('address')" class="groups" style="max-width: 500px">
        <label>주소</label>
        <input v-model="address" @click="isSearchAddressOpen = true" readonly placeholder="우림이비지센터 1차 1210호" />

        <p v-if="!address && formSubmitted" class="input-error-message">주소 입력하세요.</p>
      </div>

      <div v-if="isFormAvailable('address_additions')" class="groups" style="max-width: 300px">
        <label>상세주소</label>
        <input v-model="addressAdditions" placeholder="우림이비지센터 1차 1210호" />
        <p v-if="!addressAdditions && formSubmitted" class="input-error-message">상세주소 입력하세요.</p>
      </div>
    </div>

    <div v-if="selectedTypeCd === 'PO'">
      <p class="title">요금제 정보</p>
      <div class="infoContainer">
        <div class="groups" style="max-width: 300px">
          <label>성별 </label>

          <a-select
            v-model:value="paidTransferCd"
            :style="{ width: '100%' }"
            placeholder="결제구분 선택하세요"
            :options="fetchedData?.paid_transfer_cd.map((item) => ({ value: item?.cd, label: item?.value }))"
          >
          </a-select>

          <p v-if="!gender && formSubmitted" class="input-error-message">결제구분 선택하세요.</p>
        </div>

        <div class="groups" style="max-width: 300px">
          <label>예금주명</label>
          <input v-model="accountOwnerName" placeholder="홍길동" />
          <p v-if="!accountOwnerName && formSubmitted" class="input-error-message">예금주명 입력하세요.</p>
        </div>

        <div v-if="isFormAvailable('application_birthday')" class="groups" style="max-width: 200px">
          <label>예금주 생년월일</label>
          <input
            name="text"
            v-model="accountOwnerBirthday"
            placeholder="1991-01-31"
            v-cleave="{
              date: true,
              delimiter: '-',
              datePattern: ['Y', 'm', 'd'],
            }"
          />
          <p v-if="!accountOwnerBirthday && formSubmitted" class="input-error-message">생년월일 입력하세요.</p>
        </div>

        <div class="groups" style="max-width: 300px">
          <label>은행(카드사)명</label>
          <input v-model="bankOrCardProvider" placeholder="하나은행" />
          <p v-if="!bankOrCardProvider && formSubmitted" class="input-error-message">은행(카드사)명 입력하세요.</p>
        </div>

        <div class="groups" style="max-width: 300px">
          <label>계좌번호(카드번호)</label>
          <input
            type="text"
            @input="accountNumber = accountNumber.replace(/[^0-9]/g, '')"
            v-model="accountNumber"
            placeholder="1234567890"
          />
          <p v-if="!accountNumber && formSubmitted" class="input-error-message">은행(카드사)명 입력하세요.</p>
        </div>
      </div>
    </div>

    <div class="checkboxContainer">
      <a-checkbox class="checkbox" v-model:checked="supportDocsChecked">증빙자료첨부(선택사항)</a-checkbox>
      <a-checkbox class="checkbox" v-model:checked="signAfterPrintChecked"
        >신청서 프린트 인쇄후 서명/사인 자필</a-checkbox
      >
    </div>

    <div v-if="!signAfterPrintChecked" class="signContainer">
      <p class="sign-title">가입자 서명</p>
      <div v-if="!nameImageData && !signImageData" @click="addSigns('forms')" class="singImagesBox">
        <span class="draw-icon material-symbols-outlined"> stylus_note </span>
      </div>
      <div v-else class="singImagesBox">
        <span @click="deletePads('forms')" class="delete-icon material-symbols-outlined"> delete </span>
        <div class="images-row">
          <img class="image" :src="nameImageData" alt="Signature" />
          <img class="image" :src="signImageData" alt="Signature" />
        </div>
      </div>
      <p v-if="!nameImageData && !signImageData && formSubmitted" class="input-error-message">
        가입자서명을 하지 않았습니다.
      </p>

      <p class="sign-title">자동이체 서명</p>
      <div v-if="!paymentNameImageData && !paymentSignImageData" @click="addSigns('payment')" class="singImagesBox">
        <span class="draw-icon material-symbols-outlined"> stylus_note </span>
      </div>
      <div v-else class="singImagesBox">
        <span @click="deletePads('payment')" class="delete-icon material-symbols-outlined"> delete </span>
        <div class="images-row">
          <img class="image" :src="paymentNameImageData" alt="Signature" />
          <img class="image" :src="paymentSignImageData" alt="Signature" />
        </div>
      </div>
      <p v-if="!nameImageData && !signImageData && formSubmitted" class="input-error-message">
        후불이체동의 서명을 하지 않았습니다.
      </p>
    </div>
  </div>

  <div style="height: 400px"></div>
</template>

<script setup>
import AddressSearchPopup from '../components/AddressSearchPopup.vue'
import SelectPlanPopup from '../components/SelectPlanPopup.vue'
import SignPadPopup from '../components/SignPadPopup.vue'

import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useSelectPlansPopup } from '../stores/select-plans-popup'
import { useSnackbarStore } from '../stores/snackbar'
import { fetchWithTokenRefresh } from '../utils/tokenUtils'

onMounted(fetchData)

//signs image data
const nameImageData = ref(null)
const signImageData = ref(null)
const paymentNameImageData = ref(null)
const paymentSignImageData = ref(null)

//draw popup
const isDrawPadOpen = ref(false)
const drawType = ref('')

const addSigns = (type) => {
  drawType.value = type
  isDrawPadOpen.value = true
}

const deletePads = (type) => {
  if (type === 'forms') {
    nameImageData.value = null
    signImageData.value = null
  } else {
    paymentNameImageData.value = null
    paymentSignImageData.value = null
  }
}

const savePads = (type, nameData, signData) => {
  if (type === 'forms') {
    nameImageData.value = nameData
    signImageData.value = signData
  } else {
    paymentNameImageData.value = nameData
    paymentSignImageData.value = signData
  }
}

//checkboxes
const supportDocsChecked = ref(false)
const signAfterPrintChecked = ref(false)

//select plans popup
const popup = useSelectPlansPopup()

//fetched data
const fetchedData = ref()

// getting info from popup value
const selectedTypeCd = ref(popup.carrierType ?? '')
const selectedCarrierCd = ref(popup.carrierCd ?? '')
const selectedMvnoCd = ref(popup.mvnoCd ?? '')
const usimPlanName = ref(popup.planName ?? '')

//forms user info
const customerType = ref()
const birthdate = ref('')
const contact = ref('')
const applicantName = ref('')
const country = ref('')
const gender = ref()
const idPassportNumber = ref('')
const address = ref('')
const addressAdditions = ref('')

// forms usim info
const usimNo = ref()
const usimModelList = ref()
const usimModelListRequired = ref(false)
const usimFeeCd = ref()
const extraServiceCd = ref()
const dataRomingBlockCd = ref()
const planFeeCd = ref()
const phoneBillBlockCd = ref()
const usimActCd = ref()

//forms payment info
const paidTransferCd = ref()
const accountOwnerName = ref()
const accountOwnerBirthday = ref()
const bankOrCardProvider = ref()
const accountNumber = ref()

//address popup
const isSearchAddressOpen = ref(false)
const addressSelected = (selectedAddress, buildingName) => {
  address.value = selectedAddress
  addressAdditions.value = buildingName
}

//plans popup
const isPlansPopupOpen = ref(false)
watch(
  () => [popup.planName, popup.carrierType, popup.carrierCd, popup.mvnoCd],
  ([planName, carrierType, carrierCd, mvnoCd]) => {
    usimPlanName.value = planName
    selectedTypeCd.value = carrierType
    selectedCarrierCd.value = carrierCd
    selectedMvnoCd.value = mvnoCd
    fetchData()
  }
)

//submit form
const formSubmitted = ref(false)

function isFormAvailable(formId) {
  // return (
  //   PLANSINFO.find((item) => item.code === selectedTypeCd.value) // which type (postpaid or prepaid)
  //     ?.carriers.find((carrier) => carrier.code === selectedCarrierCd.value) // which carrier
  //     ?.mvnos.find((mvno) => mvno.code === selectedMvnoCd.value) //which mvno
  //     ?.availableForms.some((form) => form === formId) || false //if available returns true
  // )
  return true
}

//  check if any key contains the form
function fetchedDataContainsList(formName) {
  // if (fetchedData.value) {
  //   return Object.keys(fetchedData.value).some(
  //     (key) =>
  //       key === formName &&
  //       Array.isArray(fetchedData.value[key]) &&
  //       fetchedData.value[key].length > 0
  //   )
  // }
  return true
}

async function fetchData() {
  console.log('fetch data called')
  try {
    const response = await fetchWithTokenRefresh('agent/applyInit', {
      method: 'POST',
      body: {
        carrier_type: selectedTypeCd.value,
        carrier_cd: selectedCarrierCd.value,
        mvno_cd: selectedMvnoCd.value,
      },
    })

    if (response.ok) {
      const decodedResponse = await response.json()
      if (decodedResponse.data) {
        let info = decodedResponse.data
        fetchedData.value = info

        //setting initial values
        gender.value = fetchedData.value?.gender_cd[0]?.cd ?? ''
        usimFeeCd.value = fetchedData.value?.usim_fee_cd[0]?.cd ?? ''
        usimModelListRequired.value = fetchData.value?.chk_usim_model === 'Y'
        extraServiceCd.value = fetchedData.value?.extra_service_cd[0]?.cd ?? ''
        dataRomingBlockCd.value = fetchedData.value?.data_roming_block_cd[0]?.cd ?? ''
        planFeeCd.value = fetchedData.value?.plan_fee_cd[0]?.cd ?? ''
        phoneBillBlockCd.value = fetchedData.value?.phone_bill_block_cd[0]?.cd ?? ''
        usimActCd.value = fetchedData.value?.usim_act_cd[0]?.cd ?? ''
        paidTransferCd.value = fetchedData.value?.paid_transfer_cd[0]?.cd ?? ''

        // console.log('this is response data', info)
      }
    } else {
      throw new Error('Fetch data error')
    }
  } catch (error) {
    useSnackbarStore().showSnackbar(error.toString())
  }
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
  margin-top: 40px;
  margin-bottom: 15px;
}

.infoContainer {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  /* background-color: yellow; */
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

.checkboxContainer {
  display: flex;
  flex-flow: column;
  gap: 20px;
  margin-top: 40px;
  font-weight: 600;
}

.singImagesBox {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  max-width: 400px;
  width: 100%;
  height: 100px;
  border-radius: 5px;
  border: 1px dashed var(--main-color);
  cursor: pointer;
  position: relative;
}

.delete-icon {
  position: absolute;
  top: 3px;
  right: 3px;
  color: #ff3535;
  font-size: 25px;
  cursor: pointer;
}

.draw-icon {
  font-size: 30px;
  color: var(--main-color);
}

.images-row {
  display: flex;
  flex-flow: row;
  height: 100%;
  width: 100%;
  gap: 5px;
  box-sizing: border-box;
  padding: 5px;
}

.image {
  width: 100%;
  height: auto;
  min-width: 100px;
  max-height: 100px; /* Set a maximum height limit if needed */
  object-fit: contain; /* Maintain aspect ratio and fit within the container */
  background-color: #fbfbfb;
}

.sign-title {
  /* font-size: 15px; */
  font-weight: 600;
  line-height: 1;
  padding: 0;
  margin-top: 30px;
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .groups {
    max-width: none !important; /* Ignore max-width */
  }

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

  /* .signboxContainer .group {
    max-width: none;
    width: 100%;
  } */
}
</style>
