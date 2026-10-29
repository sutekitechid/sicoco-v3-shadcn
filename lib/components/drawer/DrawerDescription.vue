<script setup lang="ts">
import { DrawerDescription as RekaDrawerDescription, type DrawerDescriptionProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

interface Props extends DrawerDescriptionProps {
	class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
	<RekaDrawerDescription
		v-bind="props"
		:class="cn('text-body-md text-secondary', props.class)"
	>
		<slot />
	</RekaDrawerDescription>
</template>
