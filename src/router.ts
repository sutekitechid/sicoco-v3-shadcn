import { createRouter, createWebHistory } from 'vue-router'
import Input from './pages/input.vue'
import index from './pages/index.vue'
import Table from './pages/table.vue'
import Dropdown from './pages/dropdown.vue'
const routes = [
	{ path: '/input', component: Input },
	{ path: '/', component: index },
	{
		path: '/table',
		component: Table,
	},
	{
		path: '/dropdown',
		component: Dropdown,
	},
]

export const router = createRouter({
	history: createWebHistory(),
	routes,
})
