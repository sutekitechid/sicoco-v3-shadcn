import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
import { createComponentLibrary } from '../lib/main'
import { componentLibraryI18n } from './component-library-i18n'
import './assets/index.css'
import '../lib/assets/icomoon/style.css'

createApp(App)
	.use(router)
	.use(createComponentLibrary({ i18n: componentLibraryI18n }))
	.mount('#app')
