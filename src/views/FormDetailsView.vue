<template>
  <div class="container"></div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { FORMLABELS } from '../assets/constants.js'

const showingForms = ref([
  {
    key: 'cust_type_cd',
    type: 'select',

    carriers: 'ALL',
    mvnos: 'ALL',
  },

  {
    key: 'contact',
    type: 'input',
    planType: 'ALL',
    carriers: 'ALL',
    mvnos: 'ALL',
  },
  {
    key: 'applicant_name',
    type: 'input',
    carriers: 'ALL',
    mvnos: 'ALL',
  },

  {
    key: 'applicant_birthday',
    type: 'input',
    carriers: 'ALL',
    mvnos: 'ALL',
  },
  {
    key: 'gender',
    type: 'select',
    carriers: 'ALL',
    mvnos: 'ALL',
  },
])

const info = ref([
  {
    code: 'PR',
    carriers: [
      {
        code: 'KT',
        mvnos: [
          {
            code: 'COM',
            userInfoForms: [
              'cust_type_cd',
              'contact',
              'applicant_name',
              'application_birthday',
              'id_passport_number',
              'country',
              'address',
              'address_additions',
            ],
            planInfoForms: [
              //
              'usim_plan_nm',
              'usim_model_no',
              'usim_no',
              'usim_fee_cd',
            ],
          },
        ],
      },
      {
        code: 'LG',
        mvnos: [
          {
            code: 'HPM',
            userInfoForms: [
              'cust_type_cd',
              'contact',
              'applicant_name',
              'application_birthday',
              'id_passport_number',
              'country',
              'address',
              'address_additions',
            ],
            planInfoForms: [
              'usim_plan_nm',
              'usim_model_no',
              'usim_no',
              'plan_fee_cd',
              'usim_fee_cd',
            ],
          },
        ],
      },
    ],
  },

  {
    code: 'PO',
    carriers: [
      {
        code: 'SK',
        mvnos: [
          //
          {
            //
            code: SVM,

            userInfoForms: [
              'cust_type_cd',
              'contact',
              'applicant_name',
              'application_birthday',
              'address',
              'address_additions',
            ],
            planInfoForms: [
              'usim_plan_nm',
              'usim_model_no',
              'usim_no',
              'usim_fee_cd',
              'data_block_cd',
              'phone_bill_block_cd',
              'usim_act_cd',
            ],
          },
        ],
      },
      {
        code: 'KT',
        mvnos: [
          //
          {
            //
            code: 'KTM',
            userInfoForms: [
              //
              'cust_type_cd',
              'contact',
              'applicant_name',
              'application_birthday',
              'gender',
              'address',
              'address_additions',
            ],
            planInfoForms: [
              //
              'usim_plan_nm',
              'usim_model_no',
              'usim_no',
              'usim_fee_cd',
              'data_block_cd',
              'phone_bill_block_cd',
              'plan_fee_cd',
              'usim_act_cd',
            ],
          },
          {
            //
            code: 'KTS',
            userInfoForms: [
              //
              'cust_type_cd',
              'contact',
              'applicant_name',
              'application_birthday',
              'address',
              'address_additions',
            ],
            planInfoForms: [
              //
              'usim_plan_nm',
              'usim_model_no',
              'usim_no',
              'data_block_cd',
              'phone_bill_block_cd',
              'usim_act_cd',
            ],
          },
        ],
      },
      {
        code: 'LG',
        mvnos: [
          //
          {
            //
            code: 'HPM',
            userInfoForms: [
              //
              'cust_type_cd',
              'contact',
              'applicant_name',
              'application_birthday',
              'id_passport_number',
              'country',
              'address',
              'address_additions',
            ],
            planInfoForms: [
              //
              'usim_plan_nm',
              'usim_model_no',
              'usim_no',
              'usim_fee_cd',
              'usim_act_cd',
            ],
          },
          {
            //
            code: 'HVS',
            userInfoForms: [
              //
              'cust_type_cd',
              'contact',
              'applicant_name',
              'application_birthday',
              'address',
              'address_additions',
            ],

            planInfoForms: [
              //
              'usim_plan_nm',
              'usim_model_no',
              'usim_no',
              'usim_fee_cd',
              'extra_service',
              'data_block_cd',
              'plan_fee_cd',
              'usim_act_cd',
            ],
          },
          {
            //
            code: 'UPM',
            userInfoForms: [
              //
              'cust_type_cd',
              'contact',
              'applicant_name',
              'application_birthday',
              'address',
              'address_additions',
            ],
            planInfoForms: [
              'usim_plan_nm',
              'usim_model_no',
              'usim_no',
              'usim_fee_cd',
              'extra_service',
              'data_block_cd',
              'usim_act_cd',
            ],
          },
        ],
      },
    ],
  },
])
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
</style>
