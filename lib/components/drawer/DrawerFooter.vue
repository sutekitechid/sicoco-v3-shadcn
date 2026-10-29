<script setup lang="ts">
import { Primitive, type PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

interface Props extends PrimitiveProps {
	class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
	as: 'div',
})
</script>

<template>
	<Primitive
		:as="as"
		:as-child="asChild"
		:class="cn('mt-auto flex flex-col gap-2 p-4 group-data-[swipe-direction=left]/drawer-content:px-6 group-data-[swipe-direction=left]/drawer-content:pb-10 group-data-[swipe-direction=left]/drawer-content:flex-row group-data-[swipe-direction=left]/drawer-content:justify-end group-data-[swipe-direction=right]/drawer-content:px-6 group-data-[swipe-direction=right]/drawer-content:pb-10 group-data-[swipe-direction=right]/drawer-content:flex-row group-data-[swipe-direction=right]/drawer-content:justify-end', props.class)"
	>
		<slot />
	</Primitive>
</template>
