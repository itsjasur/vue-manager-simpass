import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import './assets/global.css'

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)

// import { ConfigProvider, Select, Form } from 'ant-design-vue'
// app.use(ConfigProvider)
// app.use(Select)
// app.use(Form)

app.use(Antd)

app.mount('#app')
