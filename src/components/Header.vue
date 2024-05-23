<template>
  <div class="left">
    <i @click="useSideMenuStore().toggle()" class="material-symbols-outlined"> menu </i>
    <div class="title"><MenuTitle /></div>
  </div>
  <div class="button" @click="useAuthenticationStore().logout()">Logout</div>
</template>

<script setup>
import MenuTitle from '../components/MenuTitle.vue'
import { useSideMenuStore } from '../stores/side-menu'
import { useAuthenticationStore } from '../stores/authentication'
</script>

<style scoped>
.button {
  font-size: 14px;
  padding: 10px;
}
.left {
  display: flex;
  align-items: center;
}

i {
  font-size: 24px;
  cursor: pointer;
}

.title {
  padding: 0 15px;
  line-height: 1;
}

i:hover {
  color: var(--main-color);
}
.icon {
  display: block;
}

.material-symbols-outlined {
  font-variation-settings: 'wght' 500;
}
</style>
