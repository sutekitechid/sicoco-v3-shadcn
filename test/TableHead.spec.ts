import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import TableHead from '../lib/components/table/TableHead.vue'

/** TEST CASE: check if TableHead component renders correctly and matches snapshot */
test('TableHead.vue', async () => {
  const wrapper = mount(TableHead)

  // check if component renders correctly
  expect(wrapper.html()).toMatchSnapshot()
})

/** TEST CASE: check if TableHead component renders slot content correctly */
test('TableHead.vue slot', async () => {
  const wrapper = mount(TableHead, {
    slots: {
      default: '<th>Name</th>'
    }
  })

  // check if slot content renders correctly
  expect(wrapper.text()).toContain('Name')
})