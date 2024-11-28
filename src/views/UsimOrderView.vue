<template>
  <div class="usim_order_container">
    <button style="" @click="openPopup" class="order_button">
      <span class="material-symbols-outlined"> local_shipping </span>
      <span> 유심 주문하기 </span>
    </button>
    <div></div>

    <div class="table-part">
      <a-pagination
        class="pagination"
        size="small"
        :total="totalCount"
        :current="currentPage"
        :pageSize="rowLimit"
        show-size-changer
        :show-total="(total, range) => `${range[0]}-${range[1]} / ${total}`"
        @change="onPagChange"
      >
        <template #buildOptionText="props">
          <span>{{ props.value }} / 페이지</span>
        </template>
      </a-pagination>

      <a-table
        class="table"
        :columns="columns"
        :data-source="dataList"
        bordered
        :pagination="false"
        size="middle"
        :showSorterTooltip="false"
      >
        <!-- <template #bodyCell="{ column, text, record }">
        </template> -->
      </a-table>
    </div>
  </div>
  <GlobalPopupWithOverlay ref="popupRef">
    <OrderUsimPopup v-if="orderNewPopupOpen" @closePopup="closePopup" />
  </GlobalPopupWithOverlay>
</template>

<script setup>
import OrderUsimPopup from '@/components/OrderUsimPopup.vue'
import { ref } from 'vue'

const popupRef = ref(null)
const orderNewPopupOpen = ref(false)
const closePopup = () => {
  popupRef.value.closePopup()
}

function openPopup() {
  orderNewPopupOpen.value = true
  popupRef.value.showPopup()
}

const totalCount = ref(0)
const currentPage = ref(1)
const rowLimit = ref(10)

//pagination change
function onPagChange(curPage, perPage) {
  currentPage.value = curPage
  rowLimit.value = perPage
  fetchData()
}

const dataList = ref([])
const columns = ref([
  {
    title: '상태',
    dataIndex: 'usim_act_status',
    key: 'usim_act_status',
    sorter: (a, b) => (a.usim_act_status ?? '').localeCompare(b.usim_act_status ?? ''),
  },
  {
    title: '대리점',
    dataIndex: 'usim_act_status',
    key: 'usim_act_status',
  },
  {
    title: '유심 수량',
    dataIndex: 'usim_act_status',
    key: 'usim_act_status',
  },
  {
    title: '주문 날짜',
    dataIndex: 'usim_act_status',
    key: 'usim_act_status',
  },
  {
    title: '수신자명',
    dataIndex: 'mvno_cd',
    key: 'mvno_cd',
  },
  {
    title: '연락처',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '매장주소',
    dataIndex: 'phone_number',
    key: 'phone_number',
  },
])
</script>

<style scoped>
.usim_order_container {
  padding: 0 20px;
  display: flex;
  gap: 20px;
  flex-flow: column;
}

.order_button {
  align-self: flex-start;
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 20px;
  padding: 0 20px;
  box-sizing: border-box;
}

.table-part {
  margin-bottom: 200px;
  display: flex;
  flex-flow: column;
  gap: 10px;
  overflow-x: auto;
}
</style>
