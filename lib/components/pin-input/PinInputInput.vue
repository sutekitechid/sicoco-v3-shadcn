<template>
	<PinInputInput :index="index" :class="computedClass" />
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
	},
	setup(props) {
		const computedClass = computed(() => {
			return cn(
				'w-10 h-10 bg-white rounded text-center shadow-lg text-primary-100 placeholder:text-neutral-30 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-white',
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
