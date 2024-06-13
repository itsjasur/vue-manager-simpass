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

  if (route.path === '/registration-forms') {
    return SIDEMENUNAMES[2]
  }

  if (route.path === '/rental-forms') {
    return SIDEMENUNAMES[3]
  }
  if (route.path === '/applications') {
    return SIDEMENUNAMES[4]
  }

  return 'Nothing'
})
</script>

<style scoped></style>
