
<template>
  <div class="container">
    <div class="side-menu">
      <SideMenu />
    </div>

    <div class="main-content">
      <div class="header">
        <Header />
      </div>
      <div class="view">
        <RouterView />
      </div>
    </div>
  </div>
</template>



<script setup >
import { RouterLink, RouterView } from 'vue-router'
import SideMenu from '../src/components/SideMenu.vue'
import Header from '../src/components/Header.vue'
</script>


<style >
* {
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
}

.container {
  display: flex;
  height: 100vh;
}

.side-menu {
  width: 250px; /* Fixed width */
  background-color: #1a1a1a;
  overflow-x: hidden; /* Disable horizontal scroll */
}

.main-content {
  flex: 1; /* Take remaining space */
  display: flex;
  flex-direction: column;
}

.header {
  height: 60px;
  width: 100%;
}

.view {
  flex: 1; /* Take remaining space */
  overflow-y: auto; /* Enable vertical scrolling */
}
</style>
