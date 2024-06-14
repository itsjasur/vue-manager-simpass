<template>
  <div class="dashboard-container">
    <div :class="['dashboard-side-menu', { closed: !sideMenuStore.isOpen }]">
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

  <div v-if="sideMenuStore.isOpen" @click="sideMenuStore.close()" class="m-dashboard-side-menu-overlay"></div>
  <div :class="['m-dashboard-side-menu', { closed: !sideMenuStore.isOpen }]">
    <SideMenu />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SideMenu from '../components/SideMenu.vue'
import Header from '../components/Header.vue'
import { useSideMenuStore } from '../stores/side-menu'

const sideMenuStore = useSideMenuStore()
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-flow: row;
  height: 100vh;
  width: 100vw;
  background-color: #fff;
  z-index: 1000;
}

.dashboard-side-menu {
  height: 100%;
  width: 300px;
  transition: width 0.3s ease;
}

.dashboard-side-menu.closed {
  width: 0px;
}

.dashboard-view-content {
  height: 100%;
  background-color: #fce6fc;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.dashboard-view-content-header {
  height: 65px;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 2px 4px #00000010;
  z-index: 1001;
}

.scrollable-view {
  display: flex;
  flex-flow: column;
  height: 100%;
  background-color: #fff;
  overflow-y: scroll;
}

.icon {
  cursor: pointer;
  font-size: 30px;
}

.mobile {
  display: none;
}

/* Media query for mobile devices */
@media (max-width: 960px) {
  .dashboard-side-menu {
    display: none;
  }

  .m-dashboard-side-menu-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #00000047;
    z-index: 1100;
  }

  .m-dashboard-side-menu {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 300px;
    z-index: 1101;
    transition: width 0.3s ease;
    background-color: pink;
    overflow: hidden;
  }

  .m-dashboard-side-menu.closed {
    width: 0;
  }
}
</style>
