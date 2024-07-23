<template>
  <div class="overlay">
    <div class="popup-content">
      <div class="fixed-header">
        <h3 class="title">판매점 계약 서명</h3>
        <span @click="$emit('closePopup')" class="material-symbols-outlined close-button"> cancel </span>
      </div>

      <div class="scrollable-content">
        <span class="title-note"
          >본 신청서는 심패스에서 직접 운영하는 판매점 전자계약서이며 고객님에 소중한 개인정보는 암호화되어 안전하게
          보호됩니다.
        </span>

        <div>
          <a-checkbox class="checkbox" v-model:checked="agreeToContracTerms">판매점 계약서 내용 동의 (필수)</a-checkbox>
          <span @click="contractPopup = true" class="agree-view">계약서 확인</span>
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
            <input
              :value="serverData.business_num"
              placeholder="000-00-00000"
              name="businessNumber"
              v-cleave="{ ...cleavePatterns.businessNumberPattern }"
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

        <SignImageRowContainer
          type="self"
          :placeholder="serverData.contractor"
          @updated="updatePads"
          :errorMessage="submitted && (!signData || !sealData) ? '판매자서명을 하지 않았습니다.' : null"
          title="판매자 서명"
        />

        <button @click="submit" :disabled="isSubmitting">
          <LoadingSpinner v-if="isSubmitting" height="20px" color="#ffffff" />
          <span v-else> 온라인 판매점 계약신청 </span>
        </button>
      </div>
    </div>
  </div>

  <ContractPdfViewPoup
    v-if="contractPopup"
    :partnerNm="serverData.partner_nm"
    :agentCd="props.agentCd"
    @closePopup="contractPopup = false"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as cleavePatterns from '../utils/cleavePatterns'
import { useSnackbarStore } from '@/stores/snackbar'
import { fetchWithTokenRefresh } from '@/utils/tokenUtils'
import { useRouter } from 'vue-router'
import { useWarningStore } from '@/stores/warning'
import LoadingSpinner from './Loader.vue'
import SignImageRowContainer from './SignImageRowContainer.vue'
import { useNameSignDataStore } from '@/stores/name-sign-data-store'
import ContractPdfViewPoup from '../components/ContractPdfViewPopup.vue'

const router = useRouter()
const warning = useWarningStore()

const emit = defineEmits(['closePopup'])

const props = defineProps({ agentCd: { type: String, required: true } })

const agreeToContracTerms = ref(false)
const contractPopup = ref(false)

const signStore = useNameSignDataStore()
const signData = ref(null)
const sealData = ref(null)

const updatePads = ({ name, sign, type }) => {
  signData.value = name
  sealData.value = sign
}

const serverData = ref({})

async function fetchData() {
  try {
    const response = await fetchWithTokenRefresh('agent/partnerInfo', { method: 'GET' })

    if (!response.ok) throw 'Fetch data error'

    const decodedResponse = await response.json()
    const info = decodedResponse.data.info
    serverData.value = info

    signStore.save(info.partner_sign, info.partner_seal)
    signData.value = info.partner_sign
    sealData.value = info.partner_seal
  } catch (error) {
    useSnackbarStore().show(error.toString())
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

    if (!signData.value || !sealData.value) {
      useSnackbarStore().show('판매자서명을 하지 않았습니다.')
      return
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

onMounted(fetchData)
onUnmounted(signStore.clear)
</script>

<style scoped>
.overlay {
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000000b2;
  padding: 20px;
  z-index: 2000;
}

.popup-content {
  background-color: var(--main-background-color);
  border-radius: 8px;
  max-height: 100%;
  max-width: 900px;
  width: 600px;
  display: flex;
  flex-flow: column;
  overflow-y: scroll;
  box-sizing: border-box;
}

.fixed-header {
  position: sticky;
  top: 0;
  min-height: 50px;
  padding: 0 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px #0000001a;
  box-sizing: border-box;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
}

.close-button {
  font-size: 30px;
  color: #737373;
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

.agree-view {
  color: #0365e6;
  cursor: pointer;
  padding: 5px;
  border-radius: 3px;
  font-size: 15px;
  border: 1.5px solid var(--main-color);
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
  font-size: 18px;
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

@media (max-width: 600px) {
  .group-row {
    flex-flow: column;
  }

  .group {
    width: 100% !important;
  }
}
</style>
