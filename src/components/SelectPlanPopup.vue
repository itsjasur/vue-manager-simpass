<template>
  <div class="overlay">
    <div class="popup-content">
      <div class="innerHeader">
        <h3 class="title">요금제선택</h3>
        <span @click="$emit('closePopup')" class="material-symbols-outlined close-button">
          cancel
        </span>
      </div>

      <div class="scroll-content">
        <div style="height: 30px"></div>

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
        <div style="height: 30px"></div>

        <div class="inputRow">
          <input
            type="text"
            id="search"
            name="password"
            placeholder="검색할 요금제명을 입력해주세요"
            v-model="searchText"
          />

          <span @click="searchText = ''" class="icon material-symbols-outlined"> close </span>
        </div>
        <div style="height: 30px"></div>

        <a-table
          class="table"
          :columns="columns"
          :data-source="dataList"
          bordered
          :pagination="false"
          @onchange="onChange"
        >
          <template #bodyCell="{ column, text }">
            <template v-if="column.dataIndex === 'basic_fee' || column.dataIndex === 'sales_fee'">
              <div>{{ text.toLocaleString() }}</div>
            </template>

            <template v-if="column.dataIndex === 'usim_plan_nm'">
              <span class="linkText">
                {{ text }}
              </span>
            </template>
          </template>
        </a-table>

        <div class="card"></div>

        <div style="height: 100px"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSnackbarStore } from '../stores/snackbar'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { fetchWithTokenRefresh } from '../utils/tokenUtils'
import { PLANTYPES } from '../assets/constants'

const props = defineProps(['selectedType', 'mvnoInfo'])
const selectedType = ref('')
const searchText = ref('')
const dataList = ref([])
const emit = defineEmits(['closePopup'])

selectedType.value = props.selectedType ?? 'PO'

const columns = ref([
  {
    title: '요금제명',
    dataIndex: 'usim_plan_nm',
    key: 'usim_plan_nm',
    sorter: (a, b) => (a.usim_plan_nm ?? '').localeCompare(b.usim_plan_nm), // sorter function for alphabetical sorting
    sortDirections: ['descend', 'ascend']
  },
  {
    title: '기본금액 (월)',
    dataIndex: 'basic_fee',
    key: 'basic_fee',
    sorter: (a, b) => a.basic_fee ?? 0 - b.basic_fee ?? 0
  },
  {
    title: '판매금액 (월)',
    dataIndex: 'sales_fee',
    key: 'sales_fee',
    sorter: (a, b) => a.sales_fee ?? 0 - b.sales_fee ?? 0
  },

  {
    title: '음성',
    dataIndex: 'voice',
    key: 'voice',
    sorter: (a, b) => (a.voice ?? '').localeCompare(b.voice ?? '')
  },
  {
    title: '문자',
    dataIndex: 'message',
    key: 'message',
    sorter: (a, b) => (a.message ?? '').localeCompare(b.message ?? '')
  },
  {
    title: '데이터',
    dataIndex: 'cell_data',
    key: 'cell_data',
    sorter: (a, b) => (a.cell_data ?? '').localeCompare(b.cell_data ?? '')
  },

  {
    title: 'QOS',
    dataIndex: 'qos',
    key: 'qos',
    sorter: (a, b) => (a.qos ?? '').localeCompare(b.qos ?? '')
  }
])

const types = ref(PLANTYPES)

function changeType(cd) {
  selectedType.value = cd
  fetchData()
}

async function fetchData() {
  console.log('fetch data called')
  try {
    console.log('this is search value' + searchText.value)

    const response = await fetchWithTokenRefresh('agent/planlist', {
      method: 'POST',
      body: {
        carrier_cd: props.mvnoInfo.carrier_cd, // SKT : SK ,KT : KT,LG U+ : LG
        mvno_cd: props.mvnoInfo.mvno_cd,
        carrier_type: selectedType.value, // 선불:PR ,후불:PO
        usim_plan_nm: searchText.value
      }
    })
    if (response.ok) {
      const decodedResponse = await response.json()
      if (decodedResponse.data && decodedResponse.data.info) {
        let info = decodedResponse.data.info
        dataList.value = info
      }
    } else {
      throw new Error('Fetch data error')
    }
  } catch (error) {
    useSnackbarStore().showSnackbar(error.toString())
  }
}

const onChange = (pagination, filters, sorter) => {
  console.log('params', pagination, filters, sorter)
}

//this handles keyboard actions
function keydownHandle(event) {
  if (event.key === 'Escape') {
    emit('closePopup')
  }
}

watch(searchText, (newValue, oldValue) => {
  fetchData()
})

onMounted(() => {
  fetchData()
  document.addEventListener('keydown', keydownHandle)
})

onUnmounted(() => {
  document.removeEventListener('keydown', keydownHandle)
})
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
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  z-index: 1100;
  background-color: rgba(0, 0, 0, 0.552);
  padding: 20px;
}

.popup-content {
  background-color: white;
  border-radius: 8px;
  height: 100%;
  width: 100%;
  overflow: auto;
}

.innerHeader {
  position: sticky;
  top: 0;
  height: 60px;
  padding: 0 20px;
  align-items: center;
  display: flex;
  justify-content: space-between;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Bottom shadow */
  z-index: 1101;
}

.innerHeader .material-symbols-outlined {
  font-size: 30px;
}

.scroll-content {
  padding: 0 20px;
}

.inputRow {
  position: relative;
  width: 30%;
}

input {
  height: 50px;
  padding-right: 40px;
}

.inputRow .icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: #808080;
  cursor: pointer;
}

.types {
  display: flex; /* Display the carrier buttons in a row */
  gap: 20px;
  flex-flow: wrap;
}

.button {
  min-height: 50px;
  min-width: 150px;
}

.linkText {
  color: var(--main-color);
  display: inline-flex;
  font-weight: 600;
  cursor: pointer;
}

@media (min-width: 767px) {
  .card {
    display: none;
  }
}

.card {
  width: 100%;
  height: 100px;
}

@media (max-width: 768px) {
  .table {
    display: none;
  }

  .inputRow {
    width: 100%;
  }
  .button {
    min-width: 50px;
    flex: 1 0 calc(50% - 20px); /* each item takes half of the container width with a gap of 20px */
    max-width: calc(50% - 10px); /* ensures items don't exceed half of the container width */
  }
}
</style>
