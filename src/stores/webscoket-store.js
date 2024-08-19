import { defineStore } from 'pinia'

export const useWebSocketStore = defineStore('webSocket', {
  state: () => ({
    socket: null,
    socketConnected: false,
    totalUnreadCount: 0,
    connectionStatus: 'Initial',
    chats: [],
    roomId: null,
  }),

  actions: {
    connect() {
      const accessToken = localStorage.getItem('accessToken')
      this.socket = new WebSocket(`ws://localhost:8000/ws/${accessToken}`)

      this.socket.onopen = () => {
        console.log('Connected to server')
        this.connectionStatus = 'Connected'
        this.socketConnected = true
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

      this.socket.onclose = (event) => {
        this.connectionStatus = event?.reason ?? 'Disconnected'
        // console.log(event)
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

    disconnect() {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ action: 'disconnect' }))
        this.socket.close()
      }
      this.socket = null
    },
  },
})
