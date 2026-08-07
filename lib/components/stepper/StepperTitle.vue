<template>
	<StepperTitle :class="cn(baseClass, props.class)">
		<slot />
	</StepperTitle>
</template>

<script setup lang="ts">
import { StepperTitle } from 'reka-ui'

import { cn } from '../../utils/tw-merge'

const props = defineProps<{
	class?: string
}>()

const baseClass = 'text-xs text-neutral-500'
</script>
