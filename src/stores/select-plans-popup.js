import { defineStore } from 'pinia'
import { fetchWithTokenRefresh } from '../utils/tokenUtils'
import { useSnackbarStore } from '../stores/snackbar'

export const useSelectPlansPopup = defineStore('selectPlansPopup', {
  state: () => ({
    active: false,

    type: '',
    carrierCd: '',
    mvnoCd: '',
    searchText: '',
  }),

  actions: {
    open() {
      this.active = true
    },

    close() {
      this.active = false
    },
  },
})
