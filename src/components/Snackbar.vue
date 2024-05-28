<template>
  <div v-if="snackbarStore.show" class="snackbar" :class="snackbarStore.type">
    <div class="snackbar-content">
      <span>{{ snackbarStore.message }}</span>
    </div>
    <div class="close-icon" @click="snackbarStore.hideSnackbar">&times;</div>
  </div>
</template>

<script setup>
import { useSnackbarStore } from '../stores/snackbar'

const snackbarStore = useSnackbarStore()
</script>

<style scoped>
.snackbar {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%); /* this takes the snackbar width into account*/
  background-color: #5b5b5b;
  color: #fff;
  padding: 10px 15px;
  border-radius: 4px;
  display: flex;
  font-size: 15px;
  max-width: 80%; /* mobile default */
  min-width: 40%;
  align-items: center;
  justify-content: space-between;
  z-index: 1200;
}

.snackbar-content {
  flex-grow: 1;
  text-align: center;
}

/* Desktop styles */
@media (min-width: 768px) {
  .snackbar {
    max-width: 400px;
    min-width: 200px;
  }
}

.close-icon {
  font-size: 22px;
  cursor: pointer;
  padding-left: 5px;
}

.close-icon:hover {
  color: #ffd3d3;
}
</style>
