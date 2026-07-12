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
import { BreadcrumbLink, BreadcrumbSeparator, breadcrumbItemVariant } from '.'
import { isMobile } from '../../utils/viewport'

const props = defineProps<{
	class?: HTMLAttributes['class']
	to?: string | unknown
	disabled?: boolean
	as?: string
	target?: string
}>()
</script>

<template>
	<li
		:class="
			cn(
				'group',
				'text-label-md',
				'group inline-flex items-center gap-2',
				'transition-colors text-main dark:text-neutral-500 cursor-pointer last:cursor-default last:text-disabled last:hover:text-disabled dark:last:text-disabled dark:last:hover:text-disabled',
				// Force descendant <a> to keep neutral color (overrides link's text-primary-default).
				// Uses descendant combinator (_) so the link's own color rules are overridden
				// when this BreadcrumbItem is the :last-child. The hover variant targets
				// the <a> element specifically via the descendant combinator.
				'[&:last-child_a]:text-disabled [&:last-child_a:hover]:text-disabled dark:[&:last-child_a]:text-disabled',
				isMobile() &&
					'[&:nth-child(n)]:[&:not(:first-child)]:[&:not(:nth-last-child(2))]:[&:not(:last-child)]:hidden',
				props.class,
			)
		"
	>
		<BreadcrumbLink
			:disabled="disabled"
			:as="as"
			:to="to"
			:target="target"
			:class="['font-semibold flex', breadcrumbItemVariant({ disabled: props.disabled })]"
		>
			<slot />
		</BreadcrumbLink>
		<BreadcrumbSeparator :disabled="props.disabled" class="group-[:last-child]:hidden" />
	</li>
</template>
