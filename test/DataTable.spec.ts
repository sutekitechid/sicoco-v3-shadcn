import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import DataTable from '../lib/components/data-table/DataTable.vue'

const columns = [
  {
    field: 'name',
    header: 'Name',
  },
  {
    field: 'age',
    header: 'Age',
  },
]

const data = [
  { name: 'John Doe', age: 30 },
  { name: 'Jane Doe', age: 25 },
]

/** TEST CASE: check if the DataTable component renders correctly */
test('renders correctly', async () => {
  const wrapper = mount(DataTable, {
    props: {
      columns,
      data,
    },
  })

  // check if the table renders correctly
  expect(wrapper.html()).toMatchSnapshot()
})

/** TEST CASE: check if the DataTable component renders the correct number of rows */
test('renders correct number of rows', async () => {
  const wrapper = mount(DataTable, {
    props: {
      columns,
      data,
    },
  })

  // check if the table has the correct number of rows
  expect(wrapper.findAll('tr')).toHaveLength(data.length + 1) // +1 for the header row
})

/** TEST CASE: check if the DataTable component renders the correct number of columns */
test('renders correct number of columns', async () => {
  const wrapper = mount(DataTable, {
    props: {
      columns,
      data,
    },
  })

  // check if the table has the correct number of columns
  expect(wrapper.findAll('th')).toHaveLength(columns.length)
})

/** TEST CASE: check if the DataTable component renders the correct data */
test('renders correct data', async () => {
  const wrapper = mount(DataTable, {
    props: {
      columns,
      data,
    },
  })

  // check if the table renders the correct data
  const rows = wrapper.findAll('tbody tr')
  rows.forEach((row, index) => {
    const cells = row.findAll('td')
    expect(cells[0].text()).toBe(data[index].name)
    expect(cells[1].text()).toBe(data[index].age.toString())
  })
})

/** TEST CASE: check if the DataTable component renders "No results" when data is empty */
test('renders "No results" when data is empty', async () => {
  const wrapper = mount(DataTable, {
    props: {
      columns,
      data: [],
    },
  })

  // check if the table renders "No results" message
  expect(wrapper.find('tbody tr td').text()).toBe('No results.')
})