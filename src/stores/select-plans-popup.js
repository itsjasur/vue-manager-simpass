import { defineStore } from 'pinia'

export const useSelectPlansPopup = defineStore('selectPlansPopup', {
  state: () => ({
    active: false,
    type: '',
    carrierCd: '',
    mvnoCd: '',
    searchText: '',
    onlyFavorites: false,
  }),

  actions: {
    open(type, carrierCd, mvnoCd, onlyFavorites = false) {
      this.active = true
      this.type = type
      this.carrierCd = carrierCd
      this.mvnoCd = mvnoCd
      this.onlyFavorites = onlyFavorites
    },

    close() {
      this.active = false
    },
  },
})
