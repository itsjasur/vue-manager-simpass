import { defineStore } from 'pinia'
import { messaging } from '../firebase'
import { getToken } from '@firebase/messaging'

import { FIREBASEVAPIDKEY } from '@/../sensitive'
import { fetchWithTokenRefresh } from '@/utils/tokenUtils'

export const useWebSocketStore = defineStore('webSocket', {
  state: () => ({
    socket: null,
    isConnected: false,
    totalUnreadCount: 0,

    chats: [],
    reconnectInterval: null,

    username: null,

    rooms: [],
    selectedRoom: {},

    // roomId: null,
    // agentName: null,
  }),

  actions: {
    connect() {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) return

      this.socket = new WebSocket(import.meta.env.VITE_CHAT_SERVER_URL + `ws/${accessToken}`)
      this.socket.onopen = async () => {
        console.log('Socket connected')
        this.isConnected = true
        this.clearReconnectInterval()

        try {
          var currentFcmToken = await getToken(messaging, { vapidKey: FIREBASEVAPIDKEY })

          if (currentFcmToken) {
            this.socket.send(JSON.stringify({ action: 'update_fcm_token', fcmToken: currentFcmToken }))
          }
        } catch (e) {
          console.log(e)
        }
      }

      this.socket.onclose = () => {
        console.log('Socket disconnected')
        this.isConnected = false
        this.attemptReconnect()
      }

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data)

        if (data?.type === 'total_count') {
          this.totalUnreadCount = data?.total_unread_count
        }

        if (data?.type === 'chat_rooms') {
          if (data?.rooms) {
            var chatrooms = data.rooms
            this.rooms = this.rooms.map((curroom) => ({
              ...curroom,
              ...chatrooms.find((chatroom) => chatroom.agent_code === curroom.agent_code),
            }))
          }
        }

        if (data?.type === 'room_chats') {
          let chatz = data.chats
          this.chats = [...chatz].reverse()
        }

        if (data?.type === 'room_info') {
          if (data.room_info) {
            this.selectedRoom = {
              ...this.selectedRoom,
              ...data.room_info,
            }
          }
        }

        if (data?.type === 'new_chat') {
          if (this.selectedRoom.room_id === data?.new_chat.room_id) {
            this.chats.unshift(data.new_chat)
          }
        }
      }
    },

    getChatRooms() {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ action: 'get_chat_rooms', searchText: null }))
      }
    },

    //this gets room info
    getRoomInfo(agentCode) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(
          JSON.stringify({
            action: 'get_room_info',
            agentCode: agentCode,
          })
        )
      }
    },

    joinRoom() {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ action: 'join_room', roomId: this.selectedRoom.room_id }))
      }
    },

    resetRoomUnreadCount() {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ action: 'reset_room_unread_count', roomId: this.selectedRoom.room_id }))
      }
    },

    sendMessage(text, attachmentPaths) {
      this.socket.send(
        JSON.stringify({
          action: 'new_message',
          text: text,
          attachmentPaths: attachmentPaths,
          roomId: this.selectedRoom.room_id,
        })
      )
    },

    attemptReconnect() {
      if (!this.reconnectInterval) {
        this.reconnectInterval = setInterval(async () => {
          try {
            const response = await fetchWithTokenRefresh('agent/userInfo', { method: 'GET' })
            if (!response.ok) throw 'Fetch data error'
            this.connect()
          } catch (error) {
            chatPopupStore.close()
            useSnackbarStore().show(error.toString())
          }
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
