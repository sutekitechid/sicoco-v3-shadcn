<template>
	<PinInputRoot
		:id="id"
		v-model="model"
		:placeholder="placeholder"
		:class="cn('flex gap-2 items-center mt-1')"
		:type="type"
		@complete="onComplete"
	>
		<slot />
	</PinInputRoot>
</template>

<script lang="ts">
import { PinInputRoot } from 'radix-vue'
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
		type: {
			type: String as () => 'number' | 'text',
			default: 'text',
		},
	},
	emits: ['complete'],
	setup(props, { emit }) {
		function onComplete(e: string[]) {
			emit('complete', e)
		}
		const model = useVModel(props, 'modelValue', emit)

		return {
			props,
			onComplete,
			model,
			cn,
		}
	},
}
</script>
