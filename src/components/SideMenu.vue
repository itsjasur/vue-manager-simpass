<template>
  <div class="menu">
    <div @click="sideMenuChoose(menuItems[0])" class="logo_container">
      <img v-if="hostname === 'sjnetwork'" :src="sjlogo" alt="Logo" style="width: 200px" class="sjnetwork" />
      <img v-else :src="baroformlogo" alt="Logo" style="width: 200px" class="baroform" />
    </div>

    <template v-for="(item, index) in menuItems" :key="index">
      <div @click="sideMenuChoose(item)" class="menu-item" :class="{ currentlyOpen: isActive(item.path) }">
        <span class="material-symbols-outlined"> {{ item.icon }} </span>
        <span class="menu-title">{{ item.name }}</span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { SIDEMENUNAMES } from '../assets/constants'
import { useSideMenuStore } from '../stores/side-menu'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import sjlogo from '@/assets/sjlogo.png'
import baroformlogo from '@/assets/baroformlogo.png'

const hostname = ref('baroform')
onMounted(() => {
  hostname.value = window.location.hostname.includes('sjnetwork') ? 'sjnetwork' : 'baroform'
})

const sideMenuStore = useSideMenuStore()

function sideMenuChoose(item) {
  if (!sideMenuStore.isDesktop) sideMenuStore.close()
  router.push(item.path)
}

const router = useRouter()
const route = useRoute()
const menuItems = ref([
  { name: SIDEMENUNAMES[0], path: '/home', icon: 'home' },
  { name: SIDEMENUNAMES[1], path: '/profile', icon: 'person' },
  { name: SIDEMENUNAMES[2], path: '/registration-forms', icon: 'description' },
  { name: SIDEMENUNAMES[3], path: '/applications', icon: 'checklist_rtl' },
  { name: SIDEMENUNAMES[4], path: '/download-forms', icon: 'file_save' },
])
function isActive(path) {
  if (route.name === 'form-details' && path === '/registration-forms') return true
  if (path === route.path) return true
}
</script>

<style scoped>
.menu {
  min-width: 300px;
  width: 100%;
  height: 100%;
  background-color: rgb(38, 38, 38);
  display: flex;
  flex-flow: column;
  gap: 15px;
  overflow-y: auto;
}

.logo_container {
  height: auto;
  width: 100%;
  padding-left: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  box-sizing: border-box;
}

.logo_container:hover {
  background-color: #4e4e4e;
  border-radius: 5px;
}

.sjnetwork {
  padding: 10px 5px;
  height: 45px;
  width: 100%;
  object-fit: contain;
  object-position: left;
}
.baroform {
  padding: 10px 5px;
  height: 40px;
  width: 100%;
  object-fit: contain;
  object-position: left;
}

a {
  text-decoration: none; /* router link underline */
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  /* background-color: #ffffff2c; */
  margin: 0 15px;
  border-radius: 5px;
  padding: 0 10px;
  min-height: 50px;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  user-select: none;
}

.menu-item:hover {
  background-color: #ffffff45;
}
.menu-item:active {
  background-color: #ffffff57;
}

.currentlyOpen {
  background-color: #ffffff25;
}
</style>
