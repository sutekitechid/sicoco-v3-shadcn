<script setup lang="ts">
import { DrawerClose as RekaDrawerClose, type DrawerCloseProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import Button from '../button/Button.vue'

interface Props extends DrawerCloseProps {
	class?: HTMLAttributes['class']
	ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
	ariaLabel: 'Close drawer',
})
</script>

<template>
	<RekaDrawerClose as-child>
		<Button
			:class="cn('absolute right-4 top-4', props.class)"
			variant="tertiary-primary"
			size="sm"
			icon-left="si-heroicon-solid-x-mark"
			:aria-label="ariaLabel"
		>
			<slot />
		</Button>
	</RekaDrawerClose>
</template>
