import { defineStore } from 'pinia'

export const useSnackbarStore = defineStore('snackbar', {
  state: () => ({
    message: 'asda aksjdlhas ldhaslkjdh askdhjakljs',
    show: true,
    type: 'success', // or 'error', 'warning', etc.
    timeout: null
  }),

  actions: {
    showSnackbar(message, type = 'success') {
      this.message = message
      this.type = type
      this.show = true

      // clearing any existing timeout
      if (this.timeout) {
        clearTimeout(this.timeout)
      }

      // setting  new timeout to hide the snackbar after 5 seconds
      this.timeout = setTimeout(() => {
        this.hideSnackbar()
      }, 4000)
    },

    hideSnackbar() {
      this.show = false
      this.message = ''
      this.type = 'success'
      this.timeout = null
    }
  }
})
