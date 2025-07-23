<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

const props = defineProps<{
	class?: HTMLAttributes['class']
}>()
</script>

<template>
	<tfoot :class="cn('bg-white', props.class)">
		<slot />
	</tfoot>
</template>
