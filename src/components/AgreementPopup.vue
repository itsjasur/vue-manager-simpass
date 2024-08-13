<template>
  <div class="agreement-main">
    <div class="popup-content">
      <div class="fixed-header">
        <span class="header-title">{{ props.title }}</span>
        <span @click="$emit('closePopup')" class="material-symbols-outlined close-button"> cancel </span>
      </div>
      <div class="html-content" v-html="htmlContent"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import privacyHtml from '@/assets/privacy.html?url'
import usetermsHtml from '@/assets/useterms.html?url'

const emit = defineEmits(['closePopup'])

const props = defineProps({
  title: { type: String, default: '' },
  type: { type: String, default: 'privacy' },
})

const htmlContent = ref('')

// Function to fetch the HTML file content
async function loadHtml() {
  try {
    const response = await fetch(props.type === 'privacy' ? privacyHtml : usetermsHtml)

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    htmlContent.value = await response.text()
  } catch (error) {
    console.error('Error loading HTML file:', error)
  }
}

onUnmounted(() => {
  document.removeEventListener('keydown', keydownHandle)
})

function keydownHandle(event) {
  if (event.key === 'Escape') emit('closePopup')
}

onMounted(() => {
  document.addEventListener('keydown', keydownHandle)
  loadHtml()
})
</script>

<style scoped>
.agreement-main {
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;

  -webkit-user-select: none;
  user-select: none;
}

.popup-content {
  background-color: white;
  border-radius: 8px;
  max-width: 800px;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  overflow-y: auto;
}

@media (max-width: 600px) {
  .agreement-main {
    padding: 0;
  }
  .popup-content {
    width: 100%;
    height: 100%;
    border-radius: 0px;
  }
}

.html-content {
  padding: 0 30px;
  /* padding-bottom: 100px; */
  box-sizing: border-box;
  overflow-y: auto;
}

.close-button {
  font-size: 30px;
  color: #737373;
}
</style>
