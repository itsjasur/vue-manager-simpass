import { defineStore } from 'pinia'

export const useSignUpstore = defineStore('signupStore', {
  state: () => ({
    // signupStep: 'initial',
    signupStep: 'secondary',
    receiptId: '',
    salesCd: '',
    phoneNumber: '01023123123',
    idCertType: '',
  }),

  actions: {
    next(newStep, receiptId, salesCd, phoneNumber, idCertType) {
      this.signupStep = newStep
      this.receiptId = receiptId
      this.salesCd = salesCd
      this.phoneNumber = phoneNumber
      this.idCertType = idCertType
    },
  },
})
