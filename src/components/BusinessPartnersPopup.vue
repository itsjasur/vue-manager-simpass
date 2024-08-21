<template>
  <div class="popup-content">
    <div class="fixed-header">
      <p class="title">판매점 계약 서명</p>
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
            <input v-model="serverData.email" @input="validateForms" />
          </div>
          <p v-if="submitted && errors.email" class="input-error-message">{{ errors.email }}</p>
        </div>
      </div>

      <template v-if="useDeviceTypeStore().isDeviceMobile() && partnerInfoFetched">
        <SignImageRowContainer
          :overlayText="serverData.contractor"
          title="판매자 서명"
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
import { ref, onMounted } from 'vue'
import * as cleavePatterns from '../utils/cleavePatterns'
import { useSnackbarStore } from '@/stores/snackbar'
import { fetchWithTokenRefresh } from '@/utils/tokenUtils'
import { useRouter } from 'vue-router'
import { useWarningStore } from '@/stores/warning'
import LoadingSpinner from '../components/Loader.vue'
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

const serverData = ref({})

const partnerInfoFetched = ref(false)
async function fetchData() {
  try {
    const response = await fetchWithTokenRefresh('agent/partnerInfo', { method: 'GET' })

    if (!response.ok) throw 'Fetch data error'

    const decodedResponse = await response.json()
    const info = decodedResponse.data.info
    serverData.value = info

    signData.value = info.partner_sign
    sealData.value = info.partner_seal
  } catch (error) {
    useSnackbarStore().show(error.toString())
  } finally {
    partnerInfoFetched.value = true
  }
}

const submitted = ref(false)
const isSubmitting = ref(false)

async function submit() {
  try {
    submitted.value = true

    if (!agreeToContracTerms.value) {
      useSnackbarStore().show('판매점 계약서 내용에 동의해주세요.')
      return
    }

    if (useDeviceTypeStore().isDeviceMobile()) {
      if (!signData.value || !sealData.value) {
        useSnackbarStore().show('판매자서명을 하지 않았습니다.')
        return
      }
    }

    isSubmitting.value = true

    const response = await fetchWithTokenRefresh('agent/setContractSign', {
      method: 'POST',
      body: {
        agent_cd: props.agentCd,
        partner_sign: signData.value,
        partner_seal: sealData.value,
      },
    })

    const decodedResponse = await response.json()
    if (!response.ok) {
      console.log(decodedResponse)
      throw decodedResponse?.message ?? 'Request error'
    }

    console.log(decodedResponse)

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    await delay(2000)

    emit('closePopup')

    warning.open(decodedResponse.result, [decodedResponse.message ?? '정상적으로 거래접수가 완료되었습니다.'])
    router.push('/')
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

.sign_seal_button {
  align-self: self-start;
  background-color: #cda000;
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
