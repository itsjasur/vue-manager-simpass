<template>
  <div class="container">
    <div class="row">
      <div class="groups">
        <label>판매점코드 </label>
        <input v-model="pcode" placeholder="SM00000" readonly />
      </div>

      <div class="groups">
        <label>판매점명</label>
        <input v-model="pname" placeholder="" readonly />
      </div>
      <!-- <div class="groups">
        <label>판매점명 </label>
        <a-select
          ref="select"
          allowClear
          v-model:value="pname"
          :style="{ width: '100%' }"
          placeholder="Please select"
          :options="options"
        >
        </a-select>
      </div> -->
    </div>

    <div class="row">
      <div class="groups">
        <label for="contact">연락처</label>
        <input id="contact" v-model="contact" placeholder="" readonly />
      </div>

      <div class="groups">
        <label>이메일</label>
        <input v-model="email" placeholder="" readonly />
      </div>
    </div>

    <div class="row">
      <div class="groups">
        <label>매장주소</label>
        <input v-model="storeAddress" placeholder="" readonly />
      </div>

      <div class="groups">
        <label>매장상세주소</label>
        <input v-model="storeDetailAddress" placeholder="" readonly />
      </div>
    </div>

    <div class="row">
      <div class="groups">
        <label>계약일자 </label>
        <input v-model="contractDate" placeholder="" readonly />
      </div>

      <div class="groups">
        <label>상태 </label>
        <input v-model="status" placeholder="" readonly />
      </div>
    </div>
  </div>
</template>

//
<script setup>
import { ref, onMounted } from 'vue'
import { useSnackbarStore } from '../stores/snackbar'
import { fetchWithTokenRefresh } from '../utils/tokenUtils'

const pname = ref('')
const pcode = ref('')
const contact = ref('')
const email = ref('')
const storeAddress = ref('')
const storeDetailAddress = ref('')
const contractDate = ref('')
const status = ref('')

// const options = [...Array(25)].map((_, i) => ({
//   value: (i + 10).toString(36) + (i + 1)
// }))
const options = [{ value: 'a' }, { value: 'b' }]

async function fetchProfileData() {
  try {
    const response = await fetchWithTokenRefresh('agent/partnerInfo', {
      method: 'GET'
      // body: JSON.stringify(requestModel)
    })
    if (response.ok) {
      const decodedResponse = await response.json()
      if (decodedResponse.data && decodedResponse.data.info) {
        let info = decodedResponse.data.info
        pname.value = info.partner_nm
        pcode.value = info.partner_cd
        contact.value = info.phone_number
        email.value = info.email
        storeAddress.value = info.address
        storeDetailAddress.value = info.dtl_address
        contractDate.value = new Date(info.contract_date).toLocaleString()

        status.value = info.status_nm
      }
    } else {
      throw new Error('Fetch profile data error')
    }
  } catch (error) {
    useSnackbarStore().showSnackbar(error.toString())
  }
}
onMounted(fetchProfileData)
</script>

<style scoped>
.container {
  width: 80%;
  min-width: 300px;
  max-width: 1000px;
  margin-top: 20px;
  padding: 0 15px;
  box-sizing: border-box; /*  padding and border in the element's total width and height */
}

.groups {
  width: 100%;
}

.row {
  display: flex;
  width: 100%;
  gap: 20px; /* adds spacing between items */
  margin-bottom: 30px;
  align-items: center;
}

@media (max-width: 768px) {
  .container {
    width: 100%;
  }

  .row {
    flex-direction: column;
    width: 100%;
    margin-bottom: 20px;
    align-items: center;
  }
}
</style>
