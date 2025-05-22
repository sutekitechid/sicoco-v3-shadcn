<template>
	<PinInputRoot
		v-model="computedValue"
		:id="id"
		:placeholder="placeholder"
		:class="computedClass"
		@complete="onComplete"
	>
		<slot />
	</PinInputRoot>
</template>

<script lang="ts">
import { PinInputRoot } from 'radix-vue'
import { type HTMLAttributes, computed } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '../../utils/tw-merge'

export default {
	components: {
		PinInputRoot,
	},
	props: {
		id: {
			type: String,
			required: true,
		},
		modelValue: {
			type: Array as () => string[],
			required: true,
		},
		placeholder: {
			type: String,
			default: '○',
		},
		class: {
			type: String as () => HTMLAttributes['class'],
			default: '',
		},
	},
	emits: ['complete', 'update:modelValue'],
	setup(props, { emit }) {
		function onComplete(e: string[]) {
			emit('complete', e)
		}
		const computedValue = useVModel(props, 'modelValue', emit)

		const computedClass = computed(() => {
			return cn('flex gap-2 items-center mt-1', props.class)
		})

		return {
			props,
			onComplete,
			computedValue,
			computedClass,
		}
	},
}
</script>
