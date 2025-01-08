import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import TableEmpty from '../lib/components/table/TableEmpty.vue'

/** TEST CASE: check if the TableEmpty component renders correctly */
test('renders correctly', async () => {
	const wrapper = mount(TableEmpty, {
		slots: {
			default: 'Tidak ada data',
		},
	})

	// check if the table renders correctly
	expect(wrapper.html()).toMatchSnapshot()
})

/** TEST CASE: check if the TableEmpty component accepts custom class */
test('accepts class', async () => {
	const wrapper = mount(TableEmpty, {
		props: {
			class: 'text-center',
		},
	})

	// check if the table has the correct class
	expect(wrapper.html()).toContain('text-center')
})

/** TEST CASE: check if the TableEmpty component renders slot content */
test('renders slot content', async () => {
	const wrapper = mount(TableEmpty, {
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
	expect(wrapper.html()).toContain('Tidak ada data Mulyono')

	// check if the table has the correct button in slot content
	console.log(wrapper.find('button'))
	expect(wrapper.find('button').html()).toContain('Reset Pencarian')
})
