<script setup lang="ts">
import { cn } from '../../utils/tw-merge'
import { useSlots, type HTMLAttributes } from 'vue'
import { EMPTY_DATA_MESSAGE_TEXT } from './constants'

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes['class']
		icon?: string
		message?: string
	}>(),
	{
		icon: 'search',
		message: EMPTY_DATA_MESSAGE_TEXT,
	}
)
</script>

<template>
	<div :class="cn(props.class)">
		<slot />
		{{ props.message }}
	</div>
</template>
