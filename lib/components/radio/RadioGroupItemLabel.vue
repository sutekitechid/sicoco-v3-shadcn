<template>
	<Label
		:for="props.for"
		class="text-neutral-100 text-left peer-disabled:text-neutral-50 cursor-pointer"
	>
		<slot />
	</Label>
</template>

<script setup lang="ts">
/**
 * Radio group item label component
 *
 * @slot - Default slot for the label
 *
 * @props for - The for attribute of the label
 */
import { Label } from '../label'

const props = defineProps<{ for?: string }>()
</script>
