<script setup lang="ts">
import { Button } from '../button'
import { cn } from '../../utils/tw-merge'
import { type HTMLAttributes } from 'vue'

/**
 * Props for the PaginationPrev component
 * - `class`: Additional CSS classes
 * - `disabled`: Whether the button is disabled
 * @default disabled: false
 *
 * @example
 * ```vue
 * <template>
 *  <PaginationPrev :disabled="true" />
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
		:class="cn(props.class)"
		:disabled="props.disabled"
		:data-cy="props.dataCy"
		outlined
		class="w-11 h-11"
	>
		<i class="si-chevron-left text-xl" />
	</Button>
</template>
