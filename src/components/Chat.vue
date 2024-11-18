<template>
  <div class="chats-section" ref="chatContainer" @drop.prevent="onDrop" @dragover.prevent>
    <template v-for="(chat, index) in webSocketStore.chats" :key="index">
      <!-- <div :class="['chat-bubble', { ismychat: chat.sender === webSocketStore.username }]">
        {{ chat.text }}
      </div> -->

      <template v-if="chat.text || chat.attachment_paths">
        <template v-if="chat.sender !== webSocketStore.username">
          <div class="chat_container_wrapper">
            <div class="agent_image_box"></div>
            <div class="chat_container_content">
              <div class="sender_agent_name">{{ chat?.sender_agent_info?.name }}</div>
              <template v-if="chat.text">
                <div class="chat-bubble">
                  {{ chat.text }}
                </div>
              </template>
              <template v-if="chat.attachment_paths.length > 0">
                <img
                  v-for="(attachmentPath, pathIndex) in chat.attachment_paths"
                  :key="pathIndex"
                  :src="attachmentPath"
                  @load="scrollToBottom"
                  alt=""
                  class="attachment_img"
                />
              </template>
            </div>
          </div>
        </template>
        <template v-else>
          <template v-if="chat.text">
            <div class="chat-bubble my_chat">
              {{ chat.text }}
            </div>
          </template>
        </template>

        <template v-if="chat.attachment_paths.length > 0">
          <img
            v-for="(attachmentPath, pathIndex) in chat.attachment_paths"
            :key="pathIndex"
            :src="attachmentPath"
            @load="scrollToBottom"
            alt=""
            class="attachment_img my_images"
          />
        </template>
      </template>
    </template>
  </div>

  <div class="bottom-actions">
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
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useSnackbarStore } from '@/stores/snackbar'
import { fetchWithTokenRefresh } from '@/utils/tokenUtils'
import { useWebSocketStore } from '@/stores/webscoket-store'

const webSocketStore = useWebSocketStore()

const chatContainer = ref(null)
const newMessage = ref('')

// adds logic for the action to take on Enter without Shift
const handleKeyDown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendNewMessage()
  }
}

onMounted(() => {
  chatContainer.value = document.querySelector('.container')
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

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

async function sendNewMessage() {
  const attachmentPaths = await uploadFiles()

  if (newMessage.value.trim() || attachmentPaths.length > 0) {
    webSocketStore.sendMessage(newMessage.value, attachmentPaths)

    newMessage.value = ''
    attachments.value = []
    scrollToBottom()
  }
}
</script>

<style scoped>
.chats-section {
  padding: 20px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  overflow-y: auto;
  flex-direction: column-reverse;
}

.chat_container_wrapper {
  display: flex;
  flex-flow: row;
  width: 100%;
  gap: 5px;
}

.agent_image_box {
  width: 45px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  border-radius: 50%;
  background-color: #cfcfcf;
}

.chat_container_content {
  display: flex;
  flex-flow: column;
  gap: 10px;
  /* width: auto; */
  max-width: 70%;
}

.sender_agent_name {
  font-size: 13px;
  padding: 0;
  margin-bottom: -8px;
  color: #787878;
  width: 100%;
}

.chat-bubble {
  background-color: #787878;
  color: #fff;
  border-radius: 6px;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  align-self: flex-start;
  padding: 7px;
}

.my_chat {
  background-color: #19a619;
  align-self: flex-end;
  text-align: end;
  padding: 10px;
}

.attachment_img {
  max-height: 200px;
  max-width: 200px;
  /* object-fit: fill; */
  /* width: 100%; */
  align-self: flex-start;
  border-radius: 10px;
}

.my_images {
  align-self: flex-end;
}

.bottom-actions {
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
  position: relative;
  border-radius: 8px;
}
.attached-images img {
  border-radius: 8px;
  width: 100%;
  height: 100%;
  object-fit: contain;
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
