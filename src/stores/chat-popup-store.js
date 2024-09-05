import { defineStore } from 'pinia'

export const useChatPopupStore = defineStore('chatPopupStore', {
  state: () => ({
    active: false,
    showingChatrooms: true,
  }),

  actions: {
    open() {
      this.active = true
      this.showingChatrooms = true
    },

    close() {
      this.active = false
      this.showingChatrooms = true
    },
  },
})
