import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import './assets/global.css'
import cleaveDirective from './directives/cleaveDirective'

// import 'ant-design-vue/dist/reset.css'

const app = createApp(App)

const pinia = createPinia()
app.directive('cleave', cleaveDirective)
app.use(pinia)
app.use(router)
app.use(Antd)

app.mount('#app')
