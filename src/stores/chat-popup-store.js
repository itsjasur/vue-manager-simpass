import { defineStore } from 'pinia'

export const useChatPopupStore = defineStore('chatPopupStore', {
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
