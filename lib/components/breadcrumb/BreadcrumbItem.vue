<script lang="ts" setup>
/**
 * BreadcrumbItem component is used to add a breadcrumb item.
 * Hide the item except the first and last 2 item.
 * @slot default - Content to be displayed inside the item
 *
 * @props class - Additional classes
 * @props href - Link to navigate to
 *
 * @example
 * <BreadcrumbItem href="/home">Home</BreadcrumbItem>
 */

import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { BreadcrumbLink, BreadcrumbSeparator } from '.'

const props = defineProps<{
	class?: HTMLAttributes['class']
	href?: string
}>()
</script>

<template>
	<li
		:class="
			cn(
				'group inline-flex items-center gap-1.5',
				'transition-colors text-grey-100 font-semibold hover:text-primary-80 cursor-pointer last:cursor-default last:text-grey-60 last:hover:!text-grey-60',
				'[&:nth-child(n)]:[&:not(:first-child)]:[&:not(:nth-last-child(2))]:[&:not(:last-child)]:hidden',
				props.class
			)
		"
	>
		<BreadcrumbLink :href="href">
			<slot />
		</BreadcrumbLink>
		<BreadcrumbSeparator class="group-[:last-child]:hidden" />
	</li>
</template>
