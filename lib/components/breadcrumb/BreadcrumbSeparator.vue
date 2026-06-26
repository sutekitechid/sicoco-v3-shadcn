<script lang="ts" setup>
/**
 * BreadcrumbSeparator component is used to add a separator between breadcrumb items.
 * @slot default - Content to be displayed inside the separator
 *
 * @props class - Additional classes
 *
 * @example
 * <BreadcrumbSeparator />
 */
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

const props = defineProps<{
	class?: HTMLAttributes['class']
}>()
</script>

<template>
	<span aria-hidden="true" :class="cn(props.class)" class="mt-1">
		<slot>
			<i class="si-chevron-right text-neutral-950"></i>
		</slot>
	</span>
</template>
