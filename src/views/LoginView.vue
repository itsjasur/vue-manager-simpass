<template>
  <Snackbar />
  <div class="main">
    <div class="login-container">
      <h2>로그인</h2>
      <p class="text2">판매점 아이디 와 비밀번호를 입력하세요</p>
      <form @submit.prevent="login">
        <div class="input-group">
          <label for="username">판매점 아이디</label>
          <input type="text" id="username" name="username" v-model="username" />
          <p v-if="!username" class="input-error-message">{{ usernameErr }}</p>
        </div>
        <div class="input-group">
          <label for="password">비밀번호</label>
          <input type="password" id="password" name="password" v-model="password" />
          <p v-if="!password" class="input-error-message">{{ passwordErr }}</p>
        </div>
        <button type="submit" :disabled="isLoading">
          <div v-if="isLoading">
            <LoadingSpinner height="20px" color="#ffffff" />
          </div>
          <div v-else>Login</div>
        </button>
      </form>
    </div>

    <p class="foot-note">
      상호 : 심패스(Simpass) | 대표 : 김익태 | 대표전화 : 02-2108-3121 | FAX : 02-2108-3120
      사업자등록번호 : 343-18-00713 | 통신판매신고번호 : 제 2021-서울구로-1451 호 서울시 구로구
      디지털로33길 28, 우림이비지센터 1차 1210호
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoadingSpinner from '../components/Loader.vue'
import Snackbar from '../components/Snackbar.vue'
import { useSnackbarStore } from '@/stores/snackbar'
import { useAuthenticationStore } from '../stores/authentication'
import { BASEURL } from '@/assets/constants'

const username = ref('')
const password = ref('')

const usernameErr = ref('')
const passwordErr = ref('')
const isLoading = ref(false)

async function login(event) {
  console.log('button clicked')
  isLoading.value = true

  // Check if input fields are empty
  if (!username.value) {
    usernameErr.value = '아이디를 정확히 입력해주세요'
  }
  if (!password.value) {
    passwordErr.value = '비밀번호를 입력하세요.'
  }

  // If any input field is empty, do not proceed with the login request
  if (!username.value || !password.value) {
    isLoading.value = false
    return
  }

  try {
    const response = await fetch(BASEURL + 'auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })
    if (response.ok) {
      const data = await response.json()

      useAuthenticationStore().login(
        data['accessToken'],
        data['refreshToken'],
        data['id'],
        data['username']
      )

      // Handle successful login
    } else {
      useSnackbarStore().showSnackbar('Invalid credentials') // show snackbar with a success message
    }
  } catch (err) {
    useSnackbarStore().showSnackbar(err.toString())
  }

  isLoading.value = false
}
</script>

<style scoped>
.main {
  justify-items: center;
  align-content: center;
  align-items: center;
  justify-content: center;
  display: flex;
  height: 100vh;
  background-color: #ffffff;
  flex-direction: column;
}

.text2 {
  padding: 10px 0;
}

.login-container {
  background-color: #ffffff;
  padding: 40px 40px;
  border-radius: 10px;
  text-align: center;
  align-items: center;
  justify-self: center;
  width: 80%;
}

.input-group {
  margin: 20px 0;
  text-align: left;
}

.foot-note {
  padding-top: 50px;
  width: 80%;
  color: #4b4b4b;
  line-height: 1.6;
}

@media (min-width: 768px) {
  .main {
    background-color: #f0f2f5;
  }
  .login-container {
    width: 400px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .foot-note {
    width: 500px;
  }
}
</style>
