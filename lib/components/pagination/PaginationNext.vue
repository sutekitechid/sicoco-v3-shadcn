<script setup lang="ts">
import { cn } from '../../utils/tw-merge'
import { type HTMLAttributes } from 'vue'

/**
 * Props for the PaginationNext component
 * - `class`: Additional CSS classes
 * - `disabled`: Whether the button is disabled
 * @default disabled: false
 *
 * @example
 * ```vue
 * <template>
 *  <PaginationNext :disabled="true" />
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
		:class="cn(props.class)"
		class="cursor-pointer text-primary-500"
		:disabled="props.disabled"
		:data-cy="props.dataCy"
		:data-testid="props.dataTestid ?? props.dataCy"
	>
		<i class="si-heroicon-outline-chevron-right" />
	</div>
</template>
