<script setup lang="ts">
import { DrawerOverlay as RekaDrawerOverlay, type DrawerOverlayProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

interface Props extends DrawerOverlayProps {
	class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
	<RekaDrawerOverlay
		v-bind="props"
		:class="cn('fixed inset-0 z-50 bg-neutral-950/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0', props.class)"
	/>
</template>
