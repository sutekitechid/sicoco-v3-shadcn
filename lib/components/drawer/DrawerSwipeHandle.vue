<script setup lang="ts">
import { DrawerHandle as RekaDrawerHandle, type DrawerHandleProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

interface Props extends DrawerHandleProps {
	class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
	<RekaDrawerHandle
		v-bind="props"
		data-slot="drawer-swipe-handle"
		:class="cn('mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-neutral-400', props.class)"
	>
		<slot />
	</RekaDrawerHandle>
</template>
