<template>
  <div class="chatrooms_container">
    <template v-for="(room, index) in webSocketStore.rooms" :key="index">
      <div class="chatroom" @click="selectRoom(room)">
        <div class="circle_avatar"></div>
        <div>{{ room.agent_name }}</div>
        <div v-if="room.partner_unread_count > 0" class="chatroom_unread_count_badge">
          {{ room.partner_unread_count }}
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useChatPopupStore } from '@/stores/chat-popup-store'
import { useSnackbarStore } from '@/stores/snackbar'
import { useWebSocketStore } from '@/stores/webscoket-store'
import { fetchWithTokenRefresh } from '@/utils/tokenUtils'
import { onMounted, ref } from 'vue'
const webSocketStore = useWebSocketStore()
const chatPopupStore = useChatPopupStore()

onMounted(fetchData)

async function fetchAgentList() {
  try {
    const response = await fetchWithTokenRefresh('agent/agentlist', { method: 'GET' })

    if (!response.ok) {
      chatPopupStore.close()
      throw 'Fetch data error'
    }
    const decodedResponse = await response.json()
    const agentList = decodedResponse?.data?.agentlist

    const avlAgentRooms = []

    agentList.forEach((i) => {
      avlAgentRooms.push({
        agent_code: i.agent_cd,
        agent_name: i.agent_nm,
        partner_unread_count: 0,
      })
    })

    webSocketStore.rooms = avlAgentRooms

    webSocketStore.getChatRooms()
  } catch (error) {
    chatPopupStore.close()
    useSnackbarStore().show(error.toString())
  }
}

async function fetchData() {
  try {
    const response = await fetchWithTokenRefresh('agent/userInfo', { method: 'GET' })

    if (!response.ok) {
      chatPopupStore.close()
      throw 'Fetch data error'
    }
    const decodedResponse = await response.json()
    webSocketStore.username = decodedResponse.data.info

    if (decodedResponse.data.info) {
      webSocketStore.username = decodedResponse.data.info.username
      await fetchAgentList()
    }
  } catch (error) {
    chatPopupStore.close()
    useSnackbarStore().show(error.toString())
  }
}

function selectRoom(room) {
  webSocketStore.selectedRoom = room
  webSocketStore.joinNewRoom(room.agent_code)
  chatPopupStore.showingChatrooms = false
}
</script>

<style scoped>
.chatrooms_container {
  padding: 20px 0;
  display: flex;
  flex-flow: column;
  gap: 15px;
}
.chatroom {
  display: flex;
  flex-flow: row;
  gap: 15px;
  /* justify-content: center; */
  align-items: center;
  padding: 5px;
  box-sizing: border-box;
}

.chatroom:hover {
  background-color: #e4e4e4;
  border-radius: 8px;
  cursor: pointer;
}
.circle_avatar {
  height: 55px;
  width: 55px;
  background-color: #ccc;
  border-radius: 50px;
}

.chatroom_unread_count_badge {
  margin-left: auto;
  background-color: rgb(219, 0, 0);
  border-radius: 50px;
  color: #fff;
  padding: 5px;
  font-size: 13px;
  box-sizing: border-box;

  min-width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
}

@media (max-width: 900px) {
  .chatrooms_container {
    height: 100%;
    width: 100%;
    left: 0px;
    right: 0px;
  }
  .chatrooms_section {
    height: 100%;
  }
  .popup_header {
    height: 65px;
  }
}
</style>
