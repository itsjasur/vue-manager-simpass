import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import './assets/global.css'
import CleaveInput from './components/CleaveInput.vue'
import GlobalPopupWithOverlay from './components/GlobalPopupWithOverlay.vue'
import GlobalSearchAddress from './components/GlobalSearchAddress.vue'
// import 'ant-design-vue/dist/reset.css'

const app = createApp(App)

const pinia = createPinia()
app.component('CleaveInput', CleaveInput)
app.component('GlobalPopupWithOverlay', GlobalPopupWithOverlay)
app.component('GlobalSearchAddress', GlobalSearchAddress)

app.use(pinia)
app.use(router)
app.use(Antd)

// app.mount('#app')

if (document.getElementById('app')) {
  app.mount('#app')
} else if (document.getElementById('app-sjnetwork')) {
  app.mount('#app-sjnetwork')
}
