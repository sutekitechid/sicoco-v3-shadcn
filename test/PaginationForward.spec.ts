import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import PaginationForward from '../lib/components/pagination/PaginationForward.vue'

/* TEST CASE: check if the Pagination Forward component renders correctly */
test('renders correctly', async () => {
    const wrapper = mount(PaginationForward)
    expect(wrapper.html()).toMatchSnapshot()
})

/* TEST CASE: check if the Pagination Forward component emits the input event 
 * with the correct value when the button is clicked 
 */
test('emits input event', async () => {
    const wrapper = mount(PaginationForward)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('input')
})

/* TEST CASE: check if the Pagination Forward component emits the update:model-value event 
 * with the correct value 
 */
test('emits update:modelValue event', async () => {
    const wrapper = mount(PaginationForward)
    await wrapper.find('input').setValue('3')
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['3'])
})

/* TEST CASE: check if the Pagination Forward component is disabled */
test('is disabled', async () => {
    const wrapper = mount(PaginationForward, {
        props: {
            disabled: true
        }
    })

    // check if the Pagination Forward component is disabled
    expect(wrapper.find('button').attributes('disabled')).toBe('')
    // check if the Pagination Forward component is disabled
    expect(wrapper.find('input').attributes('disabled')).toBe('')
})