import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import PaginationForwardInput from '../lib/components/pagination/PaginationForwardInput.vue'
import { Input } from '../lib/components/input'
import { DEBOUNCE_DURATION } from '../lib/utils/constants'

/* TEST CASE: check if the Pagination Forward Input component is disabled */
test('is disabled', async () => {
	const wrapper = mount(PaginationForwardInput, {
		props: {
			disabled: true,
		},
	})

	// check if the Pagination Forward Input component is disabled
	expect(wrapper.find('input').attributes('disabled')).toBeFalsy()
})

/* TEST CASE: check if the Pagination Forward Input component emits the input event
 * with the correct value
 */
test('emits input event', async () => {
	const wrapper = mount(PaginationForwardInput)

	const input = wrapper.find('input')

	await input.setValue('3')

	await new Promise(resolve => setTimeout(resolve, DEBOUNCE_DURATION))

	const emittedInputEvent = wrapper.emitted('input')

	expect(emittedInputEvent).toBeDefined()
	expect(emittedInputEvent![0]).toEqual([3])
})

/* TEST CASE: check if the Pagination Forward Input component
 * emits the update:modelValue event with the correct value
 */
test('emits update:modelValue event', async () => {
	const wrapper = mount(PaginationForwardInput)

	const input = wrapper.findComponent(Input)

	await input.setValue('3')

	const emittedModelValue = input.emitted('update:modelValue')

	expect(emittedModelValue).toBeDefined()
	expect(emittedModelValue![0]).toEqual(['3'])
})
