<template>
  <div class="container">
    <div class="title">가입신청/고객정보</div>
    <div class="row">
      <div class="groups">
        <label>판매점코드 </label>
        <input v-model="pcode" placeholder="SM00000" readonly />
      </div>

      <div class="groups">
        <label>판매점명</label>
        <input v-model="pname" placeholder="" readonly />
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
        <label>계약일자 </label>
        <input v-model="contractDate" placeholder="" readonly />
      </div>

      <div class="groups">
        <label>상태 </label>
        <input v-model="status" placeholder="" readonly />
      </div>
    </div>

    <div class="title">가입신청/고객정보</div>

    <SignImageRowContainer type="self" placeholder="Jasur" @updated="updatePads" title="판매자 서명" />

    <button @click="submit">접수하기</button>
  </div>
</template>

//
<script setup>
import { ref, onMounted } from 'vue'
import { useSnackbarStore } from '../stores/snackbar'
import { fetchWithTokenRefresh } from '../utils/tokenUtils'
import SignImageRowContainer from '../components/SignImageRowContainer.vue'

const pname = ref('')
const pcode = ref('')
const contact = ref('')
const email = ref('')
const storeAddress = ref('')
const storeDetailAddress = ref('')
const contractDate = ref('')
const status = ref('')

const nameImageData = ref(null)
const signImageData = ref(null)

const updatePads = ({ name, sign, type }) => {
  nameImageData.value = name
  signImageData.value = sign
}

async function fetchProfileData() {
  try {
    const response = await fetchWithTokenRefresh('agent/partnerInfo', {
      method: 'GET',
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
        nameImageData.value = info.partner_sign
        signImageData.value = info.partner_seal
      }
    } else {
      throw new Error('Fetch profile data error')
    }
  } catch (error) {
    useSnackbarStore().showSnackbar(error.toString())
  }
}

//FORM DATA REQUEST
const formData = new FormData()

async function submit() {
  //adding sign images data
  formData.set('partner_sign', nameImageData.value)
  formData.set('partner_seal', signImageData.value)

  // //checks if all values are filled

  try {
    const response = await fetchWithTokenRefresh('agent/setActSign', {
      method: 'POST',
      body: {
        partner_sign: nameImageData.value,
        partner_seal: signImageData.value,
      },
    })

    if (response.ok) {
      const decodedResponse = await response.json()
      useSnackbarStore().showSnackbar(decodedResponse.message)
    }
  } catch (error) {
    useSnackbarStore().showSnackbar(error.toString())
  }
}

onMounted(fetchProfileData)
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 20px;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  gap: 30px;
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

.sign-title {
  line-height: 1;
  padding: 0;
  margin: 0;
  margin-bottom: 7px;
}

.singImagesBox {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  max-width: 400px;
  width: 100%;
  height: 100px;
  border-radius: 5px;
  border: 1px dashed var(--main-color);
  cursor: pointer;
  position: relative;

  background-color: #fff;
}
.singImagesBox .images-row {
  display: flex;
  flex-flow: row;
  height: 100%;
  width: 100%;
  gap: 5px;
  box-sizing: border-box;
  padding: 5px;
  align-items: center;
}
.singImagesBox .image {
  width: 100%;
  height: 100%;
  min-width: 100px;
  max-height: 100px; /* Set a maximum height limit if needed */
  object-fit: contain;
  background-color: #fbfbfb;
}
.delete-icon {
  position: absolute;
  top: 3px;
  right: 3px;
  color: #ff3535 !important;
  cursor: pointer !important;
  background-color: #ffffff;
  padding: 2px;
  border-radius: 20px;
}

button {
  max-width: 200px;
  margin-top: 20px;
  height: 45px;
  margin-bottom: 400px;
}

@media (max-width: 600px) {
  .row {
    flex-direction: column;
    width: 100%;
    align-items: center;
  }
}
</style>
