<!--  -->
<!--  -->
<template>
  <div class="usim_order_popup_main_container">
    <div class="fixed-header">
      <p class="title">유심 주문</p>
      <span @click="$emit('closePopup')" class="material-symbols-outlined close-button"> cancel </span>
    </div>

    <div class="scrollable_content">
      <div class="top_user_info_section">
        <span style="font-size: 18px">배송 세부 사항을 확인하세요</span>

        <div class="input_group">
          <label>수신자명</label>
          <input v-model="name" placeholder="" />
          <p v-if="isSubmitted && !name" class="input-error-message">수신자명를 입력해주세요.</p>
        </div>

        <div class="input_group">
          <label>연락처</label>
          <CleaveInput placeholder="010-1234-5678" v-model="phoneNumber" :options="cleavePatterns.phoneNumberPattern" />
          <p v-if="isSubmitted && !phoneNumber" class="input-error-message">연락처를 입력해주세요.</p>
        </div>

        <div class="address_group">
          <div class="input_group" style="flex: 3">
            <label>매장주소</label>
            <input v-bind:value="address" @click="openAddressPopup" placeholder="" readonly />
            <p v-if="isSubmitted && !address" class="input-error-message">매장주소를 입력해주세요.</p>
          </div>

          <div class="input_group" style="flex: 2">
            <label>상세주소</label>
            <input v-model="addressDetails" placeholder="" />
          </div>
        </div>
      </div>

      <div></div>
      <span style="font-size: 18px">USIM 종류를 선택하세요</span>

      <div class="filters_section">
        <div class="filter_group" style="flex: 4">
          <label>대리점</label>
          <a-select
            :getPopupContainer="(triggerNode) => triggerNode.parentNode"
            v-model:value="selectedAgentCode"
            @change="
              () => {
                selectedCarrierCode = null
                selectedMvnoCode = null
              }
            "
            :style="{ width: '100%' }"
            :options="[...(agents?.map((i) => ({ value: i.agent_cd, label: i.agent_nm })) || [])]"
          >
          </a-select>
          <p v-if="isSubmitted && !selectedAgentCode" class="input-error-message">대리점를 선택하세요.</p>
        </div>
        <div class="filter_group" style="flex: 2">
          <label>통신망</label>
          <a-select
            :getPopupContainer="(triggerNode) => triggerNode.parentNode"
            @change="selectedMvnoCode = null"
            v-model:value="selectedCarrierCode"
            :style="{ width: '100%' }"
            :options="[...(carriers?.map((i) => ({ value: i.cd, label: i.label })) || [])]"
          >
          </a-select>
          <p v-if="isSubmitted && !selectedCarrierCode" class="input-error-message">통신망를 선택하세요.</p>
        </div>
        <div class="filter_group" style="flex: 4">
          <label>통신사</label>
          <a-select
            :getPopupContainer="(triggerNode) => triggerNode.parentNode"
            v-model:value="selectedMvnoCode"
            :style="{ width: '100%' }"
            :options="findMvnos() ?? []"
          >
          </a-select>
          <p v-if="isSubmitted && !selectedMvnoCode" class="input-error-message">통신사를 선택하세요.</p>
        </div>
      </div>

      <div class="input_group" style="max-width: 150px">
        <label>유심 수량</label>
        <input type="number" v-model="usimCount" placeholder="" />
        <p v-if="isSubmitted && (!usimCount || usimCount < 1)" class="input-error-message">수량 입력해주세요.</p>
      </div>

      <button style="margin-top: 10px; align-self: flex-end; width: 200px" @click="createOrder()">주문하기</button>
    </div>

    <GlobalPopupWithOverlay ref="addressPopupRef">
      <GlobalSearchAddress @selected="handleAddressSelected" @closePopup="closeAddressPopup" />
    </GlobalPopupWithOverlay>
  </div>
</template>

<script setup>
import { useSnackbarStore } from '@/stores/snackbar'
import { fetchWithTokenRefresh } from '@/utils/tokenUtils'
import { onMounted, ref } from 'vue'
import * as cleavePatterns from '../utils/cleavePatterns'

const addressPopupRef = ref(null)
const closeAddressPopup = () => {
  addressPopupRef.value.closePopup()
}
function openAddressPopup() {
  addressPopupRef.value.showPopup()
}
const handleAddressSelected = (data) => {
  address.value = data.address
  addressDetails.value = data.buildingName
  console.log('Selected address:', data.address)
  console.log('Building name:', data.buildingName)
}

const name = ref()
const phoneNumber = ref()

const address = ref()
const addressDetails = ref()

const selectedAgentCode = ref()
const selectedCarrierCode = ref()
const selectedMvnoCode = ref()
const usimCount = ref(0)

const isSubmitted = ref(true)

function findMvnos() {
  const mvnoCodes = agents.value
    ?.find((agent) => agent.agent_cd === selectedAgentCode.value)
    ?.items?.find((item) => item[selectedCarrierCode.value])?.[selectedCarrierCode.value]

  return mvnoCodes?.map((mvnoCd) => ({
    value: mvnoCd,
    label: mvnos.value?.find((mvno) => mvno.mvno_cd === mvnoCd)?.mvno_nm,
  }))
}

const agents = ref([
  {
    agent_nm: '에스제이',
    agent_cd: 'SJ',
    items: [{ KT: ['KTS', 'KTM'] }, { SK: ['SVM'] }, { LG: ['UPM', 'HVS'] }],
  },
  {
    agent_nm: '바로폼',
    agent_cd: 'BP',
    items: [{ KT: ['FRT', 'CDM'] }, { SK: ['FRT'] }, { LG: ['FRT', 'ISM', 'HPM', 'CDM'] }],
  },
])
const mvnos = ref([
  { mvno_nm: '프리티', mvno_cd: 'FRT' },
  { mvno_nm: '핼로 모바일', mvno_cd: 'HVS' },
  { mvno_nm: '인스 모바일', mvno_cd: 'ISM' },
  { mvno_nm: 'KT M모바일', mvno_cd: 'KTM' },
  { mvno_nm: 'KT Sky Life', mvno_cd: 'KTS' },
  { mvno_nm: 'SK 7모바일', mvno_cd: 'SVM' },
  { mvno_nm: 'U+ 유모바일', mvno_cd: 'UPM' },
  { mvno_nm: '한패스 모바일', mvno_cd: 'HPM' },
  { mvno_nm: '코드 모바일', mvno_cd: 'CDM' },
])
const carriers = ref([
  { cd: 'KT', label: 'KT' },
  { cd: 'SK', label: 'SKT' },
  { cd: 'LG', label: 'LG U+' },
])

async function fetchProfileData() {
  try {
    const response = await fetchWithTokenRefresh('agent/partnerInfo', { method: 'GET' })
    if (!response.ok) throw new Error('Fetch profile data error')

    const decodedResponse = await response.json()
    if (decodedResponse.data && decodedResponse.data.info) {
      const userInfo = decodedResponse.data.info
      name.value = userInfo?.contractor
      phoneNumber.value = userInfo?.phone_number

      address.value = userInfo?.address
      addressDetails.value = userInfo?.dtl_address
    }
  } catch (error) {
    useSnackbarStore().show(error.toString())
  }
}

function createOrder() {
  isSubmitted.value = true

  if (
    !name.value ||
    !phoneNumber.value ||
    !address.value ||
    !selectedAgentCode.value ||
    !selectedCarrierCode.value ||
    !selectedMvnoCode.value
  ) {
    useSnackbarStore().show('')
    return
  }
}

onMounted(fetchProfileData)
</script>

<style scoped>
.usim_order_popup_main_container {
  background-color: white;
  border-radius: 8px;
  width: 700px;
  overflow: auto;
  align-self: center;
}

.scrollable_content {
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  gap: 30px;
  overflow-y: auto;
}

.top_user_info_section {
  display: flex;
  flex-flow: column;
  gap: 20px;
}

.input_group {
  width: 200px;
  display: flex;
  flex-flow: column;
}
.address_group {
  display: flex;
  flex-flow: wrap;
  gap: 15px;
}

.address_group .input_group {
  min-width: 200px;
  flex: 1 0 calc(50% - 20px);
}

.filters_section {
  display: flex;
  flex-flow: wrap;
  gap: 20px;
}

.filter_group {
  min-width: 100px;
  flex: 1 0 calc(50% - 20px);
}

/* :nth-child(1) */
</style>
