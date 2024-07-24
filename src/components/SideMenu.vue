<template>
  <div class="menu">
    <div class="logo">
      <router-link @click="sideMenuChoose" to="/profile"
        ><img src="../assets/logo.png" alt="Logo" style="width: 200px" />
      </router-link>
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
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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
.logo {
  padding: 10px;
  margin: 15px 10px;
  user-select: none;
}
img {
  color: antiquewhite;
}

.logo:hover {
  background-color: #4e4e4e;
  border-radius: 5px;
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
