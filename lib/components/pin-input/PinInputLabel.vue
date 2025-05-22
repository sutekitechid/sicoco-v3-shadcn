<template>
	<Label :for="props.for" :class="computedClass">
		{{ label }}
	</Label>
</template>

<script lang="ts">
import { Label } from 'radix-vue'
import { cn } from '../../utils/tw-merge'
import { type HTMLAttributes, computed } from 'vue'

export default {
	components: {
		Label,
	},
	props: {
		for: {
			type: String,
			required: true,
		},
		label: {
			type: String,
			required: true,
		},
		class: {
			type: String as () => HTMLAttributes['class'],
			default: '',
		},
	},
	setup(props) {
		const computedClass = computed(() => {
			return cn('text-neutral-50', props.class)
		})

		return {
			props,
			cn,
			computedClass,
		}
	},
}
</script>
