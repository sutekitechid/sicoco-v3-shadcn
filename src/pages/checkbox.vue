<template>
	<div>
		<Checkbox
			ref="checkboxRef"
			:model-value="selectedOptions.length > 0"
			:indeterminate="
				selectedOptions.length > 0 &&
				selectedOptions.length < checkboxOptions.length
			"
			:value="true"
			required
			@update:model-value="
				val => {
					if (val) {
						selectedOptions = checkboxOptions.map(option => option.value)
					} else {
						selectedOptions = []
					}
				}
			"
		>
			Pilih Semua
		</Checkbox>
		<div class="flex flex-col gap-2 m-6">
			<div v-for="option in checkboxOptions" :key="option.value">
				<Checkbox
					:key="option.value"
					:model-value="selectedOptions"
					@update:model-value="
						val => {
							if (val) {
								selectedOptions.push(option.value)
							} else {
								selectedOptions = selectedOptions.filter(
									v => v !== option.value
								)
							}
						}
					"
					:label="option.label"
					:value="option.value"
					variant="success"
					class="items-start"
				>
					<p class="font-semibold mb-2">Remember Me!</p>
					{{ option.label }} Save my login details for next time.
					{{ selectedOptions }}
				</Checkbox>
			</div>
		</div>
		<Checkbox
			:model-value="customCheckbox"
			variant="success"
			:value="true"
			rounded
			@update:model-value="updateCheckbox"
		/>
		<!-- @update:model-value="updateCheckbox" -->
		<Button @click="customCheckbox = !customCheckbox">button</Button>
	</div>
</template>
<script setup lang="ts">
import Button from '@/components/button/Button.vue'
import Checkbox from '@/components/checkbox/Checkbox.vue'
import { ref } from 'vue'

const customCheckbox = ref(true)
function updateCheckbox(value: boolean) {
	console.log('updateCheckbox value', value)
	customCheckbox.value = value
}

const selectedOptions = ref<string[]>([])

const checkboxOptions = [
	{ label: 'Option 1', value: 'option1' },
	{ label: 'Option 2', value: 'option2' },
	{ label: 'Option 3', value: 'option3' },
]
</script>
