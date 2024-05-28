<template>
  <div class="container">
    <!-- <div class="row">
      <div class="groups">
        <label for="contact">요금제 선택</label>
        <input id="contact" v-model="planName" placeholder="" readonly />
      </div>

      <div class="groups">
        <label>유심비</label>
        <a-select
          ref="select"
          v-model:value="usimFee"
          :style="{ width: '100%' }"
          placeholder="Please select"
        >
        </a-select>
      </div>
    </div> -->

    <div class="body">
      <template v-for="(value, key) in formData" :key="key">
        <!-- If the value is an array, create a select input -->
        <template v-if="Array.isArray(value) && value.length > 0">
          <div class="item">
            <label :for="key">{{ FORMLABELS[key] }} </label>
            <a-select
              ref="select"
              v-model:value="formValues[key]"
              :id="key"
              :style="{ width: '100%' }"
              :placeholder="FORMLABELS[key]"
              :options="value"
              @change="handleChange"
            >
            </a-select>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { FORMNAMES } from '../assets/constants.js'

const planName = ref('')
const usimFee = ref('')

const formValues = ref({})

// creating empty ref values inside formValues
function initializeFormValues() {
  for (const key in formData) {
    formValues.value[key] = null
  }
}

function handleChange(key, val) {
  console.log(formValues.value)
}

onMounted(() => {
  initializeFormValues()
})

const formData = {
  extra_service_cd: [],
  usim_fee_cd: [],
  plan_fee_cd: [],
  chk_partner_sign: 'Y',
  paid_transfer_cd: [
    { cd: 'B', value: '은행계좌' },
    { cd: 'C', value: '신용카드 ' },
  ],
  gender_cd: [],
  mnp_carrier_type: [
    { cd: 'PR', value: '선불' },
    { cd: 'PO', value: '후불' },
  ],
  usim_model_list: [],
  relationship_cd: [
    { cd: 'F', value: '부' },
    { cd: 'M', value: '모' },
  ],
  data_block_cd: [],
  data_roming_block_cd: [],
  cust_type_cd: [
    { cd: 'MEL', value: '개인' },
    { cd: 'MEA', value: '외국인' },
    { cd: 'COL', value: '청소년' },
    { cd: 'MEP', value: '개인사업자' },
    { cd: 'MEC', value: '법인사업자' },
  ],
  cust_type: [
    { cd: 'ME', value: '일반' },
    { cd: 'CO', value: '청소년' },
  ],
  cust_cd: [
    { cd: 'L', value: '내국인' },
    { cd: 'A', value: '외국인' },
    { cd: 'C', value: '법인' },
    { cd: 'P', value: '개인사업자' },
  ],
  mnp_pre_carrier: [
    { cd: 'SK', value: 'SKT' },
    { cd: 'KT', value: 'KT' },
    { cd: 'LG', value: 'LG U+' },
    { cd: 'MV', value: '알뜰폰' },
  ],
  chk_usim_model: 'N',
  phone_bill_block_cd: [],
  usim_act_cd: [
    { cd: 'N', value: '신규가입' },
    { cd: 'M', value: '번호이동' },
  ],
}
</script>

<style scoped>
.container {
  width: 80%;
  min-width: 300px;
  max-width: 1000px;
  margin-top: 20px;
  padding: 0 15px;
  box-sizing: border-box;
}

.row {
  display: flex;
  width: 100%;
  gap: 20px; /* adds spacing between items */
  margin-bottom: 30px;
  align-items: center;
}

.groups {
  width: 100%;
}

.body {
  display: flex;
  flex-direction: column;
  gap: 30px;
}
</style>
