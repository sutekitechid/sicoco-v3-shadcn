import { createRouter, createWebHistory } from 'vue-router'
import Input from './pages/input.vue'
import index from './pages/index.vue'

const routes = [
	{ path: '/input', component: Input },
	{ path: '/', component: index },
]

export const router = createRouter({
	history: createWebHistory(),
	routes,
})
