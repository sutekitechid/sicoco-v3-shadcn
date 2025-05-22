<template>
	<PinInputInput :index="index" :class="computedClass" :disabled="disabled" />
</template>

<script lang="ts">
import { PinInputInput } from 'radix-vue'
import { cn } from '../../utils/tw-merge'
import { computed, type HTMLAttributes } from 'vue'

export default {
	components: {
		PinInputInput,
	},
	props: {
		index: {
			type: Number,
			required: true,
		},
		class: {
			type: String as () => HTMLAttributes['class'],
			default: '',
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	setup(props) {
		const computedClass = computed(() => {
			return cn(
				'w-10 h-10 bg-white rounded text-center shadow-lg text-neutral-100 dark:bg-neutral-10 ring-offset-neutral-10 placeholder:text-neutral-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-50/40 focus-visible:ring-offset-0 focus-visible:border-primary-100/60 disabled:cursor-not-allowed disabled:opacity-50',
				props.class
			)
		})

		return {
			props,
			cn,
			computedClass,
		}
	},
}
</script>
