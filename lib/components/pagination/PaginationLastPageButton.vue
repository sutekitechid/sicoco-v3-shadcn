<script setup lang="ts">
import { Button } from '../button'
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
}>()
</script>

<template>
	<Button
		variant="primary"
		:disabled="props.disabled"
		:data-cy="props.dataCy"
		class="w-11 h-11"
	>
		<i class="si-chevrons-right text-xl" />
	</Button>
</template>
