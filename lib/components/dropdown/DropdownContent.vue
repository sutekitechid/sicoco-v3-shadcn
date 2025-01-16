<script setup lang="ts">
/**
 * DropdownContent is a Vue 3 component that serves as a wrapper for dropdown content.
 * It leverages the `PopoverContent` component from `radix-vue` to provide enhanced dropdown functionality.
 *
 * @example
 * <DropdownContent class="custom-class">
 *   <p>Dropdown Item Content</p>
 * </DropdownContent>
 *
 * @props {string} [class] - Additional custom CSS classes for styling.
 * @props {string} [align="center"] - Alignment of the dropdown content. Options include "start", "center", or "end".
 * @props {number} [sideOffset=4] - The offset in pixels between the dropdown content and its reference element.
 *
 * @emits {any} * - Emits all events from the underlying `PopoverContent` component.
 *
 * @slots default - Default slot for rendering dropdown item content.
 */

import { cn } from '../../utils/tw-merge'
import {
	PopoverContent,
	type PopoverContentEmits,
	type PopoverContentProps,
	useForwardPropsEmits,
} from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'
import { dropdownContentVariants } from '.'

defineOptions({
	inheritAttrs: false,
})

const props = withDefaults(
	defineProps<PopoverContentProps & { class?: HTMLAttributes['class'] }>(),
	{
		align: 'center',
		sideOffset: 4,
	}
)

const emits = defineEmits<PopoverContentEmits>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props
	return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
	<PopoverContent
		v-bind="{ ...forwarded, ...$attrs }"
		:class="[cn(dropdownContentVariants(), props.class)]"
	>
		<slot />
	</PopoverContent>
</template>
