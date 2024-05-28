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
      },
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
