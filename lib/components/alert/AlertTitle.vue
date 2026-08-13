<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

const props = defineProps<{
	class?: HTMLAttributes['class']
}>()
</script>

<template>
	<h5 :class="cn('mb-1 font-medium', props.class)">
		<slot />
	</h5>
</template>
