<script setup lang="ts">
import { type HTMLAttributes } from 'vue'

/**
 * Props for the PaginationForwardButton component
 * - `class`: Additional CSS classes
 * - `disabled`: Whether the button is disabled
 * @default disabled: false
 *
 * @example
 * ```vue
 * <template>
 *  <PaginationForwardButton :disabled="true" />
 * </template>
 * ```
 */
const props = defineProps<{
	class?: HTMLAttributes['class']
	disabled?: boolean
	dataCy?: string
	dataTestid?: string
}>()
</script>

<template>
	<div
		class="cursor-pointer text-primary-500"
		:disabled="props.disabled"
		:data-cy="props.dataCy"
		:data-testid="props.dataTestid ?? props.dataCy"
	>
		<i class="si-heroicon-solid-chevron-double-right" />
	</div>
</template>
