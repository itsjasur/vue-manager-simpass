<template>
  <div class="usim_order_container">
    <button style="" @click="openPopup()" class="order_button">
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
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'full_address'">
            <span>{{ record?.address + ' ' + record?.address_details || '' }}</span>
          </template>
          <template v-if="column.dataIndex === 'status'">
            <div
              :style="{
                backgroundColor: statusColors?.[text],
                color: '#fff',
                borderRadius: '30px',
                padding: '2px 5px',
              }"
            >
              {{ statuses?.[text] }}
            </div>
          </template>

          <template v-if="column.dataIndex === 'agent_cd'">
            <div class="order_items">
              <span v-for="(item, index) in record.order_items" :key="index">
                {{ AGENT_CODES?.[item?.agent_code] ?? '' }}
              </span>
            </div>
          </template>

          <template v-if="column.dataIndex === 'carrier_type_code'">
            <div class="order_items">
              <span v-for="(item, index) in record.order_items" :key="index">
                {{ CARRIER_CODES?.[item?.carrier_type_code] ?? '' }}
              </span>
            </div>
          </template>

          <template v-if="column.dataIndex === 'mvno_cd'">
            <div class="order_items">
              <span v-for="(item, index) in record.order_items" :key="index">
                {{ MVNO_CODES?.[item?.mvno_code] ?? '' }}
              </span>
            </div>
          </template>

          <template v-if="column.dataIndex === 'usim_count'">
            <div class="order_items">
              <span v-for="(item, index) in record.order_items" :key="index" style="color: blue; font-weight: 500">
                {{ item.usim_count }}
              </span>
            </div>
          </template>

          <template v-if="column.dataIndex === 'edit_order'">
            <span
              v-if="record.status === 'confirmed'"
              class="material-symbols-outlined"
              style="color: orange; cursor: pointer"
              @click="openPopup(record?.order_id)"
            >
              edit
            </span>
          </template>
        </template>
      </a-table>
    </div>
  </div>
  <GlobalPopupWithOverlay ref="popupRef">
    <OrderUsimPopup v-if="orderNewPopupOpen" @closePopup="closePopup" :orderId="selectedOrderId" />
  </GlobalPopupWithOverlay>
</template>

<script setup>
import OrderUsimPopup from '@/components/OrderUsimPopup.vue'
import { useSnackbarStore } from '@/stores/snackbar'
import { onMounted, ref } from 'vue'
import { AGENT_CODES, CARRIER_CODES, MVNO_CODES } from '@/assets/constants' //used don't delete

const popupRef = ref(null)
const orderNewPopupOpen = ref(false)
function closePopup(shouldRefresh) {
  currentPage.value = 1
  rowLimit.value = 10
  if (shouldRefresh) fetchData()
  popupRef.value.closePopup()
}

const statuses = {
  confirmed: '주문확인',
  shipped: '배송중',
  delivered: '발송완료',
  failed: '취소',
}
const statusColors = {
  confirmed: 'green',
  shipped: 'orange',
  delivered: 'grey',
  failed: 'red',
}

const selectedOrderId = ref(null)
function openPopup(orderId) {
  console.log('openpopup', orderId)
  selectedOrderId.value = orderId
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

const columns = ref([
  {
    title: '상태',
    dataIndex: 'status',
    key: 'status',
    sorter: (a, b) => (a.status ?? '').localeCompare(b.status ?? ''),
    align: 'center',
    width: '100px',
  },

  {
    title: '수신자명',
    dataIndex: 'receiver_name',
    key: 'receiver_name',
    width: 120,
  },
  {
    title: '종류',
    dataIndex: 'order_items',
    key: 'order_items',
    align: 'center',
    children: [
      {
        title: '대리점',
        dataIndex: 'agent_cd',
        key: 'agent_cd',
        align: 'center',
        customHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      },
      {
        title: '통신망',
        dataIndex: 'carrier_type_code',
        key: 'carrier_type_code',
        align: 'center',
        customHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      },
      {
        title: '통신사',
        dataIndex: 'mvno_cd',
        key: 'mvno_cd',
        align: 'center',
        customHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      },
      {
        title: '유심 수량',
        dataIndex: 'usim_count',
        key: 'usim_count',
        align: 'center',
        customHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      },
    ],
  },
  {
    title: '주문 날짜',
    dataIndex: 'created_at',
    key: 'created_at',
    // width: '15%',
  },
  {
    title: '연락처',
    dataIndex: 'phone_number',
    key: 'phone_number',
    // width: '10%',
  },
  {
    title: '주소',
    dataIndex: 'full_address',
    key: 'full_address',
    // width: '25%',
  },
  {
    title: '코맨트',
    dataIndex: 'sender_comment',
    key: 'sender_comment',
    // width: '20%',
  },
  {
    title: '수정',
    dataIndex: 'edit_order',
    key: 'edit_order',
    align: 'center',
  },
])

const dataList = ref([])
const fetchData = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) return

    const response = await fetch(import.meta.env.VITE_CHAT_SERVER_URL + 'get-orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token: accessToken,
        per_page: rowLimit.value,
        page_number: currentPage.value,
      }),
    })

    // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const decodedResponse = await response.json()
    dataList.value = decodedResponse.usim_orders

    console.log(dataList.value)
    totalCount.value = decodedResponse.total_count
  } catch (error) {
    console.error('Error fetching orders:', error)
    useSnackbarStore().show(error.toString())
  }
}

onMounted(fetchData)
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

.order_items {
  display: flex;
  flex-flow: column;
  gap: 25px;
  height: fit-content;
  word-break: keep-all;
  max-lines: 1;
  text-overflow: ellipsis;
  /* background-color: cadetblue; */
  /* align-content: space-between; */
  /* justify-content: space-between; */
  /* align-items: start; */
  /* background-color: aquamarine; */
  /* color: red; */
}
</style>
