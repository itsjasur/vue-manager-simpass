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
            wishCount: 2,
            code: 'COM',
            customerForms: [
              'cust_type_cd',
              'contact',
              'name',
              'birthday',
              'id_no',
              'country',
              'address',
              'addressdetail',
            ],

            usimForms: [
              //
              'usim_plan_nm',
              'usim_model_list',
              'usim_no',
              'usim_act_cd',
              // 'wish_number',
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
            customerForms: [
              'cust_type_cd',
              'contact',
              'name',
              'birthday',
              'id_no',
              'country',
              'address',
              'addressdetail',
            ],

            usimForms: [
              //
              'usim_plan_nm',
              'usim_model_list',
              'usim_no',
              'usim_fee_cd',
              'usim_act_cd',
              // 'wish_number',
            ],
          },
        ],
      },
    ],
  },

  {
    code: 'PO',
    paymentForms: [
      //
      'paid_transfer_cd',
      'account_name',
      'account_birthday',
      'account_agency',
      'account_number',
    ],
    carriers: [
      {
        code: 'SK',

        mvnos: [
          {
            wishCount: 2,
            code: 'SVM',
            customerForms: [
              //
              'cust_type_cd',
              'contact',
              'name',
              'birthday',
              'address',
              'addressdetail',
            ],
            usimForms: [
              //
              'usim_plan_nm',
              'usim_model_list',
              'usim_no',
              'usim_fee_cd',
              'data_block_cd',
              'phone_bill_block_cd',
              'usim_act_cd',
              // 'wish_number',
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

            usimForms: [
              //
              'usim_plan_nm',
              'usim_model_list',
              'usim_no',
              'usim_fee_cd',
              'data_block_cd',
              'phone_bill_block_cd',
              'plan_fee_cd',
              'usim_act_cd',
              // 'wish_number',
            ],
            customerForms: [
              //
              'cust_type_cd',
              'contact',
              'name',
              'birthday',
              'gender',
              'address',
              'addressdetail',
            ],
          },
          {
            code: 'KTS',

            usimForms: [
              //
              'usim_plan_nm',
              'usim_model_list',
              'usim_no',
              'data_block_cd',
              'phone_bill_block_cd',
              'usim_act_cd',
              // 'wish_number',
            ],
            customerForms: [
              //
              'cust_type_cd',
              'contact',
              'name',
              'birthday',
              'address',
              'addressdetail',
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

            usimForms: [
              //
              'usim_plan_nm',
              'usim_model_list',
              'usim_no',
              'usim_fee_cd',
              'usim_act_cd',
              // 'wish_number',
            ],
            customerForms: [
              'cust_type_cd',
              'contact',
              'name',
              'birthday',
              'id_no',
              'country',
              'address',
              'addressdetail',
            ],
          },
          {
            wishCount: 2,
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
              // 'wish_number',
            ],
            customerForms: [
              //
              'cust_type_cd',
              'contact',
              'name',
              'birthday',
              'address',
              'addressdetail',
            ],
          },
          {
            wishCount: 2,
            code: 'UPM',
            usimForms: [
              //
              'usim_plan_nm',
              'usim_model_list',
              'usim_no',
              'usim_fee_cd',
              'extra_service_cd',
              'data_block_cd',
              'usim_act_cd',
              // 'wish_number',
            ],
            customerForms: [
              //
              'cust_type_cd',
              'contact',
              'name',
              'birthday',
              'address',
              'addressdetail',
            ],
          },
        ],
      },
    ],
  },
]

export const PAYMENT_FORM_DETAILS = {
  //USIM INFO

  paid_transfer_cd: {
    value: null,
    type: 'select',
    width: '300px',
    error: '결제구분 선택하세요.',
    placeholder: '결제구분 선택하세요',
    label: '결제구분',
    hasDefault: true,
  },

  account_name: {
    value: null,
    type: 'input',
    width: '300px',
    error: '예금주명 입력하세요.',
    placeholder: '홍길동',
    label: '예금주명',
    hasDefault: false,
  },

  account_birthday: {
    value: null,
    type: 'cleave',
    pattern: {
      date: true,
      delimiter: '-',
      datePattern: ['y', 'm', 'd'],
    },
    width: '200px',
    error: '생년월일 입력하세요.',
    placeholder: '91-01-31',
    label: '예금주 생년월일',
    hasDefault: false,
  },

  account_agency: {
    value: null,
    type: 'input',
    width: '300px',
    error: '은행(카드사)명 입력하세요.',
    placeholder: '하나은행',
    label: '은행(카드사)명',
    hasDefault: false,
  },

  account_number: {
    value: null,
    type: 'input',
    width: '300px',
    error: '계좌번호(카드번호) 입력하세요.',
    placeholder: '1234567890',
    label: '계좌번호(카드번호)',
    hasDefault: false,
  },

  card_yy_mm: {
    value: null,
    type: 'cleave',
    pattern: {
      date: true,
      datePattern: ['m', 'y'],
    },
    width: '200px',
    error: '카드유효기간을 정확하게 입력하세요.',
    placeholder: '11/29',
    label: '카드유효기간',
    hasDefault: false,
  },
}

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
  },

  usim_no: {
    value: null,
    type: 'input',
    width: '300px',
    error: '일련번호 입력하세요.',
    placeholder: '00000000',
    hasDefault: false,
    label: '일련번호',
  },
  usim_fee_cd: {
    value: null,
    type: 'select',
    width: '300px',
    error: '유심비용청구을 선택하세요',
    placeholder: '유심비용청구을 선택하세요',
    hasDefault: true,
    label: '유심비용청구',
  },

  extra_service_cd: {
    value: null,
    type: 'select',
    width: '300px',
    error: '부가서비스 선택하세요',
    placeholder: '부가서비스을 선택하세요',
    hasDefault: true,
    label: '부가서비스',
  },

  data_block_cd: {
    label: '해외데이터로밍',
    value: null,
    type: 'select',
    width: '300px',
    error: '해외데이터로밍을 선택하세요.',
    placeholder: '해외데이터로밍을 선택하세요',
    hasDefault: true,
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
  },
  phone_bill_block_cd: {
    label: '휴대폰결제',
    value: null,
    type: 'select',
    width: '300px',
    error: '휴대폰결제을 선택하세요.',
    placeholder: '휴대폰결제을 선택하세요',
    hasDefault: true,
  },
  usim_act_cd: {
    label: '개통구분',
    value: null,
    type: 'select',
    width: '300px',
    error: '개통구분을 선택하세요.',
    placeholder: '개통구분을 선택하세요',
    hasDefault: false,
  },

  wish_number: {
    label: '희망번호',
    value: null,
    type: 'cleave',
    width: '300px',
    error: null,
    placeholder: '희망번호',
    hasDefault: false,
  },

  mnp_carrier_type: {
    label: '이동 유형',
    value: null,
    type: 'select',
    width: '300px',
    error: '이동 유형을 선택하세요.',
    placeholder: '선불',
    hasDefault: true,
  },

  phone_number: {
    value: null,
    type: 'cleave',
    pattern: {
      prefix: '010-',
      phone: true,
      phoneRegionCode: 'KR',
      delimiter: '-',
    },
    width: '300px',
    error: '가입/이동 전화번호을 입력하세요.',
    placeholder: '010-0000-0000',
    label: '가입/이동 전화번호',
    hasDefault: false,
  },

  mnp_pre_carrier: {
    label: '이전통신사',
    value: null,
    type: 'select',
    width: '300px',
    error: '이전통신사을 선택하세요.',
    placeholder: '선불',
    hasDefault: false,
  },

  mnp_pre_carrier_nm: {
    value: null,
    type: 'input',
    width: '300px',
    error: '이전 통신사 기타명을 입력하세요.',
    placeholder: '이전 통신사 기타명',
    label: '이전 통신사 기타명',
    hasDefault: false,
  },
}

//CUSTOMER INFO
///
///
export const CUSTOMER_FORM_DETAILS = {
  cust_type_cd: {
    type: 'select',
    width: '200px',
    error: '고객유형 선택하세요.',
    placeholder: '고객유형 선택하세요',
    value: null,
    hasDefault: false,
    label: '고객유형',
  },

  contact: {
    type: 'cleave',
    pattern: {
      phone: true,
      phoneRegionCode: 'KR',
      delimiter: '-',
    },
    width: '200px',
    error: '연락처 입력하세요.',
    placeholder: '010-0000-0000',
    value: null,
    label: '개통번호외 연락번호',
    hasDefault: true,
  },

  country: {
    type: 'input',
    width: '300px',
    error: '국적 선택하세요.',
    placeholder: '대한민국',
    hasDefault: true,
    value: null,
    label: '국적',
  },

  id_no: {
    //
    type: 'input',
    width: '200px',
    error: '신분증번호/여권번호 입력하세요.',
    placeholder: '910131-0000000',
    value: null,
    hasDefault: true,
    label: '신분증번호/여권번호',
  },

  name: {
    //
    type: 'input',
    width: '500px',
    error: '가입자명 입력하세요.',
    placeholder: '홍길동',
    hasDefault: true,
    value: null,
    label: '가입자명',
  },

  birthday: {
    //
    type: 'cleave',
    pattern: {
      date: true,
      delimiter: '-',
      datePattern: ['y', 'm', 'd'],
    },
    width: '200px',
    hasDefault: true,
    error: '생년월일 입력하세요.',
    placeholder: '91-01-31',
    value: null,
    label: '생년월일',
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
  },

  addressdetail: {
    //
    value: null,
    hasDefault: true,
    type: 'input',
    width: '300px',
    error: '상세주소 입력하세요.',
    placeholder: '우림이비지센터 1차 1210호',
    label: '상세주소',
  },
}
