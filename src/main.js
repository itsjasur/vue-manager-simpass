import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import './assets/global.css'
import cleaveDirective from './directives/cleaveDirective'

const pinia = createPinia()
const app = createApp(App)

app.directive('cleave', cleaveDirective)

app.use(router)
app.use(pinia)

app.use(Antd)

app.mount('#app')
