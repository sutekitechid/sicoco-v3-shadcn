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
		:class="cn('grid gap-1.5 p-4 text-center group-data-[swipe-direction=left]/drawer-content:px-6 group-data-[swipe-direction=left]/drawer-content:pt-10 group-data-[swipe-direction=left]/drawer-content:text-left group-data-[swipe-direction=right]/drawer-content:px-6 group-data-[swipe-direction=right]/drawer-content:pt-10 group-data-[swipe-direction=right]/drawer-content:text-left', props.class)"
	>
		<slot />
	</Primitive>
</template>
