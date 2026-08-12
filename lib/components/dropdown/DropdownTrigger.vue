<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { PopoverTrigger, type PopoverTriggerProps } from 'reka-ui'
import { cn } from '../../utils/tw-merge'

interface Props extends PopoverTriggerProps {
	class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
	as: 'div',
})
</script>

<template>
	<PopoverTrigger
		v-bind="props"
		:class="cn('block w-full min-w-0', props.class)"
	>
		<slot />
	</PopoverTrigger>
</template>
