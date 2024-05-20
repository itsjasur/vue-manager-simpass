import { defineStore } from 'pinia'

export const useSnackbarStore = defineStore('snackbar', {
  state: () => ({
    message: '',
    show: false,
    timeout: null
  }),

  actions: {
    showSnackbar(message) {
      //if text is empty, no need to show snackbar
      if (message) {
        this.message = message
        this.show = true

        // clearing any existing timeout
        if (this.timeout) {
          clearTimeout(this.timeout)
        }

        // setting  new timeout to hide the snackbar after 5 seconds
        this.timeout = setTimeout(() => {
          this.hideSnackbar()
        }, 4000)
      }
    },

    //this hides snackbar
    hideSnackbar() {
      this.show = false
      this.message = ''
      this.timeout = null
    }
  }
})
