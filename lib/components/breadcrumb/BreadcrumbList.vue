<script lang="ts" setup>
/**
 * BreadcrumbList component is a wrapper for BreadcrumbEllipsis and BreadcrumbSeparator components.
 * When there are more than the viewport-specific threshold, an ellipsis button is shown in place
 * of the collapsed middle items. Clicking the ellipsis expands all items inline with a fade
 * transition.
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
import { HTMLAttributes, h, computed, ref } from 'vue'
import { cn } from '../../utils/tw-merge'
import { BreadcrumbSeparator, BreadcrumbEllipsis } from '.'
import { isFragment } from '../../utils/vnode'
import { isMobile } from '../../utils/viewport'

const props = defineProps<{
	class?: HTMLAttributes['class']
}>()

const slots = defineSlots()

const computedDefaultSlot = computed(() => slots.default?.() ?? [])

const isExpanded = ref(false)

type Item = {
	vnode: ReturnType<typeof h>
	key: string | number
}

const ELLIPSIS_KEY = 'ellipsis'
const SEPARATOR_KEY = 'separator'

/**
 * Build the rendered list of breadcrumb items. When `isExpanded` is false and the
 * item count exceeds the viewport threshold, the middle items are replaced by an
 * interactive ellipsis button. Each item carries a stable key so Vue's
 * <TransitionGroup> can animate enter/leave correctly.
 */
const breadcrumbItems = computed<Item[]>(() => {
	const children = generateChildren(
		computedDefaultSlot.value[0]?.children ?? []
	)
	const threshold = isMobile() ? 3 : 4
	const exceedsThreshold = children.length > threshold

	if (!exceedsThreshold || isExpanded.value) {
		return children.map((c, i) => ({ vnode: c, key: i }))
	}

	return [
		{ vnode: children[0], key: 0 },
		{ vnode: children[1], key: 1 },
		{
			vnode: h(BreadcrumbEllipsis, {
				interactive: true,
				onClick: () => {
					isExpanded.value = true
				},
			}),
			key: ELLIPSIS_KEY,
		},
		{ vnode: h(BreadcrumbSeparator), key: SEPARATOR_KEY },
		{ vnode: children[children.length - 2], key: children.length - 2 },
		{ vnode: children[children.length - 1], key: children.length - 1 },
	]
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
	<TransitionGroup
		tag="ol"
		name="breadcrumb"
		:class="
			cn(
				'relative flex flex-wrap items-center gap-1.5 break-words sm:gap-2.5 min-h-7',
				props.class
			)
		"
	>
		<div v-if="false">
			<slot />
		</div>
		<component
			:is="item.vnode"
			v-for="item in breadcrumbItems"
			:key="item.key"
		/>
	</TransitionGroup>
</template>
