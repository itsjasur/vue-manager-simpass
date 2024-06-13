import { defineStore } from 'pinia'

export const useRouteMemoryStore = defineStore('router-memory-store', {
  state: () => ({
    intendedRoute: '',
  }),

  actions: {
    save(url) {
      this.intendedRoute = url
    },
  },
})
