<template>
  <div v-if="snackbarStore.active" class="snackbar" :class="[snackbarStore.type]">
    <div class="snackbar-content">
      {{ snackbarStore.message }}
    </div>
    <div class="close-icon" @click="snackbarStore.hide">&times;</div>
  </div>
</template>

<script setup>
import { useSnackbarStore } from '../stores/snackbar'

const snackbarStore = useSnackbarStore()
</script>

<style scoped>
.snackbar {
  position: fixed;
  top: 30px;
  left: 50%;
  transform: translateX(-50%); /* this takes the snackbar width into account*/
  background-color: #212121;
  color: #fff;
  padding: 10px 15px;
  border-radius: 4px;
  display: flex;
  align-items: center;

  width: 80%;
  max-width: 400px;
  min-width: 200px;

  justify-content: space-between;
  z-index: 5000;
  box-shadow: 0 0 20px #00000042;
  /* font-weight: 600; */
}

.snackbar.warning {
  background-color: #f1a20d;
}

.snackbar-content {
  font-size: 15px;
  flex-grow: 1;
  text-align: center;
  white-space: pre-line;
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
