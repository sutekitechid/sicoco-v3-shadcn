<script setup lang="ts">
import {
	StepperDescription,
	StepperIndicator,
	StepperItem,
	Stepper,
	StepperTitle,
	StepperTrigger,
} from '@/components/stepper'

import { ref } from 'vue'

const steps = [
	{
		step: 1,
		title: 'Address',
		description: 'Add your address here',
		icon: 'reka-icons:home',
	},
	{
		step: 2,
		title: 'Shipping',
		description: 'Set your preferred shipping method',
		icon: 'reka-icons:archive',
	},
	{
		step: 3,
		title: 'Checkout',
		description: 'Confirm your order',
		icon: 'reka-icons:check',
	},
]

const step = ref(2)
</script>

<template>
	<Stepper v-model="step" data-cy="our-stepper">
		<StepperItem
			v-for="(item, index) in steps"
			:key="item.step"
			:step="item.step"
			:steps-count="steps.length"
			:data-cy="`our-stepper-item-${index + 1}`"
		>
			<template #trigger>
				<StepperTrigger :data-cy="`our-stepper-item-trigger-${index + 1}`">
					<StepperIndicator>
						{{ index + 1 }}
					</StepperIndicator>
				</StepperTrigger>
			</template>

			<template #label>
				<div
					class="top-full left-0 w-full group-data-[state=inactive]:text-neutral-950"
				>
					<StepperTitle class="text-left">
						{{ item.title }}
					</StepperTitle>
					<StepperDescription class="text-left">
						{{ item.description }}
					</StepperDescription>
				</div>
			</template>
		</StepperItem>
	</Stepper>
</template>
