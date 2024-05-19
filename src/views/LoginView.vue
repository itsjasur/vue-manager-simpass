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
      <button type="submit" :disabled="isLoading">
        <div v-if="isLoading">
          <LoadingSpinner height="30px" color="#ffffff" />
        </div>
        <div v-else>Login</div>
      </button>

      <p>{{ error }}</p>

      <Snackbar />
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoadingSpinner from '../components/Loader.vue'
import Snackbar from '../components/Snackbar.vue'
import { useSnackbarStore } from '@/stores/snackbar'

const username = ref('')
const password = ref('')

const error = ref(null)
const isLoading = ref(false)

async function login(event) {
  // Show the snackbar with a success message
  useSnackbarStore().showSnackbar('asdas')

  console.log('button clicked')
  isLoading.value = true
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

  isLoading.value = false
}
</script>

<style>
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

.input-group {
  margin: 20px 0;
  text-align: left;
}
</style>
