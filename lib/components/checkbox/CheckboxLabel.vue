<template>
	<Label
		:for="props.for"
		class="text-main dark:text-neutral-500 text-left cursor-pointer text-body-md peer-disabled:opacity-100"
	>
		<slot />
	</Label>
</template>

<script setup lang="ts">
import { Label } from '../label'

const props = defineProps<{ for?: string }>()
</script>
