import { defineStore } from 'pinia'

export const useAuthenticationStore = defineStore('status', {
  state: () => ({
    isLoggedIn: true,
    // role: [],
    id: '',
    userName: ''
  }),

  actions: {
    logout() {
      this.isLoggedIn = false
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      // localStorage.removeItem('role')
    },

    login(token, refreshToken, id, userName) {
      this.isLoggedIn = true
      localStorage.setItem('accessToken', token)
      localStorage.setItem('refreshToken', refreshToken)
      // localStorage.setItem('role', JSON.stringify(roles))
      localStorage.setItem('id', id)
      localStorage.setItem('userName', userName)
    }

    // retrieveFromStorage() {
    //   const token = localStorage.getItem('token')
    //   const refreshToken = localStorage.getItem('refreshToken')
    //   const roleJSON = localStorage.getItem('role')
    // }
  }
})
