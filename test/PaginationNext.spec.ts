import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import PaginationNext from '../lib/components/pagination/PaginationNext.vue'

/* TEST CASE: check if the Pagination Next component renders correctly */
test('renders correctly', async () => {
    const wrapper = mount(PaginationNext)
    expect(wrapper.html()).toMatchSnapshot()
})

/* TEST CASE: check if the Pagination Next component is disabled */
test('is disabled', async () => {
    const wrapper = mount(PaginationNext, {
        props: {
            disabled: true
        }
    })

    // check if the Pagination Next component is disabled
    expect(wrapper.find('button').attributes('disabled')).toBeFalsy()
})