import { defineStore } from 'pinia'
import router from '../router/'

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
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      // window.location.href = '/login'
      router.push('/login')
    },

    login(token, refreshToken, id, userName) {
      this.isLoggedIn = true
      localStorage.setItem('accessToken', token)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('id', id)
      localStorage.setItem('userName', userName)

      router.push('/home')
      // window.location.href = '/home'
    }

    // retrieveFromStorage() {
    //   const token = localStorage.getItem('token')
    //   const refreshToken = localStorage.getItem('refreshToken')
    //   const roleJSON = localStorage.getItem('role')
    // }
  }
})
