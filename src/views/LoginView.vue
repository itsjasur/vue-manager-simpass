<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="input-group">
        <label for="username">Username</label>
        <input type="text" id="username" name="username" required v-model="username" />
      </div>
      <div class="input-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required v-model="password" />
      </div>
      <button type="submit">Login</button>

      <p>{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const error = ref(null)

async function login(event) {
  console.log('submit clicked')

  try {
    const response = await fetch('http://192.168.0.251:8091/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })

    if (response.ok) {
      const data = await response.json()
      // Handle successful login
    } else {
      error.value = 'Invalid credentials'
    }
  } catch (err) {
    error.value = 'An error occurred during login'
    console.error(err)
  }
}
</script>

<style>
/* * {
  box-sizing: border-box;
} */

body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.login-container {
  background-color: #ffffff;
  padding: 40px 40px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  align-items: center;
  width: 400px;
}

h2 {
  margin-bottom: 20px;
  color: orange;
}

.input-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #414141;
  font-size: 16px;
}

input {
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  padding-left: 13px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: orange;
  box-shadow: 0 0 2px orange;
}

button {
  margin: 15px 0;
  width: 100%;
  height: 50px;
  background-color: orange;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: orange;
}
</style>
