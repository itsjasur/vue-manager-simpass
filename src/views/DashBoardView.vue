<template>
  <div class="container">
    <div v-if="useSideMenuStore().isSideMenuOpen" class="overlay" @click="useSideMenuStore().close()" />
    <div
      v-if="useSideMenuStore().isSideMenuOpen"
      class="side-menu"
      :class="{ sideMenuOpen: useSideMenuStore().isSideMenuOpen }"
    >
      <SideMenu />
    </div>

    <div class="main-content" :class="{ sideMenuOpen: useSideMenuStore().isSideMenuOpen }">
      <div class="header">
        <Header />
      </div>

      <div class="view">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

import SideMenu from '../components/SideMenu.vue'
import Header from '../components/Header.vue'
import { useSideMenuStore } from '../stores/side-menu'

const handleResize = () => {
  if (window.innerWidth <= 960) {
    useSideMenuStore().close()
  }
}

//on mobile default sidemenu closed
onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})
</script>

<style scoped>
.side-menu {
  width: 280px;
  height: 100vh;
  background-color: #1a1a1a;
  transition: transform 0.3s ease;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1003;
}

.side-menu.closed {
  transform: translateX(-100%);
}

.main-content {
  position: relative;
  height: 100%;
  background-color: white;
}

.main-content.sideMenuOpen {
  margin-left: 280px;
}

/* Style for Header */
.header {
  position: sticky;
  top: 0;
  height: 60px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Bottom shadow */
  text-align: center;
  line-height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  z-index: 1001;
}

.view {
  overflow-x: auto;
  white-space: nowrap;
  height: calc(100vh - 60px);
}

/* Media query for mobile devices */
@media (max-width: 960px) {
  .main-content.sideMenuOpen {
    margin-left: 0px;
  }

  .overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.346); /* Semi-transparent black background */
    z-index: 1002; /* Ensure the overlay is on top of other elements */
  }
}
</style>
