<template>
  <SelectPlanPopup v-if="selectPlansPopup.active" />
  <SearchAddressPopup v-if="searchAddressPopup.active" />
  <AgreePadPopup v-if="isAgreePadOpen" @savePad="saveAgreePad" @closePopup="isAgreePadOpen = false" />
  <PrintablePopup v-if="usePrintablePopup().active" />

  <SignPadPopup
    v-if="isDrawPadOpen"
    :type="drawType"
    :userName="nameForPad"
    @savePads="savePads"
    @closePopup="isDrawPadOpen = false"
  />

  <div v-if="isPlanAvailable" class="container">
    <div class="partition">
      <template v-if="Object.keys(usimForms).length > 0">
        <div class="title">요금제 정보</div>
        <template v-for="(item, index) in usimForms" :key="index">
          <div class="group" :style="{ maxWidth: item.maxwidth }">
            <label>{{ item.label }}</label>

            <template v-if="item['type'] === 'select'">
              <a-select
                v-model:value="item.value"
                :style="{ width: '100%' }"
                :placeholder="item.placeholder"
                @change="generateAdditionalForms"
                v-bind="inputBindings(index)"
                :options="
                  fetchedData[index]?.map((i) => ({ value: i.cd, label: i.value })) ?? [{ value: 'N/A', label: 'N/A' }]
                "
              >
              </a-select>
            </template>

            <template v-if="item.type === 'input'">
              <input v-model="item.value" :placeholder="item.placeholder" v-bind="inputBindings(index)" />
            </template>

            <template v-if="item.type === 'cleave'">
              <input v-model="item.value" :placeholder="item.placeholder" v-cleave="item.pattern" />
            </template>

            <p
              v-if="formSubmitted && !item.value && (index !== 'usim_model_list' || usimModelRequired)"
              class="input-error-message"
            >
              {{ item.error }}
            </p>
          </div>
        </template>
      </template>

      <template v-if="Object.keys(customerForms).length > 0">
        <div class="title">고객 정보</div>
        <template v-for="(item, index) in customerForms" :key="index">
          <div class="group" :style="{ maxWidth: item.maxwidth }">
            <label>{{ item.label }}</label>

            <template v-if="item['type'] === 'select'">
              <a-select
                v-model:value="item.value"
                :style="{ width: '100%' }"
                @change="generateAdditionalForms"
                :placeholder="item.placeholder"
                v-bind="inputBindings(index)"
                :options="
                  fetchedData[index]?.map((i) => ({ value: i.cd, label: i.value })) ?? [{ value: 'N/A', label: 'N/A' }]
                "
              >
              </a-select>
            </template>

            <template v-if="item.type === 'input'">
              <input v-model="item.value" :placeholder="item.placeholder" v-bind="inputBindings(index)" />
            </template>

            <template v-if="item.type === 'cleave'">
              <input v-model="item.value" :placeholder="item.placeholder" v-cleave="item.pattern" />
            </template>

            <p v-if="!item.value && formSubmitted" class="input-error-message">
              {{ item.error }}
            </p>
          </div>
        </template>
      </template>

      <!-- Deputy forms -->
      <template v-if="deputyAvailable && Object.keys(deputyForms).length > 0">
        <div class="title">법정대리인</div>
        <template v-for="(item, index) in deputyForms" :key="index">
          <div class="group" :style="{ maxWidth: item.maxwidth }">
            <label>{{ item.label }}</label>

            <template v-if="item['type'] === 'select'">
              <a-select
                v-model:value="item.value"
                :style="{ width: '100%' }"
                @change="generateAdditionalForms"
                :placeholder="item.placeholder"
                v-bind="inputBindings(index)"
                :options="
                  fetchedData[index]?.map((i) => ({ value: i.cd, label: i.value })) ?? [{ value: 'N/A', label: 'N/A' }]
                "
              >
              </a-select>
            </template>

            <template v-if="item.type === 'input'">
              <input v-model="item.value" :placeholder="item.placeholder" v-bind="inputBindings(index)" />
            </template>

            <template v-if="item.type === 'cleave'">
              <input v-model="item.value" :placeholder="item.placeholder" v-cleave="item.pattern" />
            </template>

            <p v-if="!item.value && formSubmitted" class="input-error-message">
              {{ item.error }}
            </p>
          </div>
        </template>
      </template>

      <template v-if="Object.keys(paymentForms).length > 0">
        <div class="title">
          <span>자동이체</span>
          <!-- checks if owner is the same -->
          <a-checkbox class="checkbox left-margin" v-model:checked="selfRegisterChecked">가입자와 동일</a-checkbox>
        </div>

        <template v-for="(item, index) in paymentForms" :key="index">
          <div class="group" :style="{ maxWidth: item.maxwidth }">
            <label>{{ item.label }}</label>

            <template v-if="item['type'] === 'select'">
              <a-select
                v-model:value="item.value"
                :style="{ width: '100%' }"
                :placeholder="item.placeholder"
                @change="generateAdditionalForms"
                v-bind="inputBindings(index)"
                :options="fetchedData[index]?.map((i) => ({ value: i.cd, label: i.value })) ?? null"
              >
              </a-select>
            </template>

            <template v-if="item.type === 'input'">
              <input v-model="item.value" :placeholder="item.placeholder" v-bind="inputBindings(index)" />
            </template>

            <template v-if="item.type === 'cleave'">
              <input v-model="item.value" :placeholder="item.placeholder" v-cleave="item.pattern" />
            </template>

            <p v-if="!item.value && formSubmitted" class="input-error-message">
              {{ item.error }}
            </p>
          </div>
        </template>
      </template>
    </div>

    <div class="bottom-part">
      <a-checkbox class="checkbox" v-model:checked="supportedImagesChecked">증빙자료첨부(선택사항)</a-checkbox>

      <!-- uploads images -->
      <input id="file-input" @change="handleFileUpload" type="file" class="file-input" accept="image/*" multiple />

      <div v-if="supportedImagesChecked" class="uploadedImagesRow">
        <label for="file-input" class="uploadImageBox">
          <span class="inner-icon material-symbols-outlined"> add </span>
          <p>이미지 업로드</p>
        </label>

        <div v-for="(image, index) in supportedImages" :key="index" class="uploadImageBox">
          <img :src="image" :alt="index" />
          <span @click="deleteDocImages(index)" class="delete-icon material-symbols-outlined"> delete </span>
        </div>
      </div>

      <!-- checks and enables sign container -->
      <a-checkbox class="checkbox" v-model:checked="signAfterPrintChecked"
        >신청서 프린트 인쇄후 서명/사인 자필</a-checkbox
      >
      <template v-if="!signAfterPrintChecked">
        <!-- form sign container -->
        <div class="sign-container">
          <p class="sign-title">가입자 서명</p>
          <div v-if="!nameImageData && !signImageData" @click="addSigns('forms')" class="singImagesBox">
            <span class="inner-icon material-symbols-outlined"> stylus_note </span>
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
        </div>

        <div v-if="!selfRegisterChecked" class="sign-container">
          <!-- payment sign container -->
          <p class="sign-title">자동이체 서명</p>
          <div v-if="!paymentNameImageData && !paymentSignImageData" @click="addSigns('payment')" class="singImagesBox">
            <span class="inner-icon material-symbols-outlined"> stylus_note </span>
          </div>
          <div v-else class="singImagesBox">
            <span @click="deletePads('payment')" class="delete-icon material-symbols-outlined"> delete </span>
            <div class="images-row">
              <img class="image" :src="paymentNameImageData" alt="Signature" />
              <img class="image" :src="paymentSignImageData" alt="Signature" />
            </div>
          </div>
          <p v-if="!paymentNameImageData && !paymentSignImageData && formSubmitted" class="input-error-message">
            후불이체동의 서명을 하지 않았습니다.
          </p>
        </div>

        <!-- deputy sign container -->
        <div v-if="deputyAvailable" class="sign-container">
          <p class="sign-title">법정대리인 서명</p>
          <div v-if="!deputyNameImageData && !deputySignImageData" @click="addSigns('deputy')" class="singImagesBox">
            <span class="inner-icon material-symbols-outlined"> stylus_note </span>
          </div>
          <div v-else class="singImagesBox">
            <span @click="deletePads('deputy')" class="delete-icon material-symbols-outlined"> delete </span>
            <div class="images-row">
              <img class="image" :src="deputyNameImageData" alt="Signature" />
              <img class="image" :src="deputySignImageData" alt="Signature" />
            </div>
          </div>
          <p v-if="!deputyNameImageData && !deputySignImageData && formSubmitted" class="input-error-message">
            법정대리인서명을 하지 않았습니다.
          </p>
        </div>

        <!-- partner sign container -->
        <div v-if="partnerNeedsToSign" class="sign-container">
          <p class="sign-title">판매자 서명</p>
          <div v-if="!partnerNameImageData && !partnerSignImageData" @click="addSigns('partner')" class="singImagesBox">
            <span class="inner-icon material-symbols-outlined"> stylus_note </span>
          </div>
          <div v-else class="singImagesBox">
            <span @click="deletePads('partner')" class="delete-icon material-symbols-outlined"> delete </span>
            <div class="images-row">
              <img class="image" :src="partnerNameImageData" alt="Signature" />
              <img class="image" :src="partnerSignImageData" alt="Signature" />
            </div>
          </div>
          <p v-if="!partnerNameImageData && !partnerSignImageData && formSubmitted" class="input-error-message">
            판매자서명을 하지 않았습니다.
          </p>
        </div>

        <!-- i agree sign container -->
        <div v-if="shouldShowAgreeContent" class="sign-container">
          <p class="sign-title">동의합니다.</p>
          <div v-if="!agreePadData" @click="isAgreePadOpen = true" class="singImagesBox">
            <span class="inner-icon material-symbols-outlined"> stylus_note </span>
          </div>
          <div v-else class="singImagesBox">
            <span @click="agreePadData = null" class="delete-icon material-symbols-outlined"> delete </span>
            <div class="images-row">
              <img class="image" :src="agreePadData" alt="Signature" />
            </div>
          </div>
          <p v-if="!agreePadData && formSubmitted" class="input-error-message">가입약관에 동의하지 않았습니다.</p>
        </div>
      </template>

      <button class="submit" @click="submit" :disabled="isSubmitLoading">
        <span v-if="isSubmitLoading">
          <LoadingSpinner height="20px" color="#ffffff" />
        </span>
        <span v-else> 개통 신청/서식출력</span>
      </button>
    </div>
  </div>

  <template v-else>
    <div class="plan-not-found">
      <h2>요금제를 찾을 수 없습니다</h2>
    </div>
  </template>
</template>

<script setup>
import { ref, onMounted, watch, reactive, nextTick } from 'vue'

import { Select } from 'ant-design-vue'
import { fetchWithTokenRefresh } from '../utils/tokenUtils'
import { USIM_FORM_DETAILS, CUSTOMER_FORM_DETAILS, PLANSINFO } from '../assets/constants'
import { PAYMENT_FORM_DETAILS, BASEURL, DEPUTY_FORM_DETAILS } from '../assets/constants'
import { useSelectPlansPopup } from '../stores/select-plans-popup'
import { usePrintablePopup } from '../stores/printable-popup'

import { useSearchaddressStore } from '../stores/select-address-popup'
import SelectPlanPopup from '../components/SelectPlanPopup.vue'
import SearchAddressPopup from '../components/SearchAddressPopup.vue'
import SignPadPopup from '../components/SignPadPopup.vue'
import AgreePadPopup from '../components/AgreePadPopup.vue'
import PrintablePopup from '../components/PrintablePopup.vue'
import { convertToPdfAndGetUrl } from '../utils/helpers'
import LoadingSpinner from '../components/Loader.vue'
import { useSnackbarStore } from '../stores/snackbar'

//props
const props = defineProps({ id: String })

//if plan with id not found
const isPlanAvailable = ref(false)

// weather usim model needs to be checked
const usimModelRequired = ref(false)

//popup init
const selectPlansPopup = useSelectPlansPopup()
const searchAddressPopup = useSearchaddressStore()

//flase shows sign boxes
const selfRegisterChecked = ref(false)

//signAfterPrintChecked
const signAfterPrintChecked = ref(true)
//signs image data
const nameImageData = ref(null)
const signImageData = ref(null)

const paymentNameImageData = ref(null)
const paymentSignImageData = ref(null)

const deputyNameImageData = ref(null)
const deputySignImageData = ref(null)

//shows if partner has no sign in profile
const partnerNeedsToSign = ref(false)
const partnerNameImageData = ref(null)
const partnerSignImageData = ref(null)

//draw popup
const isDrawPadOpen = ref(false)
const drawType = ref('')
const nameForPad = ref('')

//agre pad
const shouldShowAgreeContent = ref(false)
const isAgreePadOpen = ref(false)
const agreePadData = ref(null)

const addSigns = (type) => {
  drawType.value = type
  isDrawPadOpen.value = true

  //which name to show on name pad
  switch (type) {
    case 'forms':
      nameForPad.value = customerForms?.value?.name?.value ?? ''
      break

    case 'deputy':
      nameForPad.value = deputyForms?.value?.deputy_name?.value ?? ''
      break

    case 'payment':
      nameForPad.value = paymentForms?.value?.account_name?.value ?? ''
      break
  }
}

const deletePads = (type) => {
  switch (type) {
    case 'forms':
      nameImageData.value = null
      signImageData.value = null
      break
    case 'deputy':
      deputyNameImageData.value = null
      deputySignImageData.value = null
      break
    case 'payment':
      paymentNameImageData.value = null
      paymentSignImageData.value = null
      break
    case 'partner':
      partnerNameImageData.value = null
      partnerSignImageData.value = null
      break
    default:
      console.error('Invalid pad type:', type)
  }
}

const savePads = (type, nameData, signData) => {
  switch (type) {
    case 'forms':
      nameImageData.value = nameData
      signImageData.value = signData
      break
    case 'deputy':
      deputyNameImageData.value = nameData
      deputySignImageData.value = signData
      break
    case 'payment':
      paymentNameImageData.value = nameData
      paymentSignImageData.value = signData
      break
    case 'partner':
      partnerNameImageData.value = nameData
      partnerSignImageData.value = signData
      break
    default:
      console.error('Invalid pad type:', type)
  }
}

const deleteAgreePad = () => (agreePadData.value = null)
const saveAgreePad = (padData) => (agreePadData.value = padData)
//supported docs checkbox and handler
const supportedImagesChecked = ref(true)
// this handles file upload
const supportedImages = ref([])

//  a ref for storing File objects
const fileObjects = ref([])
const handleFileUpload = async (event) => {
  const selectedFiles = event.target.files
  for (let i = 0; i < selectedFiles.length; i++) {
    fileObjects.value.push(selectedFiles[i])
  }
  createImageUrls()
}

//create url images
const createImageUrls = () => {
  supportedImages.value = []
  for (let i = 0; i < fileObjects.value.length; i++) {
    const imageUrl = URL.createObjectURL(fileObjects.value[i])
    supportedImages.value.push(imageUrl)
  }
}

const deleteDocImages = (index) => {
  fileObjects.value.splice(index, 1)
  // console.log(fileObjects.value)
  createImageUrls()
}

//forms
const usimForms = ref({})
const customerForms = ref({})
const paymentForms = ref({})
const deputyForms = ref({})

//weather to show or hide deputy forms
const deputyAvailable = ref(false)

//find current plan info
const currentPlanInfo = () =>
  PLANSINFO.find((item) => item.code === selectPlansPopup.type) // which type (postpaid or prepaid)
    ?.carriers.find((carrier) => carrier.code === selectPlansPopup.carrierCd) // which carrier
    ?.mvnos.find((mvno) => mvno.code === selectPlansPopup.mvnoCd) //which mvno

//fetched data ref
const fetchedData = ref({})

//this generates forms
async function generateForms() {
  //making sure they are empty whenever generateForms called
  usimForms.value = {}
  customerForms.value = {}
  paymentForms.value = {}

  for (const item of currentPlanInfo().usimForms) {
    usimForms.value[item] = USIM_FORM_DETAILS[item]
  }
  for (const item of currentPlanInfo().customerForms) {
    customerForms.value[item] = CUSTOMER_FORM_DETAILS[item]
  }

  const postpaidData = PLANSINFO.find((item) => item.code === selectPlansPopup.type)
  if (postpaidData.paymentForms)
    for (const item of postpaidData.paymentForms) {
      paymentForms.value[item] = PAYMENT_FORM_DETAILS[item]
    }

  //partner sign box shows if not Y
  partnerNeedsToSign.value = fetchedData?.value?.chk_partner_sign === 'N'

  //should we show the agree image signer
  shouldShowAgreeContent.value = fetchedData?.value?.usim_plan_info?.mvno_cd === 'UPM'

  //default setter should come after additional form generate
  generateAdditionalForms()
}

const generateAdditionalForms = async () => {
  //adding deputy forms
  if (customerForms?.value?.cust_type_cd?.value === 'COL') {
    deputyAvailable.value = true
    deputyForms.value = DEPUTY_FORM_DETAILS
  } else {
    deputyAvailable.value = false
    deputyForms.value = {}
  }
  //deleting and resetting forms
  delete usimForms.value.mnp_carrier_type
  delete usimForms.value.phone_number
  delete usimForms.value.mnp_pre_carrier
  delete usimForms.value.mnp_pre_carrier_nm
  delete usimForms.value.wish_number

  if (usimForms.value.usim_act_cd && usimForms.value.usim_act_cd.value === 'N') {
    //wish numbers input with cleave
    let wishArray = Array(currentPlanInfo().wishCount).fill(4) //[4,4,4]
    usimForms.value.wish_number = USIM_FORM_DETAILS.wish_number
    usimForms.value.wish_number.pattern = {
      numericOnly: true,
      delimiter: ' / ',
      blocks: wishArray, //[4,4,4]
    }
    usimForms.value.wish_number.placeholder = wishArray.map((e) => '1234').join(' / ')
  }

  if (usimForms.value.usim_act_cd && usimForms.value.usim_act_cd.value === 'M') {
    usimForms.value.mnp_carrier_type = USIM_FORM_DETAILS.mnp_carrier_type
    usimForms.value.phone_number = USIM_FORM_DETAILS.phone_number
    usimForms.value.mnp_pre_carrier = USIM_FORM_DETAILS.mnp_pre_carrier

    if (usimForms.value.mnp_pre_carrier.value === 'MV') {
      usimForms.value.mnp_pre_carrier_nm = USIM_FORM_DETAILS.mnp_pre_carrier_nm
    }
  }

  //setting country code if customer is korean
  if (customerForms.value.country && customerForms.value.cust_type_cd) {
    let customerTypeCd = customerForms.value.cust_type_cd.value
    customerForms.value.country.value = customerTypeCd && customerTypeCd !== 'MEA' ? '대한민국' : null
  }

  //adding card MM//YY
  delete paymentForms.value.card_yy_mm
  if (paymentForms.value.paid_transfer_cd && paymentForms.value.paid_transfer_cd.value === 'C') {
    paymentForms.value.card_yy_mm = PAYMENT_FORM_DETAILS.card_yy_mm
  }

  defaultSetter()
}

// Iterating over usimForms/customerforms to set default values based on fetchData
const defaultSetter = () => {
  for (const key in usimForms.value) {
    if (key === 'usim_plan_nm') {
      usimForms.value.usim_plan_nm.value = fetchedData.value.usim_plan_info?.usim_plan_nm ?? ''
    }
    if (
      usimForms.value[key].value === null &&
      usimForms.value[key].type === 'select' &&
      usimForms.value[key].hasDefault
    ) {
      usimForms.value[key].value = fetchedData.value?.[key]?.[0]?.cd ?? null
    }
  }

  for (const key in customerForms.value) {
    if (
      customerForms.value[key].value === null &&
      customerForms.value[key].type === 'select' &&
      customerForms.value[key].hasDefault
    ) {
      customerForms.value[key].value = fetchedData.value?.[key]?.[0]?.cd ?? null
    }
  }
  for (const key in deputyForms.value) {
    if (
      deputyForms.value[key].value === null &&
      deputyForms.value[key].type === 'select' &&
      deputyForms.value[key].hasDefault
    ) {
      deputyForms.value[key].value = fetchedData.value?.[key]?.[0]?.cd ?? null
    }
  }

  for (const key in paymentForms.value) {
    if (
      paymentForms.value[key].value === null &&
      paymentForms.value[key].type === 'select' &&
      paymentForms.value[key].hasDefault
    ) {
      paymentForms.value[key].value = fetchedData.value?.[key]?.[0]?.cd ?? null
    }
  }
}

//initial mount fetches data
onMounted(fetchData)

//this check if anything updating in the address store and updates address fields
watch(
  () => searchAddressPopup.address,
  () => {
    customerForms.value['address'].value = searchAddressPopup.address
    customerForms.value['addressdetail'].value = searchAddressPopup.buildingName
  }
)

// whenever selected plan info changes, fetchdata() called
watch(() => [selectPlansPopup.type, selectPlansPopup.mvnoCd, selectPlansPopup.carrierCd], fetchData)

//bindings for forms
const inputBindings = (item) => {
  if (item === 'name')
    return { onInput: () => (customerForms.value[item].value = customerForms.value[item].value.toUpperCase()) }
  if (item === 'account_name')
    return { onInput: () => (paymentForms.value[item].value = paymentForms.value[item].value.toUpperCase()) }
  if (item === 'deputy_name')
    return { onInput: () => (deputyForms.value[item].value = deputyForms.value[item].value.toUpperCase()) }

  if (item === 'usim_plan_nm') return { onClick: (event) => selectPlansPopup.open(), readonly: true }
  if (item === 'address') return { onClick: () => searchAddressPopup.open(), readonly: true }

  if (item === 'account_number' && paymentForms.value.account_number)
    return {
      onInput: (event) =>
        (paymentForms.value.account_number.value = paymentForms.value.account_number.value.replace(/[^0-9]/g, '')),
    }
}

async function fetchData() {
  console.log('fetch called')
  try {
    const response = await fetchWithTokenRefresh('agent/applyInit', {
      method: 'POST',
      body: { usim_plan_id: props.id },
    })

    if (response.ok) {
      const decodedResponse = await response.json()
      // console.log(decodedResponse)
      if (decodedResponse.data) {
        let info = decodedResponse.data
        fetchedData.value = info

        if (info?.usim_plan_info) {
          selectPlansPopup.type = info.usim_plan_info.carrier_type
          selectPlansPopup.carrierCd = info.usim_plan_info.carrier_cd
          selectPlansPopup.mvnoCd = info.usim_plan_info.mvno_cd

          usimModelRequired.value = info.chk_usim_model === 'Y'
          isPlanAvailable.value = true

          generateForms()
        }
      }
    } else {
      throw new Error('Fetch data error')
    }
  } catch (error) {
    useSnackbarStore().showSnackbar(error.toString())
  }
}

//submit form
const formSubmitted = ref(false)
const isSubmitLoading = ref(false)

const submit = async () => {
  formSubmitted.value = true
  isSubmitLoading.value = true

  const usimFormsNotEmpty = Object.entries(usimForms.value).every(([key, field]) => {
    if (key === 'usim_model_list' && !usimModelRequired.value) return true //return true if usimModelRequired is flase
    if (!field.error) return true // return true if error is not given
    return field.value
  })

  const customerFormsNotEmpty = Object.values(customerForms.value).every((field) => {
    if (!field.error) return true // return true if error is not given
    return field.value
  })
  const paymentFormsNotEmpty = Object.values(paymentForms.value).every((field) => {
    if (!field.error) return true // return true if error is not given
    return field.value
  })
  const deputyFormsNotEmpty = Object.values(deputyForms.value).every((field) => {
    if (!field.error) return true // return true if error is not given
    return field.value
  })

  // //checks if all values are filled
  const checklist = [usimFormsNotEmpty, customerFormsNotEmpty, paymentFormsNotEmpty, deputyFormsNotEmpty]

  if (!signAfterPrintChecked.value) {
    //form signs
    checklist.push([nameImageData.value, signImageData.value].every(Boolean))

    //payment signs
    if (!selfRegisterChecked.value) {
      checklist.push([paymentNameImageData.value, paymentSignImageData.value].every(Boolean))
    }

    if (shouldShowAgreeContent) {
      checklist.push(agreePadData.value ? true : false)
    }

    if (deputyAvailable) {
      checklist.push([deputyNameImageData.value, deputySignImageData.value].every(Boolean))
    }
  }

  console.log(checklist.every((item) => item === true))

  if (checklist.every((item) => item === true)) {
    await fetchForms()
  } else {
    useSnackbarStore().showSnackbar('채워지지 않은 필드가 있습니다.')
  }

  isSubmitLoading.value = false
}

//FORM DATA REQUEST
const formData = new FormData()

async function dataConfigure() {
  //adding files
  for (const file of fileObjects.value) {
    formData.set('attach_files[]', file)
  }

  formData.set('bill_sign', paymentNameImageData.value)
  formData.set('bill_seal', paymentSignImageData.value)

  formData.set('apply_sign', nameImageData.value)
  formData.set('apply_seal', signImageData.value)

  formData.set('deputy_sign', deputyNameImageData.value)
  formData.set('deputy_seal', deputySignImageData.value)

  formData.set('agree_sign', agreePadData.value)

  formData.set('carrier_type', fetchedData?.value?.usim_plan_info?.carrier_type)
  formData.set('carrier_cd', fetchedData?.value?.usim_plan_info?.carrier_cd)
  formData.set('usim_plan_id', fetchedData?.value?.usim_plan_info?.id)

  //adding usim infos
  for (const key in usimForms.value) {
    formData.set(key, usimForms.value[key].value)
  }

  //adding customer infos
  for (const key in customerForms.value) {
    if (key === 'birthday') {
      formData.set(key, customerForms?.value?.[key]?.value?.replace(/-/g, '').substring(2))
      continue
    }
    if (key === 'address') {
      formData.set(key, customerForms?.value?.[key].value + customerForms?.value?.['addressdetail'].value)
      continue
    }

    formData.set(key, customerForms.value?.[key]?.value)
  }

  //adding payment infos
  for (const key in paymentForms.value) {
    if (key === 'account_birthday') {
      formData.set(key, paymentForms?.value?.[key]?.value?.replace(/-/g, '').substring(2))
      continue
    }

    formData.set(key, paymentForms.value?.[key]?.value)
  }

  //adding deputy infos
  for (const key in deputyForms.value) {
    if (key === 'deputy_birthday') {
      formData.set(key, deputyForms?.value?.[key]?.value?.replace(/-/g, '').substring(2))
      continue
    }
    formData.set(key, deputyForms.value?.[key]?.value)
  }

  //adding usim infos
  if (usimForms.value?.wish_number && usimForms.value?.wish_number.value) {
    const wishList = usimForms.value?.wish_number?.value?.split(' / ')
    wishList.forEach((item, index) => {
      const key = 'request_no_' + (index + 1)
      formData.set(key, item)
    })
  }

  // for (const [key, value] of formData.entries()) {
  //   console.log(key, value)
  // }
}

//base64 images come after form is submitted successfully
const base64Images = ref([])
const pdfUrl = ref([])

async function fetchForms() {
  await dataConfigure()

  try {
    const response = await fetchWithTokenRefresh('agent/actApply', { method: 'POST', body: formData })

    if (response.ok) {
      const decodedResponse = await response.json()
      base64Images.value = decodedResponse.data.apply_forms_list
      // console.log(base64Images.value.length)
      if (base64Images.value.length > 0) {
        usePrintablePopup().open(base64Images.value)
      }
    } else {
      throw new Error('Could not fetch image data')
    }
  } catch (error) {
    useSnackbarStore().showSnackbar(error.toString())
  }
}
</script>

<style scoped>
.container {
  max-width: 1400px;
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
}

.partition {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
}

.group {
  width: 100%;
  /* background-color: aquamarine; */
}

.title {
  font-size: 18px;
  font-weight: 600;
  margin-top: 20px;
  margin-bottom: 0px;
  width: 100%;
}

.checkbox {
  font-size: 16px;
  font-weight: 500;
  /* margin-bottom: 20px; */
  /* margin-top: 30px; */
  /* background-color: aquamarine; */
}
.left-margin {
  margin-left: 20px;
}

.bottom-part {
  display: flex;
  flex-flow: column;
  gap: 25px;
  margin-top: 20px;
}

.file-input {
  display: none;
}

.uploadedImagesRow {
  display: flex;
  flex-flow: wrap;
  gap: 20px;
  /* margin-top: 20px; */
}

.uploadImageBox {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 100px;
  border-radius: 5px;
  border: 1px dashed var(--main-color);
  cursor: pointer;
  position: relative;
}

.uploadImageBox img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  box-sizing: border-box;
}

.delete-icon {
  position: absolute;
  top: 3px;
  right: 3px;
  color: #ff3535 !important;
  cursor: pointer !important;
  background-color: #ffffff;
  padding: 2px;
  border-radius: 20px;
}

.inner-icon {
  font-size: 28px;
  color: var(--main-color);
}

.uploadImageBox img:hover {
  opacity: 0.2;
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

.singImagesBox .images-row {
  display: flex;
  flex-flow: row;
  height: 100%;
  width: 100%;
  gap: 5px;
  box-sizing: border-box;
  padding: 5px;
}

.singImagesBox .image {
  width: 100%;
  height: auto;
  min-width: 100px;
  max-height: 100px; /* Set a maximum height limit if needed */
  object-fit: contain; /* Maintain aspect ratio and fit within the container */
  background-color: #fbfbfb;
}

.sign-title {
  line-height: 1;
  padding: 0;
  margin: 0;
  margin-bottom: 7px;
}

.submit {
  height: 45px;
  margin-top: 30px;
  max-width: 200px;
  margin-bottom: 400px;
}

.plan-not-found {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

@media (max-width: 600px) {
  .container {
    width: 100%;
  }

  .group {
    width: auto;
    /* max-width: 100% !important; */
  }

  .submit {
    max-width: 100%;
  }
}
</style>
