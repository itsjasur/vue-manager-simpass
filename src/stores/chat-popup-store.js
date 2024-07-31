import { defineStore } from 'pinia'

export const useChatPopupStore = defineStore('chatPopupStore', {
  state: () => ({
    active: false,
    agentCode: '',
  }),

  actions: {
    open(agentCode) {
      this.active = true
      this.agentCode = agentCode
    },

    close() {
      this.active = false
    },
  },
})
