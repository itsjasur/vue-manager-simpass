import { defineStore } from 'pinia'

export const useGlobalDataStore = defineStore('globalData', {
  state: () => ({
    // signupStep: 'initial',
    signupStep: 'secondary',
  }),

  actions: {
    newSignUpStep(newStep) {
      if (this.signupStep !== newStep) this.active = true
    },
  },
})
