import { mount } from '@vue/test-utils'
import { test, expect, vi, describe } from 'vitest'
import { defineComponent, ref, nextTick, h } from 'vue'
import DropdownItem from '../lib/components/dropdown/DropdownItem.vue'
import { Checkbox } from '../lib/components/checkbox'

test('should render class', () => {
	const wrapper = mount(DropdownItem, {
		props: {
			value: 'option1',
			class: 'test-class',
		},
	})

	expect(wrapper.exists()).toBe(true)
	expect(wrapper.classes()).toContain('test-class')
})

test('should render data-dropdown-item attribute correctly object', () => {
	const wrapper = mount(DropdownItem, {
		props: {
			value: {
				label: 'Search',
				value: 'option1',
				icons: 'si-search',
			},
			disabled: false,
		},
	})

	expect(wrapper.exists()).toBe(true)

	expect(wrapper.attributes('data-dropdown-item')).toBe(
		JSON.stringify({
			label: 'Search',
			value: 'option1',
			icons: 'si-search',
		})
	)
})
test('should render data-dropdown-item attribute correctly string', () => {
	const wrapper = mount(DropdownItem, {
		props: {
			value: 'option1',
			disabled: false,
		},
	})

	expect(wrapper.exists()).toBe(true)

	expect(wrapper.attributes('data-dropdown-item')).toBe(
		JSON.stringify('option1')
	)
})

test('should apply class disabled when disabled is true', async () => {
	const wrapper = mount(DropdownItem, {
		props: {
			value: 'option1',
			disabled: true,
		},
	})

	expect(wrapper.exists()).toBe(true)

	expect(wrapper.classes()).toContain('text-grey-90')
	expect(wrapper.classes()).toContain('bg-grey-10')
	expect(wrapper.classes()).toContain('cursor-not-allowed')
})

test('should render content from default slot', () => {
	const wrapper = mount(DropdownItem, {
		props: {
			value: 'option1',
		},
		slots: {
			default: 'Item 1',
		},
	})

	// Pastikan komponen ter-render dengan benar
	expect(wrapper.exists()).toBe(true)

	// Periksa apakah teks "Item 1" ditampilkan dalam komponen
	expect(wrapper.text()).toContain('Item 1')
})

//TODO: belum bisa ngetest yang berhubungan dengan parent component
// test('should emit on-select event when clicked', async () => {
// 	const onSelectOptionMock = vi.fn() // Mock untuk onSelectOption
// 	const setSelectedElementMock = vi.fn() // Mock untuk setSelectedElement

// 	// Mock Parent Component dengan exposed methods
// 	const Parent = defineComponent({
// 		setup() {
// 			const exposed = {
// 				onSelectOption: onSelectOptionMock,
// 				setSelectedElement: setSelectedElementMock,
// 				isOptionSelected: vi.fn().mockReturnValue(false),
// 				multipleSelect: ref(false), // Simulasi multiple select
// 			}
// 			return { exposed }
// 		},
// 		provide() {
// 			return {
// 				exposed: this.exposed, // Provide exposed untuk komponen anak
// 			}
// 		},
// 		render() {
// 			return h(DropdownItem, {
// 				value: 'option1', // Value yang dikirim ke DropdownItem
// 				disabled: false, // Non-disabled agar bisa diklik
// 			})
// 		},
// 	})

// 	// Mount Parent
// 	const wrapper = mount(Parent)

// 	// Cari elemen berdasarkan ref="dropdownItem" dan trigger klik
// 	const dropdownItem = wrapper.find('[data-dropdown-item]') // Cari berdasarkan atribut
// 	console.log(dropdownItem.exists()) // Log hasil pencarian elemen
// 	expect(dropdownItem.exists()).toBe(true) // Pastikan elemen ditemukan
// 	await dropdownItem.trigger('click') // Trigger klik pada elemen

// 	console.log('Calling onSelectOptionMock') // Log sebelum pengecekan
// 	// Pastikan onSelectOption dipanggil dengan parameter yang benar
// 	expect(onSelectOptionMock).toHaveBeenCalledWith('option1')

// 	console.log('Calling setSelectedElementMock') // Log sebelum pengecekan
// 	// Pastikan setSelectedElement juga dipanggil
// 	expect(setSelectedElementMock).toHaveBeenCalled()
// })
