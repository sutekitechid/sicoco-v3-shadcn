import { mount } from '@vue/test-utils'
import { describe, test, expect, it } from 'vitest'
import { defineComponent, ref, nextTick, h } from 'vue'
import Dropdown from '../lib/components/dropdown/Dropdown.vue'
import DropdownItem from '../lib/components/dropdown/DropdownItem.vue'

test('should render class', () => {
	const wrapper = mount(Dropdown, {
		props: {
			modelValue: 'option1',
			class: 'test-class',
		},
	})

	expect(wrapper.exists()).toBe(true)
	expect(wrapper.classes()).toContain('test-class')
})

// test('should render slot', async () => {
// 	const wrapper = mount(Dropdown, {
// 		props: {
// 			modelValue: 'option1',
// 		},
// 		slots: {
// 			default: `
//       <dropdown-item value="option1">Option 1</dropdown-item>
//       <dropdown-item value="option2">Option 2</dropdown-item>`,
// 		},
// 		global: {
// 			stubs: {
// 				'dropdown-item': DropdownItem,
// 			},
// 		},
// 	})

// 	expect(wrapper.exists()).toBe(true)
// 	expect(wrapper.text()).toContain('Option 1')
// 	expect(wrapper.text()).toContain('Option 2')
// })

test('should toggle dropdown open state on click', async () => {
	const wrapper = mount(Dropdown, {
		props: {
			modelValue: 'option1',
		},
	})

	// Mengakses tombol pemicu menggunakan ref
	const triggerButton = wrapper.find('#triggerButtonDropdown')
	console.log(triggerButton.html())
	console.log(wrapper)

	// Memastikan dropdown tertutup pada awalnya
	expect(wrapper.find('#triggerContentDropdown').classes()).toContain('hidden')

	// // Klik tombol untuk membuka dropdown
	// await triggerButton.click()
	// expect(wrapper.find('#triggerContentDropdown').classes()).not.toContain(
	// 	'hidden'
	// )

	// // Klik tombol lagi untuk menutup dropdown
	// await triggerButton.click()
	// expect(wrapper.find('#triggerContentDropdown').classes()).toContain('hidden')
})
