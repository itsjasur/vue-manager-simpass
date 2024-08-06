<template>
  <div class="dashboard-container">
    <div v-if="sideMenuStore.isDesktop" :class="['dashboard-side-menu', { open: sideMenuStore.isOpen }]">
      <SideMenu />
    </div>

    <div class="dashboard-view-content">
      <span class="dashboard-view-content-header">
        <Header />
      </span>

      <div class="scrollable-view">
        <RouterView />
      </div>
    </div>
  </div>

  <template v-if="!sideMenuStore.isDesktop">
    <div v-if="sideMenuStore.isOpen" @click="sideMenuStore.close()" class="m-dashboard-side-menu-overlay"></div>
    <div :class="['m-dashboard-side-menu', { closed: !sideMenuStore.isOpen }]">
      <SideMenu />
    </div>
  </template>
  <template v-if="userInfo?.agent_cd?.length > 0">
    <Chat v-if="chatPopupStore.active" />
    <div v-else class="open-chat-button" @click="chatPopupStore.active = true">
      <span class="material-symbols-outlined"> mode_comment </span>
      <span>개통 문의</span>

      <div v-if="totolStore.totalUnreadCount > 0" class="unread-count-badge">
        {{ totolStore.totalUnreadCount }}
      </div>
    </div>
  </template>

  <SelectPlanPopup v-if="selectPlansPopup.active" />
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import SideMenu from '../components/SideMenu.vue'
import Header from '../components/Header.vue'
import { useSideMenuStore } from '../stores/side-menu'
import SelectPlanPopup from '@/components/SelectPlanPopup.vue'
import { useSelectPlansPopup } from '@/stores/select-plans-popup'
import { useChatPopupStore } from '@/stores/chat-popup-store'
import Chat from '../components/Chat.vue'
import { useSnackbarStore } from '@/stores/snackbar'
import { fetchWithTokenRefresh } from '@/utils/tokenUtils'
import { io } from 'socket.io-client'
import { useTotalUnreadCountStore } from '@/stores/total-unread-count-store'

const selectPlansPopup = useSelectPlansPopup()

const chatPopupStore = useChatPopupStore()

const sideMenuStore = useSideMenuStore()

const socket = io('http://127.0.0.1:5000', { transports: ['websocket', 'polling'] })
const connectionStatus = ref('Initial')

const totolStore = useTotalUnreadCountStore()

onMounted(() => {
  fetchData()
  sideMenuStore.updateIsDesktop()
  window.addEventListener('resize', handleResize)

  socket.on('connect', () => {
    connectionStatus.value = 'Connected'
    socket.emit('authenticate', localStorage.getItem('accessToken'))
  })

  socket.on('authenticated', () => {
    connectionStatus.value = 'Authenticated'
    socket.emit('get_total_unread_count')
  })

  socket.on('total_unread_count', (newTotalUnreadCount) => {
    totolStore.totalUnreadCount = newTotalUnreadCount
  })
  socket.on('room_modified', (modifiedRoom) => {
    socket.emit('get_total_unread_count')
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  socket.disconnect()
})

const handleResize = () => {
  sideMenuStore.updateIsDesktop()
}

const userInfo = ref({})
async function fetchData() {
  try {
    const response = await fetchWithTokenRefresh('agent/userInfo', { method: 'GET' })

    if (!response.ok) {
      chatPopupStore.close()
      throw 'Fetch data error'
    }
    const decodedResponse = await response.json()
    userInfo.value = decodedResponse.data.info
  } catch (error) {
    chatPopupStore.close()
    useSnackbarStore().show(error.toString())
  }
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-flow: row;
  height: 100vh;
  width: 100vw;
  background-color: #ffc0cb76;
}

.dashboard-side-menu {
  height: 100%;
  width: 0px;
  transition: width 0.3s ease;
  z-index: 1001;
}

.dashboard-side-menu.open {
  width: 300px;
}

.dashboard-view-content {
  flex: 1;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--main-background-color);
  z-index: 1003;
}

.dashboard-view-content-header {
  height: 65px;
  width: 100%;
  box-shadow: 0 2px 4px #00000010;
  z-index: 1002;
}

.scrollable-view {
  display: flex;
  flex-flow: column;
  height: 100%;
  overflow-y: scroll;
}

.icon {
  cursor: pointer;
  font-size: 30px;
}

.m-dashboard-side-menu-overlay {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #00000047;
  z-index: 1100;
}

.m-dashboard-side-menu {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 300px;
  transition: width 0.3s ease;
  overflow: hidden;
  z-index: 1101;
}

.m-dashboard-side-menu.closed {
  width: 0;
}

.open-chat-button {
  position: absolute;
  right: 20px;
  bottom: 20px;
  background-color: var(--main-color);
  min-width: 120px;
  height: 50px;
  border-radius: 50px;
  padding: 0 10px;
  /* box-sizing: border-box; */
  box-shadow: 0 0 10px #00000045;
  cursor: pointer;
  color: #fff;
  z-index: 7000;

  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
}

.material-symbols-outlined {
  font-variation-settings:
    'FILL' 1,
    'wght' 400;
}

.open-chat-button:hover {
  filter: brightness(0.6);
}

.unread-count-badge {
  background-color: #ef5252;
  height: 22px;
  min-width: 22px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 3px;
  justify-content: center;
  line-height: 1;
  color: #fff;
  font-size: 14px;
}
</style>
