<template>
  <div class="main">
    <div class="container" ref="chatContainer" @drop.prevent="onDrop" @dragover.prevent>
      <div class="chats-part">
        <div class="welcome">
          <span>Welcome: {{ myusername }}</span>
          <span>Connection status: {{ connectionStatus }}</span>
        </div>

        <template v-for="(chat, index) in chats" :key="index">
          <template v-if="chat.attachment_paths.length > 0">
            <template v-for="(attachmentPath, pathIndex) in chat.attachment_paths" :key="pathIndex">
              <img
                v-if="attachmentPath"
                :src="attachmentPath"
                alt=""
                :class="['attachment-img', { ismyattachment: chat.sender === myusername }]"
              />
            </template>
          </template>

          <template v-if="chat.text">
            <div :class="['chat-bubble', { ismychat: chat.sender === myusername }]">
              {{ chat.text }}
            </div>
          </template>
        </template>
      </div>
      <!-- 
      <div class="welcome">
        <span>Welcome: {{ auth.username }}</span>
        <span>Connection status: {{ connectionStatus }}</span>
      </div>

      <template v-for="(chat, index) in chats" :key="index">
        <template v-if="chat.attachment_paths.length > 0">
          <template v-for="(attachmentPath, pathIndex) in chat.attachment_paths" :key="pathIndex">
            <img
              v-if="attachmentPath"
              :src="attachmentPath"
              alt=""
              :class="['attachment-img', { ismyattachment: chat.sender === auth.username }]"
            />
          </template>
        </template>

        <template v-if="chat.text">
          <div :class="['chat-bubble', { ismychat: chat.sender === auth.username }]">
            {{ chat.text }}
          </div>
        </template>
      </template> -->

      <div class="bottom-actions">
        <div v-if="attachments.length > 0" class="attachments-row">
          <div v-for="(file, index) in attachments" :key="index" class="attached-images">
            <img :src="file.url" :alt="'image index: ' + index" />
            <div class="overlay">
              <div @click="removeAttachment(index)" class="delete-icon">&#10005;</div>
            </div>
          </div>
        </div>

        <!-- uploads images -->
        <input
          id="file-input"
          @change="handleFileUpload"
          type="file"
          class="file-input"
          accept="image/*"
          multiple
          style="display: none"
        />

        <div class="input-row">
          <label for="file-input" class="attach-images">
            <span class="material-symbols-outlined"> add_photo_alternate </span>
          </label>

          <span @click="sendMessage" class="send-message material-symbols-outlined"> send </span>
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
  </div>
  <Warning />
</template>

<script setup>
import Warning from '../components/Warning.vue'
import { ref, onMounted, nextTick, watch } from 'vue'
import { io } from 'socket.io-client'

const myusername = ref('partner1')

// adds logic for the action to take on Enter without Shift
const handleKeyDown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

const socket = io('http://127.0.0.1:5000', { transports: ['websocket', 'polling'] })
const chats = ref([])

const connectionStatus = ref('Disconnected')

const newMessage = ref('')

const userToken = 'tokenhere'
const agentCode = 'agent1'

onMounted(() => {
  chatContainer.value = document.querySelector('.container') //chat container to scroll up or down

  socket.on('connected', (data) => {
    console.log(data)
    console.log('Connected to server')
    connectionStatus.value = 'Connected'

    socket.emit('join_room', {
      userToken: userToken,
      receiver: agentCode,
    })
  })

  socket.on('disconnect', () => {
    console.log('Disconnected from server')
    connectionStatus.value = 'Disconnected'
  })

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error)
    connectionStatus.value = 'Error: ' + error.message
  })

  socket.on('chats', (chatList) => {
    chats.value = chatList
    // console.log('parner chats', chatList)
  })

  socket.on('message', (newMessage) => {
    console.log('parner chats', newMessage)
    chats.value.push(newMessage)
  })
})

// watch(
//   () => auth.username,
//   (nw, ol) => {
//     // console.log('watch called')
//     socket.emit('join_room', {
//       userToken: userToken,
//       receiver: agentCode,
//     })
//   }
// )

const chatContainer = ref(null)
const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

//drop to attach files handler
const attachments = ref([])
const onDrop = (event) => {
  event.preventDefault()
  const files = Array.from(event.dataTransfer.files)
  const imageFiles = files.filter((file) => file.type.startsWith('image/')) // Filter out non-image files
  const urls = imageFiles.map((file) => ({ url: URL.createObjectURL(file), file }))
  attachments.value.push(...urls)
}

const removeAttachment = (index) => {
  attachments.value.splice(index, 1)
}

const sendMessage = async () => {
  if (newMessage.value.trim() || attachments.value.length > 0) {
    const attachmentPaths = await uploadFiles()

    const newMessageToSend = {
      userToken: userToken,
      text: newMessage.value,
      attachmentPaths: attachmentPaths,
      receiver: agentCode,
    }
    socket.emit('new_message', newMessageToSend)

    //clears input field text

    newMessage.value = ''

    // scrollToBottom()
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

        console.log(response.status)

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
}
</script>

<style scoped>
.main {
  /* width: 100%;
  height: 100%;
  background-color: #ffffff;
  position: relative; */

  position: absolute;
  bottom: 0;
  right: 20px;
  height: 600px;
  width: 500px;
  border-radius: 10px 10px 0 0;
  background-color: #fff;
  z-index: 7000;
  box-shadow: 0 0 20px #00000045;
}

.container {
  height: 100%;
  /* width: 100%; */
  /* padding: 0 20px; */
  box-sizing: border-box;
  overflow-y: auto;
  /* margin: 0 20px; */
}

.chats-part {
  display: flex;
  flex-flow: column;
  height: 100%;
  width: 100%;
  gap: 10px;

  position: relative;
  /* box-sizing: border-box; */
  /* margin: 0 20px; */
  margin-bottom: 250px;
  /* overflow-y: auto; */
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

.bottom-actions {
  position: sticky;
  bottom: 30px;
  width: 100%;

  display: flex;
  flex-flow: column;
  gap: 10px;
  box-sizing: border-box;
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
  padding-left: 45px;
  padding-right: 45px;
}

.input-row .attach-images {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 5px;
  cursor: pointer;
  z-index: 1;
}
.input-row .send-message {
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  margin-right: 10px;
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

.chat-bubble {
  background-color: #787878;
  color: #fff;
  border-radius: 20px;
  line-height: 1;

  word-wrap: break-word;
  align-self: flex-start;
  max-width: 60%;
  /* padding: 10px 30px 10px 10px; */
  padding: 10px;
}

.ismychat {
  background-color: #19a619;
  align-self: flex-end;
  text-align: end;
  /* padding: 10px 10px 10px 30px; */
  padding: 10px;
}

.attachment-img {
  max-height: 200px;
  max-width: 50%;
  object-fit: contain;
  align-self: flex-start;
  border-radius: 10px;
}

.ismyattachment {
  align-self: flex-end;
}

.innerHeader {
  position: sticky;
  top: 0;
  /* width: 100%; */
  height: 50px;
  padding: 0 20px;
  align-items: center;
  display: flex;
  justify-content: space-between;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Bottom shadow */
}
</style>
