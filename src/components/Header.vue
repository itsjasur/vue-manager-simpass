<template>
  <div class="header-row">
    <div class="left">
      <span v-if="sideMenuStore.isOpen" @click="sideMenuStore.close()" class="material-symbols-outlined">
        menu_open
      </span>
      <span v-else @click="sideMenuStore.open()" class="material-symbols-outlined"> menu </span>
      <MenuTitle class="header-title" />
    </div>
  </div>
</template>

<script setup>
import MenuTitle from '../components/MenuTitle.vue'
import { useSideMenuStore } from '../stores/side-menu'

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
  box-sizing: border-box;
}

.left {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-title {
  margin-left: 10px;
  line-height: 1;
  font-size: 17px;
  font-weight: 600;
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
