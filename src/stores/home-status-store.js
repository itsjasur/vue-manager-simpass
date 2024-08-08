import { defineStore } from 'pinia'

export const useHomeStatusHolder = defineStore('home-status-holder', {
  state: () => ({
    status: '',
  }),

  actions: {
    save(newStatus) {
      this.status = newStatus
    },

    clear() {
      this.status = ''
    },
  },
})
