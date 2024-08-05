import { io } from 'socket.io-client'
import { defineStore } from 'pinia'
import { useSnackbarStore } from './snackbar'

export const useSocketStore = defineStore('socket', {
  state: () => ({
    socket: null,
    isConnected: false,
    connectionStatus: 'Disconnected',
    totalUnreadCount: 0,
  }),

  actions: {
    initSocket() {
      // Only initialize if not already connected

      this.socket = io('http://127.0.0.1:5000', { transports: ['websocket', 'polling'] })

      this.socket.on('connect', () => {
        this.isConnected = true
        this.connectionStatus = 'Connected'
        console.log('Connected to server')
      })

      this.socket.on('disconnect', () => {
        this.isConnected = false
        this.connectionStatus = 'Disconnected'
        console.log('Disconnected from server')
      })

      this.socket.on('connect_error', (error) => {
        this.connectionStatus = 'Error: ' + error.message
        console.error('Connection error:', error)
      })

      this.socket.on('error', (error) => {
        useSnackbarStore().show(error.message)
        this.connectionStatus = 'Error: ' + error.message
        console.error('Error:', error)
      })

      this.socket.emit('authenticate', localStorage.getItem('accessToken'))

      this.socket.on('authenticated', () => {
        this.isConnected = true
        this.connectionStatus = 'Authenticated'
        console.log('User authenticated')
        this.updateTotalCount()
      })

      this.socket.on('total_unread_count', (totalCount) => {
        this.totalUnreadCount = totalCount
        console.log('total count')
        console.log('total count', totalCount)
      })
    },

    updateTotalCount() {
      this.socket.emit('get_total_unread_count')
    },

    // on(event, callback) {
    //   if (this.socket) {
    //     this.socket.on(event, callback)
    //   }
    // },

    closeSocket() {
      if (this.socket) {
        this.socket.disconnect()
        this.socket = null
        this.isConnected = false
        this.connectionStatus = 'Disconnected'
      }
    },
  },
})
