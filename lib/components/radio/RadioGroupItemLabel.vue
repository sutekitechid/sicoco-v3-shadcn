<template>
	<Label
		:for="props.for"
		:class="radioGroupItemLabelVariant({ disabled: props.disabled })"
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
import { radioGroupItemLabelVariant } from '.'

const props = defineProps<{ for?: string; disabled?: boolean }>()
</script>
