import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import PaginationPrev from '../lib/components/pagination/PaginationPrev.vue'

/* TEST CASE: check if the Pagination Prev component renders correctly */
test('renders correctly', async () => {
    const wrapper = mount(PaginationPrev)
    expect(wrapper.html()).toMatchSnapshot()
})

/* TEST CASE: check if the Pagination Prev component is disabled */
test('is disabled', async () => {
    const wrapper = mount(PaginationPrev, {
        props: {
            disabled: true
        }
    })

    // check if the Pagination Prev component is disabled
    expect(wrapper.find('button').attributes('disabled')).toBe('')
})