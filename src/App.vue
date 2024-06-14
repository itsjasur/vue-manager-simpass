<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#fa9b0d', //primary
        colorPrimaryHover: '#fa9b0d', //primary hover
        colorBorder: '#cccccc', // border color
        controlHeight: 40, // input/select/button height
        borderRadius: 4, //all border radius
        lineWidth: 1, //border line width
        controlOutline: 'none', //focus outline
        fontSize: 15,
      },
    }"
  >
  </a-config-provider>
  <router-view />

  <Snackbar />
</template>

<script setup>
import { watch } from 'vue'
import Snackbar from './components/Snackbar.vue'
// import router from './router'
import { useRouter } from 'vue-router'
import { useAuthenticationStore } from './stores/authentication'
import { useRouteMemoryStore } from './stores/router-memory-store'

const router = useRouter()
const authStore = useAuthenticationStore()

// Watch for changes in isLoggedIn and redirect to login
watch(
  () => authStore.isLoggedIn,
  (newIsLoggedIn) => {
    if (!newIsLoggedIn) {
      useRouteMemoryStore().save(router.currentRoute.value.fullPath)
      router.push('/login')
    }
  }
)
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: white;
}
</style>
