<template>
  <div class="container">
    <!-- <div class="typeButton">Postpaid</div> -->

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

    <div style="height: 40px"></div>

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

    <div style="height: 40px"></div>

    <div class="mvnos">
      <div
        class="card"
        v-for="(item, index) in mvnos"
        :key="index"
        @click="selectMvno(item.mvno_cd)"
      >
        <img :src="item.image_url" :alt="item.mvno_nm" width="100%" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSnackbarStore } from '@/stores/snackbar'
import { fetchWithTokenRefresh } from '@/utils/tokenUtils'
import { onMounted, ref } from 'vue'

const selectedType = ref('PO')
const selectedCarrier = ref('')

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

const mvnos = ref([])

function changeType(cd) {
  selectedType.value = cd
  fetchData()
}

function changeCarrier(cd) {
  selectedCarrier.value = cd
  fetchData()
}

function selectMvno(cd) {}

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
  margin: 20px;
  /* background-color: aquamarine; */
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

.button.selected {
  border-color: var(--main-color);
  color: var(--main-color);
}
.button {
  min-height: 50px;
  min-width: 120px;
  width: auto;
  box-sizing: border-box;
  border-radius: 5px;
  font-weight: 600;
  border: 1.5px solid #797979;
  color: #797979;

  text-align: center;
  align-content: center;
}
.button:hover {
  cursor: pointer;
  opacity: 0.6;
}

.button:active {
  cursor: pointer;
  border-color: #bebebe;
  color: #bebebe;
}

.card {
  width: 200px;
  background-color: #f3f3f3;
  padding: 50px 30px;
  box-sizing: border-box;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 20px;
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
    padding: 6vw 8vw;
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
