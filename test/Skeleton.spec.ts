import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import Skeleton from '../lib/components/skeleton/Skeleton.vue'

// Test case 1: Checking if the default classes are applied to the Skeleton component
test('renders the Skeleton component with default classes', () => {
	// Mount the Skeleton component
	const wrapper = mount(Skeleton)

	// Assert that the component has the default 'animate-pulse' class
	expect(wrapper.classes()).toContain('animate-pulse') // Checks if the 'animate-pulse' class is applied by default
})

// Test case 2: Checking if additional classes passed via props are applied correctly
test('applies additional classes passed via props', () => {
	// Mount the Skeleton component with a custom class ('h-8 w-32') passed as a prop
	const wrapper = mount(Skeleton, {
		props: { class: 'h-8 w-32' }, // Passing custom height and width classes
	})

	// Assert that the custom classes are applied to the component
	expect(wrapper.classes()).toContain('h-8') // Checks if the 'h-8' class is applied
	expect(wrapper.classes()).toContain('w-32') // Checks if the 'w-32' class is applied
})

// Test case 3: Snapshot test to ensure component HTML structure remains unchanged
test('snapshot test for Skeleton component', () => {
	// Mount the Skeleton component with a custom class ('h-6 w-48')
	const wrapper = mount(Skeleton, {
		props: {
			class: 'h-6 w-48', // Custom size for this test
		},
	})

	// Match the component's HTML structure against a snapshot
	expect(wrapper.html()).toMatchSnapshot() // Compares the rendered HTML to a saved snapshot to detect changes
})
