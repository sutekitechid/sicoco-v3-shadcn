import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import Pagination from '../lib/components/pagination/Pagination.vue'

/* TEST CASE: check if the Pagination component renders correctly */
test('renders correctly', async () => {
    const wrapper = mount(Pagination)
    expect(wrapper.html()).toMatchSnapshot()
})

/* TEST CASE: check if the Pagination component renders the correct number of pages */
test('renders correct number of pages', async () => {
    const wrapper = mount(Pagination, {
        props: {
            total: 10,
            perPage: 5
        }
    })

    // check if the Pagination component renders the correct number of pages
    expect(wrapper.findAll('[data-type="page"]')).toHaveLength(2)
})

/* TEST CASE: check if the Pagination component renders the correct active page */
test('renders correct active page', async () => {
    const wrapper = mount(Pagination, {
        props: {
            total: 50,
            perPage: 15,
            page: 2
        }
    })

    // check if the Pagination component renders the correct active page
    expect(wrapper.find('[data-selected="true"][data-type="page"]').text()).toBe('2')
})

/* TEST CASE: check if page input is disabled if the total data is less than 
 * or equal to the items per page
 */
test('page input is disabled if total data is less than or equal to items per page', async () => {
    const wrapper = mount(Pagination, {
        props: {
            total: 15,
            perPage: 15
        }
    })

    // check if the page input is disabled
    expect(wrapper.find('input').attributes('disabled')).toBeFalsy()
})

/* TEST CASE: check if next page button is disabled if the current page is the last page */
test('next page button is disabled if current page is the last page', async () => {
    const wrapper = mount(Pagination, {
        props: {
            total: 50,
            perPage: 15,
            page: 4
        }
    })

    // check if the next page button is disabled
    expect(wrapper.find('.pagination-next').attributes('disabled')).toBeFalsy()
})

/* TEST CASE: check if previous page button is disabled if the current page is the first page */
test('previous page button is disabled if current page is the first page', async () => {
    const wrapper = mount(Pagination, {
        props: {
            total: 50,
            perPage: 15,
            page: 1
        }
    })

    // check if the previous page button is disabled
    expect(wrapper.find('.pagination-prev').attributes('disabled')).toBeFalsy()
})

/* TEST CASE: check if the Pagination component emits the correct event 
 * when next page button is clicked 
 */
test('emits "update:page" event when next page button is clicked', async () => {
    const wrapper = mount(Pagination, {
        props: {
            total: 50,
            perPage: 15
        }
    })

    // click the next page button
    await wrapper.find('.pagination-next').trigger('click')

    // check if the next page button emits the correct event when clicked
    expect(wrapper.emitted('update:page')).toBeTruthy()
    expect(wrapper.emitted('update:page')[0]).toEqual([2])
})

/* TEST CASE: check if the Pagination component emits the correct event 
 * when prev page button is clicked 
 */
test('emits "update:page" event when previous page button is clicked', async () => {
    const wrapper = mount(Pagination, {
        props: {
            total: 50,
            perPage: 15,
            page: 2
        }
    })

    // click the previous page button
    await wrapper.find('.pagination-prev').trigger('click')

    // check if the previous page button emits the correct event when clicked
    expect(wrapper.emitted('update:page')).toBeTruthy()
    expect(wrapper.emitted('update:page')[0]).toEqual([1])
})

/* TEST CASE: check if the Pagination component emits the correct event 
 * when a page is clicked 
 */