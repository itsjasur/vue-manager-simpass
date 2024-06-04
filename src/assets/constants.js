export const SIDEMENUNAMES = [
  '홈',
  '나의 정보',
  '가입/번호이동 신청서',
  '랜탈가입 신청서',
  '신청서 (접수/개통) 현황',
  '신청서양식 다운로드',
]

// export const BASEURL = 'http://192.168.0.251:8091/api/'
export const BASEURL = 'https://ta.simpass.co.kr/api/'

export const PLANTYPES = [
  { cd: 'PO', label: '후불' },
  { cd: 'PR', label: '선불' },
]

export const CARRIERS = [
  { cd: '', label: '전체' },
  { cd: 'KT', label: 'KT' },
  { cd: 'SK', label: 'SKT' },
  { cd: 'LG', label: 'LG U+' },
]

export const CHECKBOXES = [
  { name: '증빙자료첨부(선택사항)', type: 'supportDocs', value: false },
  { name: '신청서 프린트 인쇄후 서명/사인 자필', type: 'signAfterPrint', value: false },
]

export const PLANSINFO = [
  {
    code: 'PR',
    carriers: [
      {
        code: 'KT',
        mvnos: [
          {
            code: 'COM',
            customerForms: [
              'cust_type_cd',
              'contact',
              'applicant_name',
              'application_birthday',
              'id_passport_number',
              'country',
              'address',
              'address_additions',
            ],

            usimForms: [
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
            customerForms: [
              'cust_type_cd',
              'contact',
              'applicant_name',
              'application_birthday',
              'id_passport_number',
              'country',
              'address',
              'address_additions',
            ],

            usimForms: [
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
            customerForms: [
              'cust_type_cd',
              'contact',
              'applicant_name',
              'application_birthday',
              'address',
              'address_additions',
            ],
            usimForms: [
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

            usimForms: [
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
            customerForms: [
              'cust_type_cd',
              'contact',
              'applicant_name',
              'application_birthday',
              'gender',
              'address',
              'address_additions',
            ],
          },
          {
            code: 'KTS',

            usimForms: [
              //
              'usim_plan_nm',
              'usim_model_list',
              'usim_no',
              'data_roming_block_cd',
              'phone_bill_block_cd',
              'usim_act_cd',
            ],
            customerForms: [
              'cust_type_cd',
              'contact',
              'applicant_name',
              'application_birthday',
              'address',
              'address_additions',
            ],
          },
        ],
      },
      {
        code: 'LG',
        mvnos: [
          {
            code: 'HPM',

            usimForms: [
              //
              'usim_plan_nm',
              'usim_model_list',
              'usim_no',
              'usim_fee_cd',
              'usim_act_cd',
            ],
            customerForms: [
              'cust_type_cd',
              'contact',
              'applicant_name',
              'application_birthday',
              'id_passport_number',
              'country',
              'address',
              'address_additions',
            ],
          },
          {
            code: 'HVS',

            usimForms: [
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
            customerForms: [
              'cust_type_cd',
              'contact',
              'applicant_name',
              'application_birthday',
              'address',
              'address_additions',
            ],
          },
          {
            code: 'UPM',
            usimForms: [
              //
              'usim_plan_nm',
              'usim_model_list',
              'usim_no',
              'usim_fee_cd',
              'extra_service_cd',
              'data_roming_block_cd',
              'usim_act_cd',
            ],
            customerForms: [
              'cust_type_cd',
              'contact',
              'applicant_name',
              'application_birthday',
              'address',
              'address_additions',
            ],
          },
        ],
      },
    ],
  },
]

export const USIM_FORM_DETAILS = {
  //USIM INFO

  usim_plan_nm: {
    //
    value: null,
    type: 'input',
    width: '400px',
    error: '요금제을 선택하세요.',
    placeholder: '요금제 선택하세요.',
    label: '요금제',
    partitionType: 'usim',
    hasDefault: true,
  },

  usim_model_list: {
    value: null,
    type: 'select',
    width: '300px',
    error: 'USIM 모델명을 선택하세요.',
    placeholder: '모델명을 선택하세요',
    hasDefault: false,
    label: 'USIM 모델명',
    partitionType: 'usim',
  },

  usim_no: {
    value: null,
    type: 'select',
    width: '300px',
    error: '일련번호 입력하세요.',
    placeholder: '00000000',
    hasDefault: false,
    label: '일련번호',
    partitionType: 'usim',
  },
  usim_fee_cd: {
    value: null,
    type: 'select',
    width: '300px',
    error: '유심비용청구을 선택하세요',
    placeholder: '유심비용청구을 선택하세요',
    hasDefault: true,
    label: '유심비용청구',
    partitionType: 'usim',
  },

  extra_service_cd: {
    value: null,
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
    value: null,
    type: 'select',
    width: '300px',
    error: '해외데이터로밍을 선택하세요.',
    placeholder: '해외데이터로밍을 선택하세요',
    hasDefault: true,
  },

  plan_fee_cd: {
    label: '가입비',
    value: null,
    type: 'select',
    width: '300px',
    error: '가입비을 선택하세요.',
    placeholder: '가입비을 선택하세요',
    hasDefault: true,
    partitionType: 'usim',
  },
  phone_bill_block_cd: {
    label: '휴대폰결제',
    value: null,
    type: 'select',
    width: '300px',
    error: '휴대폰결제을 선택하세요.',
    placeholder: '휴대폰결제을 선택하세요',
    hasDefault: true,
    partitionType: 'usim',
  },
  usim_act_cd: {
    label: '가입비',
    value: null,
    type: 'select',
    width: '300px',
    error: '개통구분을 선택하세요.',
    placeholder: '개통구분을 선택하세요',
    hasDefault: true,
    partitionType: 'usim',
  },
}

export const CUSTOMER_FORM_DETAILS = {
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
    value: null,
    label: '개통번호외 연락번호',
    hasDefault: true,
    partitionType: 'customer',
  },

  country: {
    type: 'input',
    width: '300px',
    error: '국적 선택하세요.',
    placeholder: '대한민국',
    hasDefault: true,
    value: null,
    label: '국적',
    partitionType: 'customer',
  },

  id_passport_number: {
    //
    type: 'input',
    width: '200px',
    error: '신분증번호/여권번호 입력하세요.',
    placeholder: '910131-0000000',
    value: null,
    hasDefault: true,
    label: '신분증번호/여권번호',
    partitionType: 'customer',
  },

  applicant_name: {
    //
    type: 'input',
    width: '500px',
    error: '가입자명 입력하세요.',
    placeholder: '홍길동',
    hasDefault: true,
    value: null,
    label: '가입자명',
    partitionType: 'customer',
  },

  application_birthday: {
    //
    type: 'cleave-birthday-input',
    width: '200px',
    hasDefault: true,
    error: '생년월일 입력하세요.',
    placeholder: '1991-01-31',
    value: null,
    label: '생년월일',
    partitionType: 'customer',
  },

  gender: {
    //
    value: null,
    type: 'select',
    width: '100px',
    error: '성별 입력하세요.',
    placeholder: '남',
    hasDefault: true,
    label: '성별',
    partitionType: 'customer',
  },

  address: {
    //
    value: null,
    type: 'input',
    width: '500px',
    error: '주소 입력하세요.',
    hasDefault: true,
    placeholder: '서울시 구로구 디지털로33길 28',
    label: '주소',
    partitionType: 'customer',
  },

  address_additions: {
    //
    value: null,
    hasDefault: true,
    type: 'input',
    width: '300px',
    error: '상세주소 입력하세요.',
    placeholder: '우림이비지센터 1차 1210호',
    label: '상세주소',
    partitionType: 'customer',
  },
}
