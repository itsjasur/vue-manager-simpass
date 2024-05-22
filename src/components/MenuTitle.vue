<template>
  {{ title }}
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { SIDEMENUNAMES } from '../assets/constants'

const route = useRoute()

const title = computed(() => {
  if (route.path === '/home') {
    return SIDEMENUNAMES[0]
  }

  if (route.path === '/profile') {
    return SIDEMENUNAMES[1]
  }

  if (route.path === '/registration') {
    return SIDEMENUNAMES[2]
  }

  if (route.path === '/rental-registration') {
    return SIDEMENUNAMES[3]
  }

  return 'Nothing'
})
</script>

<style></style>
