<template>
  <h3>Registration page</h3>
</template>

<script setup></script>

<style scoped>
.side-menu {
  position: fixed;
  top: 0;
  width: 280px; /* Fixed width */
  height: 100vh;
  background-color: #1a1a1a;
  z-index: 1000; /* Ensure the side-menu is on top of the overlay */
}

.main-content {
  /* this is side menu width */
  margin-left: 0px;
  /* this is header width */
  margin-top: 60px;
  height: 100vw;
  background-color: yellow;
}

.main-content.sideMenuOpen {
  margin-left: 280px;
}

.header {
  top: 0;
  display: flex;
  font-size: 18px;
  font-weight: 500;
  height: 60px;
  width: 100%;
  z-index: 1000;
  background-color: aqua;
  justify-content: space-between;
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
