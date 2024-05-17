<template>
  <div class="logo">
    <router-link to="/"
      ><img src="../assets/logo.png" alt="Logo" style="width: 200px"
    /></router-link>
  </div>
  <ul>
    <li>
      <router-link to="/profile">{{ SIDEMENUNAMES[0] }}</router-link>
    </li>
    <li>
      <router-link to="/registration">{{ SIDEMENUNAMES[1] }}</router-link>
    </li>
    <li>
      <router-link to="/rental-registration">{{ SIDEMENUNAMES[2] }}</router-link>
    </li>
  </ul>
</template>

<script setup>
import MenuTitle from '../components/MenuTitle.vue'
import { SIDEMENUNAMES } from '../assets/constants'
</script>

<style scoped>
.logo {
  padding: 10px;
  margin: 15px 10px;
}

.logo:hover {
  background-color: #4e4e4e;
  border-radius: 5px;
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  text-align: left;
  margin: 10px 10px;
}

ul li a {
  color: #fff;
  text-decoration: none;
  display: block;
  padding: 12px 15px;
}

ul li a:hover {
  background-color: #4e4e4e;
  border-radius: 5px;
}

ul li .router-link-active {
  background-color: #313131;
  border-radius: 5px;
}
</style>
