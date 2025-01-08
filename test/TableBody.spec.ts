import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import TableBody from '../lib/components/table/TableBody.vue'

/** TEST CASE: check if the Table Body component renders correctly and matches the snapshot */
test('renders correctly', async () => {
  const wrapper = mount(TableBody, {
    slots: {
      default: `
        <tr>
          <td>John Doe</td>
          <td>30</td>
        </tr>
      `,
    },
  })

  // check if the table body renders correctly
  expect(wrapper.html()).toMatchSnapshot()
})

