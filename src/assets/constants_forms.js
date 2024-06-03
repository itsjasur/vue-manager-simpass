export const PLANSINFO = [
  {
    code: 'PR',
    carriers: [
      {
        code: 'KT',
        mvnos: [
          {
            code: 'COM',
            availableForms: [
              'cust_type_cd',
              'contact',
              'applicant_name',
              'application_birthday',
              'id_passport_number',
              'country',
              'address',
              'address_additions',

              //
              'usim_plan_nm',
              'usim_model_list',
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
            availableForms: [
              'cust_type_cd',
              'contact',
              'applicant_name',
              'application_birthday',
              'id_passport_number',
              'country',
              'address',
              'address_additions',

              //
              'usim_plan_nm',
              'usim_model_list',
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
          {
            code: 'SVM',
            availableForms: [
              'cust_type_cd',
              'contact',
              'applicant_name',
              'application_birthday',
              'address',
              'address_additions',

              //
              'usim_plan_nm',
              'usim_model_list',
              'usim_no',
              'usim_fee_cd',
              'data_roming_block_cd',
              'phone_bill_block_cd',
              'usim_act_cd',
            ],
          },
        ],
      },
      {
        code: 'KT',
        mvnos: [
          {
            code: 'KTM',
            availableForms: [
              'cust_type_cd',
              'contact',
              'applicant_name',
              'application_birthday',
              'gender',
              'address',
              'address_additions',

              //
              'usim_plan_nm',
              'usim_model_list',
              'usim_no',
              'usim_fee_cd',
              'data_roming_block_cd',
              'phone_bill_block_cd',
              'plan_fee_cd',
              'usim_act_cd',
            ],
          },
          {
            code: 'KTS',
            availableForms: [
              'cust_type_cd',
              'contact',
              'applicant_name',
              'application_birthday',
              'address',
              'address_additions',

              //
              'usim_plan_nm',
              'usim_model_list',
              'usim_no',
              'data_roming_block_cd',
              'phone_bill_block_cd',
              'usim_act_cd',
            ],
          },
        ],
      },
      {
        code: 'LG',
        mvnos: [
          {
            code: 'HPM',
            availableForms: [
              'cust_type_cd',
              'contact',
              'applicant_name',
              'application_birthday',
              'id_passport_number',
              'country',
              'address',
              'address_additions',

              //
              'usim_plan_nm',
              'usim_model_list',
              'usim_no',
              'usim_fee_cd',
              'usim_act_cd',
            ],
          },
          {
            code: 'HVS',
            availableForms: [
              'cust_type_cd',
              'contact',
              'applicant_name',
              'application_birthday',
              'address',
              'address_additions',

              //
              'usim_plan_nm',
              'usim_model_list',
              'usim_no',
              'usim_fee_cd',
              'extra_service_cd',
              'data_roming_block_cd',
              'plan_fee_cd',
              'usim_act_cd',
            ],
          },
          {
            code: 'UPM',
            availableForms: [
              'cust_type_cd',
              'contact',
              'applicant_name',
              'application_birthday',
              'address',
              'address_additions',

              //
              'usim_plan_nm',
              'usim_model_list',
              'usim_no',
              'usim_fee_cd',
              'extra_service_cd',
              'data_roming_block_cd',
              'usim_act_cd',
            ],
          },
        ],
      },
    ],
  },
]

export const USIM_INFO_FORMS = {
  //USIM INFO

  usim_plan_nm: {
    //
    value: '',
    type: 'input',
    width: '400px',
    error: '요금제을 선택하세요.',
    placeholder: '요금제 선택하세요.',
    label: '요금제',
    partitionType: 'usim',
  },

  usim_model_list: {
    value: '',
    type: 'select',
    width: '300px',
    error: 'USIM 모델명을 선택하세요.',
    placeholder: '모델명을 선택하세요',
    hasDefault: false,
    label: 'USIM 모델명',
    partitionType: 'usim',
  },

  usim_no: {
    value: '',
    type: 'select',
    width: '300px',
    error: '일련번호 입력하세요.',
    placeholder: '00000000',
    hasDefault: false,
    label: '일련번호',
    partitionType: 'usim',
  },
  usim_fee_cd: {
    value: '',
    type: 'select',
    width: '300px',
    error: '유심비용청구을 선택하세요',
    placeholder: '유심비용청구을 선택하세요',
    hasDefault: true,
    label: '유심비용청구',
    partitionType: 'usim',
  },

  extra_service_cd: {
    value: '',
    type: 'select',
    width: '300px',
    error: '유심비용청구을 선택하세요',
    placeholder: '부가서비스을 선택하세요',
    hasDefault: false,
    label: '부가서비스',
    partitionType: 'usim',
  },

  data_roming_block_cd: {
    label: '해외데이터로밍',
    value: '',
    type: 'select',
    width: '300px',
    error: '해외데이터로밍을 선택하세요.',
    placeholder: '해외데이터로밍을 선택하세요',
    hasDefault: true,
  },

  plan_fee_cd: {
    label: '가입비',
    value: '',
    type: 'select',
    width: '300px',
    error: '가입비을 선택하세요.',
    placeholder: '가입비을 선택하세요',
    hasDefault: true,
    partitionType: 'usim',
  },
  phone_bill_block_cd: {
    label: '가입비',
    value: '',
    type: 'select',
    width: '300px',
    error: '휴대폰결제을 선택하세요.',
    placeholder: '휴대폰결제을 선택하세요',
    hasDefault: true,
    partitionType: 'usim',
  },
  usim_act_cd: {
    label: '가입비',
    value: '',
    type: 'select',
    width: '300px',
    error: '개통구분을 선택하세요.',
    placeholder: '개통구분을 선택하세요',
    hasDefault: true,
    partitionType: 'usim',
  },
}

export const CUSTOMER_INFO_FORMS = {
  //CUSTOMER INFO
  cust_type_cd: {
    type: 'select',
    width: '200px',
    error: '고객유형 선택하세요.',
    placeholder: '고객유형 선택하세요',
    value: null,
    hasDefault: false,
    label: '고객유형',
    partitionType: 'customer',
  },

  contact: {
    type: 'input',
    width: '200px',
    error: '연락처 입력하세요.',
    placeholder: '010-0000-0000',
    value: '',
    label: '개통번호외 연락번호',
    partitionType: 'customer',
  },

  country: {
    type: 'input',
    width: '300px',
    error: '국적 선택하세요.',
    placeholder: '대한민국',
    value: '',
    label: '국적',
    partitionType: 'customer',
  },

  id_passport_number: {
    //
    type: 'input',
    width: '200px',
    error: '신분증번호/여권번호 입력하세요.',
    placeholder: '910131-0000000',
    value: '',
    label: '신분증번호/여권번호',
    partitionType: 'customer',
  },

  applicant_name: {
    //
    type: 'input',
    width: '500px',
    error: '가입자명 입력하세요.',
    placeholder: '홍길동',
    value: '',
    label: '가입자명',
    partitionType: 'customer',
  },

  application_birthday: {
    //
    type: 'cleave-birthday-input',
    width: '200px',
    error: '생년월일 입력하세요.',
    placeholder: '1991-01-31',
    value: '',
    label: '생년월일',
    partitionType: 'customer',
  },

  gender: {
    //
    value: '',
    type: 'select',
    width: '100px',
    error: '성별 입력하세요.',
    placeholder: '남',
    hasDefault: true,
    label: '성별',
    partitionType: 'customer',
    options: [
      { value: 'PR', label: '선불' },
      { value: 'PO', label: '선불' },
    ],
  },

  address: {
    //
    value: '',
    type: 'input',
    width: '500px',
    error: '주소 입력하세요.',
    placeholder: '서울시 구로구 디지털로33길 28',
    label: '주소',
    partitionType: 'customer',
  },

  address: {
    //
    value: '',
    type: 'input',
    width: '300px',
    error: '상세주소 입력하세요.',
    placeholder: '우림이비지센터 1차 1210호',
    label: '상세주소',
    partitionType: 'customer',
  },
}
