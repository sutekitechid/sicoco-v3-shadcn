<template>
	<Label
		:for="props.for"
		class="text-black text-left peer-disabled:text-grey-50"
	>
		<slot />
	</Label>
</template>

<script setup lang="ts">
import { Label } from '../label'

const props = defineProps<{ for?: string }>()
</script>
