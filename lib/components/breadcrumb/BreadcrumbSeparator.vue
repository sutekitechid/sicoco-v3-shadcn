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
			<i class="si-heroicon-solid-chevron-right text-primary-500 peer-hover:text-primary-700"></i>
		</slot>
	</span>
</template>
