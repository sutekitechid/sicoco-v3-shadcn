import { createRouter, createWebHistory } from 'vue-router'
import Input from './pages/input.vue'
import index from './pages/index.vue'
import dialog from './pages/dialog.vue'
import Dropdown from './pages/dropdown.vue'
import SortableTableExample from './pages/SortableTableExample.vue'
import DataTableV2 from './pages/data-table-v2.vue'
import DataTablePerformanceTest from './pages/DataTablePerformanceTest.vue'
import FormValidationTest from './pages/form-validation-test.vue'
import Calendar from './pages/calendar.vue'
import customColor from './pages/custom-color.vue'
import checkbox from './pages/checkbox.vue'
import carousel from './pages/carousel.vue'
import typography from './pages/typography.vue'
import * as path from 'path'
const routes = [
	{ path: '/input', component: Input },
	{ path: '/', component: index },
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
	},
	{
		path: '/datatable-performance',
		component: DataTablePerformanceTest,
	},
	{
		path: '/form-validation-test',
		component: FormValidationTest,
	},
	{
		path: '/calendar',
		component: Calendar,
	},
	{
		path: '/custom-color',
		component: customColor,
	},
	{
		path: '/checkbox',
		component: checkbox,
	},
	{
		path: '/carousel',
		component: carousel,
	},
	{
		path: '/typography',
		component: typography
	}
]

export const router = createRouter({
	history: createWebHistory(),
	routes,
})
