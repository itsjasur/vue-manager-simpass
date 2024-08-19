import { defineStore } from 'pinia'

export const useChatPopupStore = defineStore('chatPopupStore', {
  state: () => ({
    active: false,
  }),

  actions: {
    open(socket) {
      this.active = true
    },

    close() {
      this.active = false
    },
  },
})
