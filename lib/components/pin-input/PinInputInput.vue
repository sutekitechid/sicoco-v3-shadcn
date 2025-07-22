<template>
	<PinInputInput
		:index="index"
		:disabled="disabled"
		:class="cn(pinInputVariants({ disabled: props.disabled }))"
	/>
</template>

<script lang="ts">
import { PinInputInput } from 'radix-vue'
import { cn } from '../../utils/tw-merge'
import { pinInputVariants } from '.'

export default {
	components: {
		PinInputInput,
	},
	props: {
		index: {
			type: Number,
			required: true,
		},

		disabled: {
			type: Boolean,
			default: false,
		},
	},
	setup(props) {
		return {
			props,
			cn,
			pinInputVariants,
			focus,
		}
	},
}
</script>
