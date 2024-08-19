import { defineStore } from 'pinia'

export const useWebSocketStore = defineStore('webSocket', {
  state: () => ({
    socket: null,
    isConnected: false,
    totalUnreadCount: 0,
    connectionStatus: 'Initial',
    chats: [],
    roomId: null,
    reconnectInterval: null,
  }),

  actions: {
    connect() {
      const accessToken = localStorage.getItem('accessToken')
      this.socket = new WebSocket(`ws://localhost:8000/ws/${accessToken}`)

      this.socket.onopen = () => {
        console.log('Socket connected')
        this.connectionStatus = 'Connected'
        this.isConnected = true
        this.clearReconnectInterval()
      }

      this.socket.onclose = () => {
        console.log('Socket disconnected')
        this.isConnected = false
        this.attemptReconnect()
      }

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        // console.log(data)

        if (data?.type === 'total_count') {
          this.totalUnreadCount = data?.total_unread_count
          //   console.log(data?.total_unread_count)
        }
        if (data?.type === 'chats') {
          this.chats = data?.chats
          this.roomId = data?.room_id
          //   console.log(data.chats)
        }
        if (data?.type === 'new_chat') {
          this.chats.push(data?.new_chat)
          //   console.log(data.new_chat)
        }
      }
    },
    joinRoom(selectedAgentCode) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ action: 'join_room', agentCode: selectedAgentCode }))
      }
    },

    resetRoomUnreadCount() {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ action: 'reset_room_unread_count', roomId: this.roomId }))
      }
    },

    sendMessage(text, attachmentPaths) {
      this.socket.send(
        JSON.stringify({
          action: 'new_message',
          text: text,
          attachmentPaths: attachmentPaths,
          roomId: this.roomId,
        })
      )
    },

    attemptReconnect() {
      if (!this.reconnectInterval) {
        this.reconnectInterval = setInterval(() => {
          console.log('Attempting to reconnect...')
          this.connect()
        }, 5000)
      }
    },

    clearReconnectInterval() {
      if (this.reconnectInterval) {
        clearInterval(this.reconnectInterval)
        this.reconnectInterval = null
      }
    },

    disconnect() {
      this.clearReconnectInterval()
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ action: 'disconnect' }))
        this.socket.close()
      }
      this.socket = null
      this.isConnected = false
    },
  },
})
