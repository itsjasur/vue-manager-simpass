<template>
  <div class="html_content">
    <div v-html="content"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import privacyHtml from '@/assets/privacy.html?url'
import usetermsHtml from '@/assets/useterms.html?url'
import sjPrivacyHtml from '@/assets/sj_privacy.html?url'
import sjUsetermsHtml from '@/assets/sj_useterms.html?url'

const content = ref('')
const hostname = ref('baroform')

const props = defineProps({
  page: {
    type: String,
    required: true,
  },
})

onMounted(async () => {
  hostname.value = window.location.hostname.includes('sjnetwork') ? 'sjnetwork' : 'baroform'

  const page = props.page
  if (page !== 'privacy' && page !== 'useterms') {
    content.value = '<h1>404 - Page Not Found</h1>'
    return
  }

  let response = null

  if (hostname.value === 'sjnetwork') {
    if (page === 'privacy') {
      response = await fetch(sjPrivacyHtml)
    } else if (page === 'useterms') {
      response = await fetch(sjUsetermsHtml)
    }
  } else {
    if (page === 'privacy') {
      response = await fetch(privacyHtml)
    } else if (page === 'useterms') {
      response = await fetch(usetermsHtml)
    }
  }
  content.value = await response.text()
})
</script>

<style scoped>
.html_content {
  padding: 0 30px;
  padding-bottom: 100px;
  padding-top: 20px;
  overflow-y: auto;
  max-width: 1000px;
  margin: 0 auto;
}
</style>
