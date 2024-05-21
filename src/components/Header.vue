<template>
  <div class="header">
    <i @click="useSideMenuStore().toggle()" class="material-symbols-outlined"> menu </i>

    <p><MenuTitle /></p>
  </div>
</template>

<script setup>
import MenuTitle from '../components/MenuTitle.vue'
import { useSideMenuStore } from '../stores/side-menu'
</script>

<style scoped>
i {
  font-size: 24px;
  padding: 0 15px;
  cursor: pointer;
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
