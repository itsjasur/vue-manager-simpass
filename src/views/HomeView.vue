<template>
  <div class="home-main">
    <div class="counts-container">
      <div class="counts-header">
        <div class="counts-header-text">
          <div>
            <span>서류접수 </span>
            <span style="font-weight: 800">진행상태</span>
          </div>
          <div style="font-size: 18px">Progress</div>
        </div>

        <span @click="goToApplicationsWithStatus('')" class="material-symbols-outlined">arrow_right_alt</span>
      </div>

      <div class="counts-data-list">
        <template v-for="(item, index) in dataList" :key="index">
          <div @click="goToApplicationsWithStatus(item.usim_act_status)" class="count-box">
            <div>{{ item.usim_act_status_nm }}</div>

            <span style="font-size: 20px; font-weight: 700; color: #fff">{{ item.cnt }}</span>
            <span> 건</span>
          </div>
          <div v-if="index !== dataList.length - 1" class="vert-divider"></div>
        </template>
      </div>
    </div>

    <div class="home-container">
      <div class="card" @click="router.push('/registration-forms')">
        <div class="img">
          <img src="../assets/icons/sim.png" alt="" />
        </div>
        <div class="textbox">
          <p class="primaryT">후불/선불유심</p>
          <p class="secondoryT">가입신청서</p>
        </div>
      </div>

      <div class="card">
        <div class="img">
          <img src="../assets/icons/docs.png" alt="" />
        </div>
        <div class="textbox">
          <p class="primaryT">정책보기</p>
        </div>
      </div>
      <div class="card" @click="router.push('/business-request')">
        <div class="img">
          <img src="../assets/icons/handshake.png" alt="" />
        </div>
        <div class="textbox">
          <p class="primaryT">거래요청</p>
        </div>
      </div>
      <div class="card" @click="router.push('/business-partners')">
        <div class="img">
          <img src="../assets/icons/store.png" alt="" />
        </div>
        <div class="textbox">
          <p class="primaryT">거래대리점</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useHomeStatusHolder } from '@/stores/page-loading-store copy'
import { useSnackbarStore } from '@/stores/snackbar'
import { fetchWithTokenRefresh } from '@/utils/tokenUtils'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const dataList = ref([])

function goToApplicationsWithStatus(status) {
  if (!status) status = ''
  useHomeStatusHolder().save(status)
  router.push('/applications')
}

async function fetchData() {
  try {
    const response = await fetchWithTokenRefresh('agent/actCntStatus', { method: 'GET' })

    const decodedResponse = await response.json()
    if (!response.ok) throw decodedResponse?.message ?? 'Fetch data error'
    dataList.value = decodedResponse?.data?.act_status_cnt ?? []
  } catch (error) {
    useSnackbarStore().showSnackbar(error.toString())
  }
}

onMounted(fetchData)
</script>

<style scoped>
.home-main {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}
.counts-container {
  width: 100%;
  /* min-height: 160px; */
  max-width: 860px;
  background-color: var(--main-color);
  margin-bottom: 50px;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 20px;

  display: flex;
  flex-flow: column;
  justify-content: space-between;
  gap: 30px;
  box-shadow: 0 0 10px #00000051;
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
  flex-flow: column;
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
}

.vert-divider {
  width: 1px;
  height: 100%;
  background-color: #ffffffce;
}

.count-box {
  display: flex;
  flex-flow: column;
  gap: 5px;
  align-items: center;
  cursor: pointer;
}

.home-container {
  width: 100%;
  display: flex;
  flex-flow: wrap;
  gap: 20px;
  justify-content: center;
}

.card {
  height: 200px;
  width: 200px;
  padding: 10px;
  box-sizing: border-box;
  align-content: center;
}

img {
  height: 75px;
}

.img {
  /* background-color: yellow; */
  display: flex;
  justify-content: center;
  margin: 10px 0px;
}

.textbox {
  /* background-color: yellow; */
  display: flex;
  flex-direction: column;
  text-align: center;
}

.primaryT {
  margin: 0;
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
  .container {
    flex-direction: column;
  }

  .card {
    width: 100%;
    height: auto;
    min-height: 100px;
    display: flex;
    align-items: center;
    align-content: center;
    justify-items: center;
    justify-content: center;
  }

  .textbox {
    margin-left: 10px;
    width: 100%;
    text-align: start;
  }

  .primaryT {
    margin-bottom: 10px;
  }
}
</style>
