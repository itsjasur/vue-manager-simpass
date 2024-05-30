import { defineStore } from 'pinia'

export const useSideMenuStore = defineStore('sidemenu', {
  state: () => ({
    isSideMenuOpen: true,
  }),

  actions: {
    toggle() {
      // console.log('toggled')
      this.isSideMenuOpen = !this.isSideMenuOpen
    },
    close() {
      this.isSideMenuOpen = false
    },

    open() {
      this.isSideMenuOpen = true
    },
  },
})
