<template>
  <div class="side-menu">
    <div class="logo" @click="handleResize()">
      <router-link to="/home"><img src="../assets/logo.png" alt="Logo" style="width: 200px" /> </router-link>
    </div>
    <ul @click="handleResize()">
      <li>
        <router-link to="/home">
          <span class="material-symbols-outlined"> home </span>{{ SIDEMENUNAMES[0] }}</router-link
        >
      </li>
      <li>
        <router-link to="/profile">
          <span class="material-symbols-outlined"> person </span>{{ SIDEMENUNAMES[1] }}</router-link
        >
      </li>
      <li>
        <router-link to="/registration-forms">
          <span class="material-symbols-outlined"> description </span>{{ SIDEMENUNAMES[2] }}</router-link
        >
      </li>
      <li>
        <router-link to="/rental-forms">
          <span class="material-symbols-outlined"> demography </span>{{ SIDEMENUNAMES[3] }}</router-link
        >
      </li>

      <li>
        <router-link to="/applications">
          <span class="material-symbols-outlined"> checklist_rtl </span>{{ SIDEMENUNAMES[4] }}</router-link
        >
      </li>

      <li>
        <router-link to="/download-forms">
          <span class="material-symbols-outlined"> file_save </span>{{ SIDEMENUNAMES[5] }}</router-link
        >
      </li>
    </ul>
  </div>
</template>

<script setup>
import MenuTitle from '../components/MenuTitle.vue'
import { SIDEMENUNAMES } from '../assets/constants'
import { useSideMenuStore } from '../stores/side-menu'

const handleResize = () => {
  if (window.innerWidth <= 960) {
    useSideMenuStore().close()
  }
}
</script>

<style scoped>
.logo {
  padding: 10px;
  margin: 15px 10px;
}
img {
  color: antiquewhite;
}

.logo:hover {
  background-color: #4e4e4e;
  border-radius: 5px;
}

ul {
  padding: 0;
  margin: 0;
}

ul li {
  text-align: left;
  margin: 10px;
  display: flex; /* Add this line */
}
li span {
  font-size: 22px;
  padding-right: 10px;
}
ul li .router-link-active {
  background-color: #313131;
  border-radius: 5px;
}

ul li :hover {
  background-color: #4e4e4e;
  border-radius: 5px;
}

ul li a {
  color: #fff;
  text-decoration: none;
  display: block;
  padding: 12px 15px;
  width: 100%; /* Add this line */
  display: flex; /* Add this line */
  /* justify-content: start; */
  /* justify-items: center; */
  align-items: flex-end;
}
</style>
