import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import EmptyDataMessage from '../lib/components/empty-data-message/EmptyDataMessage.vue'
import { EMPTY_DATA_MESSAGE_TEXT } from '../lib/components/empty-data-message'

/** TEST CASE: check if the EmptyDataMessage component renders correctly */
test('renders correctly', async () => {
	const wrapper = mount(EmptyDataMessage, {
		slots: {
			default: ' Tidak ada data',
		},
	})

	// check if the table renders correctly
	expect(wrapper.html()).toMatchSnapshot()
})

/** TEST CASE: check if the EmptyDataMessage component accepts custom class */
test('accepts class', async () => {
	const wrapper = mount(EmptyDataMessage, {
		props: {
			class: 'text-center',
		},
	})

	// check if the table has the correct class
	expect(wrapper.html()).toContain('text-center')
})

/** TEST CASE: check if the EmptyDataMessage component renders the custom icon */
test('renders custom icon', async () => {
	const icon = 'si mdi-alert'
	const wrapper = mount(EmptyDataMessage, {
		props: {
			icon,
		},
	})

	// check if the table has the correct icon
	expect(wrapper.html()).toContain(icon)
})

/** TEST CASE: check if the EmptyDataMessage component renders slot content */
test('renders slot content', async () => {
	const wrapper = mount(EmptyDataMessage, {
		slots: {
			default: `
        <div>
          <p>Tidak ada data Mulyono</p>
          <div>
            <p>
              Pencarian “Mulyono” tidak ditemukan pada tabel ini. 
              Silahkan cari nama lain atau buat data baru.
            </p>
          </div>
        </div>
        <div>
          <button>Reset Pencarian</button>
          <button>Tambah Data</button>
        </div>
      `,
		},
	})

	// check if the table has the correct text in slot content
	expect(wrapper.text()).toContain('Tidak ada data Mulyono')

	// check if the table has the correct button in slot content
	expect(wrapper.find('button').html()).toContain('Reset Pencarian')
})
