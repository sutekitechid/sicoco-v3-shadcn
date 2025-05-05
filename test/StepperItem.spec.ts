import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import StepperItem from '../lib/components/stepper/StepperItem.vue'
import StepperTitle from '../lib/components/stepper/StepperTitle.vue'
import Stepper from '../lib/components/stepper/Stepper.vue'

// Test case: check if the Stepper component renders the stepper with required props
test('renders the stepper item with required props', () => {
	const wrapper = mount(Stepper, {
		slots: {
			default: `<StepperItem :step="1" :stepsCount="3" />`,
		},
		global: {
			components: { StepperItem },
		},
	})

	const stepperItem = wrapper.findComponent(StepperItem)
	expect(stepperItem.exists()).toBe(true)
	expect(stepperItem.props('step')).toBe(1)
	expect(stepperItem.props('stepsCount')).toBe(3)
})

// Test case: check if the Stepper component applies the correct styles based on stepsCount
test('applies the correct styles based on stepsCount', () => {
	const wrapper = mount(Stepper, {
		slots: {
			default: `<StepperItem :step="1" :stepsCount="4" />`,
		},
		global: {
			components: { StepperItem },
		},
	})

	const stepperItem = wrapper.findComponent(StepperItem)
	const stepperItemStyle = stepperItem.vm.stepperItemStyle
	expect(stepperItemStyle.width).toBe('25%')
})

// Test case: check if the Stepper component renders slots correctly
test('renders slots correctly', () => {
	const wrapper = mount(Stepper, {
		slots: {
			default: `
                <StepperItem :step="1" :stepsCount="3">
                    <template #label>
                        <StepperTitle>Step Item Content</StepperTitle>
                    </template>
                </StepperItem>
            `,
		},
		global: {
			components: { StepperItem, StepperTitle },
		},
	})

	expect(wrapper.html()).toContain('Step Item Content')
})
