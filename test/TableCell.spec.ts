import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import TableCell from '../lib/components/table/TableCell.vue'

/** TEST CASE: check if the table cell renders correctly and matches the snapshot */
test('renders correctly', async () => {
  const wrapper = mount(TableCell)

  // check if the table cell renders correctly
  expect(wrapper.html()).toMatchSnapshot()
})

/** TEST CASE: check if the table cell accepts custom class */
test('accepts class', async () => {
  const wrapper = mount(TableCell, {
    props: {
      class: 'text-center',
    },
  })

  // check if the table cell has the correct class
  expect(wrapper.classes()).toContain('text-center')
})

/** TEST CASE: check if the table cell renders value correctly */
test('renders correctly', async () => {
  const wrapper = mount(TableCell, {
    props: {
      value: 'foo foo',
    },
  })

  // check if the table cell renders correctly
  expect(wrapper.text()).toContain('foo foo')
})

/** TEST CASE: check if the table cell renders slot content correctly */
test('renders correctly with slot content', async () => {
  const wrapper = mount(TableCell, {
    slots: {
      default: '<div>fa fa</div>',
    },
  })

  // check if the table cell renders correctly
  expect(wrapper.text()).toContain('fa fa')
})
