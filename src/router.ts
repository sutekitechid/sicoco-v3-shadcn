import { createRouter, createWebHashHistory } from 'vue-router'
import Input from './pages/input.vue'
import InputExample from './pages/input-example.vue'
import index from './pages/index.vue'
import dialog from './pages/dialog.vue'
import Dropdown from './pages/dropdown.vue'
import SortableTableExample from './pages/SortableTableExample.vue'
import DataTableV2 from './pages/data-table-v2.vue'
import DataTablePerformanceTest from './pages/DataTablePerformanceTest.vue'
import FormValidationTest from './pages/form-validation-test.vue'
import Calendar from './pages/calendar.vue'
import Datepicker from './pages/datepicker.vue'
import customColor from './pages/custom-color.vue'
import checkbox from './pages/checkbox.vue'
import carousel from './pages/carousel.vue'
import typography from './pages/typography.vue'
import badge from './pages/badge.vue'
import button from './pages/button.vue'
import radio from './pages/radio.vue'
import switchPage from './pages/switch.vue'
import richEditor from './pages/rich-editor.vue'
import breadcrumb from './pages/breadcrumb.vue'
import tabs from './pages/tabs.vue'
import tooltip from './pages/tooltip.vue'
import accordion from './pages/accordion.vue'
import textarea from './pages/textarea.vue'
import pagination from './pages/pagination.vue'
import chromajs from './pages/chromajs.vue'
import alert from './pages/alert.vue'
import loading from './pages/loading.vue'
import toast from './pages/toast.vue'
import PinControlsExample from './pages/pin-controls-example.vue'
import progress from './pages/progress.vue'
import SidebarPage from './pages/sidebar.vue'
import FakePage from './pages/fake-page.vue'
import Icons from './pages/icons.vue'
import FormFilter from './pages/form-filter.vue'

import * as path from 'path'
const routes = [
	{ path: '/input', component: Input },
	{ path: '/input-example', component: InputExample },
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
		path: '/datepicker',
		component: Datepicker,
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
		component: typography,
	},
	{
		path: '/badge',
		component: badge,
	},
	{
		path: '/button',
		component: button,
	},
	{
		path: '/radio',
		component: radio,
	},
	{
		path: '/switch',
		component: switchPage,
	},
	{
		path: '/rich-editor',
		component: richEditor,
	},
	{
		path: '/breadcrumb',
		component: breadcrumb,
	},
	{
		path: '/tabs',
		component: tabs,
	},
	{
		path: '/tooltip',
		component: tooltip,
	},
	{
		path: '/accordion',
		component: accordion,
	},
	{
		path: '/textarea',
		component: textarea,
	},
	{
		path: '/pagination',
		component: pagination,
	},
	{
		path: '/chromajs',
		component: chromajs,
	},
	{
		path: '/alert',
		component: alert,
	},
	{
		path: '/loading',
		component: loading,
	},
	{
		path: '/toast',
		component: toast,
	},
	{
		path: '/pin-input',
		component: PinControlsExample,
	},
	{
		path: '/progress',
		component: progress,
	},
	{
		path: '/sidebar',
		component: SidebarPage,
	},
	{
		path: '/icons',
		component: Icons,
	},
	{
		path: '/form-filter',
		component: FormFilter,
	},
	// Fake routes for sidebar demo
	{
		path: '/persiapan/1',
		component: FakePage,
	},
	{
		path: '/persiapan/2',
		component: FakePage,
	},
	{
		path: '/penetapan/1',
		component: FakePage,
	},
	{
		path: '/penetapan/2',
		component: FakePage,
	},
	{
		path: '/pelaksanaan',
		component: FakePage,
	},
	{
		path: '/evaluasi',
		component: FakePage,
	},
	{
		path: '/pengendalian/1',
		component: FakePage,
	},
	{
		path: '/pengendalian/2',
		component: FakePage,
	},
	{
		path: '/peningkatan',
		component: FakePage,
	},
	{
		path: '/repositori-spmi',
		component: FakePage,
	},
	{
		path: '/pengaturan/profil',
		component: FakePage,
	},
	{
		path: '/pengaturan/akun',
		component: FakePage,
	},
]

export const router = createRouter({
	history: createWebHashHistory(),
	routes,
})
