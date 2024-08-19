<template>
  <div class="main_wrapper">
    <div v-if="!formSubmitted" class="sign_seal_submit_container">
      <p class="title">모바일 또는 테블릿에서 서명/사인 부탁드립니다.</p>
      <SignImageRowContainer overlayText="" title="사인/서명" @updateSignSeal="updatePads" />
      <button @click="saveSignData" class="save_sign">사인/서명 저장</button>
    </div>

    <div v-if="formSubmitted" class="sign_seal_submit_container">
      <p>감사합니다. 서명이 제출되었습니다.</p>
    </div>
  </div>
</template>

<script setup>
import SignImageRowContainer from '@/components/SignImageRowContainer.vue'
import { usePageLoadingStore } from '@/stores/page-loading-store'
import { useSnackbarStore } from '@/stores/snackbar'
import { ref } from 'vue'

import { useRoute } from 'vue-router'

const route = useRoute()

const signData = ref(null)
const sealData = ref(null)

const formSubmitted = ref(false)

const updatePads = (sign, seal) => {
  signData.value = sign
  sealData.value = seal
}

async function saveSignData() {
  if (!signData.value || !sealData.value) {
    useSnackbarStore().show('사인/서명을 하지 않았습니다.')
    return
  }

  try {
    usePageLoadingStore().start()
    const response = await fetch(import.meta.env.VITE_CHAT_SERVER_URL + 'save-sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: route.params.id,
        sign: signData.value,
        seal: sealData.value,
      }),
    })
    if (!response.ok) return

    const data = await response.json()
    if (data?.success) {
      formSubmitted.value = true
      usePageLoadingStore().stop()

      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
      await delay(3000)

      window.close()
    } else throw '만료되었거나 잘못된 URL입니다.'
  } catch (err) {
    useSnackbarStore().show(err)
  } finally {
    usePageLoadingStore().stop()
  }
}
</script>

<style scoped>
.main_wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;

  padding: 20px;
  box-sizing: border-box;
}

.sign_seal_submit_container {
  margin-top: 100px;
  max-width: 350px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column;
  /* align-items: center; */
  justify-content: center;
}

.title {
  font-weight: 600;
}

.save_sign {
  margin-top: 20px;
  width: 100%;
}
</style>
