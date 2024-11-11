<template>
  <div class="popup-content">
    <div class="fixed-header">
      <p class="title">판매점 계약 동의 및 계약내용 확인</p>
      <span @click="$emit('closePopup')" class="material-symbols-outlined close-button"> cancel </span>
    </div>

    <div class="scrollable-content">
      <span class="title-note"
        >본 신청서는 심패스에서 직접 운영하는 판매점 전자계약서이며 고객님에 소중한 개인정보는 암호화되어 안전하게
        보호됩니다.
      </span>

      <div class="checkbox-contract-row">
        <a-checkbox class="checkbox" v-model:checked="agreeToContracTerms">판매점 계약서 내용 동의 (필수)</a-checkbox>
        <button @click="fetchContractPDFAndPrint" class="see-contract-button">계약서 확인</button>
      </div>

      <div class="part-title">판매점 정보</div>

      <div class="group">
        <label>상호명*</label>
        <input :value="serverData.partner_nm" readonly />
        <p v-if="submitted && !serverData.partner_nm" class="input-error-message">상호명를 입력하세요.</p>
      </div>

      <div class="group-row">
        <div class="group">
          <label>사업자번호*</label>

          <CleaveInput
            v-model="serverData.business_num"
            placeholder="000-00-00000"
            :options="cleavePatterns.businessNumberPattern"
            readonly
          />

          <p v-if="submitted && !serverData.business_num" class="input-error-message">사업자번호를 입력하세요.</p>
        </div>

        <div class="group">
          <label>대표자명*</label>
          <input :value="serverData.contractor" readonly />
          <p v-if="submitted && !serverData.contractor" class="input-error-message">대표자명를 입력하세요.</p>
        </div>
      </div>

      <div class="group-row">
        <div class="group">
          <label>연락 번호*</label>

          <CleaveInput
            v-model="serverData.phone_number"
            placeholder="010-1234-5678"
            :options="cleavePatterns.phoneNumberPattern"
            readonly
          />
          <p v-if="submitted && !serverData.phone_number" class="input-error-message">연락 번호를 입력하세요.</p>
        </div>

        <div class="group">
          <label>이메일주소*</label>

          <div class="group-inner-row">
            <input v-model="forms.email" @input="validateForms" />
          </div>
          <p v-if="submitted && errors.email" class="input-error-message">{{ errors.email }}</p>
        </div>
      </div>
      <div class="group-row">
        <div class="group">
          <label>매장 전화</label>

          <CleaveInput
            placeholder="02-1234-5678"
            :options="cleavePatterns.phoneNumberPattern"
            @rawValue="forms.telNumber = $event"
          />
        </div>

        <div class="group">
          <label>매장 팩스</label>

          <CleaveInput
            placeholder="02-1234-5678"
            :options="cleavePatterns.phoneNumberPattern"
            @rawValue="forms.faxNumber = $event"
          />
        </div>
      </div>

      <div class="group-row">
        <div class="group">
          <label>주소*</label>
          <input v-model="forms.address" @input="validateForms" @click="searchAddressPopup.open()" readonly />
          <p v-if="submitted && errors.address" class="input-error-message">{{ errors.address }}</p>
        </div>

        <div class="group" style="width: 70%">
          <label>상세주소*</label>
          <input v-model="forms.addressAdditions" @input="validateForms" />
        </div>
      </div>

      <!-- payment data -->
      <div class="part-title">수수료 입금계좌 정보</div>

      <div class="group-row">
        <div class="group">
          <label>예급주 명*</label>
          <input :value="serverData.contractor" readonly />
          <p v-if="submitted && !serverData.contractor" class="input-error-message">예급주 명를 입력하세요.</p>
        </div>

        <div class="group" style="width: 60%">
          <label>생년월일*</label>

          <CleaveInput
            v-model="serverData.birthday"
            placeholder="1991-01-31"
            :options="cleavePatterns.birthdayPatternFull"
            readonly
          />

          <p v-if="submitted && !serverData.birthday" class="input-error-message">생년월일를 입력하세요.</p>
        </div>
      </div>

      <div class="group-row">
        <div class="group">
          <label>은행명 (첨부할 자료와 동일)*</label>
          <input v-model="forms.bankName" @input="validateForms" />
          <p v-if="submitted && errors.bankName" class="input-error-message">{{ errors.bankName }}</p>
        </div>

        <div class="group">
          <label>계좌번호 (첨부할 자료와 동일)*</label>
          <input v-model="forms.accountNumber" @input="validateForms" />
          <p v-if="submitted && errors.accountNumber" class="input-error-message">{{ errors.accountNumber }}</p>
        </div>
      </div>

      <!-- files data -->
      <div class="part-title">판매점 서류 등록</div>

      <div v-for="(item, index) in imageUploads" :key="index" class="image-uploads">
        <div class="upload-row">
          <input
            :id="`file-input-${index}`"
            @change="handleFileUpload($event, index)"
            type="file"
            style="display: none"
            accept="image/*"
          />
          <span class="upload-title"> {{ item.title }} </span>

          <div class="right-side">
            <div v-if="item.initial" class="submitted">
              <span>문서가 제출되었습니다</span>
              <span class="material-symbols-outlined"> new_releases </span>
            </div>

            <div v-if="!item.initial && !item.new" class="not-submitted">
              <span class="material-symbols-outlined"> add </span>
              <label :for="`file-input-${index}`">이미지 업로드</label>
            </div>

            <div v-if="!item.initial && item.new" class="file-name">
              <span>{{ item.new.name }}</span>
            </div>

            <div v-if="!item.initial && item.new" class="not-submitted">
              <span class="material-symbols-outlined"> add </span>
              <label :for="`file-input-${index}`">재업로드</label>
            </div>
          </div>
        </div>
        <p v-if="submitted && !item.initial && !item.new && item.required" class="input-error-message">
          이미지를 업로드해주세요.
        </p>
      </div>

      <template v-if="useDeviceTypeStore().isDeviceMobile() && partnerInfoFetched">
        <SignImageRowContainer
          :overlayText="serverData.contractor"
          title="판매자 서명"
          signComment="판매자 이름을 적어주세요"
          sealComment="판매자 사인을 해주세요"
          @updateSignSeal="updatePads"
          :errorMessage="submitted && (!signData || !sealData) ? '판매자서명을 하지 않았습니다.' : null"
          :signImageData="signData"
          :sealImageData="sealData"
        />
      </template>

      <template v-else>
        <template v-if="signData && sealData">
          <SignImageRowContainer
            title="판매자 서명"
            signComment="판매자 이름을 적어주세요"
            sealComment="판매자 사인을 해주세요"
            @updateSignSeal="updatePads"
            :signImageData="signData"
            :sealImageData="sealData"
          />
        </template>
        <button v-else @click="showSendSmsPopupContent" class="sign_seal_button">서명/사인 하기</button>
      </template>

      <button @click="submit" :disabled="isSubmitting">
        <LoadingSpinner v-if="isSubmitting" height="20px" color="#ffffff" />
        <span v-else> 온라인 판매점 계약신청 </span>
      </button>
    </div>
  </div>
  <PrintablePdfPopup v-if="printablePdfPopup.active" />

  <GlobalPopupWithOverlay ref="smsPopupRef">
    <SendSmsPopupContent
      @closePopup="closeSendSmsPopupContent"
      :phoneNumber="serverData.phone_number"
      :partnerCd="serverData.partner_cd"
    />
  </GlobalPopupWithOverlay>
</template>

<script setup>
import { ref, onMounted, reactive, watchEffect } from 'vue'
import * as cleavePatterns from '../utils/cleavePatterns'
import { useSearchaddressStore } from '@/stores/select-address-popup'
import { useSnackbarStore } from '@/stores/snackbar'
import { fetchWithTokenRefresh } from '@/utils/tokenUtils'
import { useRouter } from 'vue-router'
import { useWarningStore } from '@/stores/warning'
import LoadingSpinner from '../components/Loader.vue'
import * as VALIDATOR from '../utils/validators'
import SignImageRowContainer from '../components/SignImageRowContainer.vue'
import PrintablePdfPopup from '../components/PrintablePdfPopup.vue'
import { usePrintablePdfPopup } from '@/stores/printable-pdf-popup'
import { useDeviceTypeStore } from '@/stores/device-type-store'
import GlobalPopupWithOverlay from './GlobalPopupWithOverlay.vue'
import SendSmsPopupContent from './SendSmsPopupContent.vue'

//sign and seal popup
const smsPopupRef = ref(null)
const showSendSmsPopupContent = () => {
  smsPopupRef.value.showPopup()
}
const closeSendSmsPopupContent = (sign, seal) => {
  if (sign) signData.value = sign
  if (seal) sealData.value = seal
  smsPopupRef.value.closePopup()
}

const printablePdfPopup = usePrintablePdfPopup()
const router = useRouter()
const warning = useWarningStore()

const emit = defineEmits(['closePopup'])

const props = defineProps({ agentCd: { type: String, required: true } })

const signData = ref()
const sealData = ref()

const updatePads = (sign, seal) => {
  signData.value = sign
  sealData.value = seal
}

const agreeToContracTerms = ref(false)

const forms = reactive({
  telNumber: '',
  faxNumber: '',
  email: '',
  address: '',
  addressAdditions: '',
  bankName: '',
  accountNumber: '',
})

const errors = reactive({
  email: '',
  address: '',
  bankName: '',
  accountNumber: '',
})

function validateForms() {
  const res = [
    (errors.email = VALIDATOR.validateEmail(forms.email)),
    (errors.address = forms.address ? '' : '주소를 입력하세요.'),
    (errors.bankName = forms.bankName ? '' : '은행명를 입력하세요.'),
    (errors.accountNumber = forms.accountNumber ? '' : '계좌번호를 입력하세요.'),
  ]
  return res.every((value) => value === null || value === '')
}

const serverData = ref({})

//docs and images
const imageUploads = reactive({
  businessLicence: { initial: null, new: null, required: true, title: '사업자 등록증 (필수)' },
  directorId: { initial: null, new: null, required: true, title: '대표자 신분증 (필수)' },
  bankBook: { initial: null, new: null, required: true, title: '통장 사본 (필수)' },
})

//setting address and addressdetail to store value
const searchAddressPopup = useSearchaddressStore()
watchEffect(() => {
  forms.address = searchAddressPopup.address
  forms.addressAdditions = searchAddressPopup.buildingName
})

const partnerInfoFetched = ref(false)
async function fetchData() {
  try {
    const response = await fetchWithTokenRefresh('agent/partnerInfo', { method: 'GET' })

    if (!response.ok) throw 'Fetch data error'

    const decodedResponse = await response.json()
    const info = decodedResponse.data.info
    serverData.value = info

    forms.telNumber = info.store_contact
    forms.faxNumber = info.store_fax
    forms.address = info.address
    forms.addressAdditions = info.dtl_address
    forms.accountNumber = info.bank_num
    forms.bankName = info.bank_nm
    forms.email = info.email

    imageUploads.businessLicence.initial = info.bs_reg_no
    imageUploads.directorId.initial = info.id_card
    imageUploads.bankBook.initial = info.bank_book

    signData.value = info.partner_sign
    sealData.value = info.partner_seal
  } catch (error) {
    useSnackbarStore().show(error.toString())
  } finally {
    partnerInfoFetched.value = true
  }
}

//  a ref for storing File objects
const handleFileUpload = async (event, itemName) => {
  if (itemName === 'businessLicence') imageUploads.businessLicence.new = event.target.files[0]
  if (itemName === 'directorId') imageUploads.directorId.new = event.target.files[0]
  if (itemName === 'bankBook') imageUploads.bankBook.new = event.target.files[0]
}

const submitted = ref(false)
const isSubmitting = ref(false)
const formData = new FormData()

async function submit() {
  submitted.value = true

  if (!agreeToContracTerms.value) {
    useSnackbarStore().show('판매점 계약서 내용에 동의해주세요.')
    return
  }

  const imagesFilled = Object.values(imageUploads).every((item) => !item.required || item.initial || item.new)

  if (!validateForms() || !imagesFilled) {
    useSnackbarStore().show('채워지지 않은 필드가 있습니다.')
    return
  }

  if (!signData.value || !sealData.value) {
    useSnackbarStore().show('판매자서명을 하지 않았습니다.')
    return
  }

  if (imageUploads.businessLicence.new && imageUploads.businessLicence.new instanceof File)
    formData.set(
      'bs_reg_no_attach',
      imageUploads.businessLicence.new,
      imageUploads?.businessLicence?.new?.name ?? 'filename'
    )

  if (imageUploads.directorId.new && imageUploads.directorId.new instanceof File)
    formData.set('id_card_attach', imageUploads.directorId.new, imageUploads?.directorId?.new?.name ?? 'filename')

  if (imageUploads.bankBook.new && imageUploads.bankBook.new instanceof File)
    formData.set('bank_book_attach', imageUploads.bankBook.new, imageUploads?.bankBook?.new?.name ?? '')

  formData.set('agent_cd', props.agentCd)

  formData.set('contractor', serverData.value.contractor)
  formData.set('birthday', serverData.value.birthday)
  formData.set('partner_nm', serverData.value.partner_nm)

  formData.set('business_num', serverData.value.business_num)
  formData.set('phone_number', serverData.value.phone_number)

  formData.set('email', forms.email)
  formData.set('store_contact', forms.telNumber)
  formData.set('store_fax', forms.faxNumber)

  formData.set('address', forms.address)
  formData.set('dtl_address', forms.addressAdditions)

  formData.set('bank_nm', forms.bankName)
  formData.set('bank_num', forms.accountNumber)

  formData.set('id_cert_type', serverData.value.id_cert_type)
  formData.set('receipt_id', serverData.value.receipt_id)

  formData.set('partner_sign', signData.value)
  formData.set('partner_seal', sealData.value)

  try {
    isSubmitting.value = true

    const response = await fetchWithTokenRefresh('agent/contract', { method: 'POST', body: formData })

    if (!response.ok) {
      const decodedResponse = await response.json()
      throw decodedResponse?.message ?? 'Request'
    }

    const decodedResponse = await response.json()

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    await delay(2000)

    if (decodedResponse.result === 'SUCCESS') {
      emit('closePopup')
      warning.open('접수완료', ['정상적으로 거래접수가 완료되었습니다.'])
      router.push('/')
    }
  } catch (error) {
    useSnackbarStore().show(error.toString())
  } finally {
    isSubmitting.value = false
  }
}

async function fetchContractPDFAndPrint() {
  try {
    const response = await fetchWithTokenRefresh('agent/contractForms', {
      method: 'POST',
      body: { agent_cd: props.agentCd },
    })

    if (!response.ok) throw 'Fetch contract PDF data error'

    const pdfData = await response.blob()
    const blob = new Blob([pdfData], { type: 'application/pdf' })
    // a URL for the Blob
    const url = URL.createObjectURL(blob)
    if (!useDeviceTypeStore().isDeviceMobile()) {
      printablePdfPopup.open(url)
    } else {
      //  temporary anchor element to trigger the download
      const a = document.createElement('a')
      a.href = url
      // a.download = form.title + '.pdf' // desired file name
      document.body.appendChild(a)
      a.click()
      window.open(url, '_blank')
      // Clean up
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  } catch (error) {
    useSnackbarStore().show(error.toString())
  }
}

onMounted(fetchData)
</script>

<style scoped>
.popup-content {
  background-color: var(--main-background-color);
  border-radius: 8px;
  max-width: 900px;
  display: flex;
  flex-flow: column;
  box-sizing: border-box;
  margin: 20px;
}

.scrollable-content {
  padding: 25px;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  gap: 30px;
  overflow-y: auto;
}

.title-note {
  font-size: 15px;
  color: #6e7881;
  line-height: 1.5;
  font-weight: 500;
  margin-top: 10px;
}

.checkbox-contract-row {
  display: flex;
  flex-flow: wrap;
  gap: 10px;
  align-items: center;
}

.checkbox {
  font-weight: 500;
}

.see-contract-button {
  border: 1.5px solid var(--main-color);
  background-color: transparent;
  color: var(--main-color);
  padding: 5px 10px;
  margin: 0;
  height: auto;
  min-height: 0;
  min-width: 0;
}

.group-row {
  display: flex;
  flex-flow: row;
  gap: 20px;
  width: 100%;
}

.group {
  width: 100%;
}

.group-inner-row {
  display: flex;
  flex-flow: row;
  gap: 10px;
}

.part-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: -10px;
}

button {
  margin-top: 30px;
  margin-bottom: 50px;
  min-width: 200px;
  width: auto;
  align-self: flex-end;
}

.sign_seal_button {
  align-self: self-start;
  background-color: #cda000;
}

.upload-row {
  display: flex;
  flex-flow: row;
  justify-content: space-between;

  min-height: 50px;
  padding: 0 10px;
  align-items: center;
  border-radius: 4px;
  border: 1.5px dashed var(--main-color);
  box-sizing: border-box;
}

.right-side {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  line-height: 1;
  align-items: center;
  gap: 7px;
}

.upload-title {
  font-size: 15px;
  font-weight: 500;
}

.submitted .material-symbols-outlined {
  font-variation-settings:
    'FILL' 1,
    'wght' 400;
  color: #00be00;
  font-size: 22px;
  line-height: 1;
}
.submitted {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 15px;
}

.not-submitted {
  display: flex;
  align-items: center;
  padding: 0 5px;
  border-radius: 3px;
  min-height: 30px;
  border: 1px dashed var(--main-color);
  font-size: 15px;
  color: var(--main-color);
  cursor: pointer;
}

.upload-add-box {
  margin: 0;
  display: flex;
  align-items: center;
  color: var(--main-color);
}

.upload-row label {
  all: unset;
}

.file-name {
  max-width: 200px;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 15px;
}

@media (max-width: 600px) {
  .group-row {
    flex-flow: column;
  }

  .group {
    width: 100% !important;
  }
}
</style>
