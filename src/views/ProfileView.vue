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
        <label>대표자명</label>
        <input :value="data.contractor" placeholder="" readonly />
      </div>

      <div class="groups">
        <label>사업자번호</label>
        <input :value="data.business_num" placeholder="" readonly />
      </div>
    </div>

    <div class="row">
      <div class="groups">
        <label>연락처</label>
        <input v-model="contact" placeholder="" readonly />
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

    <div class="password-change-container">
      <div class="title">비밀번호 변경</div>
      <div class="groups" style="max-width: 400px">
        <label>현재 비밀번호 </label>
        <input type="password" v-model="oldPassword" placeholder="비밀번호" />
        <p v-if="isSubmitted && !oldPassword" class="input-error-message">현재 비밀번호를 입력해주세요.</p>
      </div>
      <div class="groups" style="max-width: 400px">
        <label>새 비밀번호 </label>
        <input type="password" v-model="newPassword" placeholder="비밀번호" />
        <p v-if="isSubmitted && !newPassword" class="input-error-message">새 비밀번호를 입력해주세요.</p>
      </div>
      <div class="groups" style="max-width: 400px">
        <label>현재 비밀번호 확인 </label>
        <input type="password" v-model="newPasswordCheck" placeholder="비밀번호" />
        <p v-if="isSubmitted && !newPasswordCheck" class="input-error-message">새 비밀번호를 다시 입력해주세요.</p>
        <p
          v-if="isSubmitted && newPassword && newPasswordCheck && newPassword !== newPasswordCheck"
          class="input-error-message"
        >
          비밀번호가 일치하지 않습니다.
        </p>
      </div>

      <button @click="changePassword" :disabled="isLoading">
        <LoadingSpinner v-if="isLoading" height="20px" color="#ffffff" />
        <span v-else> 비밀번호 업데이트 </span>
      </button>

      <div class="password-change-rules">
        <div class="rule-title">강력한 비밀번호를 얻으려면 이 가이드를 따르세요.</div>

        <ul>
          <li>특수 문자 1개</li>
          <li>최소 8글자</li>
          <li>숫자 1개(2개 권장)</li>
          <li>자주 바꾸세요</li>
        </ul>
      </div>
    </div>

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
import LoadingSpinner from '../components/Loader.vue'

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

        console.log(data.value)

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
  if (!signData.value || !sealData.value) {
    useSnackbarStore().show('서명/사인 하지 않았습니다')
    return
  }

  //adding sign images data
  formData.set('partner_sign', signData.value ?? '')
  formData.set('partner_seal', sealData.value ?? '')

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

const oldPassword = ref(null)
const newPassword = ref(null)
const newPasswordCheck = ref(null)
const isSubmitted = ref(false)
const isLoading = ref(false)

async function changePassword() {
  // console.log(data.value)

  isSubmitted.value = true
  if (!oldPassword.value || !newPassword.value) {
    useSnackbarStore().show('이전 비밀번호와 새 비밀번호를 입력하세요.')
    return
  }
  if (newPassword.value !== newPasswordCheck.value) {
    useSnackbarStore().show('비밀번호가 일치하지 않습니다.')
    return
  }

  try {
    isLoading.value = true

    const response = await fetchWithTokenRefresh('admin/myPassword', {
      method: 'POST',
      body: {
        id: data.value.id,
        username: data.value.partner_cd,
        password: oldPassword.value,
        new_password: newPassword.value,
      },
    })

    const decodedResponse = await response.json()
    console.log(decodedResponse)

    useSnackbarStore().show(decodedResponse?.message ?? 'Password change error')
  } catch (error) {
    useSnackbarStore().show(error.toString())
  } finally {
    isLoading.value = false
  }
}

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
}

.password-change-container {
  display: flex;
  flex-flow: column;
  gap: 20px;
  margin-bottom: 150px;
}

@media (max-width: 600px) {
  .row {
    flex-direction: column;
    width: 100%;
    align-items: center;
  }
}
</style>
