<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import './assets/index.css'
import '../lib/assets/icomoon/style.css'
import Button from '@/components/button/Button.vue'
import Dropdown from '@/components/dropdown/Dropdown.vue'
import { ref } from 'vue'
const modelDropdown = ref(undefined)
const modelDropdown2 = ref(undefined)

const optionDropdown = ref([
	{
		label: 'Option 1',
		value: 'option1',
	},
	{
		label: 'Option 2',
		value: 'option2',
	},
])
import Badge from '@/components/badge/Badge.vue'
import Skeleton from '@/components/skeleton/Skeleton.vue'
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
		<span class="text-black"> dropdowns </span>
		<div>
			<div class="grid grid-cols-2">
				<div>
					<Dropdown
						v-model="modelDropdown"
						:options="optionDropdown"
						:custom-formatter="item => item?.label"
					>
					</Dropdown>
				</div>
				<div>
					<Dropdown
						v-model="modelDropdown2"
						:options="optionDropdown"
						:custom-formatter="item => item?.label"
					>
					</Dropdown>
				</div>
			</div>
		</div>
		<Skeleton class="h-[125px] w-[250px] rounded-none" />
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
