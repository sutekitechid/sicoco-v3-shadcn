import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import TableRow from '../lib/components/table/TableRow.vue'

/** TEST CASE: check if the TableRow component renders correctly and matches the snapshot */
test('renders correctly', async () => {
  const wrapper = mount(TableRow)

  // check if the table row renders correctly
  expect(wrapper.html()).toMatchSnapshot()
})

/** TEST CASE: check if the TableRow component accepts custom class */
test('accepts class', async () => {
  const wrapper = mount(TableRow, {
    props: {
      class: 'bg-grey-30',
    },
  })

  // check if the table row has the correct class
  expect(wrapper.classes()).toContain('bg-grey-30')
})

/** TEST CASE: check if the TableRow component renders slot content correctly */
test('renders correctly with slot content', async () => {
  const wrapper = mount(TableRow, {
    slots: {
      default: '<td>foo foo</td>',
    },
  })

  // check if the table row renders correctly
  expect(wrapper.text()).toContain('foo foo')
})