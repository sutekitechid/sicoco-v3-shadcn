<template>
	<StepperTrigger
		class="inline-flex items-center group-data-[disabled]:text-neutral-60 group-data-[state=active]:bg-primary-100 group-data-[state=active]:text-white justify-center rounded-full text-neutral-100 w-10 h-10 shrink-0 bg-white border-neutral-30 border-1 group-data-[state=completed]:bg-primary-100 group-data-[state=completed]:text-white"
	>
		<slot />
	</StepperTrigger>
</template>

<script setup lang="ts">
import { StepperTrigger } from 'reka-ui'
</script>
