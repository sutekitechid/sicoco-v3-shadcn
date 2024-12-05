<script lang="ts" setup>
/**
 * BreadcrumbList component is a wrapper for BreadcrumbEllipsis and BreadcrumbSeparator components.
 * It inserts ellipsis after 1st child and separator after 2nd child if there are more than 3 children.
 * @slot default - BreadcrumbItem components
 *
 * @props class - Additional classes
 *
 */
import { HTMLAttributes, h, computed } from 'vue'
import { cn } from '../../utils/tw-merge'
import { BreadcrumbEllipsis, BreadcrumbSeparator } from '.'

const props = defineProps<{
	class?: HTMLAttributes['class']
}>()

const slots = defineSlots()

const defaultSlot = slots.default?.() ?? []

// insert ellipsis after 1st child
const breadcrumbItems = computed(() => {
	const children = defaultSlot[0].children
	if (children.length > 3) {
		children.splice(2, 0, h(BreadcrumbEllipsis))
		children.splice(3, 0, h(BreadcrumbSeparator))
	}
	return children
})
</script>

<template>
	<ol
		:class="
			cn(
				'flex flex-wrap items-center gap-1.5 break-words text-xs sm:gap-2.5',
				props.class
			)
		"
	>
		<div v-if="false">
			<slot />
		</div>
		<template v-for="(child, index) in breadcrumbItems" :key="index">
			<component :is="child" />
		</template>
	</ol>
</template>
