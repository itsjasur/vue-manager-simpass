import { reactive } from 'vue'

export const PLANSINFO = [
  {
    code: 'PR',
    carriers: [
      {
        code: 'KT',
        mvnos: [
          {
            wishCount: 2,
            code: 'COM',
            forms: [
              'cust_type_cd',
              'contact',
              'name',
              'birthday',
              'id_no',
              'country',
              'address',
              'addressdetail',

              'usim_act_cd',
              'usim_plan_nm',
              'usim_model_list',
              'usim_no',
            ],
          },
        ],
      },
      {
        code: 'LG',
        mvnos: [
          {
            wishCount: 3,
            code: 'HPM',
            forms: [
              'cust_type_cd',
              'contact',
              'name',
              'birthday',
              'id_no',
              'country',
              'address',
              'addressdetail',
              'usim_act_cd',

              'usim_plan_nm',
              'usim_model_list',
              'usim_no',
              'usim_fee_cd',
            ],
          },

          {
            code: 'ISM',
            wishCount: 3,
            forms: [
              'cust_type_cd',
              'contact',
              'name',
              'birthday',
              'id_no',
              'country',
              'address',
              'addressdetail',

              'usim_act_cd',
              'usim_plan_nm',
              'usim_model_list',
              'usim_no',
            ],
          },
        ],
      },
    ],
  },

  {
    code: 'PO',
    paymentForms: ['paid_transfer_cd', 'account_name', 'account_birthday', 'account_agency', 'account_number'],
    carriers: [
      {
        code: 'SK',
        mvnos: [
          {
            wishCount: 2,
            code: 'SVM',
            forms: [
              //
              'cust_type_cd',
              'contact',
              'name',
              'birthday_full',
              'address',
              'addressdetail',

              'usim_act_cd',
              'usim_plan_nm',
              'usim_no',
              'usim_fee_cd',
            ],
          },
        ],
      },
      {
        code: 'KT',

        mvnos: [
          {
            wishCount: 2,
            code: 'KTM',
            forms: [
              //
              'cust_type_cd',
              'contact',
              'name',
              'birthday',
              'gender_cd',
              'address',
              'addressdetail',
              'plan_fee_cd',
              'usim_act_cd',

              'usim_plan_nm',
              'usim_model_list',
              'usim_no',
              'usim_fee_cd',
            ],
          },
          {
            code: 'KTS',
            forms: [
              //
              'cust_type_cd',
              'contact',
              'name',
              'birthday',
              'address',
              'addressdetail',
              'usim_act_cd',

              'usim_plan_nm',
              'usim_model_list',
              'usim_no',
            ],
          },
        ],
      },
      {
        code: 'LG',
        mvnos: [
          {
            wishCount: 3,
            code: 'HPM',

            forms: [
              'cust_type_cd',
              'contact',
              'name',
              'birthday',
              'id_no',
              'country',
              'address',
              'addressdetail',
              'usim_act_cd',

              'usim_plan_nm',
              'usim_model_list',
              'usim_no',
              'usim_fee_cd',
            ],
          },
          {
            wishCount: 2,
            code: 'HVS',
            forms: [
              //
              'cust_type_cd',
              'contact',
              'name',
              'birthday',
              'address',
              'addressdetail',
              'gender_cd',
              'plan_fee_cd',
              'usim_act_cd',

              'usim_plan_nm',
              'usim_model_list',
              'usim_no',
              'usim_fee_cd',
            ],
          },
          {
            wishCount: 2,
            code: 'UPM',
            forms: [
              //
              'cust_type_cd',
              'contact',
              'name',
              'birthday',
              'address',
              'addressdetail',
              'usim_act_cd',

              'usim_plan_nm',
              'usim_model_list',
              'usim_no',
              'usim_fee_cd',
            ],
          },
        ],
      },
    ],
  },
]

export const displayingForms = reactive([
  { type: 'usim', title: '요금제 정보', forms: [] },
  { type: 'customer', title: '고객 정보', forms: [] },
  { type: 'empty', title: '', forms: [] },
  { type: 'deputy', title: '법정대리인', forms: [] },
  { type: 'payment', title: '자동이체', forms: [] },
])

export function generateDisplayingForms(availableForms) {
  for (var i of displayingForms) {
    i.forms = []
  }

  // console.log('newList', newList)
  availableForms.value.forEach((formName) => {
    // console.log(e)
    if (['usim_plan_nm', 'usim_model_list', 'usim_no', 'usim_fee_cd'].includes(formName)) {
      displayingForms[0].forms.push(formName)
    }
    if (
      [
        'cust_type_cd',
        'contact',
        'country',
        'id_no',
        'name',
        'birthday',
        'birthday_full',
        'gender_cd',
        'address',
        'addressdetail',
      ].includes(formName)
    ) {
      displayingForms[1].forms.push(formName)
    }

    if (
      [
        'extra_service_cd',
        'data_block_cd',
        'plan_fee_cd',
        'phone_bill_block_cd',
        'usim_act_cd',
        'wish_number',
        'mnp_carrier_type',
        'phone_number',
        'mnp_pre_carrier',
        'mnp_pre_carrier_nm',
      ].includes(formName)
    ) {
      displayingForms[2].forms.push(formName)
    }

    if (
      ['deputy_name', 'deputy_birthday', 'deputy_birthday_full', 'relationship_cd', 'deputy_contact'].includes(formName)
    ) {
      displayingForms[3].forms.push(formName)
    }

    if (
      [
        'paid_transfer_cd',
        'account_name',
        'account_birthday',
        'account_birthday_full',
        'account_agency',
        'account_number',
        'card_yy_mm',
      ].includes(formName)
    ) {
      displayingForms[4].forms.push(formName)
    }
  })
}
