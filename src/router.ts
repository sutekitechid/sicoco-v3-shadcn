import { createRouter, createWebHistory } from 'vue-router'
import Input from './pages/input.vue'
import index from './pages/index.vue'
import Table from './pages/table.vue'
import dialog from './pages/dialog.vue'
import Dropdown from './pages/dropdown.vue'
import SortableTableExample from './pages/SortableTableExample.vue'
import DataTableV2 from './pages/data-table-v2.vue'
const routes = [
	{ path: '/input', component: Input },
	{ path: '/', component: index },
	{
		path: '/table',
		component: Table,
	},
	{
		path: '/sortable-table',
		component: SortableTableExample,
	},
	{
		path: '/dialog',
		component: dialog,
	},
	{
		path: '/dropdown',
		component: Dropdown,
	},
	{
		path: '/data-table-v2',
		component: DataTableV2,
	}
]

export const router = createRouter({
	history: createWebHistory(),
	routes,
})
