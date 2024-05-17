
<template>
  <div class="logo">
    <img src="../assets/logo.png" alt="Logo" style="width: 200px" />
  </div>
  <ul>
    <li><RouterLink to="/">Home</RouterLink></li>
    <li><RouterLink to="/profile">Profile</RouterLink></li>
    <li><RouterLink to="/about">About</RouterLink></li>
  </ul>
</template>



<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>


<style scoped >
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

a:hover,
a.router-link-active {
  background-color: #313131;
  border-radius: 5px;
}
</style>
