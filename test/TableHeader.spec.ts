import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import TableHeader from '../lib/components/table/TableHeader.vue'

/** TEST CASE: check if the Table Header component renders correctly and matches the snapshot */
test('renders correctly', async () => {
  const wrapper = mount(TableHeader)

  // check if the table header renders correctly
  expect(wrapper.html()).toMatchSnapshot()
})

/** TEST CASE: check if the Table Header component accepts custom class */
test('accepts class', async () => {
  const wrapper = mount(TableHeader, {
    props: {
      class: 'bg-grey-30',
    },
  })

  // check if the table header has the correct class
  expect(wrapper.classes()).toContain('bg-grey-30')
})

/** TEST CASE: check if the Table Header component renders slot content correctly */
test('renders correctly with slot content', async () => {
  const wrapper = mount(TableHeader, {
    slots: {
      default: '<div>fa fa</div>',
    },
  })

  // check if the table header renders correctly
  expect(wrapper.text()).toContain('fa fa')
})
