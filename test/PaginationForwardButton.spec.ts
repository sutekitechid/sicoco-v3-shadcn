import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import PaginationForwardButton from '../lib/components/pagination/PaginationForwardButton.vue'

/* TEST CASE: check if the Pagination Forward Button component renders correctly */
test('renders correctly', async () => {
    const wrapper = mount(PaginationForwardButton)
    expect(wrapper.html()).toMatchSnapshot()
})

/* TEST CASE: check if the Pagination Forward Button component is disabled */
test('is disabled', async () => {
    const wrapper = mount(PaginationForwardButton, {
        props: {
            disabled: true
        }
    })

    // check if the Pagination Forward Button component is disabled
    expect(wrapper.find('button').attributes('disabled')).toBe('')
})