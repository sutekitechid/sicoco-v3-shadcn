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
import { type DropdownContentVariants, dropdownContentVariants } from '.'

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
	<PopoverPortal>
		<PopoverContent
			v-bind="{ ...forwarded, ...$attrs }"
			:class="[cn(dropdownContentVariants(), props.class)]"
		>
			<slot />
		</PopoverContent>
	</PopoverPortal>
</template>
