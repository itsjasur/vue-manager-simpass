<template>
  <div v-if="serverData" class="container">
    <!-- FORMS -->
    <template v-for="(typeFormNames, index) of availableForms" :key="index">
      <template v-if="typeFormNames.length > 0">
        <div class="partition">
          <div v-if="index === 'usim'" class="title">요금제 정보</div>
          <div v-if="index === 'customer'" class="title">고객 정보</div>
          <div v-if="index === 'deputy'" class="title">법정대리인</div>
          <div v-if="index === 'payment'" class="title">
            <span> 자동이체 </span>
            <a-checkbox class="checkbox left-margin" v-model:checked="selfRegisterChecked">가입자와 동일</a-checkbox>
          </div>

          <template v-for="(formName, index) in typeFormNames" :key="index">
            <!-- <div>{{ FIXED_FORMS[formName] }}</div> -->
            <div class="group" :style="{ maxWidth: FIXED_FORMS[formName].maxwidth }">
              <label>{{ FIXED_FORMS[formName].label }}</label>

              <!-- input -->
              <template v-if="FIXED_FORMS[formName].type === 'input'">
                <input v-model="FIXED_FORMS[formName].value" v-bind="inputBindings(formName)" />
              </template>

              <!-- select -->
              <template v-if="FIXED_FORMS[formName].type === 'select'">
                <a-select
                  v-model:value="FIXED_FORMS[formName].value"
                  :style="{ width: '100%' }"
                  @change="generateInitialForms"
                  :options="FIXED_FORMS[formName].options"
                  v-bind="inputBindings(formName)"
                >
                </a-select>
              </template>

              <!-- cleave -->
              <template v-if="FIXED_FORMS[formName].type === 'cleave'">
                <input
                  v-model="FIXED_FORMS[formName].value"
                  v-cleave="FIXED_FORMS[formName].pattern"
                  v-bind="inputBindings(formName)"
                />
              </template>

              <p v-if="formSubmitted && FIXED_FORMS[formName].errorMessage" class="input-error-message">
                {{ FIXED_FORMS[formName].errorMessage }}
              </p>

              <!-- <p v-if="FIXED_FORMS[formName].errorMessages" class="input-error-message">
                {{ FIXED_FORMS[formName].errorMessage }}
              </p> -->

              <!-- <p
                v-if="
                  formSubmitted &&
                  !FIXED_FORMS[formName].value &&
                  (formName !== 'usim_model_list' || serverData?.usim_plan_info?.chk_usim_model === 'Y')
                "
                class="input-error-message"
              >
                {{ FIXED_FORMS[formName].error }}
              </p> -->
            </div>
          </template>
        </div>
      </template>
    </template>

    <!-- IMAGE UPLOAD -->
    <div class="supperted-images">
      <a-checkbox class="checkbox" v-model:checked="supportedImagesChecked">증빙자료첨부(선택사항)</a-checkbox>
      <input id="file-input" @change="handleFileUpload" type="file" style="display: none" accept="image/*" multiple />

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
    </div>

    <!-- checks and enables sign container -->
    <a-checkbox class="checkbox" v-model:checked="signAfterPrintChecked"
      >신청서 프린트 인쇄후 서명/사인 자필</a-checkbox
    >

    <div class="sing-name-pads" v-if="!signAfterPrintChecked">
      <!-- form sign pad -->
      <SignImageRowContainer
        type="forms"
        :placeholder="FIXED_FORMS.name?.value"
        @updated="updatePads"
        title="가입자서명"
        :errorMessage="!nameImageData && !signImageData && formSubmitted ? '가입자서명을 하지 않았습니다.' : null"
      />
      <!-- payment pad-->
      <SignImageRowContainer
        v-if="serverData?.usim_plan_info?.carrier_type === 'PO' && !selfRegisterChecked"
        type="payment"
        :placeholder="FIXED_FORMS.account_name?.value"
        @updated="updatePads"
        title="자동이체 서명"
        :errorMessage="
          !paymentNameImageData && !paymentSignImageData && formSubmitted
            ? '후불이체동의 서명을 하지 않았습니다.'
            : null
        "
      />
      <!-- deputy sign pad -->
      <SignImageRowContainer
        v-if="availableForms.deputy.length > 0"
        type="deputy"
        :placeholder="FIXED_FORMS.deputy_name?.value"
        @updated="updatePads"
        title="법정대리인 서명"
        :errorMessage="
          !deputyNameImageData && !deputySignImageData && formSubmitted ? '법정대리인서명을 하지 않았습니다.' : null
        "
      />
      <!-- partner sign pad -->
      <SignImageRowContainer
        v-if="serverData?.chk_partner_sign === 'N'"
        type="partner"
        @updated="updatePads"
        title="판매자 서명"
        :errorMessage="
          !partnerNameImageData && !partnerSignImageData && formSubmitted ? '판매자서명을 하지 않았습니다.' : null
        "
      />

      <!-- i agree pad -->
      <AgreePadPopupContainer
        v-if="serverData?.usim_plan_info?.mvno_cd === 'UPM'"
        @updated="updateAgreePad"
        title="동의합니다"
        :errorMessage="!agreePadData && formSubmitted ? '가입약관에 동의하지 않았습니다.' : null"
      />
    </div>

    <button class="submit" @click="submit" :disabled="formSubmitting">
      <LoadingSpinner v-if="formSubmitting" height="20px" color="#ffffff" />
      <span v-else> 개통 신청/서식출력</span>
    </button>
  </div>

  <div v-else class="plan-not-found">요금제를 찾을 수 없습니다</div>
</template>

<script setup>
import { useSnackbarStore } from '@/stores/snackbar'
import { fetchWithTokenRefresh } from '@/utils/tokenUtils'
import { computed, onMounted, reactive, ref, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { FORMS } from '../assets/constants2'
import { PLANSINFO } from '../assets/constants'
import _ from 'lodash'
import SignImageRowContainer from '../components/SignImageRowContainer.vue'
import AgreePadPopupContainer from '../components/AgreePadPopupContainer.vue'
import { useSearchaddressStore } from '../stores/select-address-popup'
import LoadingSpinner from '../components/Loader.vue'
import { usePrintablePopup } from '../stores/printable-popup'
import { useSelectPlansPopup } from '../stores/select-plans-popup'

//address poup
const selectAddressPopup = useSearchaddressStore()

const route = useRoute()

//need to make deep copy in order to reset when page reloads
const FIXED_FORMS = reactive(_.cloneDeep(FORMS))

//setting address and addressdetail to store value
//addressdetail needs get and set in order to be editable
FIXED_FORMS.address.value = computed(() => selectAddressPopup.address)
FIXED_FORMS.addressdetail.value = computed({
  get: () => selectAddressPopup.buildingName,
  set: (newValue) => (selectAddressPopup.buildingName = newValue),
})

//this inits page
onMounted(fetchData)
//this watches route id (if plan id changed)
watch(() => route.params.id, fetchData)

// 1 first fetch data onMounted()
const serverData = ref(null)

// finding forms
const availableForms = reactive({ usim: [], customer: [], deputy: [], payment: [] })

async function fetchData() {
  try {
    const response = await fetchWithTokenRefresh('agent/applyInit', {
      method: 'POST',
      body: { usim_plan_id: route.params.id },
    })
    if (!response.ok) throw 'Fetch data error'

    const decodedResponse = await response.json()
    serverData.value = decodedResponse.data

    //setting usim plan name everytime it refetches
    FIXED_FORMS.usim_plan_nm.value = serverData.value.usim_plan_info.usim_plan_nm

    generateInitialForms()
  } catch (error) {
    useSnackbarStore().showSnackbar(error.toString())
  }
}

//generates forms here
function generateInitialForms() {
  //usim plan info is form server data
  const usimPlanInfo = serverData.value?.usim_plan_info

  let selectedTypeInfo = PLANSINFO.find((item) => item.code === usimPlanInfo.carrier_type) //selected type
  let selectedCarrierInfo = selectedTypeInfo.carriers.find((carrier) => carrier.code === usimPlanInfo.carrier_cd) //selected carrier
  let selectedMvnoInfo = selectedCarrierInfo.mvnos.find((mvno) => mvno.code === usimPlanInfo.mvno_cd) //selected mvno

  //setting available forms in each mvno
  availableForms.usim = [...(selectedMvnoInfo?.usimForms ?? [])]
  availableForms.customer = [...(selectedMvnoInfo?.customerForms ?? [])]
  availableForms.deputy = []

  //finding payment forms in each type
  availableForms.payment = [...(selectedTypeInfo?.paymentForms ?? [])]

  //adding options to select forms
  for (const formName in FIXED_FORMS) {
    if (FIXED_FORMS[formName]?.type === 'select')
      FIXED_FORMS[formName].options = serverData.value[formName]?.map((i) => ({ value: i.cd, label: i.value })) ?? [
        { value: 'N/A', label: 'N/A' },
      ]
  }
  //set default once forms created and after additional forms added
  setDefault()

  //EXTRA FIELDS FOR FORMS
  //adding usim extra forms
  if (FIXED_FORMS?.usim_act_cd?.value === 'N') {
    availableForms.usim.push('wish_number')
    //wish numbers input with cleave
    let wishArray = Array(selectedMvnoInfo.wishCount).fill(4) //[4,4,4]
    FIXED_FORMS.wish_number.pattern = { numericOnly: true, delimiter: ' / ', blocks: wishArray } //4,4,4
    FIXED_FORMS.wish_number.placeholder = wishArray.map((e) => '1234').join(' / ')
  }

  if (FIXED_FORMS?.usim_act_cd?.value === 'M')
    availableForms.usim.push('mnp_carrier_type', 'phone_number', 'mnp_pre_carrier')
  if (FIXED_FORMS?.mnp_pre_carrier?.value === 'MV') availableForms.usim.push('mnp_pre_carrier_nm')

  if (FIXED_FORMS?.paid_transfer_cd?.value === 'C') availableForms.payment.push('card_yy_mm')

  //adding deputy forms
  if (FIXED_FORMS?.cust_type_cd?.value === 'COL')
    availableForms.deputy.push('deputy_name', 'deputy_birthday', 'relationship_cd', 'deputy_contact')

  //after extra forms added, set default should be called again!
  setDefault()

  //settnig country code
  FIXED_FORMS.country.value = ''
  if (FIXED_FORMS?.cust_type_cd?.value !== 'MEA') FIXED_FORMS.country.value = '대한민국'
}

//sets default values
function setDefault() {
  for (const formName in FIXED_FORMS) {
    if (
      FIXED_FORMS[formName].type === 'select' &&
      FIXED_FORMS[formName].hasDefault &&
      FIXED_FORMS[formName].value === null
    )
      FIXED_FORMS[formName].value = serverData.value[formName]?.[0]?.cd ?? null
  }
}

//creating extra bindings for forms
const inputBindings = (formName) => {
  let bindings = {
    placeholder: FIXED_FORMS[formName].placeholder,
  }

  //usim plan name is readonly
  if (formName === 'usim_plan_nm') {
    bindings.onClick = (event) => {
      useSelectPlansPopup().open(
        serverData.value?.usim_plan_info?.carrier_type,
        serverData.value?.usim_plan_info?.carrier_cd,
        serverData.value?.usim_plan_info?.mvno_cd
      )
    }
    bindings.readonly = true
  }

  if (/name/i.test(formName)) {
    bindings.onInput = (event) => {
      FIXED_FORMS[formName].value = event.target.value.toUpperCase()
      // console.log('clicked')
    }
  } //checking all forms with name

  if (formName === 'address') {
    bindings.onClick = (event) => selectAddressPopup.open()
    bindings.readonly = true
  }
  if (formName === 'account_number') {
    bindings.onInput = (event) => {
      FIXED_FORMS[formName].value = event.target.value.replace(/[^0-9]/g, '')
    }
  }

  return bindings
}

// weather the registerer is owner or somebody else
const selfRegisterChecked = ref(false)

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
  createImageUrls()
}

//will sign after print
const signAfterPrintChecked = ref(false)
//signs image data
const nameImageData = ref(null)
const signImageData = ref(null)

const paymentNameImageData = ref(null)
const paymentSignImageData = ref(null)

const deputyNameImageData = ref(null)
const deputySignImageData = ref(null)

//shows if partner has no sign in profile
const partnerNameImageData = ref(null)
const partnerSignImageData = ref(null)

//draw popup
const updatePads = ({ name, sign, type }) => {
  switch (type) {
    case 'forms':
      nameImageData.value = name
      signImageData.value = sign
      break
    case 'deputy':
      deputyNameImageData.value = name
      deputySignImageData.value = sign
      break
    case 'payment':
      paymentNameImageData.value = name
      paymentSignImageData.value = sign
      break
    case 'partner':
      partnerNameImageData.value = name
      partnerSignImageData.value = sign
      break
    default:
      useSnackbarStore().showSnackbar('Invalid pad type')
  }
}

//i agreee pad
const agreePadData = ref(null)
const updateAgreePad = (data) => (agreePadData.value = data)

var submitCheckList = [false]

// checking and updateing error codes
for (const formName in FIXED_FORMS) {
  watchEffect(() => {
    submitCheckList = []
    if (!FIXED_FORMS[formName].required) return

    //resets to null here
    FIXED_FORMS[formName].errorMessage = null

    //setting special error
    if (formName === 'deputy_contact' || formName === 'contact' || formName === 'phone_number') {
      if (FIXED_FORMS[formName]?.value?.replaceAll('-', '').length < 10) {
        FIXED_FORMS[formName].errorMessage = '전화번호를 정확하게 입력하세요.'
        submitCheckList.push(false)
      }
    }

    //setting special errors
    if (formName === 'card_yy_mm' && FIXED_FORMS[formName]?.value?.replaceAll('/', '').length < 4) {
      FIXED_FORMS[formName].errorMessage = '카드 만료일은 MM(월) 및 YY(년)여야 합니다.'
      submitCheckList.push(false)
    }

    if (formName === 'birthday' || formName === 'deputy_birthday' || formName === 'account_birthday') {
      if (FIXED_FORMS[formName]?.value?.replaceAll('-', '')?.length < 8) {
        FIXED_FORMS[formName].errorMessage = '올바른 날짜를 입력하십시오'
        submitCheckList.push(false)
      }
    }

    if (serverData?.chk_usim_model === 'N') {
      FIXED_FORMS[formName].errorMessage = FIXED_FORMS[formName].error
    }

    if (FIXED_FORMS[formName].value === null || FIXED_FORMS[formName].value === '') {
      FIXED_FORMS[formName].errorMessage = FIXED_FORMS[formName].error
      submitCheckList.push(false)
      return
    }

    console.log(submitCheckList)

    // console.log(submitCheckList)
    // usim check required status
    // FIXED_FORMS.usim_model_list.required = serverData?.chk_usim_model === 'Y'
  })
}

function formValidate() {
  submitCheckList = []

  //if all avl forms are filled
  for (let type in availableForms) {
    availableForms[type].forEach((formName) => {
      FIXED_FORMS[formName].errorMessage = null
      if (!FIXED_FORMS[formName]?.required) return

      if (FIXED_FORMS[formName].value === null || FIXED_FORMS[formName].value === '') {
        FIXED_FORMS[formName].errorMessage = FIXED_FORMS[formName].error
        submitCheckList.push(false)
      }

      //setting special error
      if (formName === 'deputy_contact' || formName === 'contact' || formName === 'phone_number') {
        if (FIXED_FORMS[formName]?.value?.replaceAll('-', '').length < 10) {
          FIXED_FORMS[formName].errorMessage = '전화번호를 정확하게 입력하세요.'
          submitCheckList.push(false)
        }
      }

      //
      //
      //

      if (formName === 'usim_model_list' && serverData.value.chk_usim_model === 'Y') {
        FIXED_FORMS[formName].errorMessage = null
        return
      }
      if (FIXED_FORMS[formName].error === null) {
        submitCheckList.push(true)
        FIXED_FORMS[formName].errorMessage = null
        return
      }
      if (FIXED_FORMS[formName].value) {
        submitCheckList.push(true)
        FIXED_FORMS[formName].errorMessage = null
        return
      }

      submitCheckList.push(false)
    })
  }

  if (!signAfterPrintChecked.value) {
    submitCheckList.push(nameImageData.value && signImageData.value ? true : false)

    if (!selfRegisterChecked.value) {
      submitCheckList.push(paymentNameImageData.value && paymentSignImageData.value ? true : false)
    }

    if (availableForms.deputy.length > 0) {
      submitCheckList.push(deputyNameImageData.value && deputySignImageData.value ? true : false)
    }

    if (serverData.value?.usim_plan_info?.mvno_cd === 'UPM') {
      submitCheckList.push(agreePadData.value ? true : false)
    }
  }
}

//SUBMIT
//FORM DATA REQUEST
const formSubmitting = ref(false)
const formSubmitted = ref(true)
const formData = new FormData()

async function submit() {
  formSubmitted.value = true

  // //if all avl forms are filled
  // for (let type in availableForms) {
  //   availableForms[type].forEach((formName) => {
  //     FIXED_FORMS[formName].errorMessage = FIXED_FORMS[formName].error

  //     if (formName === 'usim_model_list' && serverData.value.chk_usim_model === 'Y') {
  //       submitCheckList.push(true)
  //       FIXED_FORMS[formName].errorMessage = null
  //       return
  //     }
  //     if (FIXED_FORMS[formName].error === null) {
  //       submitCheckList.push(true)
  //       FIXED_FORMS[formName].errorMessage = null
  //       return
  //     }
  //     if (FIXED_FORMS[formName].value) {
  //       submitCheckList.push(true)
  //       FIXED_FORMS[formName].errorMessage = null
  //       return
  //     }

  //     submitCheckList.push(false)
  //   })
  // }

  // if (!signAfterPrintChecked.value) {
  //   submitCheckList.push(nameImageData.value && signImageData.value ? true : false)

  //   if (!selfRegisterChecked.value) {
  //     submitCheckList.push(paymentNameImageData.value && paymentSignImageData.value ? true : false)
  //   }

  //   if (availableForms.deputy.length > 0) {
  //     submitCheckList.push(deputyNameImageData.value && deputySignImageData.value ? true : false)
  //   }

  //   if (serverData.value?.usim_plan_info?.mvno_cd === 'UPM') {
  //     submitCheckList.push(agreePadData.value ? true : false)
  //   }
  // }

  if (submitCheckList.every((item) => item === true)) {
    await fetchForms()
  } else {
    useSnackbarStore().showSnackbar('채워지지 않은 필드가 있습니다.')
  }

  console.log(availableForms.usim)
  console.log(submitCheckList)
}

async function fetchForms() {
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

  formData.set('carrier_type', serverData.value?.value?.usim_plan_info?.carrier_type)
  formData.set('carrier_cd', serverData.value?.value?.usim_plan_info?.carrier_cd)
  formData.set('usim_plan_id', serverData.value?.value?.usim_plan_info?.id)

  for (const form in FIXED_FORMS) {
    formData.set(form, FIXED_FORMS[form].value)
  }

  try {
    const response = await fetchWithTokenRefresh('agent/actApply', { method: 'POST', body: formData })

    if (response.ok) {
      const decodedResponse = await response.json()
      base64Images.value = decodedResponse.data.apply_forms_list
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

<style>
.container {
  max-width: 1400px;
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  gap: 30px;
}

.partition {
  display: flex;
  flex-flow: wrap;
  gap: 20px;
  margin-bottom: 30px;
  min-height: 100px;
}

.title {
  font-size: 18px;
  font-weight: 600;
  margin-top: 20px;
  margin-bottom: 0px;
  width: 100%;
}

.group {
  width: 100%;
  /* background-color: aquamarine; */
}

.checkbox {
  font-size: 16px;
  font-weight: 500;
}
.left-margin {
  margin-left: 15px;
}
.uploadedImagesRow {
  display: flex;
  flex-flow: wrap;
  gap: 20px;
  margin-top: 15px;
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
  background-color: #fff;
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

.sing-name-pads {
  display: flex;
  flex-flow: column;
  gap: 25px;
  font-weight: 500;
}
.plan-not-found {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 25px;
}
.submit {
  height: 45px;
  margin-top: 30px;
  max-width: 200px;
  margin-bottom: 400px;
}
</style>
