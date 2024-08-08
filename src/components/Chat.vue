<template>
  <div v-if="userInfo" class="chat-container" @drop.prevent="onDrop" @dragover.prevent>
    <div class="chat-popup-header">
      <div v-if="selectedAgentCode" style="width: 150px">
        <a-select
          v-model:value="selectedAgentCode"
          :getPopupContainer="(triggerNode) => triggerNode.parentNode"
          :style="{ width: '100%' }"
          @change="joinRoom"
          :options="userInfo.agent_cd.map((i) => ({ value: i, label: agentList[i] })) ?? []"
        >
        </a-select>
        <!-- :options="statuses.map((i) => ({ value: i.cd, label: i.value })) ?? [{ value: 'N/A', label: 'N/A' }]" -->
      </div>
      <span @click="chatPopupStore.close()" class="material-symbols-outlined close-button"> cancel </span>
    </div>

    <div class="chats-section" ref="chatContainer">
      <div class="welcome">
        <span>환영하다: {{ userInfo.name }}!</span>
        <span>연결 상태: {{ connectionStatus }}</span>
      </div>

      <template v-for="(chat, index) in chats" :key="index">
        <template v-if="chat.attachment_paths.length > 0">
          <template v-for="(attachmentPath, pathIndex) in chat.attachment_paths" :key="pathIndex">
            <img
              v-if="attachmentPath"
              :src="attachmentPath"
              @load="scrollToBottom"
              alt=""
              :class="['attachment-img', { ismyattachment: chat.sender === userInfo.username }]"
            />
          </template>
        </template>

        <template v-if="chat.text">
          <div :class="['chat-bubble', { ismychat: chat.sender === userInfo.username }]">
            {{ chat.text }}
          </div>
        </template>
      </template>
    </div>

    <div v-if="selectedAgentCode" class="bottom-actions">
      <div v-if="attachments.length > 0" class="attachments-row">
        <div v-for="(file, index) in attachments" :key="index" class="attached-images">
          <img :src="file.url" :alt="'image index: ' + index" />
          <div class="overlay">
            <div @click="removeAttachment(index)" class="delete-icon">&#10005;</div>
          </div>
        </div>
      </div>

      <div class="input-row">
        <input
          id="file-input"
          @change="handleFileUpload"
          type="file"
          class="file-input"
          accept="image/*"
          multiple
          style="display: none"
        />
        <label for="file-input" class="attach-images-icon">
          <span class="material-symbols-outlined"> add_photo_alternate </span>
        </label>

        <span @click="sendMessage" class="send-message-icon material-symbols-outlined"> send </span>
        <a-textarea
          size="large"
          @keydown="handleKeyDown"
          v-model:value="newMessage"
          type="text"
          :auto-size="{ minRows: 1, maxRows: 5 }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useChatPopupStore } from '@/stores/chat-popup-store'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useSnackbarStore } from '@/stores/snackbar'
import { fetchWithTokenRefresh } from '@/utils/tokenUtils'
import { io } from 'socket.io-client'

const chatPopupStore = useChatPopupStore()

const userInfo = ref()

const chatContainer = ref(null)

const chats = ref([])
const newMessage = ref('')

const selectedAgentCode = ref('IK')

const agentList = { IK: '인스코리아', SJ: '에스제이' }

// adds logic for the action to take on Enter without Shift
const handleKeyDown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}
const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

function joinRoom() {
  socket.emit('join_room', {
    agentCode: selectedAgentCode.value,
  })
}

function resetRoomUnreadCount() {
  socket.emit('reset_room_unread_count', {
    roomId: selectedAgentCode.value + '_' + userInfo.value.username,
  })
}

const socket = io(import.meta.env.VITE_CHAT_SERVER_URL, { transports: ['websocket', 'polling'] })

const connectionStatus = ref('Initial')

onMounted(() => {
  chatContainer.value = document.querySelector('.container') //chat container to scroll up or down
  fetchData()

  socket.on('connect', () => {
    connectionStatus.value = 'Connected'
    console.log('Connected to server')

    socket.emit('authenticate', {
      userToken: localStorage.getItem('accessToken'),
      fcmToken: localStorage.getItem('fcmToken'),
    })
  })

  socket.on('disconnect', () => {
    connectionStatus.value = 'Disconnected'
    console.log('Socket disconnected from server')
  })

  socket.on('connect_error', (error) => {
    connectionStatus.value = 'Error: ' + error.message
    console.error('Connection error:', error)
  })

  socket.on('error', (error) => {
    useSnackbarStore().show(error.message)
    connectionStatus.value = 'Error: ' + error.message
    // console.error('Error:', error)
  })

  socket.on('authenticated', () => {
    connectionStatus.value = 'Authenticated'
    console.log('User authenticated')
    joinRoom()
  })

  //partner page chats-info returns list of chats for selected agentCode
  socket.on('chats', (data) => {
    console.log('chats page socket store on chats called')
    console.log(data)
    chats.value = data
    scrollToBottom()
    resetRoomUnreadCount()
  })

  socket.on('message', (newMessage) => {
    console.log(newMessage)
    resetRoomUnreadCount()
    chats.value.push(newMessage)
    scrollToBottom()
  })
})

onUnmounted(() => {
  socket.disconnect()
})

//drop to attach files handler
const attachments = ref([])
const onDrop = (event) => {
  event.preventDefault()
  const files = Array.from(event.dataTransfer.files)
  const imageFiles = files.filter((file) => file.type.startsWith('image/')) // Filter out non-image files
  const urls = imageFiles.map((file) => ({ url: URL.createObjectURL(file), file }))
  attachments.value.push(...urls)
}
//this handles attach icon click image uploads
const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  const imageFiles = files.filter((file) => file.type.startsWith('image/'))
  const urls = imageFiles.map((file) => ({ url: URL.createObjectURL(file), file }))
  attachments.value.push(...urls)
}

const removeAttachment = (index) => {
  attachments.value.splice(index, 1)
}

async function uploadFiles() {
  const uploadedFilesPaths = []

  for (const { file } of attachments.value) {
    const formData = new FormData()
    formData.set('file', file)
    formData.set('filename', 'filename')

    try {
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      uploadedFilesPaths.push(result.path)

      attachments.value = []
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  return uploadedFilesPaths
}

const sendMessage = async () => {
  if (newMessage.value.trim() || attachments.value.length > 0) {
    const attachmentPaths = await uploadFiles()

    const newMessageToSend = {
      userToken: localStorage.getItem('accessToken'),
      text: newMessage.value,
      attachmentPaths: attachmentPaths,
      agentCode: selectedAgentCode.value,
    }
    socket.emit('new_message', newMessageToSend)
    //clears input field text
    newMessage.value = ''
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
    userInfo.value = decodedResponse.data.info
    if (userInfo.value?.agent_cd?.length > 0) selectedAgentCode.value = userInfo.value.agent_cd[0]
    console.log(userInfo.value)
  } catch (error) {
    chatPopupStore.close()
    useSnackbarStore().show(error.toString())
  }
}
</script>

<style scoped>
.chat-container {
  position: absolute;
  bottom: 0;
  right: 20px;
  /* height: 600px; */
  height: auto;
  width: 500px;
  border-radius: 10px 10px 0 0;
  background-color: #fff;
  z-index: 7000;
  box-shadow: 0 0 20px #00000045;
  overflow-y: hidden;
}

.chat-popup-header {
  height: 50px;
  padding: 0 20px;
  align-items: center;
  display: flex;
  justify-content: space-between;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chats-section {
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 500px;
  overflow-y: auto;
}
.welcome {
  display: flex;
  flex-flow: column;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 40px;
}
.chat-bubble {
  background-color: #787878;
  color: #fff;
  border-radius: 20px;
  /* line-height: 1; */
  word-wrap: break-word;
  word-break: break-word; /*  prevents overflow of long words */
  white-space: pre-wrap; /*  preserves line breaks */

  align-self: flex-start;
  max-width: 60%;
  padding: 10px;
}
.ismychat {
  background-color: #19a619;
  align-self: flex-end;
  text-align: end;
  padding: 10px;
}
.attachment-img {
  max-height: 200px;
  max-width: 50%;
  /* object-fit: cover; */
  align-self: flex-start;
  border-radius: 10px;
}
.ismyattachment {
  align-self: flex-end;
}

.bottom-actions {
  padding: 10px;
  margin-bottom: 10px;
}
.attachments-row {
  display: flex;
  flex-flow: wrap;
  align-items: center;
  gap: 10px;
  padding: 10px;
  box-sizing: border-box;
  background-color: #00000024;
  border-radius: 8px;
}

.attached-images {
  height: 80px;
  width: 80px;
  /* object-fit: cover; */
  position: relative;
  border-radius: 8px;
}
.attached-images img {
  border-radius: 8px;
  width: 100%;
  height: 100%;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.delete-icon {
  color: white;
  font-size: 24px;
  cursor: pointer;
}
.attached-images:hover .overlay {
  opacity: 1;
}

.input-row {
  position: relative;
}
.input-row .ant-input {
  padding-left: 50px;
  padding-right: 50px;
  border-radius: 8px;
  font-size: 16px;
}

.input-row .attach-images-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 1;
}
.input-row .send-message-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 1;
}

.input-row .material-symbols-outlined {
  color: #fff;
  padding: 7px;
  background-color: #19a619;
  border-radius: 30px;
  font-size: 20px;
}
</style>
