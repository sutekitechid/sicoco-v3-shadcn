import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import Stepper from '../lib/components/stepper/Stepper.vue'
import StepperItem from '../lib/components/stepper/StepperItem.vue'
import StepperTitle from '../lib/components/stepper/StepperTitle.vue'

// Test case: check if the Stepper component renders the stepper with default props
test('renders the stepper with default props', () => {
	const wrapper = mount(Stepper)
	expect(wrapper.exists()).toBe(true)
	expect(wrapper.props('modelValue')).toBe(1)
	expect(wrapper.props('defaultValue')).toBe(1)
	expect(wrapper.props('linear')).toBe(true)
})

// Test case: check if the Stepper component emits the correct event when the step changes
test('emits "update:modelValue" when the step changes', async () => {
	const wrapper = mount(Stepper, {
		props: {
			modelValue: 1,
		},
	})

	wrapper.vm.$emit('update:modelValue', 2)
	await wrapper.vm.$nextTick()

	expect(wrapper.emitted('update:modelValue')).toBeTruthy()
	expect(wrapper.emitted('update:modelValue')![0]).toEqual([2])
})

// Test case: check if the Stepper component renders slot content correctly
test('renders slots correctly', () => {
	const wrapper = mount(Stepper, {
		slots: {
			default: `
                <StepperItem :step="1" :stepsCount="3">
                    <template #label>
                        <StepperTitle>Step content</StepperTitle>
                    </template>
                </StepperItem>`,
		},
		global: {
			components: { StepperItem, StepperTitle },
		},
	})

	expect(wrapper.html()).toContain('Step content')
})
