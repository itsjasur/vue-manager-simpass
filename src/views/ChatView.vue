<template>
  <div class="chats_container">
    <div class="chat_header">
      <div class="begin_items" v-if="!chatPopupStore.showingChatrooms">
        <span @click="goToChatrooms" class="material-symbols-outlined back_button"> arrow_back </span>
        <span class="agent_name"> {{ webSocketStore.selectedRoom.agent_name }}</span>
      </div>
      <div class="end_items">
        <span class="con_status">{{ webSocketStore.isConnected ? 'Connected' : 'Disconnected' }}</span>
        <span style="cursor: pointer" @click="chatPopupStore.close()" class="material-symbols-outlined close_button">
          cancel
        </span>
      </div>
    </div>

    <div class="content_section">
      <ChatRooms v-if="chatPopupStore.showingChatrooms" />
      <Chat v-else />
    </div>
  </div>
</template>

<script setup>
import { useChatPopupStore } from '@/stores/chat-popup-store'
import { useWebSocketStore } from '@/stores/webscoket-store'

import ChatRooms from '../components/ChatRooms.vue'
import Chat from '../components/Chat.vue'

const webSocketStore = useWebSocketStore()
const chatPopupStore = useChatPopupStore()

function goToChatrooms() {
  webSocketStore.chats = []
  chatPopupStore.showingChatrooms = true
}
</script>

<style scoped>
.chats_container {
  position: absolute;
  right: 20px;
  bottom: 0;
  width: 500px;
  box-shadow: 0 0 20px #00000045;
  background-color: #fff;
  border-radius: 10px 10px 0 0;
  display: flex;
  flex-flow: column;
  z-index: 1400;
  justify-content: space-between;
}

.chat_header {
  height: 55px;
  padding: 0 20px;
  align-items: center;
  display: flex;
  justify-content: space-between;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 10px 10px 0 0;
}

.content_section {
  padding: 0 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 500px;
  overflow-y: auto;
}

.back_button:hover {
  color: #e06c00;
  cursor: pointer;
}

.begin_items {
  display: flex;
  align-items: center;
  gap: 10px;
}
.end_items {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.con_status {
  color: #e06c00;
  font-size: 14px;
}

@media (max-width: 900px) {
  .chats_container {
    height: 100%;
    width: 100%;
    left: 0px;
    right: 0px;
    /* padding-bottom: auto; */

    justify-content: flex-start;
  }
  .content_section {
    padding-top: auto;
    height: 100%;
  }
  .chat_header {
    height: 65px;
  }
}
</style>
