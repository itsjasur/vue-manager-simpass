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
                whiteSpace: 'nowrap',
              }"
            >
              {{ statuses?.[text] }}
            </div>
          </template>

          <template v-if="column.dataIndex === 'agent_code'">
            <div class="order_items_content">
              <span v-for="(item, index) in record.order_items" :key="index">
                <!-- :style="{ fontWeight: 'bold', color: getColor(index) }" -->
                {{ AGENT_CODES?.[item?.agent_code] ?? '' }}
              </span>
            </div>
          </template>

          <template v-if="column.dataIndex === 'carrier_type_code'">
            <div class="order_items_content">
              <span v-for="(item, index) in record.order_items" :key="index">
                {{ CARRIER_CODES?.[item?.carrier_type_code] ?? '' }}
              </span>
            </div>
          </template>

          <template v-if="column.dataIndex === 'mvno_code'">
            <div class="order_items_content">
              <span v-for="(item, index) in record.order_items" :key="index">
                {{ MVNO_CODES?.[item?.mvno_code] ?? '' }}
              </span>
            </div>
          </template>

          <template v-if="column.dataIndex === 'usim_count'">
            <div class="order_items_content">
              <span v-for="(item, index) in record.order_items" :key="index">
                {{ item.usim_count }}
              </span>
            </div>
          </template>

          <template v-if="column.dataIndex === 'sender_comment'">
            <span style="color: orange">{{ text }}</span>
          </template>

          <template v-if="column.dataIndex === 'actions'">
            <div v-if="record.status === 'confirmed'" class="table_actions">
              <span class="material-symbols-outlined" style="color: #3393ff" @click="openPopup(record?.order_id)">
                edit
              </span>
              <span class="material-symbols-outlined" style="color: red" @click="showDeleteModal(record?.order_id)">
                delete
              </span>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <div class="cards_part">
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

      <div class="card_box" v-for="(item, index) in dataList" :key="index">
        <div class="card_row">
          <span>상태: </span>
          <div
            :style="{
              backgroundColor: statusColors?.[item?.status],
              color: '#fff',
              borderRadius: '30px',
              padding: '4px 10px',
              whiteSpace: 'nowrap',
              fontSize: '15px',
            }"
          >
            {{ statuses?.[item?.status] }}
          </div>
        </div>

        <div class="card_row">
          <span>판매자명: </span>
          <span>{{ item?.receiver_name }}</span>
        </div>

        <div class="card_row">
          <span>연락처: </span>
          <span>{{ item?.phone_number }}</span>
        </div>

        <div class="card_row">
          <span>주소: </span>
          <span>{{ item?.address + ' ' + item?.address_details }}</span>
        </div>

        <div class="card_row">
          <span>코맨트: </span>
          <span>{{ item?.sender_comment }}</span>
        </div>

        <div class="card_row">
          <span>행위</span>
          <div style="display: flex; gap: 20px">
            <span class="material-symbols-outlined" style="color: #3393ff" @click="openPopup(item?.order_id)"
              >edit
            </span>
            <span class="material-symbols-outlined" style="color: red" @click="showDeleteModal(item?.order_id)">
              delete
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <a-modal v-model:open="isDeleteModalVisible" :centered="true" title="삭제 확인" :closable="false">
    <!-- :maskClosable="false" -->
    <p>주문을 삭제하시겠습니까?? 삭제하면 복구할 수 없습니다.</p>
    <template #footer>
      <a-button key="cancel" @click="isDeleteModalVisible = false">취소</a-button>
      <a-button key="delete" type="primary" danger @click="deleteOrder">삭제</a-button>
    </template>
  </a-modal>

  <GlobalPopupWithOverlay ref="popupRef">
    <OrderUsimPopup @closePopup="closePopup" :orderId="selectedOrderId" />
  </GlobalPopupWithOverlay>
</template>

<script setup>
import OrderUsimPopup from '@/components/OrderUsimPopup.vue'
import { useSnackbarStore } from '@/stores/snackbar'
import { onMounted, ref } from 'vue'
import { AGENT_CODES, CARRIER_CODES, MVNO_CODES } from '@/assets/constants' //used don't delete
import { fetchWithTokenRefresh } from '@/utils/tokenUtils'

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
    title: '판매자명',
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
        dataIndex: 'agent_code',
        key: 'agent_code',
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
        dataIndex: 'mvno_code',
        key: 'mvno_code',
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
    dataIndex: 'actions',
    key: 'actions',
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

    if (!response.ok) throw new Error(`HTTP error! status: ${response?.status}`)

    const decodedResponse = await response.json()
    dataList.value = decodedResponse.usim_orders
    // console.log(dataList.value)
    totalCount.value = decodedResponse.total_count
  } catch (error) {
    console.error('Error fetching orders:', error)
    useSnackbarStore().show(error.toString())
  }
}

const selectedOrderId = ref(null)
function openPopup(orderId) {
  // console.log('openpopup', orderId)
  selectedOrderId.value = orderId
  popupRef.value.showPopup()
}

const popupRef = ref(null)
function closePopup(shouldRefresh) {
  currentPage.value = 1
  rowLimit.value = 10
  if (shouldRefresh) fetchData()
  popupRef.value.closePopup()
}

const isDeleteModalVisible = ref(false)

function showDeleteModal(orderId) {
  selectedOrderId.value = orderId
  isDeleteModalVisible.value = true
}

// deletes order
async function deleteOrder() {
  // console.log('deleteoder called', selectedOrderId.value)
  try {
    await tokenUpdate()

    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) return

    const response = await fetch(import.meta.env.VITE_CHAT_SERVER_URL + 'delete-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: selectedOrderId.value, access_token: accessToken }),
    })

    if (!response.ok) throw new Error(`HTTP error! status: ${response?.status}`)
    const decodedResponse = await response.json()
    // console.log(decodedResponse)
    useSnackbarStore().show(decodedResponse?.message ?? 'Order deleted')

    // close modal
    isDeleteModalVisible.value = false

    fetchData()
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

async function tokenUpdate() {
  try {
    const response = await fetchWithTokenRefresh('agent/partnerInfo', { method: 'GET' })
    if (!response.ok) throw new Error('Fetch profile data error')
  } catch (error) {
    useSnackbarStore().show(error.toString())
  }
}

onMounted(tokenUpdate)
onMounted(fetchData)
</script>

<style scoped>
.usim_order_container {
  margin: 0 20px;
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

.table {
  min-width: 1000px;
}

.order_items_content {
  display: flex;
  flex-flow: column;
  gap: 30px;
  word-break: keep-all;
  white-space: nowrap;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table_actions {
  display: flex;
  flex-flow: wrap;
  gap: 20px;
  justify-content: center;
}

.material-symbols-outlined {
  cursor: pointer;
}

.cards_part {
  display: none;
  flex-flow: column;
  gap: 20px;
  margin-bottom: 200px;
}

.card_box {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #fff;
}

.card_row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

@media (max-width: 600px) {
  .table-part {
    display: none;
  }
  .cards_part {
    display: flex;
  }
}
</style>
