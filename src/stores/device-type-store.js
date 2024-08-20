// import { defineStore } from 'pinia'

// export const useDeviceTypeStore = defineStore('deviceType', {
//   state: () => ({
//     isMobile: true,
//   }),

//   actions: {
//     isDeviceMobile() {
//       const userAgent = navigator.userAgent.toLowerCase()
//       console.log(userAgent)

//       // Combined regex for both mobile and tablet devices
//       const mobileTabletRegex =
//         /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|kindle|silk|mobile|tab|cros|firefox.*mobile|tizen/i

//       // Check if it's a mobile device or tablet
//       if (mobileTabletRegex.test(userAgent)) {
//         this.isMobile = true
//         return true
//       }

//       // Check for iPad running iOS 13+ (which can report as a Mac)
//       if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) {
//         this.isMobile = true
//         return true
//       }

//       // Additional check for Android tablets that might not be caught by the regex
//       if (userAgent.indexOf('android') > -1 && userAgent.indexOf('mobile') === -1) {
//         this.isMobile = true
//         return true
//       }

//       this.isMobile = false
//       return false
//     },
//   },
// })

import { defineStore } from 'pinia'

export const useDeviceTypeStore = defineStore('deviceType', {
  state: () => ({
    isMobile: false,
  }),

  actions: {
    isDeviceMobile() {
      const userAgent = navigator.userAgent.toLowerCase()
      console.log('User Agent:', userAgent)

      // Check for Windows or macOS
      const isWindows = userAgent.indexOf('win') > -1
      const isMacOS = userAgent.indexOf('mac') > -1

      // If it's neither Windows nor macOS, consider it mobile
      this.isMobile = !(isWindows || isMacOS)
      return this.isMobile
    },
  },
})
