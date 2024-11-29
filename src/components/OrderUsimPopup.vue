<!--  -->
<!--  -->
<template>
  <div class="usim_order_popup_main_container">
    <div class="fixed-header">
      <p class="title">유심 주문</p>
      <span @click="$emit('closePopup', false)" class="material-symbols-outlined close-button"> cancel </span>
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

      <div class="usim_order_type_list_item" v-for="(item, index) in usimOrderTypeList" :key="index">
        <span style="font-weight: 600; color: #ccc; font-size: 15px">주문 유형 {{ index + 1 }}</span>
        <div class="filters_section">
          <div class="filter_group" style="flex: 2; min-width: 200px">
            <label>대리점</label>
            <a-select
              :getPopupContainer="(triggerNode) => triggerNode.parentNode"
              v-model:value="item.selectedAgentCode"
              @change="
                () => {
                  item.selectedCarrierCode = null
                  item.selectedMvnoCode = null
                }
              "
              :style="{ width: '100%' }"
              :options="Object.entries(AGENT_CODES).map(([key, val]) => ({ value: key, label: val }))"
            >
            </a-select>
            <!-- :options="[...(agents?.map((i) => ({ value: i.agent_cd, label: i.agent_nm })) || [])]" -->
            <p v-if="isSubmitted && !item.selectedAgentCode" class="input-error-message">대리점를 선택하세요.</p>
          </div>
          <div class="filter_group" style="flex: 1; min-width: 120px">
            <label>통신망</label>
            <a-select
              :getPopupContainer="(triggerNode) => triggerNode.parentNode"
              @change="item.selectedMvnoCode = null"
              v-model:value="item.selectedCarrierCode"
              :style="{ width: '100%' }"
              :options="Object.entries(CARRIER_CODES).map(([key, val]) => ({ value: key, label: val }))"
            >
            </a-select>
            <!-- :options="[...(carriers?.map((i) => ({ value: i.cd, label: i.label })) || [])]" -->
            <p v-if="isSubmitted && !item.selectedCarrierCode" class="input-error-message">통신망를 선택하세요.</p>
          </div>
          <div class="filter_group" style="flex: 2; min-width: 200px">
            <label>통신사</label>
            <a-select
              :getPopupContainer="(triggerNode) => triggerNode.parentNode"
              v-model:value="item.selectedMvnoCode"
              :style="{ width: '100%' }"
              :options="getMvnoOptions(item)"
            >
            </a-select>
            <p v-if="isSubmitted && !item.selectedMvnoCode" class="input-error-message">통신사를 선택하세요.</p>
          </div>

          <div class="filter_group" style="flex: 1; min-width: 120px">
            <label>유심 수량</label>
            <input type="number" v-model="item.usimCount" placeholder="" min="0" step="any" />
            <p v-if="isSubmitted && (!item.usimCount || item.usimCount < 1)" class="input-error-message">
              수량 입력해주세요.
            </p>
          </div>
        </div>

        <span
          v-if="usimOrderTypeList.length > 1"
          class="material-symbols-outlined delete_item_button"
          @click="usimOrderTypeList.length > 1 ? usimOrderTypeList.splice(index, 1) : null"
        >
          delete
        </span>
      </div>

      <button class="add_item_button" @click="usimOrderTypeList.push({ ...emptyItem })">
        <span class="material-symbols-outlined"> add </span>
        <span>유형 추가</span>
      </button>

      <button style="margin-top: 0px; align-self: flex-end; width: 200px" @click="createOrder()">주문하기</button>
    </div>

    <GlobalPopupWithOverlay ref="addressPopupRef">
      <GlobalSearchAddress @selected="handleAddressSelected" @closePopup="closeAddressPopup" />
    </GlobalPopupWithOverlay>
  </div>
</template>

<script setup>
import { useSnackbarStore } from '@/stores/snackbar'
import { fetchWithTokenRefresh } from '@/utils/tokenUtils'
import { computed, onMounted, reactive, ref } from 'vue'
import * as cleavePatterns from '../utils/cleavePatterns'
import { AGENT_CODES, CARRIER_CODES, MVNO_CODES } from '@/assets/constants'

const emit = defineEmits(['closePopup'])
const props = defineProps({ orderId: { type: String, default: null } })

const agent_info_list = {
  SJ: { KT: ['KTS', 'KTM'], SK: ['SVM'], LG: ['UPM', 'HVS'] },
  BP: { KT: ['FRT', 'CDM'], SK: ['FRT'], LG: ['FRT', 'ISM', 'HPM', 'CDM'] },
}

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
const isSubmitted = ref(false)

const emptyItem = {
  selectedAgentCode: '',
  selectedCarrierCode: '',
  selectedMvnoCode: '',
  usimCount: 0,
}
const usimOrderTypeList = reactive([])

// select mvno options are computed based on agent and carrier values
const getMvnoOptions = computed(() => {
  return (item) => {
    if (!item.selectedAgentCode || !item.selectedCarrierCode) return []
    const mvnoList = agent_info_list?.[item.selectedAgentCode]?.[item.selectedCarrierCode] || []
    return mvnoList.map((mc) => ({ value: mc, label: MVNO_CODES?.[mc] }))
  }
})

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

async function createOrder() {
  isSubmitted.value = true

  if (!name.value || !phoneNumber.value || !address.value) {
    useSnackbarStore().show('모든 항목을 채워주세요.')
    return
  }

  for (var item of usimOrderTypeList) {
    if (!item.selectedAgentCode || !item.selectedCarrierCode || !item.selectedMvnoCode || item.usimCount < 1) {
      useSnackbarStore().show('주문 항목의 모든 필드를 채워주세요.')
      return
    }
    console.log(item)
  }

  try {
    await fetchProfileData()

    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) return

    var newOrder = {
      order_id: props?.orderId,
      access_token: accessToken,
      receiver_name: name.value,
      phone_number: phoneNumber.value,
      address: address.value,
      address_details: addressDetails.value,
      order_items: [],
    }

    for (var item of usimOrderTypeList) {
      newOrder.order_items.push({
        agent_code: item.selectedAgentCode,
        carrier_type_code: item.selectedCarrierCode,
        mvno_code: item.selectedMvnoCode,
        usim_count: item.usimCount,
      })
    }

    const response = await fetch(import.meta.env.VITE_CHAT_SERVER_URL + 'create-or-update-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    })

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const decodedResponse = await response.json()
    useSnackbarStore().show(decodedResponse?.message ?? 'Order success')

    if (decodedResponse?.success) emit('closePopup', true)

    console.log(decodedResponse)
  } catch (error) {
    console.error('Error fetching html:', error)
    useSnackbarStore().show(error.toString())
  }
}

// fetch order if order id is given
async function fetchOrderToEdit() {
  console.log('fetchordertoedit called', props.orderId)

  try {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) return

    const response = await fetch(import.meta.env.VITE_CHAT_SERVER_URL + 'get-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: props.orderId,
        access_token: accessToken,
      }),
    })

    if (!response.ok) throw new Error(`HTTP error! status: ${response?.status}`)
    const decodedResponse = await response.json()
    console.log(decodedResponse)

    for (var item of decodedResponse?.order_items ?? []) {
      usimOrderTypeList.push({
        selectedAgentCode: item.agent_code,
        selectedCarrierCode: item.carrier_type_code,
        selectedMvnoCode: item.mvno_code,
        usimCount: item.usim_count,
      })
    }
  } catch (error) {
    console.error('Error fetching html:', error)
  }
}

onMounted(async () => {
  if (props.orderId) {
    usimOrderTypeList.length = 0
    await fetchOrderToEdit()
  } else {
    usimOrderTypeList.length = 0
    usimOrderTypeList.push({ ...emptyItem })
  }
  await fetchProfileData()
})
</script>

<style scoped>
.usim_order_popup_main_container {
  background-color: var(--main-background-color);
  border-radius: 8px;
  width: 850px;
  display: flex;
  flex-flow: column;
  margin: 20px;
  /* height: fit-content; */
  /* max-width: 95%; */
  /* max-height: 95%; */
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
  flex: 1 0 calc(50% - 20px);
}

.usim_order_type_list_item {
  border: 2px dashed #cdcdcd;
  border-radius: 6px;
  padding: 20px;
  padding-top: 10px;
  box-sizing: border-box;

  display: flex;
  flex-flow: column;
  gap: 10px;
  position: relative;
}

.add_item_button {
  margin-top: 10px;
  background-color: #9d9d9d;
  align-self: flex-start;
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 0 10px;
}

.delete_item_button {
  position: absolute;
  top: 5px;
  right: 5px;
  color: red;
  cursor: pointer;
}

/* :nth-child(1) */
</style>
