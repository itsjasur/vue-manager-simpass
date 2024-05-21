<template>
  <div class="container">
    <div
      v-if="useSideMenuStore().isSideMenuOpen"
      class="overlay"
      @click="useSideMenuStore().close()"
    />
    <div v-if="useSideMenuStore().isSideMenuOpen" class="side-menu">
      <SideMenu />
    </div>

    <div class="main-content" :class="{ open: useSideMenuStore().isSideMenuOpen }">
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
import { RouterView } from 'vue-router'
import SideMenu from '../components/SideMenu.vue'
import Header from '../components/Header.vue'
import { useSideMenuStore } from '../stores/side-menu'
import { onMounted } from 'vue'

const handleResize = () => {
  if (window.innerWidth <= 767) {
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
.container {
  height: 100vh;
}

.side-menu {
  position: fixed;
  top: 0;
  width: 280px; /* Fixed width */
  height: 100vh;
  background-color: #1a1a1a;
  z-index: 1000; /* Ensure the side-menu is on top of the overlay */
}

.header {
  position: fixed;
  top: 0;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  display: flex;
  height: 60px;
  width: 100%;
  z-index: 1000;
  background-color: #fff;
}

.main-content {
  /* this is side menu width */
  margin-left: 0px;
  /* this is header width */
  margin-top: 60px;
  height: 100vh;
}

.main-content.open {
  margin-left: 280px;
}

.view {
  overflow-y: auto; /* Enable vertical scrolling */
}

/* Media query for mobile devices */
@media (max-width: 767px) {
  .main-content {
    margin-left: 0px;
  }
  .main-content.open {
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
    z-index: 999; /* Ensure the overlay is on top of other elements */
  }
}
</style>
