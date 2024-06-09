import { defineStore } from 'pinia'

export const usePrintablePopup = defineStore('printablePopup', {
  state: () => ({
    active: false,
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
