<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#fa9b0d',
        colorPrimaryActive: '#fff',
        colorBorder: '#cccccc' // Default border color for input and select
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
