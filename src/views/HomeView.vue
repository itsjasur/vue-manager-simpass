<template>
  <div class="home-main">
    <div class="counts-container">
      <div class="counts-header">
        <div class="counts-header-text">
          <span>가입접수 </span>
          <span style="font-weight: 800">진행상태</span>
        </div>

        <span @click="goToApplicationsWithStatus('')" class="material-symbols-outlined">arrow_right_alt</span>
      </div>

      <div class="counts-data-list">
        <template v-for="(item, index) in dataList" :key="index">
          <div @click="goToApplicationsWithStatus(item.usim_act_status)" class="count-box">
            <div>{{ item.usim_act_status_nm }}</div>
            <div>
              <span style="font-size: 20px; font-weight: 700; color: #fff">{{ item.cnt }}</span>
              <span> 건</span>
            </div>
          </div>
          <div v-if="index !== dataList.length - 1" class="vert-divider"></div>
        </template>
      </div>
    </div>

    <div class="cards-container">
      <div class="card" @click="router.push('/registration-forms')">
        <div class="img">
          <img src="../assets/icons/sim.png" alt="" />
        </div>
        <div class="textbox">
          <span class="primaryT">후불/선불유심</span>
          <span class="secondoryT">가입신청서</span>
        </div>
      </div>

      <div
        @click="
          warningStore.open(`현재 정책보기 서비스는 개발진행중 입니다.`, [
            '빠른시일내 서비스 제공해 드리겠습니다. ^^',
            '당분간 정책관련 문의는 아래 연락처로 연락부탁드립니다.',
            '담당자 : 안도현',
            '연락처 : 010-8062-1111',
          ])
        "
        class="card"
      >
        <div class="img">
          <img src="../assets/icons/docs.png" alt="" />
        </div>
        <div class="textbox">
          <span class="primaryT">정책보기</span>
        </div>
      </div>
      <div class="card" @click="router.push('/business-request')">
        <div class="img">
          <img src="../assets/icons/handshake.png" alt="" />
        </div>
        <div class="textbox">
          <span class="primaryT">거래요청</span>
        </div>
      </div>
      <div class="card" @click="router.push('/business-partners')">
        <div class="img">
          <img src="../assets/icons/store.png" alt="" />
        </div>
        <div class="textbox">
          <span class="primaryT">거래대리점</span>
        </div>
      </div>
    </div>
  </div>

  <HomePagePopup
    v-if="homePagePopupOpen"
    :contractStatus="homeInfo?.contract_status ?? 'NA'"
    :agentsInfo="homeInfo?.agent_info_list ?? []"
    @closePopup="homePagePopupOpen = false"
  />
</template>

<script setup>
import { useHomeStatusHolder } from '@/stores/home-status-store'
import { useSnackbarStore } from '@/stores/snackbar'
import { fetchWithTokenRefresh } from '@/utils/tokenUtils'
import { onMounted, ref } from 'vue'
import HomePagePopup from '../components/HomePagePopup.vue'
import { useRouter } from 'vue-router'

import { useWarningStore } from '@/stores/warning'

const warningStore = useWarningStore()

const router = useRouter()

const dataList = ref([])

function goToApplicationsWithStatus(status) {
  if (!status) status = ''
  // useHomeStatusHolder().save(status)
  useHomeStatusHolder().save()
  router.push('/applications')
}

async function fetchData() {
  try {
    const response = await fetchWithTokenRefresh('agent/actCntStatus', { method: 'GET' })

    const decodedResponse = await response.json()
    if (!response.ok) throw decodedResponse?.message ?? 'Fetch data error'
    dataList.value = decodedResponse?.data?.act_status_cnt ?? []
  } catch (error) {
    useSnackbarStore().show(error.toString())
  }
}

const homePagePopupOpen = ref(false)
const homeInfo = ref({})

async function fetchHomeInfo() {
  try {
    const response = await fetchWithTokenRefresh('agent/homeInfo', { method: 'GET' })

    const decodedResponse = await response.json()
    if (!response.ok) throw decodedResponse?.message ?? 'Fetch data error'

    homeInfo.value = decodedResponse?.data
    homePagePopupOpen.value = homeInfo.value.contract_status === 'P' || homeInfo.value.contract_status === 'N'

    // console.log(homePagePopupOpen.value)
  } catch (error) {
    useSnackbarStore().show(error.toString())
  }
}

onMounted(async () => {
  await fetchHomeInfo()
  await fetchData()
})
</script>

<style scoped>
.home-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 20px;
  margin-top: 20px;
  /* min-height: 100%; */
  /* overflow-y: auto; */
}
.counts-container {
  width: 100%;
  background-color: var(--main-color);
  margin-bottom: 50px;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  flex-flow: column;
  gap: 30px;
  box-shadow: 0 0 10px #00000051;
  max-width: 860px;
}

.counts-header {
  display: flex;
  flex-flow: row;
  font-size: 20px;
  gap: 30px;
  color: #fff;
  line-height: 1;
  align-items: center;
  justify-content: space-between;
}

.counts-header-text {
  display: flex;
  gap: 5px;
}

.material-symbols-outlined {
  background-color: #fff;
  color: var(--main-color);
  font-size: 30px;
  border-radius: 50px;
  padding: 3px;
  cursor: pointer;
}

.counts-data-list {
  display: flex;
  flex-flow: row;
  color: #ffffffce;
  justify-content: space-evenly;
  text-align: center;
  font-size: 15px;
}

.vert-divider {
  width: 1px;
  height: 100%;
  margin: 0 5px;
  background-color: #ffffffce;
}

.count-box {
  display: flex;
  flex-flow: column;
  gap: 5px;
  align-items: center;
  cursor: pointer;
}

.cards-container {
  width: 100%;
  display: flex;
  flex-flow: wrap;
  gap: 20px;
  justify-content: center;
  margin-bottom: 100px;
}

.card {
  height: 200px;
  width: 200px;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: space-evenly;
}

img {
  height: 75px;
}

.textbox {
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 5px;
}

.primaryT {
  font-weight: 600;
  color: #565656;
}
.secondoryT {
  margin-top: 3px;
  font-weight: 400;
  color: #565656;
  margin-bottom: 0px;
}

@media (max-width: 600px) {
  .home-main {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    padding: 20px;
  }

  .card {
    width: 100%;
    height: auto;
    min-height: 100px;
    display: flex;
    flex-flow: row;
    gap: 10px;
  }

  .counts-data-list {
    font-size: 11px;
  }

  .textbox {
    width: 100%;
    text-align: start;
  }
}
</style>
