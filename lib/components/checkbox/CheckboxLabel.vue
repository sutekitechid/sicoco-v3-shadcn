<template>
	<Label
		:for="props.for"
		class="text-neutral-950 dark:text-neutral-500 text-left peer-disabled:text-neutral-500 cursor-pointer"
	>
		<slot />
	</Label>
</template>

<script setup lang="ts">
import { Label } from '../label'

const props = defineProps<{ for?: string }>()
</script>
