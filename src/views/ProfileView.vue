<template>
  <div class="profile_container">
    <div class="title">가입신청/고객정보</div>
    <!-- <div class="title">{{ userAgent }}</div> -->
    <div class="row">
      <div class="groups">
        <label>판매점 아이디 </label>
        <input v-model="pcode" placeholder="SM00000" readonly />
      </div>

      <div class="groups">
        <label>판매점명</label>
        <input v-model="pname" placeholder="" readonly />
      </div>
    </div>

    <div class="row">
      <div class="groups">
        <label for="contact">대표자명</label>
        <input id="contact" :value="data.contractor" placeholder="" readonly />
      </div>

      <div class="groups">
        <label>사업자번호</label>
        <input :value="data.business_num" placeholder="" readonly />
      </div>
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
        <label>가입일자 </label>
        <input v-model="contractDate" placeholder="" readonly />
      </div>

      <div class="groups">
        <label>상태 </label>
        <input v-model="status" placeholder="" readonly />
      </div>

      <!-- <div class="groups">
        <label>Cleave </label>
        <CleaveInput v-model="cleaveInp" :options="cloptions" @rawValue="console.log($event)" />
      </div> -->

      <!-- <div class="groups">
        <label>Cleave </label>
        <CleaveInput :modelValue="cleaveInp" @update:modelValue="cleaveInp = $event" />
      </div> -->
      <!-- <button @click="updateCl">Cleave input print</button> -->
    </div>

    <template v-if="useDeviceTypeStore().isDeviceMobile() && partnerInfoFetched">
      <SignImageRowContainer
        :overlayText="data.contractor"
        title="판매자 서명"
        @updateSignSeal="updatePads"
        :signImageData="signData"
        :sealImageData="sealData"
      />
      <button @click="submit">서명/사인 저장</button>
    </template>

    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

//
<script setup>
import { ref, onMounted } from 'vue'
import { useSnackbarStore } from '@/stores/snackbar'
import { fetchWithTokenRefresh } from '@/utils/tokenUtils'
import SignImageRowContainer from '@/components/SignImageRowContainer.vue'
import { useDeviceTypeStore } from '@/stores/device-type-store'

const data = ref({})
const pname = ref('')
const pcode = ref('')
const contact = ref('')
const email = ref('')
const storeAddress = ref('')
const storeDetailAddress = ref('')
const contractDate = ref('')
const status = ref('')

const signData = ref()
const sealData = ref()

const updatePads = (sign, seal) => {
  signData.value = sign
  sealData.value = seal
}

const partnerInfoFetched = ref(false)

async function fetchProfileData() {
  try {
    const response = await fetchWithTokenRefresh('agent/partnerInfo', { method: 'GET' })
    if (response.ok) {
      const decodedResponse = await response.json()
      if (decodedResponse.data && decodedResponse.data.info) {
        let info = decodedResponse.data.info
        data.value = info

        pname.value = info.partner_nm
        pcode.value = info.partner_cd
        contact.value = info.phone_number
        email.value = info.email
        storeAddress.value = info.address
        storeDetailAddress.value = info.dtl_address
        contractDate.value = new Date(info.apply_date).toLocaleString()
        status.value = info.status_nm

        signData.value = info.partner_sign
        sealData.value = info.partner_seal
      }
    } else {
      throw new Error('Fetch profile data error')
    }
  } catch (error) {
    useSnackbarStore().show(error.toString())
  } finally {
    partnerInfoFetched.value = true
  }
}

//FORM DATA REQUEST
const formData = new FormData()

async function submit() {
  // //checks if all values are filled
  if (!signData.value || !sealData.value) return useSnackbarStore().show('서명/사인 하지 않았습니다')

  //adding sign images data
  formData.set('partner_sign', signData.value)
  formData.set('partner_seal', sealData.value)

  try {
    const response = await fetchWithTokenRefresh('agent/setActSign', {
      method: 'POST',
      body: { partner_sign: signData.value, partner_seal: sealData.value },
    })

    if (response.ok) {
      const decodedResponse = await response.json()
      useSnackbarStore().show(decodedResponse.message)
    }
  } catch (error) {
    useSnackbarStore().show(error.toString())
  }
}
onMounted(fetchProfileData)

// const userAgent = ref('')
// onMounted(() => {
//   userAgent.value = navigator.userAgent.toLowerCase()
// })
</script>

<style scoped>
.profile_container {
  max-width: 1000px;
  margin-top: 20px;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  gap: 30px;
  padding: 0 20px;
  overflow-y: auto;
}

.groups {
  width: 100%;
}

.row {
  display: flex;
  width: 100%;
  gap: 20px;
  align-items: center;
}

.title {
  font-size: 18px;
  font-weight: 600;
  width: 100%;
  margin: 0;
  padding: 0;
}

button {
  max-width: 200px;
  margin-top: 20px;
  height: 45px;
  margin-bottom: 100px;
}

@media (max-width: 600px) {
  .row {
    flex-direction: column;
    width: 100%;
    align-items: center;
  }
}
</style>
