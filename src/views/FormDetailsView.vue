<template>
  <SelectPlanPopup v-if="selectPlansPopup.active" />
  <SearchAddressPopup v-if="searchAddressPopup.active" />
  <SignPadPopup v-if="isDrawPadOpen" :type="drawType" @savePads="savePads" @closePopup="isDrawPadOpen = false" />

  <div class="container">
    <div class="partition">
      <div class="title">요금제 정보</div>
      <template v-for="(item, index) in findForms('usimForms')" :key="index">
        <template v-if="usimForms[item]">
          <div class="group" :style="{ maxWidth: usimForms[item].width }">
            <label>{{ usimForms[item].label }}</label>
            <template v-if="usimForms[item]['type'] === 'select'">
              <a-select
                v-model:value="usimForms[item].value"
                :style="{ width: '100%' }"
                :placeholder="usimForms[item].placeholder"
                v-bind="inputBindings(item)"
                :options="fetchedData[item]?.map((i) => ({ value: i.cd, label: i.value })) ?? null"
              >
              </a-select>
            </template>

            <template v-if="usimForms[item].type === 'input'">
              <input
                v-model="usimForms[item].value"
                :placeholder="usimForms[item].placeholder"
                v-bind="inputBindings(item)"
              />
            </template>

            <template v-if="usimForms[item].type === 'cleave-birthday-input'">
              <input
                v-model="usimForms[item].value"
                :placeholder="usimForms[item].placeholder"
                v-cleave="{
                  date: true,
                  delimiter: '-',
                  datePattern: ['Y', 'm', 'd'],
                }"
              />
            </template>
          </div>
        </template>
      </template>

      <div class="title">고객 정보</div>
      <template v-for="(item, index) in findForms('customerForms')" :key="index">
        <template v-if="customerForms[item]">
          <div class="group" :style="{ maxWidth: customerForms[item].width }">
            <label>{{ customerForms[item].label }}</label>

            <template v-if="customerForms[item]['type'] === 'select'">
              <a-select
                v-model:value="customerForms[item].value"
                :style="{ width: '100%' }"
                :placeholder="customerForms[item].placeholder"
                v-bind="inputBindings(item)"
                :options="fetchedData[item]?.map((i) => ({ value: i.cd, label: i.value })) ?? null"
              >
              </a-select>
            </template>

            <template v-if="customerForms[item].type === 'input'">
              <input
                v-model="customerForms[item].value"
                :placeholder="customerForms[item].placeholder"
                v-bind="inputBindings(item)"
              />
            </template>

            <template v-if="customerForms[item].type === 'cleave-birthday-input'">
              <input
                v-model="customerForms[item].value"
                :placeholder="customerForms[item].placeholder"
                v-cleave="{
                  date: true,
                  delimiter: '-',
                  datePattern: ['Y', 'm', 'd'],
                }"
              />
            </template>
          </div>
        </template>
      </template>
    </div>

    <a-checkbox class="checkbox" v-model:checked="supportDocsChecked">증빙자료첨부(선택사항)</a-checkbox>

    <!-- uploads images -->
    <input id="file-input" @change="handleFileUpload" type="file" class="file-input" accept="image/*" multiple />

    <div v-if="supportDocsChecked" class="uploadedImagesRow">
      <label for="file-input" class="uploadImageBox">
        <span class="inner-icon material-symbols-outlined"> add </span>
        <p>이미지 업로드</p>
      </label>

      <div v-for="(image, index) in uploadedDocs" :key="index" class="uploadImageBox">
        <img :src="image" :alt="index" />
        <span @click="deleteDocImages(index)" class="delete-icon material-symbols-outlined"> delete </span>
      </div>
    </div>

    <!-- checks and enables container -->
    <a-checkbox class="checkbox" v-model:checked="signAfterPrintChecked"
      >신청서 프린트 인쇄후 서명/사인 자필</a-checkbox
    >
    <div v-if="!signAfterPrintChecked" class="signs-container">
      <!-- form sign container -->
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
      <p v-if="!nameImageData && !signImageData && formSubmitted" class="input-error-message">
        후불이체동의 서명을 하지 않았습니다.
      </p>
    </div>

    <div class="submit">
      <button @click="submit">개통 신청/서식출력</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

import { Select } from 'ant-design-vue'
import { fetchWithTokenRefresh } from '../utils/tokenUtils'
import { USIM_FORM_DETAILS, CUSTOMER_FORM_DETAILS, PLANSINFO } from '../assets/constants'
import { useSelectPlansPopup } from '../stores/select-plans-popup'
import { useSearchaddressStore } from '../stores/select-address-popup'
import SelectPlanPopup from '../components/SelectPlanPopup.vue'
import SearchAddressPopup from '../components/SearchAddressPopup.vue'
import SignPadPopup from '../components/SignPadPopup.vue'

//signAfterPrintChecked
const signAfterPrintChecked = ref(false)
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

//submit form
const formSubmitted = ref(false)
const submit = () => {
  formSubmitted.value = true
  const formKeysSet = new Set(Object.keys(forms.value))
  for (let item of formKeysSet) {
    console.log(isFormAvailable(item))
  }
}

//supported docs checkbox and handler
const supportDocsChecked = ref(true)
// this handles file upload
const uploadedDocs = ref([])
const handleFileUpload = async (event) => {
  const selectedFiles = event.target.files
  const base64Strings = []

  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64String = reader.result
      base64Strings.push(base64String)
      // Check if all selectedFiles have been processed
      if (base64Strings.length === selectedFiles.length) {
        // All selectedFiles have been converted to base64, you can use them here
        uploadedDocs.value = [...uploadedDocs.value, ...base64Strings] //adding new images to the list
      }
    }

    reader.onerror = (error) => {
      console.error('Error reading file:', error)
    }
  }
}

//popup init
const selectPlansPopup = useSelectPlansPopup()
const searchAddressPopup = useSearchaddressStore()

//froms are created from const lists
const usimForms = ref(USIM_FORM_DETAILS)
const customerForms = ref(CUSTOMER_FORM_DETAILS)

//fetched data ref
const fetchedData = ref({})

//initial mount fetches data
onMounted(fetchData)

//finds forms from PLANS info constant
const findForms = (type) => {
  const result =
    PLANSINFO.find((item) => item.code === selectPlansPopup.carrierType) // which type (postpaid or prepaid)
      ?.carriers.find((carrier) => carrier.code === selectPlansPopup.carrierCd) // which carrier
      ?.mvnos.find((mvno) => mvno.code === selectPlansPopup.mvnoCd) || [] //which mvno

  return result[type]
}

// Iterating over usimForms/customerforms to set default values based on fetchData
const defaultSetter = (data) => {
  for (const key in usimForms.value) {
    if (usimForms.value[key].type === 'select' && usimForms.value[key].hasDefault) {
      const defaultValue = data?.[key]?.[0]?.cd ?? null
      usimForms.value[key].value = defaultValue
    }
  }

  for (const key in customerForms.value) {
    if (customerForms.value[key].type === 'select' && customerForms.value[key].hasDefault) {
      const defaultValue = data?.[key]?.[0]?.cd ?? null
      customerForms.value[key].value = defaultValue
    }
  }
}

//this check if anything updating in the address store and updates address fields
watch(
  () => searchAddressPopup.buildingName,
  (newValue) => {
    for (const key in customerForms.value) {
      if (key === 'address_additions') {
        customerForms.value[key].value = searchAddressPopup.buildingName
      }
      if (key === 'address') {
        customerForms.value[key].value = searchAddressPopup.address
      }
    }
  }
)

//bindings for forms
const inputBindings = (item) => {
  if (item === 'usim_plan_nm')
    return {
      value: selectPlansPopup.selectedPlanInfo.usim_plan_nm,
      onClick: (event) => {
        selectPlansPopup.open()
      },
      readonly: true,
    }

  if (item === 'address')
    return {
      value: searchAddressPopup.address,
      onClick: (event) => {
        searchAddressPopup.open()
      },
      readonly: true,
    }
}

async function fetchData() {
  try {
    const response = await fetchWithTokenRefresh('agent/applyInit', {
      method: 'POST',
      body: {
        carrier_type: selectPlansPopup.carrierType,
        carrier_cd: selectPlansPopup.carrierCd,
        mvno_cd: selectPlansPopup.mvnoCd,
      },
    })

    if (response.ok) {
      const decodedResponse = await response.json()
      if (decodedResponse.data) {
        let info = decodedResponse.data
        fetchedData.value = info
        defaultSetter(info)
        // console.log(fetchedData.value)
      }
    } else {
      throw new Error('Fetch data error')
    }
  } catch (error) {
    console.log(error)
    // useSnackbarStore().showSnackbar(error.toString())
  }
}
</script>

<style scoped>
.container {
  max-width: 1400px;
  padding: 0 15px;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
}

.partition {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.group {
  width: 400px;
}

.title {
  /* background-color: aqua; */
  font-size: 18px;
  font-weight: 600;
  margin-top: 20px;
  margin-bottom: 0px;
  width: 100%;
}

.checkbox {
  font-size: 16px;
  font-weight: 600;
  margin-top: 40px;
}

.file-input {
  display: none;
}

.uploadedImagesRow {
  display: flex;
  flex-flow: wrap;
  gap: 20px;
  margin-top: 20px;
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

.signs-container {
  margin-top: 20px;
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
  margin-bottom: 10px;
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
  margin-top: 40px;
  max-width: 200px;
  margin-bottom: 400px;
}
</style>
