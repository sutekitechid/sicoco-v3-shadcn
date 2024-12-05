<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import './assets/index.css'
import '../lib/assets/icomoon/style.css'
import Button from '@/components/button/Button.vue'
import Badge from '@/components/badge/Badge.vue'
import Skeleton from '@/components/skeleton/Skeleton.vue'
import Input from '@/components/input/Input.vue'
import Checkbox from '@/components/checkbox/Checkbox.vue'
import CheckboxGroup from '@/components/checkbox/CheckboxGroup.vue'
import FormInput from '@/components/form-input/FormInput.vue'
import { Tooltip, TooltipContent } from '../lib/components/tooltip'

const checkboxOptions = [
	{ label: 'Option 1', value: 'option1' },
	{ label: 'Option 2', value: 'option2' },
	{ label: 'Option 3', value: 'option3' },
]
const selectedOptions = ref<string[]>([])

watch(
	selectedOptions,
	value => {
		console.log(value)
	},
	{ deep: true }
)

const checkboxRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
	console.log(checkboxRef.value)
})
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
			<Button rounded variant="danger" outlined disabled size="lg"
				>Shadcn Button</Button
			>
		</div>
		<div class="flex items-center gap-2">
			<Badge type="primary" size="small" closeable>Primary</Badge>
			<Badge type="danger" size="medium" closeable>Danger</Badge>
			<Badge type="warning" size="large" closeable>Warning</Badge>
			<Badge type="purple" size="large" closeable>purple</Badge>
		</div>
		<HelloWorld msg="Vite + Vue" />
		<Skeleton class="h-[125px] w-[250px] rounded-none" />
		<Input placeholder="Enter your name" size="lg" />
		<Checkbox
			ref="checkboxRef"
			:model-value="selectedOptions.length > 0"
			:indeterminate="
				selectedOptions.length > 0 &&
				selectedOptions.length < checkboxOptions.length
			"
			:value="true"
			required
		>
			Pilih Semua
		</Checkbox>
		<div class="flex flex-col gap-2 m-6">
			<div v-for="option in checkboxOptions" :key="option.value">
				<Checkbox
					v-model="selectedOptions"
					:label="option.label"
					:value="option.value"
					:key="option.value"
					variant="success"
					class="items-start"
				>
					<p class="font-semibold mb-2">Remember Me!</p>
					{{ option.label }} Save my login details for next time.
				</Checkbox>
			</div>
		</div>
		<FormInput>
			<CheckboxGroup
				:value="selectedOptions"
				:custom-validators="{ test: value => value === 'test' }"
			>
				<div v-for="option in checkboxOptions" :key="option.value">
					<Checkbox
						v-model="selectedOptions"
						:label="option.label"
						:value="option.value"
						:key="option.value"
						variant="success"
						class="items-start"
					>
						<p class="font-semibold mb-2">Remember Me!</p>
						{{ option.label }} Save my login details for next time.
					</Checkbox>
				</div>
				<template #errors="{ validation }">
					<p v-if="validation.test.$invalid">Test error</p>
				</template>
			</CheckboxGroup>
			<button type="submit" class="text-black">Submit</button>
		</FormInput>
		<Tooltip>
			<template #trigger>
				<Button>Hover me</Button>
			</template>
			<TooltipContent variant="success" position="right">
				<div class="w-96">
					Lorem Ipsum is simply dummy text of the printing and typesetting
					industry. Lorem Ipsum has been the industry's standard dummy text ever
					since the 1500s, when an unknown printer took a galley of type and
					scrambled it to make a type specimen book. It has survived not only
					five centuries, but also the leap into electronic typesetting,
					remaining essentially unchanged. It was popularised in the 1960s with
					the release of Letraset sheets containing Lorem Ipsum passages, and
					more recently with desktop publishing software like Aldus PageMaker
					including versions of Lorem Ipsum.
				</div></TooltipContent
			>
		</Tooltip>
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
