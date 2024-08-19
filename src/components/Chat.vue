<template>
  <div v-if="userInfo" class="chat-container" @drop.prevent="onDrop" @dragover.prevent>
    <div class="chat-popup-header">
      <div style="width: 150px">
        <a-select
          v-model:value="selectedAgentCode"
          :getPopupContainer="(triggerNode) => triggerNode.parentNode"
          :style="{ width: '100%' }"
          @change="webSocketStore.joinRoom(selectedAgentCode)"
          :options="agentList.map((i) => ({ value: i.agent_cd, label: i.agent_nm })) ?? []"
        >
        </a-select>
        <!-- :options="statuses.map((i) => ({ value: i.cd, label: i.value })) ?? [{ value: 'N/A', label: 'N/A' }]" -->
      </div>
      <span @click="chatPopupStore.close()" class="material-symbols-outlined close-button"> cancel </span>
    </div>

    <div class="chats-section" ref="chatContainer">
      <div class="welcome">
        <span>환영하다: {{ userInfo.name }}!</span>
        <span>연결 상태: {{ webSocketStore.connectionStatus }}</span>
      </div>

      <template v-for="(chat, index) in webSocketStore.chats" :key="index">
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

        <span @click="sendNewMessage" class="send-message-icon material-symbols-outlined"> send </span>
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
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useSnackbarStore } from '@/stores/snackbar'
import { fetchWithTokenRefresh } from '@/utils/tokenUtils'
import { useWebSocketStore } from '@/stores/webscoket-store'

const chatPopupStore = useChatPopupStore()
const userInfo = ref()
const chatContainer = ref(null)

const selectedAgentCode = ref(null)

const newMessage = ref('')

// adds logic for the action to take on Enter without Shift
const handleKeyDown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendNewMessage()
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
      webSocketStore.resetRoomUnreadCount()
    }
  })
}

const webSocketStore = useWebSocketStore()

// function resetRoomUnreadCount() {
//   socket.emit('reset_room_unread_count', {
//     roomId: selectedAgentCode.value + '_' + userInfo.value.username,
//   })
// }

watch(
  () => webSocketStore.chats,
  (newv, oldv) => {
    console.log('chats changed')
    scrollToBottom()
  },
  { deep: true }
)

onMounted(async () => {
  chatContainer.value = document.querySelector('.container') //chat container to scroll up or down
  fetchData()
})

onUnmounted(() => {
  webSocketStore.chats = []
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
      const response = await fetch(import.meta.env.VITE_CHAT_SERVER_URL + 'upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      uploadedFilesPaths.push(result.path)

      // attachments.value = []
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  return uploadedFilesPaths
}

async function sendNewMessage() {
  const attachmentPaths = await uploadFiles()

  if (newMessage.value.trim() || attachmentPaths.length > 0) {
    webSocketStore.sendMessage(newMessage.value, attachmentPaths)

    newMessage.value = ''
    attachments.value = []
  }
}

const agentList = ref([])
async function fetchAgentList() {
  try {
    const response = await fetchWithTokenRefresh('agent/agentlist', { method: 'GET' })

    if (!response.ok) {
      chatPopupStore.close()
      throw 'Fetch data error'
    }
    const decodedResponse = await response.json()
    agentList.value = decodedResponse?.data?.agentlist

    if (agentList.value?.length > 0) {
      selectedAgentCode.value = agentList.value?.[0]?.agent_cd
      if (selectedAgentCode.value) webSocketStore.joinRoom(selectedAgentCode.value)
    }
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
    userInfo.value = decodedResponse.data.info
    await fetchAgentList()
  } catch (error) {
    chatPopupStore.close()
    useSnackbarStore().show(error.toString())
  }
}
</script>

<style scoped>
.chat-container {
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
}

.chat-popup-header {
  height: 55px;
  padding: 0 20px;
  align-items: center;
  display: flex;
  justify-content: space-between;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 10px 10px 0 0;
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

@media (max-width: 900px) {
  .chat-container {
    height: 100%;
    width: 100%;
    left: 0px;
    right: 0px;
  }
  .chats-section {
    height: 100%;
  }
  .chat-popup-header {
    height: 65px;
  }
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
