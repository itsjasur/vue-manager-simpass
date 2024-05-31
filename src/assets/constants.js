export const SIDEMENUNAMES = [
  '홈',
  '나의 정보',
  '가입/번호이동 신청서',
  '랜탈가입 신청서',
  '신청서 (접수/개통) 현황',
  '신청서양식 다운로드',
]

export const BASEURL = 'http://192.168.0.251:8091/api/'

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

export const DATASAMPLE = {
  extra_service_cd: [],
  usim_fee_cd: [
    {
      cd: 'NP',
      value: '미청구',
    },
    {
      cd: 'PP',
      value: '일반후납',
    },
    {
      cd: 'PN',
      value: 'NFC후납',
    },
  ],
  plan_fee_cd: [],
  chk_partner_sign: 'Y',
  paid_transfer_cd: [
    {
      cd: 'B',
      value: '은행계좌',
    },
    {
      cd: 'C',
      value: '신용카드 ',
    },
  ],
  gender_cd: [
    {
      cd: 'M',
      value: '남',
    },
    {
      cd: 'W',
      value: '여',
    },
  ],
  mnp_carrier_type: [
    {
      cd: 'PR',
      value: '선불',
    },
    {
      cd: 'PO',
      value: '후불',
    },
  ],
  usim_model_list: [
    {
      cd: 'KE-V2315',
      value: 'KE-V2315',
    },
    {
      cd: 'SC-V2317',
      value: 'SC-V2317',
    },
    {
      cd: 'SC-V3005',
      value: 'SC-V3005',
    },
    {
      cd: 'GE-V2205',
      value: 'GE-V2205',
    },
    {
      cd: 'MV-L1600',
      value: 'MV-L1600',
    },
    {
      cd: 'KE-L2105',
      value: 'KE-L2105',
    },
  ],
  relationship_cd: [
    {
      cd: 'F',
      value: '부',
    },
    {
      cd: 'M',
      value: '모',
    },
  ],
  data_block_cd: [],
  data_roming_block_cd: [],
  cust_type_cd: [
    {
      cd: 'MEL',
      value: '개인',
    },
    {
      cd: 'MEA',
      value: '외국인',
    },
    {
      cd: 'COL',
      value: '청소년',
    },
    {
      cd: 'MEP',
      value: '개인사업자',
    },
    {
      cd: 'MEC',
      value: '법인사업자',
    },
  ],
  cust_type: [
    {
      cd: 'ME',
      value: '일반',
    },
    {
      cd: 'CO',
      value: '청소년',
    },
  ],
  cust_cd: [
    {
      cd: 'L',
      value: '내국인',
    },
    {
      cd: 'A',
      value: '외국인',
    },
    {
      cd: 'C',
      value: '법인',
    },
    {
      cd: 'P',
      value: '개인사업자',
    },
  ],
  mnp_pre_carrier: [
    {
      cd: 'SK',
      value: 'SKT',
    },
    {
      cd: 'KT',
      value: 'KT',
    },
    {
      cd: 'LG',
      value: 'LG U+',
    },
    {
      cd: 'MV',
      value: '알뜰폰',
    },
  ],
  chk_usim_model: 'N',
  phone_bill_block_cd: [],
  usim_act_cd: [
    {
      cd: 'N',
      value: '신규가입',
    },
    {
      cd: 'M',
      value: '번호이동',
    },
  ],
}

export const MVNOINFO = {
  num: null,
  id: 206,
  usim_plan_nm: '5G 스페셜 유심 180GB',
  carrier_cd: 'LG',
  carrier_nm: null,
  mvno_cd: 'HVS',
  mvno_nm: null,
  agent_cd: 'SP',
  agent_nm: null,
  basic_fee: 66000,
  sales_fee: 66000,
  discount_fee: 0,
  voice: ' 무제한',
  message: '무제한',
  cell_data: '180GB',
  video_etc: '',
  qos: '10Mbps',
  carrier_plan_type: 'P',
  carrier_plan_type_nm: null,
  carrier_type: 'PO',
  carrier_type_nm: null,
  usim_fee: 0,
  plan_fee: 0,
  priority: 100,
  from_date: '2024-03-19 10:20:16.0',
  expire_date: '9999-12-31 23:59:59.0',
  status: 'Y',
  status_nm: null,
  reg_by: 0,
  reg_time: '2024-03-19 10:20:16.0',
  update_by: 0,
  update_time: '2024-03-19 10:20:16.0',
}

// export const FORMLABELS = {
//   name: '이름',
//   birthday: '생년월일',
//   contact: '연락처',
//   address: '주소(주소+상세주소)',
//   carrier_type: '서비스유형',
//   cust_type: '고객정보',
//   usim_act_cd: '개통구분',
//   cust_cd: '고객구분',
//   usim_plan_id: '요금제 ID',
//   usim_plan_nm: '요금제 명',
//   carrier_cd: '통신사',
//   usim_model_list: 'USIM 모델명',
//   usim_no: 'USIM 일련번호',
//   usim_fee_cd: 'USIM 비용청구',
//   phone_number: '가입/이동 전화번호',
//   paid_transfer_cd: '자동이체 결제구분',
//   account_name: '자동이체 예금주[카드주]명',
//   account_birthday: '자동이체 예금주 생년월일',
//   account_agency: '자동이체 은행[카드사]명',
//   account_number: '자동이체 계좌/카드번호',
//   card_yy_mm: '자동이체 카드유효기간(결제구분이 카드일 경우)',
//   mnp_carrier_type: '이동유형',
//   mnp_pre_carrier: '이전통신사',
//   mnp_pre_carrier_nm: '이전통신사 알뜰폰사 명',
//   deputy_name: '대리인 이름',
//   relationship_cd: '대리인 관계',
//   deputy_birthday: '대리인 생년월일',
//   deputy_contact: '대리인 연락처',
//   apply_sign: '가입자 서명',
//   apply_seal: '가입자 (사인)',
//   agree_sign: '동의합니다 서명',
//   bill_sign: '후불 자동이체 서명',
//   bill_seal: '후불 자동이체 (사인)',
//   attach_files: '파일추가 (첨부파일)',
//   chk_eq_yn: '자동이체 고객정보 동일여부',
//   deputy_sign: '법정대리인 서명',
//   deputy_seal: '법정대리인 (사인)',
//   chk_partner_sign: '판매자 서명,사인 유무체크',
//   partner_sign: '판매자 (서명)',
//   partner_seal: '판매자 (사인)',
//   not_cust_sign: '고객 서명출력안함',
//   request_no_1: '희망번호_1 4자리',
//   request_no_2: '희망번호_2 4자리',
//   request_no_3: '희망번호_3 4자리',
//   gender: '성별',
//   data_block: '무선데이터 차단 서비스(데이티 차단서비스)',
//   data_roming_block: '데이터 로밍 차단(해외데이터 로밍서비스)',
//   phone_bill_block: '통신과금 서비스(휴대폰 결제)',
//   plan_fee_cd: '가입비 (일시불, 3개월분납, 면제)',
//   extra_service: '부가서비스',
//   paid_transfer_cd: '결제구분',
//   account_name: '예금주명',
//   account_birthday: '예금주 생년월일',
//   account_agency: '은행[카드사]명',
//   account_number: '자동이체 계좌/카드번호',
// }
