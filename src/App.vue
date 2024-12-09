<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import './assets/index.css'
import '../lib/assets/icomoon/style.css'
import Button from '@/components/button/Button.vue'
import Badge from '@/components/badge/Badge.vue'
import Skeleton from '@/components/skeleton/Skeleton.vue'
import Switch from '@/components/switch/Switch.vue'
import { ref } from 'vue'

const switchModel = ref([
	{
		model: true,
		disabled: false,
		label: 'Primary',
		type: 'primary',
	},
	{
		model: true,
		disabled: false,
		label: 'Success',
		type: 'success',
	},
	{
		model: true,
		disabled: false,
		label: 'Warning',
		type: 'warning',
	},
	{
		model: true,
		disabled: false,
		label: 'Danger',
		type: 'danger',
	},
	{
		model: true,
		disabled: false,
		label: 'Secondary',
		type: 'secondary',
	},
	{
		model: true,
		disabled: false,
		label: 'Purple',
		type: 'purple',
	},
	{
		model: true,
		disabled: false,
		label: 'Grey / Gray',
		type: 'grey',
	},
])
</script>

<template>
	<div class="bg-white">
		<div class="flex">
			<a href="https://vite.dev" target="_blank">
				<img src="/vite.svg" class="logo" alt="Vite logo" />
			</a>
			<a href="https://vuejs.org/" target="_blank">
				<img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
			</a>
		</div>
		<div class="flex gap-4">
			<div class="bg-danger-100 h-64">asd</div>
			<Button rounded variant="success">Shadcn Button</Button>
		</div>
		<div class="flex items-center gap-2">
			<Badge type="primary" size="small" closeable>Primary</Badge>
			<Badge type="danger" size="medium" closeable>Danger</Badge>
			<Badge type="warning" size="large" closeable>Warning</Badge>
			<Badge type="purple" size="large" closeable>purple</Badge>
		</div>
		<HelloWorld msg="Vite + Vue" />
		<Skeleton class="h-[125px] w-[250px] rounded-none" />
		<div class="flex gap-2">
			<div v-for="(item, index) in switchModel" :key="index" class="mb-4">
				<Switch
					v-model="item.model"
					:disabled="item.disabled"
					:type="item.type"
				>
					<span class="text-black"> {{ item.label }}: {{ item.model }} </span>
				</Switch>
			</div>
		</div>
	</div>
</template>

<style scoped>
.logo {
	height: 6em;
	padding: 1.5em;
	will-change: filter;
	transition: filter 300ms;
}
.logo:hover {
	filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
	filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
