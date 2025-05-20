import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
import './assets/index.css'
import '../lib/assets/icomoon/style.css'

createApp(App).use(router).mount('#app')
