<script setup lang="ts">
/**
 * 'ItemsPerPage' is a component that allows users to select the number of items
 * to display per page.
 *
 * Props for the ItemsPerPage component
 * @props {string} class - Additional CSS classes
 * @props {number|string} modelValue: 10 - Additional CSS classes
 * @props {number[]|string[]} options: [10, 20, 50, 100] - Options for items per page
 * @props {number|string} total: 0 - Total number of items
 *
 * @example
 * ```vue
 * <template>
 *  <ItemsPerPage v-model="perPage" :total="total" />
 * </template>
 * ```
 */
import { computed, defineEmits, type HTMLAttributes } from 'vue'

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
