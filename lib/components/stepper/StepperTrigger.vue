<template>
	<StepperTrigger
		class="inline-flex items-center group-data-[disabled]:text-neutral-500 group-data-[state=active]:bg-primary-500 group-data-[state=active]:text-white dark:text-neutral-500 justify-center rounded-full text-neutral-950 dark:text-neutral-500 w-10 h-10 shrink-0 bg-white border-neutral-400 border-1 group-data-[state=completed]:bg-primary-500 group-data-[state=completed]:text-white dark:text-neutral-500"
	>
		<slot />
	</StepperTrigger>
</template>

<script setup lang="ts">
import { StepperTrigger } from 'reka-ui'
</script>
