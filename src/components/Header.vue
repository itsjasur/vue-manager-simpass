<template>
  <div class="header-row">
    <div class="left">
      <span v-if="sideMenuStore.isOpen" @click="sideMenuStore.close()" class="material-symbols-outlined">
        menu_open
      </span>
      <span v-else @click="sideMenuStore.open()" class="material-symbols-outlined"> menu </span>
      <div class="title"><MenuTitle /></div>
    </div>
    <!-- <div class="button" @click="useAuthenticationStore().logout()">Logout</div> -->
    <div class="button" @click="sideMenuStore.toggle()">Logout</div>
  </div>
</template>

<script setup>
import MenuTitle from '../components/MenuTitle.vue'
import { useSideMenuStore } from '../stores/side-menu'
import { useAuthenticationStore } from '../stores/authentication'

const sideMenuStore = useSideMenuStore()
</script>

<style scoped>
.header-row {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0 20px;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  box-sizing: border-box;
}
.button {
  font-size: 14px;
  padding: 10px;
  box-sizing: border-box;
  right: 20px;
}
.left {
  display: flex;
  align-items: center;
}

.title {
  padding: 0 15px;
  line-height: 1;
}

.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;

  font-size: 30px;
  cursor: pointer;
  user-select: none;
}

.material-symbols-outlined:hover {
  color: var(--main-color);
}
</style>
