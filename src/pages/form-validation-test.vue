<template>
	<div class="container mx-auto p-8">
		<h1 class="text-2xl font-bold mb-6">Form Validation E2E Test</h1>

		<FormInput ref="formRef">
			<div class="space-y-4">
				<!-- Static inputs for sequential validation test -->
				<div>
					<p class="mb-2">Field 1 (Required)</p>
					<Input
						v-model="form.field1"
						required
						data-cy="field-1"
						data-validation-order="1"
						name="field1"
					>
						<template #required>Field 1 is required</template>
					</Input>
				</div>

				<div>
					<p class="mb-2">Field 2 (Required)</p>
					<Input
						v-model="form.field2"
						required
						data-cy="field-2"
						data-validation-order="2"
						name="field2"
					>
						<template #required>Field 2 is required</template>
					</Input>
				</div>

				<div>
					<p class="mb-2">Field 3 (Required)</p>
					<Input
						v-model="form.field3"
						required
						data-cy="field-3"
						data-validation-order="3"
						name="field3"
					>
						<template #required>Field 3 is required</template>
					</Input>
				</div>

				<!-- Dynamic inputs for remove test -->
				<div
					v-for="(field, index) in dynamicFields"
					:key="field.id"
					class="flex gap-2 items-start"
				>
					<div class="flex-1">
						<p class="mb-2">Dynamic Field {{ index + 1 }}</p>
						<Input
							v-model="field.value"
							required
							:data-cy="`dynamic-field-${index}`"
							:data-validation-order="`dynamic-${index}`"
						>
							<template #required>Dynamic field {{ index + 1 }} is required</template>
						</Input>
					</div>
					<button
						type="button"
						@click="removeDynamicField(index)"
						:data-cy="`remove-dynamic-${index}`"
						class="mt-9 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
					>
						Remove
					</button>
				</div>

				<button
					type="button"
					@click="addDynamicField"
					data-cy="add-dynamic-field"
					class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				>
					Add Dynamic Field
				</button>

				<button
					type="submit"
					data-cy="submit-button"
					class="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
				>
					Submit
				</button>
			</div>
		</FormInput>

		<!-- Validation info display -->
		<div class="mt-8 p-4 bg-gray-100 rounded">
			<h2 class="font-semibold mb-2">Validation Info (for debugging)</h2>
			<div data-cy="total-validations" class="text-sm font-bold text-lg">
				Total Validations Registered: {{ totalValidations }}
			</div>
			<div data-cy="validation-order" class="text-sm mt-2">
				<div class="font-semibold">Validation Order:</div>
				<ol class="list-decimal list-inside">
					<li
						v-for="(item, index) in validationList"
						:key="index"
						class="text-xs"
					>
						{{ item }}
					</li>
				</ol>
			</div>
			<div data-cy="last-validation-result" class="text-sm mt-2">
				Last Validation Result: {{ lastValidationResult || 'None' }}
			</div>
			<div class="text-xs mt-2 text-red-600 font-bold">
				🔍 Debug: formRef exists? {{ !!formRef }}
			</div>
			<div class="text-xs mt-1 text-red-600 font-bold">
				🔍 Debug: validationRegistry exists?
				{{ !!(formRef?.validationRegistry) }}
			</div>
			<div class="text-xs mt-1 text-red-600 font-bold">
				🔍 Debug: registry.list exists?
				{{ !!(formRef?.validationRegistry?.list) }}
			</div>
			<div class="text-xs mt-1 text-red-600 font-bold">
				🔍 Debug: registry.map size?
				{{ formRef?.validationRegistry?.map?.size || 0 }}
			</div>
			<div class="text-xs mt-1 text-blue-600 font-bold">
				💡 Expected: 3 static validations should auto-register
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import FormInput from '../../lib/components/form-input/FormInput.vue'
import Input from '../../lib/components/input/Input.vue'

interface DynamicField {
	id: number
	value: string
}

const formRef = ref<InstanceType<typeof FormInput> | null>(null)
const form = ref({
	field1: '',
	field2: '',
	field3: '',
})

const dynamicFields = ref<DynamicField[]>([])
let fieldIdCounter = 0

const lastValidationResult = ref<string>('')

const addDynamicField = () => {
	dynamicFields.value.push({
		id: fieldIdCounter++,
		value: '',
	})
}

const removeDynamicField = (index: number) => {
	dynamicFields.value.splice(index, 1)
}

const totalValidations = computed(() => {
	return formRef.value?.validationRegistry?.list?.length || 0
})

const validationList = computed(() => {
	if (!formRef.value?.validationRegistry?.list) return []
	return formRef.value.validationRegistry.list.map((item, index) => {
		// Extract selector for display
		const selector = item.validationId
		return `${index + 1}. ${selector}`
	})
})

// Watch for form submission
onMounted(() => {
	// Expose debug info to window for Cypress testing
	if (typeof window !== 'undefined') {
		(window as any).formValidationDebug = {
			formRef,
			getRegistry: () => formRef.value?.validationRegistry,
			getList: () => formRef.value?.validationRegistry?.list || [],
			getMap: () => formRef.value?.validationRegistry?.map || new Map(),
		}
	}

	// Add form submit event listener if needed for test verification
	if (formRef.value) {
		const formElement = formRef.value.$el as HTMLFormElement
		formElement.addEventListener('submit', (e) => {
			e.preventDefault()
			lastValidationResult.value = 'Validation triggered at ' + new Date().toISOString()
		})
	}
})
</script>
