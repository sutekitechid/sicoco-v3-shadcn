import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import PaginationForwardInput from '../lib/components/pagination/PaginationForwardInput.vue'

/* TEST CASE: check if the Pagination Forward Input component renders correctly */
test('renders correctly', async () => {
    const wrapper = mount(PaginationForwardInput)
    expect(wrapper.html()).toMatchSnapshot()
})

/* TEST CASE: check if the Pagination Forward Input component is disabled */
test('is disabled', async () => {
    const wrapper = mount(PaginationForwardInput, {
        props: {
            disabled: true
        }
    })

    // check if the Pagination Forward Input component is disabled
    expect(wrapper.find('input').attributes('disabled')).toBe('')
})

/* TEST CASE: check if the Pagination Forward Input component emits the input event 
 * with the correct value
 */
test('emits input event', async () => {
    const wrapper = mount(PaginationForwardInput)
    await wrapper.find('input').setValue('3')
    expect(wrapper.emitted('input')[0]).toEqual(['3'])
})

/* TEST CASE: check if the Pagination Forward Input component 
 * emits the update:modelValue event with the correct value
 */
test('emits update:modelValue event', async () => {
    const wrapper = mount(PaginationForwardInput)
    await wrapper.find('input').setValue('3')
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['3'])
})