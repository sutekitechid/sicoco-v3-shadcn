<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { cn } from '../../utils/tw-merge'
import { spinnerVariants, type SpinnerVariants } from '.'

interface Props extends PrimitiveProps {
	size?: SpinnerVariants['size']
	label?: string
	class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
	as: 'span',
	size: 'md',
	label: 'Memuat',
})
</script>

<template>
	<Primitive :as="as" role="status" :class="cn(spinnerVariants({ size }), props.class)">
		<svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
			<circle cx="20" cy="20" r="17" class="stroke-neutral-200" stroke-width="3" />
			<circle
				cx="20"
				cy="20"
				r="17"
				class="stroke-current"
				stroke-width="3"
				stroke-linecap="round"
				stroke-dasharray="80 27"
			/>
		</svg>
		<span class="sr-only">{{ label }}</span>
	</Primitive>
</template>
