<script setup lang="ts">
import { computed, defineEmits, type HTMLAttributes } from 'vue'

/**
 * Props for the ItemsPerPage component
 * - `class`: Additional CSS classes
 * - `modelValue`: Current value of items per page
 * - `options`: Options for items per page
 * - `total`: Total number of items
 * @default modelValue: 10
 * @default options: [10, 20, 50, 100]
 * @default total: 0
 *
 * @example
 * ```vue
 * <template>
 *  <ItemsPerPage v-model="perPage" :total="total" />
 * </template>
 */
const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes['class']
		modelValue?: number | string
		options?: number[] | string[]
		total?: number | string
	}>(),
	{
		modelValue: 10,
		options: [10, 20, 50, 100],
		total: 0,
	}
)

/** Emits events for the ItemsPerPage component */
const emit = defineEmits(['update:model-value'])

/**
 * Computed properpty for model value that returns the current value of items per page and
 * emits the `update:model-value` event when the value is changed
 */
const computedModelValue = computed({
	get: () => props.modelValue,
	set: (value: number) => {
		emit('update:model-value', value)
	},
})
</script>

<template>
	<div class="flex gap-3 text-sm items-center">
		<p class="text-grey-60">Tampilkan</p>
		<!-- NOTE: Need to replace this select with dropdown component, 
        ---- once the dropdown component is ready 
        --->
		<select v-model="computedModelValue" class="bg-white">
			<option
				v-for="perPage in options"
				:key="perPage"
				:value="perPage"
				:disabled="Number(perPage) > Number(total)"
			>
				{{ perPage }} per halaman
			</option>
		</select>
		<p class="text-grey-100 font-semibold">Total data : {{ total }}</p>
	</div>
</template>
