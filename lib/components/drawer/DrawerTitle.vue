<script setup lang="ts">
import { DrawerTitle as RekaDrawerTitle, type DrawerTitleProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

interface Props extends DrawerTitleProps {
	class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
	<RekaDrawerTitle v-bind="props" :class="cn('text-title-lg font-semibold text-main', props.class)">
		<slot />
	</RekaDrawerTitle>
</template>
