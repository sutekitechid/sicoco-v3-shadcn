<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import './assets/index.css'
import Button from '@/components/button/Button.vue'
import Dropdown from '@/components/dropdown/Dropdown.vue'
import { ref } from 'vue'
const modelDropdown = ref(null)
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
		<HelloWorld msg="Vite + Vue" />
		<span class="text-black"> dropdowns </span>
		<Dropdown v-model="modelDropdown" :options="optionDropdown">
			<div class="text-primary">dropdown lagiasdasdasdasd</div>
		</Dropdown>
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
