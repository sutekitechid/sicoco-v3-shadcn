<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import './assets/index.css'
import Button from '@/components/button/Button.vue'
import Popover from '@/components/popover/Popover.vue'
import PopoverContent from '@/components/popover/PopoverContent.vue'
import PopoverTrigger from '@/components/popover/PopoverTrigger.vue'
</script>

<template>
	<div class="bg-white">
		<Popover>
			<PopoverTrigger>
				<span class="text-black"> Open popover 2 </span>
			</PopoverTrigger>
			<PopoverContent> Some popover content 2 </PopoverContent>
		</Popover>
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
		<Popover>
			<PopoverTrigger>
				<span class="text-black"> Open popover </span>
			</PopoverTrigger>
			<PopoverContent> Some popover content </PopoverContent>
		</Popover>
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
