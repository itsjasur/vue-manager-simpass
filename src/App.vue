<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#ffa622',
        colorPrimaryActive: '#fff'
      }
    }"
  >
  </a-config-provider>
  <router-view />
</template>

<script setup></script>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: white;
}
</style>
