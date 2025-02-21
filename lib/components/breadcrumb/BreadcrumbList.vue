<script lang="ts" setup>
/**
 * BreadcrumbList component is a wrapper for BreadcrumbEllipsis and BreadcrumbSeparator components.
 * It inserts ellipsis after 1st child and separator after 2nd child if there are more than 3 children.
 * @slot default - BreadcrumbItem components
 *
 * @props class - Additional classes
 *
 * @example
 * <BreadcrumbList>
 * 	<BreadcrumbItem href="/home">Home</BreadcrumbItem>
 * 	<BreadcrumbItem href="/about">About</BreadcrumbItem>
 * 	<BreadcrumbItem href="/contact">Contact</BreadcrumbItem>
 * 	<BreadcrumbItem href="/services">Services</BreadcrumbItem>
 * </BreadcrumbList>
 */
import { HTMLAttributes, h, computed } from 'vue'
import { cn } from '../../utils/tw-merge'
import { BreadcrumbSeparator, BreadcrumbDropdown } from '.'
import { isFragment } from '../../utils/vnode'

const props = defineProps<{
	class?: HTMLAttributes['class']
}>()

const slots = defineSlots()

const computedDefaultSlot = computed(() => slots.default?.() ?? [])

/**
 * Breadcrumb items with ellipsis and separator
 * @returns Breadcrumb items
 */
const breadcrumbItems = computed(() => {
	const children = generateChildren(
		computedDefaultSlot.value[0]?.children ?? []
	)
	if (children?.length > 3) {
		children.splice(
			2,
			0,
			h(BreadcrumbDropdown, {
				options: children.slice(1, -2),
			})
		)
		children.splice(3, 0, h(BreadcrumbSeparator))
	}
	return children
})

// merge all children into one array
const generateChildren = children => {
	const result = []

	for (const child of children) {
		if (isFragment(child)) {
			result.push(...generateChildren(child.children))
		} else {
			result.push(child)
		}
	}

	return result
}
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
