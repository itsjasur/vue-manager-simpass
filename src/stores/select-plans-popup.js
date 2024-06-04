import { defineStore } from 'pinia'
import { fetchWithTokenRefresh } from '../utils/tokenUtils'
import { useSnackbarStore } from '../stores/snackbar'

export const useSelectPlansPopup = defineStore('selectPlansPopup', {
  state: () => ({
    active: false,
    planList: [],

    carrierType: 'PO',
    carrierCd: 'KT',
    mvnoCd: 'KTS',
    searchText: '',

    selectedPlanInfo: {},
  }),

  actions: {
    open() {
      console.log('open called')
      this.active = true
      this.fetchData()
    },

    async fetchData() {
      console.log('plans fetch called')
      try {
        const response = await fetchWithTokenRefresh('agent/planlist', {
          method: 'POST',
          body: {
            carrier_cd: this.carrierCd, // SKT : SK ,KT : KT,LG U+ : LG
            mvno_cd: this.mvnoCd,
            carrier_type: this.carrierType, // 선불:PR ,후불:PO
            usim_plan_nm: this.searchText,
          },
        })
        if (response.ok) {
          const decodedResponse = await response.json()
          console.log(decodedResponse)

          if (decodedResponse.data && decodedResponse.data.info) {
            let info = decodedResponse.data.info
            this.planList = info
          }
        } else {
          throw new Error('Fetch data error')
        }
      } catch (error) {
        useSnackbarStore().showSnackbar(error.toString())
      }
    },

    close() {
      this.active = false
      this.searchText = ''
      this.planList = []
    },
  },
})
