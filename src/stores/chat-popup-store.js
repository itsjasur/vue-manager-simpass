import { defineStore } from 'pinia'

export const useChatPopupStore = defineStore('chatPopupStore', {
  state: () => ({
    active: false,
    socket: null,
  }),

  actions: {
    open(socket) {
      this.active = true
      this.socket = socket
    },

    close() {
      this.active = false
    },
  },
})
