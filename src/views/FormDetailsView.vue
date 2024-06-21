<template>
  <div v-if="serverData" class="container">
    <template v-for="(typeFormNames, index) of availableForms" :key="index">
      <template v-if="typeFormNames.length > 0">
        <div class="partition">
          <!-- <div class="title">{{ index }}</div> -->

          <div v-if="index === 'usim'" class="title">요금제 정보</div>
          <div v-if="index === 'customer'" class="title">고객 정보</div>
          <div v-if="index === 'deputy'" class="title">법정대리인</div>
          <div v-if="index === 'payment'" class="title">자동이체</div>

          <template v-for="(formName, index) in typeFormNames" :key="index">
            <!-- <div>{{ FIXED_FORMS[formName] }}</div> -->
            <div class="group" :style="{ maxWidth: FIXED_FORMS[formName].maxwidth }">
              <label>{{ FIXED_FORMS[formName].label }}</label>

              <!-- input -->
              <template v-if="FIXED_FORMS[formName].type === 'input'">
                <input v-model="FIXED_FORMS[formName].value" v-bind="inputBindings(formName)" />
              </template>

              <!-- select -->
              <template v-if="FIXED_FORMS[formName].type === 'select'">
                <a-select
                  v-model:value="FIXED_FORMS[formName].value"
                  :style="{ width: '100%' }"
                  @change="generateInitialForms"
                  :options="FIXED_FORMS[formName].options"
                  v-bind="inputBindings(formName)"
                >
                </a-select>
              </template>

              <!-- cleave -->
              <template v-if="FIXED_FORMS[formName].type === 'cleave'">
                <input
                  v-model="FIXED_FORMS[formName].value"
                  v-cleave="FIXED_FORMS[formName].pattern"
                  v-bind="inputBindings(formName)"
                />
              </template>
            </div>
          </template>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup>
import { useSnackbarStore } from '@/stores/snackbar'
import { fetchWithTokenRefresh } from '@/utils/tokenUtils'
import { nextTick, onMounted, onUnmounted, reactive, ref, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { FORMS } from '../assets/constants2'
import { PLANSINFO } from '../assets/constants'
import _ from 'lodash'
import Cleave from 'cleave.js'

import { useSearchaddressStore } from '../stores/select-address-popup'
import { watch } from 'less'

//address poup
const selectAddressPopup = useSearchaddressStore()

const route = useRoute()

//need to make deep copy in order to reset when page reloads
const FIXED_FORMS = reactive(_.cloneDeep(FORMS))

//this inits page
onMounted(fetchData)

// onMounted(() => {
//   FIXED_FORMS.address.value = selectAddressPopup.address
//   FIXED_FORMS.addressdetail.value = selectAddressPopup.buildingName
// })

// 1 first fetch data onMounted()
const serverData = ref(null)

// finding forms
const availableForms = reactive({ usim: [], customer: [], deputy: [], payment: [] })

async function fetchData() {
  try {
    const response = await fetchWithTokenRefresh('agent/applyInit', {
      method: 'POST',
      body: { usim_plan_id: route.params.id },
    })
    if (!response.ok) throw 'Fetch data error'

    const decodedResponse = await response.json()
    serverData.value = decodedResponse.data

    // console.log(serverData.value.usim_plan_info)
    // console.log(serverData.value)
    generateInitialForms()
  } catch (error) {
    useSnackbarStore().showSnackbar(error.toString())
  }
}

//generates forms here
function generateInitialForms() {
  //usim plan info is form server data
  const usimPlanInfo = serverData.value.usim_plan_info

  //selected type
  const selectedTypeInfo = PLANSINFO.find((item) => item.code === usimPlanInfo.carrier_type)
  //selected carrier
  const selectedCarrierInfo = selectedTypeInfo.carriers.find((carrier) => carrier.code === usimPlanInfo.carrier_cd)
  //selected mvno
  const selectedMvnoInfo = selectedCarrierInfo.mvnos.find((mvno) => mvno.code === usimPlanInfo.mvno_cd)

  //setting available forms in each mvno
  // availableForms.usim = selectedMvnoInfo?.usimForms ?? null
  availableForms.usim = [...(selectedMvnoInfo?.usimForms ?? [])]
  availableForms.customer = [...(selectedMvnoInfo?.customerForms ?? [])]
  availableForms.deputy = []

  //finding payment forms in each type
  availableForms.payment = [...(selectedTypeInfo?.paymentForms ?? [])]

  //adding options to select forms
  for (const formName in FIXED_FORMS) {
    if (FIXED_FORMS[formName].type === 'select') {
      FIXED_FORMS[formName].options = serverData.value[formName]?.map((i) => ({ value: i.cd, label: i.value })) ?? [
        { value: 'N/A', label: 'N/A' },
      ]
    }
  }
  //set default once forms created and after additional forms added
  setDefault()

  //EXTRA FIELDS FOR FORMS
  //adding usim extra forms
  if (FIXED_FORMS?.usim_act_cd?.value === 'N') {
    availableForms.usim.push('wish_number')

    //wish numbers input with cleave
    let wishArray = Array(selectedMvnoInfo.wishCount).fill(4) //[4,4,4]
    FIXED_FORMS.wish_number.pattern = {
      numericOnly: true,
      delimiter: ' / ',
      blocks: wishArray, //[4,4,4]
    }
    FIXED_FORMS.wish_number.placeholder = wishArray.map((e) => '1234').join(' / ')
  }

  if (FIXED_FORMS?.usim_act_cd?.value === 'M')
    availableForms.usim.push('mnp_carrier_type', 'phone_number', 'mnp_pre_carrier')
  if (FIXED_FORMS?.mnp_pre_carrier?.value === 'MV') availableForms.usim.push('mnp_pre_carrier_nm')

  if (FIXED_FORMS?.paid_transfer_cd?.value === 'C') availableForms.payment.push('card_yy_mm')

  //adding deputy forms
  if (FIXED_FORMS?.cust_type_cd?.value === 'COL')
    availableForms.deputy.push('deputy_name', 'deputy_birthday', 'relationship_cd', 'deputy_contact')

  //after extra forms added, set default should be called again!
  setDefault()

  //settnig country code
  FIXED_FORMS.country.value = ''
  if (FIXED_FORMS?.cust_type_cd?.value !== 'MEA') FIXED_FORMS.country.value = '대한민국'
}

//sets default values
function setDefault() {
  for (const formName in FIXED_FORMS) {
    if (
      FIXED_FORMS[formName].type === 'select' &&
      FIXED_FORMS[formName].hasDefault &&
      FIXED_FORMS[formName].value === null
    )
      FIXED_FORMS[formName].value = serverData.value[formName]?.[0]?.cd ?? null
  }
}

//creating extra bindings for forms
const inputBindings = (formName) => {
  let bindings = { placeholder: FIXED_FORMS[formName].placeholder }
  //usim plan name is readonly
  if (formName === 'usim_plan_nm') {
    bindings.onClick = (event) => console.log('plan name clicked')
    bindings.readonly = true
  }

  if (formName === 'address') {
    bindings.onClick = (event) => selectAddressPopup.open()
    bindings.readonly = true
  }

  return bindings
}
</script>

<style>
.container {
  max-width: 1400px;
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
}

.partition {
  display: flex;
  flex-flow: wrap;
  /* flex-flow: column; */
  gap: 20px;
  margin-bottom: 30px;

  min-height: 100px;
  background-color: #15ff0041;
}

.title {
  font-size: 18px;
  font-weight: 600;
  margin-top: 20px;
  margin-bottom: 0px;
  width: 100%;
}

.group {
  width: 100%;
  /* background-color: aquamarine; */
}
</style>
