<template>
	<div>
		<PinInputLabel :for="props.id" :label="props.label" />
		<PinInputRoot
			:id="props.id"
			v-model="model"
			:placeholder="placeholder"
			:class="props.layoutingClass"
			@complete="handleComplete"
		>
			<PinInputInput
				v-for="(id, index) in totalPins"
				:key="id"
				:index="index"
				:class="props.inputClass"
			/>
		</PinInputRoot>
	</div>
</template>

<script lang="ts">
import { useVModel } from '@vueuse/core'
import { cn } from '../../utils/tw-merge'
import type { HTMLAttributes } from 'vue'
import PinInputLabel from './PinInputLabel.vue'
import PinInputRoot from './PinInputRoot.vue'
import PinInputInput from './PinInputInput.vue'

export default {
	components: {
		PinInputLabel,
		PinInputRoot,
		PinInputInput,
	},
	props: {
		label: {
			type: String,
			default: '',
		},
		id: {
			type: String,
			default: 'pin-input',
		},
		modelValue: {
			type: Array as () => string[],
			default: () => [],
		},
		placeholder: {
			type: String,
			default: '○',
		},
		handleComplete: {
			type: Function as unknown as new () => (e: string[]) => void,
			default: (e: string[]) => {
				// eslint-disable-next-line no-alert
				console.log('Complete', e)
			},
		},
		totalPins: {
			type: Number,
			default: 5,
		},
		inputClass: {
			type: String as () => HTMLAttributes['class'],
			default: '',
		},
		layoutingClass: {
			type: String as () => HTMLAttributes['class'],
			default: '',
		},
	},
	emits: ['complete', 'update:modelValue'],
	setup(props, { emit }) {
		const model = useVModel(props, 'modelValue', emit)

		return {
			props,
			model,
			cn,
		}
	},
}
</script>
