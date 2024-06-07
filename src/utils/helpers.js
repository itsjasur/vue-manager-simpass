import { PLANSINFO } from '@/assets/constants'

export const findForms = (type, carrierCd, mvnoCd) => {
  const result = PLANSINFO.find((item) => item.code === type) // which type (postpaid or prepaid)
    ?.carriers.find((carrier) => carrier.code === carrierCd) // which carrier
    ?.mvnos.find((mvno) => mvno.code === mvnoCd) //which mvno

  return result
}
