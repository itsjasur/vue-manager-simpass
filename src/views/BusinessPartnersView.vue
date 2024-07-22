<template>
  <div class="container">
    <div v-for="(agent, index) in data" :key="index" class="agent-card">
      <div :class="['status-' + agent.status, 'status-box']">
        {{ agent.status_nm }}
      </div>
      <div class="intro">
        <img class="agent-logo" :src="agent.logo_img_url" alt="SP" />
        <span class="agent-name">{{ agent.agent_nm }}</span>
      </div>

      <div class="column-card">
        <div class="title-text">정보</div>
        <div class="content-row">
          <div class="info-title">주소:</div>
          <div class="info-content">{{ agent.address + ' ' + agent.dtl_address }}</div>
        </div>
        <div class="content-row">
          <div class="info-title">사업자번호:</div>
          <div class="info-content">{{ agent.business_num }}</div>
        </div>
        <div class="content-row">
          <div class="info-title">전화번호:</div>
          <div class="info-content">{{ agent.contact }}</div>
        </div>
      </div>

      <template v-for="(type, typeIndex) in agent.usim_agent_info" :key="typeIndex">
        <div v-if="type.list.length > 0" class="column-card">
          <div class="title-text">{{ type.carrier_type_nm }}</div>

          <template v-for="(carrier, carrierIndex) in generateCarrierList(type.list)" :key="carrierIndex">
            <template v-if="carrier.length > 0">
              <div class="content-row">
                <div class="carrier-name">{{ carrierIndex }}</div>
                <div v-for="(provider, providerIndex) in carrier" :key="providerIndex" class="providers">
                  <img class="provider-logo" :src="provider.image_url" :alt="provider.mvno_nm" />
                </div>
              </div>
            </template>
          </template>
        </div>
      </template>
      <button v-if="agent.status === 'P'" @click="openPopup(agent.agent_cd)">계약서명</button>

      <button v-if="agent.status === 'Y'" @click="fetchContractPDF(agent.agent_cd)">
        <span class="material-symbols-outlined print-contract"> print </span>
        <span> 계약서 출력</span>
      </button>
    </div>

    <div v-if="!data" class="not-found-cont">
      <div>거래가 진행중인 대리점이 존재하지 않습니다.</div>
      <button @click="router.push('/business-request')">거래요청으로 가기</button>
      <button @click="router.push('/home')">홈으로 가기</button>
    </div>
  </div>

  <BusinessPartnersPopup
    v-if="businessPartnersPopup"
    :agentCd="selectedAgentCd"
    @closePopup="businessPartnersPopup = false"
  />

  <PrintablePdfPopup v-if="printablePdfPopup.active" />
</template>

<script setup>
import { useSnackbarStore } from '@/stores/snackbar'
import { fetchWithTokenRefresh } from '@/utils/tokenUtils'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import BusinessPartnersPopup from '../components/BusinessPartnersPopup.vue'
import { usePrintablePdfPopup } from '@/stores/printable-pdf-popup'
import PrintablePdfPopup from '../components/PrintablePdfPopup.vue'

const router = useRouter()

const printablePdfPopup = usePrintablePdfPopup()

//business request popup
const businessPartnersPopup = ref(false)
const selectedAgentCd = ref()

function openPopup(agentCd) {
  businessPartnersPopup.value = true
  selectedAgentCd.value = agentCd
}

const data = ref([])

async function fetchData() {
  try {
    const response = await fetchWithTokenRefresh('agent/getContractAgentInfo', { method: 'GET' })

    if (!response.ok) throw 'Fetch profile data error'

    const decodedResponse = await response.json()
    data.value = decodedResponse.data
    // console.log(data.value)
  } catch (error) {
    useSnackbarStore().showSnackbar(error.toString())
  }
}
function generateCarrierList(list) {
  const carriers = { KT: [], SK: [], LG: [] }

  for (const carrierCd in carriers) {
    list.forEach((item) => {
      if (item.carrier_cd === carrierCd) carriers[carrierCd].push(item)
      else return
    })
  }
  return carriers
}

const profileData = ref()

async function fetchProfileData() {
  try {
    const response = await fetchWithTokenRefresh('agent/partnerInfo', { method: 'GET' })

    if (!response.ok) throw 'Fetch profile data error'

    const decodedResponse = await response.json()
    profileData.value = decodedResponse.data.info
    console.log(profileData)
  } catch (error) {
    useSnackbarStore().showSnackbar(error.toString())
  }
}

//print contract

async function fetchContractPDF(agentCd) {
  try {
    const response = await fetchWithTokenRefresh('agent/viewContract', {
      method: 'POST',
      body: { agent_cd: agentCd, partner_cd: profileData.partner_cd },
    })

    if (!response.ok) throw 'Fetch contract PDF data error'

    const pdfData = await response.blob()
    const blob = new Blob([pdfData], { type: 'application/pdf' })

    // a URL for the Blob
    const url = URL.createObjectURL(blob)
    printablePdfPopup.open(url)
  } catch (error) {
    useSnackbarStore().showSnackbar(error.toString())
  }
}

onMounted(() => {
  fetchData()
  fetchProfileData()
})
</script>

<style scoped>
.container {
  padding: 40px 20px;
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-flow: wrap;
  gap: 30px;
  justify-content: center;
  align-items: flex-start;
  overflow-y: auto;
}

.status-box {
  min-width: 200px;
  height: 40px;
  background-color: rgb(100, 100, 100);
  border-radius: 30px;
  align-self: center;

  align-content: center;
  text-align: center;
  color: #fff;
}

.status-W {
  background-color: #ff9900;
}

.status-Y {
  background-color: #23d300;
}
.status-N {
  background-color: #dc0f00;
}

.agent-card {
  width: 500px;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #fff;
  border-radius: 8px;
  box-shadow: 0 0 5px #00000013;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  gap: 20px;
}

.intro {
  display: flex;
  flex-flow: row;
  align-items: center;
  /* justify-content: center; */
  gap: 10px;
}

.agent-logo {
  height: 60px;
  width: 150px;
  background-color: #0000000b;
  border-radius: 30px;
  box-sizing: border-box;
  padding: 0 10px;
  object-fit: contain;
}

.agent-name {
  font-size: 20px;
  font-weight: 600;
  color: #454545;
}

.column-card {
  width: 100%;
  /* height: 100px; */
  padding: 10px;
  box-sizing: border-box;
  background-color: #0000000c;
  border-radius: 5px;

  display: flex;
  flex-flow: column;
  gap: 10px;
}

.column-card .title-text {
  font-weight: 600;
  /* background-color: aquamarine; */
}

.content-row {
  display: flex;
  flex-flow: row;
  align-items: center;
  gap: 10px;
}

.carrier-name {
  /* min-width: 30px; */
  white-space: nowrap;
  font-weight: 600;
}

.providers {
  display: flex;
  flex-flow: wrap;
  align-items: center;
  gap: 10px;
}

.provider-logo {
  height: 30px;
  width: 110px;
  background-color: #fff;
  border-radius: 30px;
  box-sizing: border-box;
  padding: 0 10px;
  object-fit: contain;
}

.info-title {
  font-weight: 600;
  white-space: nowrap;
}
.not-found-cont {
  display: flex;
  flex-flow: column;
  gap: 20px;
  align-items: center;
  max-width: 300px;
  text-align: center;
}
.not-found-cont button {
  width: auto;
  min-width: 150px;
}

button {
  width: auto;
  min-width: 100px;
  align-self: center;
  padding: 0 10px;
  display: flex;
  flex-flow: row;
  gap: 5px;
  align-items: center;
  justify-content: center;
}
</style>
