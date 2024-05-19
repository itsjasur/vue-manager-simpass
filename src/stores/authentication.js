import { defineStore } from 'pinia'

export const useAuthenticationStore = defineStore('status', {
  state: () => ({
    isLoggedIn: true,
    role: []
  }),

  actions: {
    logout() {
      this.isLoggedIn = false
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('role')
    },

    login(token, refreshToken) {
      this.isLoggedIn = true
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('role', JSON.stringify(roles))
    }

    // retrieveFromStorage() {
    //   const token = localStorage.getItem('token')
    //   const refreshToken = localStorage.getItem('refreshToken')
    //   const roleJSON = localStorage.getItem('role')
    // }
  }
})
