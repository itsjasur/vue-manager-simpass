import { defineStore } from 'pinia'

export const useSideMenuStore = defineStore('sidemenu', {
  state: () => ({
    isSideMenuOpen: true,
    isOpen: true,
  }),

  actions: {
    toggle() {
      // this.isSideMenuOpen = !this.isSideMenuOpen
      this.isOpen = !this.isOpen
    },
    close() {
      // this.isSideMenuOpen = false
      this.isOpen = false
    },

    open() {
      this.isOpen = true
      // this.isSideMenuOpen = true
    },
  },
})
