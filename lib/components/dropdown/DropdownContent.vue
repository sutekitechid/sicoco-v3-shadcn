<script setup lang="ts">
import { cn } from '../../utils/tw-merge'
import {
	PopoverContent,
	type PopoverContentEmits,
	type PopoverContentProps,
	PopoverPortal,
	useForwardPropsEmits,
} from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

// Disable inheritance of attributes like `class` from parent
defineOptions({
	inheritAttrs: false,
})

// Define props, combining `PopoverContentProps` and additional `class` prop
const props = withDefaults(
	defineProps<PopoverContentProps & { class?: HTMLAttributes['class'] }>(),
	{
		align: 'center',
		sideOffset: 4,
	}
)

// Define events emitted by this component
const emits = defineEmits<PopoverContentEmits>()

// Create a computed property to exclude the `class` from delegated props
const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props
	return delegated
})

// Forward the props and emits to the `PopoverContent` component
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
	<!-- Popover portal to handle the rendering of the popover outside the normal flow -->
	<PopoverPortal>
		<PopoverContent
			v-bind="{ ...forwarded, ...$attrs }"
			:class="
				cn(
					'z-50 w-72 rounded-lg border border-grey-10 bg-white p-4 text-slate-950 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ',
					props.class
				)
			"
		>
			<slot />
		</PopoverContent>
	</PopoverPortal>
</template>
