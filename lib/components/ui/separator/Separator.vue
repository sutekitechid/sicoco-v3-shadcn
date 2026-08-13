<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/tw-merge'

const separatorVariants = cva('shrink-0 bg-border', {
	variants: {
		orientation: {
			horizontal: 'h-px w-full',
			vertical: 'h-full w-px',
		},
	},
	defaultVariants: {
		orientation: 'horizontal',
	},
})

type SeparatorVariants = VariantProps<typeof separatorVariants>

const props = withDefaults(
	defineProps<{
		orientation?: SeparatorVariants['orientation']
		class?: string | Record<string, boolean>
	}>(),
	{
		orientation: 'horizontal',
	},
)
</script>

<template>
	<div
		role="separator"
		:orientation="orientation"
		:class="cn(separatorVariants({ orientation }), props.class)"
	/>
</template>
