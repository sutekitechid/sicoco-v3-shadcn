<script setup lang="ts">
import { cn } from '../../utils/tw-merge'
import { type HTMLAttributes } from 'vue'

const props = defineProps<{
	class?: HTMLAttributes['class']
}>()
</script>

<template>
	<div :class="cn(props.class)">
		<slot />
	</div>
</template>
