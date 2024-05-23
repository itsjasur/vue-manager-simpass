<template>
  <div class="mypopup" v-if="showPopup">
    <SelectPlanPopup
      :selectedType="selectedType"
      :carrierCode="selectedCarrier"
      :mvnoCode="selectedMvno"
      @closePopup="showPopup = false"
    />
  </div>
  <div class="container">
    <div class="types">
      <div
        class="button"
        v-for="(item, index) in types"
        :key="index"
        :class="{ selected: selectedType === item.cd }"
        @click="changeType(item.cd)"
      >
        {{ item.label }}
      </div>
    </div>

    <div class="carriers">
      <div
        class="button"
        v-for="(item, index) in carriers"
        :key="index"
        :class="{ selected: selectedCarrier === item.cd }"
        @click="changeCarrier(item.cd)"
      >
        {{ item.label }}
      </div>
    </div>

    <div class="mvnos">
      <div
        class="card"
        v-for="(item, index) in mvnos"
        :key="index"
        @click="selectMvno(item.mvno_cd)"
      >
        <img :src="item.image_url" :alt="item.mvno_nm" width="100%" />
        <img class="logo" :src="logoFinder(item.carrier_cd)" :alt="item.carrier_nm" height="100%" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSnackbarStore } from '../stores/snackbar'
import { fetchWithTokenRefresh } from '../utils/tokenUtils'
import { onMounted, ref } from 'vue'
import SelectPlanPopup from '../components/SelectPlanPopup.vue'

const selectedType = ref('PO')
const selectedCarrier = ref('')
const selectedMvno = ref('')

const showPopup = ref(false)

const types = ref([
  { cd: 'PO', label: '후불' },
  { cd: 'PR', label: '선불' }
])

const carriers = ref([
  { cd: '', label: '전체' },
  { cd: 'KT', label: 'KT' },
  { cd: 'SK', label: 'SKT' },
  { cd: 'LG', label: 'LG U+' }
])

function logoFinder(carrierCd) {
  if (carrierCd === 'KT') return 'src/assets/logos/kt.png'
  if (carrierCd === 'SK') return 'src/assets/logos/skt.png'
  if (carrierCd === 'LG') return 'src/assets/logos/lgu.png'
  return ''
}

const mvnos = ref([])

function changeType(cd) {
  selectedType.value = cd
  fetchData()
}

function changeCarrier(cd) {
  selectedCarrier.value = cd
  fetchData()
}

function selectMvno(mvnoCd) {
  selectedMvno.value = mvnoCd
  showPopup.value = true
}

async function fetchData() {
  try {
    const response = await fetchWithTokenRefresh('agent/applyCarrier', {
      method: 'POST',
      body: {
        carrier_type: selectedType.value,
        carrier_cd: selectedCarrier.value
      }
    })
    if (response.ok) {
      const decodedResponse = await response.json()
      if (decodedResponse.data && decodedResponse.data.info) {
        let info = decodedResponse.data.info
        mvnos.value = info
      }
    } else {
      throw new Error('Fetch profile data error')
    }
  } catch (error) {
    useSnackbarStore().showSnackbar(error.toString())
  }
}

onMounted(fetchData)
</script>

<style scoped>
.container {
  padding: 20px;
  display: flex;
  flex-flow: column;
  gap: 40px;
}

.types {
  display: flex; /* Display the carrier buttons in a row */
  gap: 20px;
  flex-flow: wrap;
}

.carriers {
  display: flex; /* Display the carrier buttons in a row */
  gap: 20px;
  flex-flow: wrap;
}

.mvnos {
  display: flex; /* Display the carrier buttons in a row */
  gap: 20px;
  flex-flow: wrap;
}

.button {
  min-height: 60px;
  min-width: 140px;
}

.card {
  width: 200px;
  background-color: #f3f3f3;
  padding: 50px 30px;
  box-sizing: border-box;
  border-radius: 10px;
  font-size: 20px;
  position: relative;
}

.card .logo {
  position: absolute;
  right: 5%;
  top: 8%;
  height: 10%;
}

.card:hover {
  filter: brightness(0.7); /* 70% brightness to make it darker */
  cursor: pointer;
}

@media (max-width: 767px) {
  .container {
    flex-direction: column;
  }

  .carriers {
    display: flex;
    flex-wrap: wrap;
  }

  .mvnos {
    display: flex;
    flex-wrap: wrap;
  }

  .button {
    flex: 1 0 calc(50% - 20px); /* each item takes half of the container width with a gap of 20px */
    max-width: calc(50% - 10px); /* ensures items don't exceed half of the container width */
  }

  .card {
    flex: 1 0 calc(50% - 20px); /* each item takes half of the container width with a gap of 20px */
    max-width: calc(50% - 10px); /* ensures items don't exceed half of the container width */
    padding: 8vw 8vw;
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
