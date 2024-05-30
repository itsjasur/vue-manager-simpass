import { defineStore } from 'pinia'

export const useSelectPlansPopup = defineStore('selectPlansPopup', {
  state: () => ({
    carrierCd: '',
    mvnoCd: '',
    carrierType: '',
    planName: '',

    active: false,
  }),

  actions: {
    open(carrierCd, mvnoCd, carrierType) {
      // console.log(carrierCd, mvnoCd, carrierType)

      this.carrierCd = carrierCd
      this.mvnoCd = mvnoCd
      this.carrierType = carrierType

      this.active = true
    },
    close() {
      this.active = false
    },

    selectItem(selectedPlan) {
      this.carrierCd = selectedPlan.carrier_cd
      this.mvnoCd = selectedPlan.mvno_cd
      this.carrierType = selectedPlan.carrier_type
      this.planName = selectedPlan.usim_plan_nm
    },
  },
})
