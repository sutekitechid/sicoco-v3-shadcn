import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import ItemsPerPage from '../lib/components/pagination/ItemsPerPage.vue'

/* TEST CASE: check if the ItemsPerPage component renders correctly */
test('renders correctly', async () => {
    const wrapper = mount(ItemsPerPage)
    expect(wrapper.text()).toContain('Tampilkan')
    expect(wrapper.text()).toContain('20 per halaman')
    expect(wrapper.text()).toContain('Total data :')
})

/* TEST CASE: check if the ItemsPerPage renders text "Tampilkan" */
test('renders "Tampilkan"', async () => {
    const wrapper = mount(ItemsPerPage)
    expect(wrapper.text()).toContain('Tampilkan')
})

/* TEST CASE: check if the ItemsPerPage component renders text "Total data" 
 * and total data number 
 */
test('renders "Total data"', async () => {
    const wrapper = mount(ItemsPerPage, {
        props: {
            total: 15
        }
    })
  
    // check if the ItemsPerPage renders text "Total data"
    expect(wrapper.text()).toContain('Total data :')
    // check if the ItemsPerPage renders total data number
    expect(wrapper.text()).toContain('15')
})

/* TEST CASE: check if the ItemsPerPage renders dropdown */
test('renders dropdown', async () => {
    const wrapper = mount(ItemsPerPage)
    expect(wrapper.find('#triggerButtonDropdown')).toBeTruthy()
})

/* TEST CASE: check if the ItemsPerPage component has the correct number of options */
test('renders correct number of options', async () => {
    const wrapper = mount(ItemsPerPage, {
        props: {
            options: [10, 20, 50, 100, 200],
        },
    })
    expect(wrapper.findAll('[data-dropdown-item]')).toHaveLength(5)
})

/* TEST CASE: check if the ItemsPerPage component has the correct default value */
test('renders correct default value', async () => {
    const wrapper = mount(ItemsPerPage)
    setTimeout(function () {
        expect(wrapper.find('#triggerButtonDropdown').text()).toContain('10 per halaman')
    }, 200)
})

/* TEST CASE: check if the ItemsPerPage component emits the event update:modelValue 
 * when the value changes 
 */
test('emits "update:model-value" event when value changes', async () => {
    const wrapper = mount(ItemsPerPage, {
        props: {
            modelValue: 10,
        },
    })
  
    /* change the value of the dropdown element */
    const dropdownTrigger = wrapper.find('#triggerButtonDropdown')
    await dropdownTrigger.trigger('click')
    const dropdownItem = wrapper.find('[data-dropdown-item="20"]')
    await dropdownItem.trigger('click')

    setTimeout(function () {
        // check if the ItemsPerPage emits the correct event when the value changes
        expect(wrapper.emitted('update:model-value')).toBeTruthy()
        expect(wrapper.emitted('update:model-value')[0]).toEqual([20])
    }, 200)
})

/* TEST CASE: check if the options that are exceeding the total data are disabled */
test('disables options that exceed total data', async () => {
    const wrapper = mount(ItemsPerPage, {
      props: {
        total: 15,
      },
    })
  
    /* check if the options that are exceeding the total data are disabled 
     * by clicking the dropdown item 
     */
    const dropdownTrigger = wrapper.find('#triggerButtonDropdown')
    await dropdownTrigger.trigger('click')
    const dropdownItem = wrapper.find('[data-dropdown-item="50"]')
    await dropdownItem.trigger('click')

    setTimeout(function () {
        /* check if the options that are exceeding the total data are disabled 
         * by checking the text of the dropdown trigger remains the same 
         */
        expect(dropdownTrigger.text()).toContain('20 per halaman') 
    }, 200)
})

/* TEST CASE: check if the options that are not exceeding the total data are enabled */
test('enables options that do not exceed total data', async () => {
    const wrapper = mount(ItemsPerPage, {
      props: {
        total: 15,
      },
    })
  
    /* check if the options that are exceeding the total data are disabled 
     * by clicking the dropdown item 
     */
    const dropdownTrigger = wrapper.find('#triggerButtonDropdown')
    await dropdownTrigger.trigger('click')
    const dropdownItem = wrapper.find('[data-dropdown-item="10"]')
    await dropdownItem.trigger('click')

    setTimeout(function () {
        /* check if the options that are exceeding the total data are disabled 
         * by checking the text of the dropdown trigger remains the same 
         */
        expect(dropdownTrigger.text()).toContain('10 per halaman') 
    }, 200)
})