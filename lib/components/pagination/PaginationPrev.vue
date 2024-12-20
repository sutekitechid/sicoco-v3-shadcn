<script setup lang="ts">
import { Button } from '../button'
import { cn } from '../../utils/tw-merge'
import { ChevronLeft } from 'lucide-vue-next'
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
}>()
</script>

<template>
	<Button :class="cn(props.class)" :disabled="props.disabled">
		<i class="si-chevron-left" />
	</Button>
</template>
