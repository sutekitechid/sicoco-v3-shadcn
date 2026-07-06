import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import RichEditorAlignment from '../lib/components/rich-editor/toolbar/RichEditorAlignment.vue'

const stubQuill = {
	getModule: () => ({}),
	getSelection: () => null,
	format: () => undefined,
	on: () => undefined,
	off: () => undefined,
	focus: () => undefined,
}

const globalStubs = {
	Dropdown: {
		template: '<div><slot /></div>',
	},
	DropdownItem: {
		template: '<div><slot /></div>',
	},
	Tooltip: {
		template: '<div><slot name="trigger" /><slot /></div>',
	},
	TooltipContent: {
		template: '<div><slot /></div>',
	},
}

describe('RichEditorAlignment.vue - per-option shortcut tooltips', () => {
	it('renders four alignment options', () => {
		const wrapper = mount(RichEditorAlignment, {
			props: { quill: stubQuill },
			global: { stubs: globalStubs },
		})

		const buttons = wrapper.findAll('button')
		expect(buttons).toHaveLength(4)
	})

	it('includes Ctrl+Shift+L hint for align left', () => {
		const wrapper = mount(RichEditorAlignment, {
			props: { quill: stubQuill },
			global: { stubs: globalStubs },
		})

		expect(wrapper.text()).toContain('Align Left (Ctrl+Shift+L)')
	})

	it('includes Ctrl+Shift+E hint for align center', () => {
		const wrapper = mount(RichEditorAlignment, {
			props: { quill: stubQuill },
			global: { stubs: globalStubs },
		})

		expect(wrapper.text()).toContain('Align Center (Ctrl+Shift+E)')
	})

	it('includes Ctrl+Shift+R hint for align right', () => {
		const wrapper = mount(RichEditorAlignment, {
			props: { quill: stubQuill },
			global: { stubs: globalStubs },
		})

		expect(wrapper.text()).toContain('Align Right (Ctrl+Shift+R)')
	})

	it('includes Ctrl+Shift+J hint for justify', () => {
		const wrapper = mount(RichEditorAlignment, {
			props: { quill: stubQuill },
			global: { stubs: globalStubs },
		})

		expect(wrapper.text()).toContain('Justify (Ctrl+Shift+J)')
	})
})
