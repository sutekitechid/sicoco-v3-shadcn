<script lang="ts" setup>
/**
 * BreadcrumbEllipsis component is used to add an ellipsis after the first item if there are more than 3 items.
 * @slot default - Content to be displayed inside the ellipsis
 *
 * @props class - Additional classes
 * @props interactive - When true, renders as a <button> and emits `click` on activation
 *
 * @example
 * <BreadcrumbEllipsis />
 * <BreadcrumbEllipsis interactive @click="expand" />
 */
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

const props = defineProps<{
	class?: HTMLAttributes['class']
	interactive?: boolean
}>()

const emit = defineEmits<{
	(e: 'click'): void
}>()
</script>

<template>
	<div class="mt-1">
		<button
			v-if="props.interactive"
			type="button"
			aria-label="Show all breadcrumb items"
			:class="
				cn(
					'flex items-center justify-center text-primary-default hover:text-primary-700 cursor-pointer',
					props.class
				)
			"
			@click="emit('click')"
		>
			<slot>
				<i class="si-heroicon-solid-ellipsis-horizontal"></i>
			</slot>
			<span class="sr-only">More</span>
		</button>
		<span
			v-else
			aria-hidden="true"
			:class="
				cn(
					'flex items-center justify-center text-primary-default',
					props.class
				)
			"
		>
			<slot>
				<i class="si-heroicon-solid-ellipsis-horizontal"></i>
			</slot>
			<span class="sr-only">More</span>
		</span>
	</div>
</template>
