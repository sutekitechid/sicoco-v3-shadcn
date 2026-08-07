import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import RichTextEditor from '../lib/components/rich-editor/RichTextEditor.vue'

describe('RichTextEditor.vue - toolbarItems prop', () => {
	it('renders all toolbar items when toolbarItems is not provided', () => {
		const wrapper = mount(RichTextEditor)

		expect(wrapper.find('.ql-bold').exists()).toBe(true)
		expect(wrapper.find('.ql-italic').exists()).toBe(true)
		expect(wrapper.find('.ql-underline').exists()).toBe(true)
		expect(wrapper.find('.ql-strike').exists()).toBe(true)
		expect(wrapper.find('.ql-link').exists()).toBe(true)
		expect(wrapper.find('.ql-clean').exists()).toBe(true)
		expect(wrapper.find('.ql-blockquote').exists()).toBe(true)
		expect(wrapper.find('.ql-code-block').exists()).toBe(true)
		expect(wrapper.find('.ql-undo').exists()).toBe(true)
		expect(wrapper.find('.ql-redo').exists()).toBe(true)
	})

	it('renders all toolbar items when toolbarItems is an empty array', () => {
		const wrapper = mount(RichTextEditor, {
			props: { toolbarItems: [] },
		})

		expect(wrapper.find('.ql-bold').exists()).toBe(true)
		expect(wrapper.find('.ql-italic').exists()).toBe(true)
		expect(wrapper.find('.ql-underline').exists()).toBe(true)
		expect(wrapper.find('.ql-strike').exists()).toBe(true)
		expect(wrapper.find('.ql-link').exists()).toBe(true)
		expect(wrapper.find('.ql-clean').exists()).toBe(true)
		expect(wrapper.find('.ql-blockquote').exists()).toBe(true)
		expect(wrapper.find('.ql-code-block').exists()).toBe(true)
	})

	it('hides items not in the toolbarItems whitelist', () => {
		const wrapper = mount(RichTextEditor, {
			props: { toolbarItems: ['undo', 'redo', 'bold'] },
		})

		expect(wrapper.find('.ql-bold').exists()).toBe(true)
		expect(wrapper.find('.ql-undo').exists()).toBe(true)
		expect(wrapper.find('.ql-redo').exists()).toBe(true)

		expect(wrapper.find('.ql-italic').exists()).toBe(false)
		expect(wrapper.find('.ql-underline').exists()).toBe(false)
		expect(wrapper.find('.ql-strike').exists()).toBe(false)
		expect(wrapper.find('.ql-link').exists()).toBe(false)
		expect(wrapper.find('.ql-clean').exists()).toBe(false)
		expect(wrapper.find('.ql-blockquote').exists()).toBe(false)
		expect(wrapper.find('.ql-code-block').exists()).toBe(false)
	})

	it('handles a single item whitelist', () => {
		const wrapper = mount(RichTextEditor, {
			props: { toolbarItems: ['bold'] },
		})

		expect(wrapper.find('.ql-bold').exists()).toBe(true)
		expect(wrapper.find('.ql-italic').exists()).toBe(false)
		expect(wrapper.find('.ql-undo').exists()).toBe(false)
	})

	it('toggles subscript and superscript independently', () => {
		const wrapperSub = mount(RichTextEditor, {
			props: { toolbarItems: ['subscript'] },
		})
		expect(wrapperSub.find('button.ql-script[value="sub"]').exists()).toBe(true)
		expect(wrapperSub.find('button.ql-script[value="super"]').exists()).toBe(false)

		const wrapperSuper = mount(RichTextEditor, {
			props: { toolbarItems: ['superscript'] },
		})
		expect(wrapperSuper.find('button.ql-script[value="sub"]').exists()).toBe(false)
		expect(wrapperSuper.find('button.ql-script[value="super"]').exists()).toBe(true)
	})

	it('toggles ordered and bullet list independently', () => {
		const wrapper = mount(RichTextEditor, {
			props: { toolbarItems: ['list-ordered'] },
		})

		expect(wrapper.find('button.ql-list[value="ordered"]').exists()).toBe(true)
		expect(wrapper.find('button.ql-list[value="bullet"]').exists()).toBe(false)
	})

	it('controls attachment items individually even when attachmentsToolbar is false', () => {
		const wrapper = mount(RichTextEditor, {
			props: {
				toolbarItems: ['image'],
			},
		})

		expect(wrapper.find('.ql-image').exists()).toBe(true)
		expect(wrapper.find('.ql-video').exists()).toBe(false)
		expect(wrapper.find('.ql-attachment').exists()).toBe(false)
	})

	it('reactive: updates visibility when toolbarItems prop changes', async () => {
		const wrapper = mount(RichTextEditor, {
			props: { toolbarItems: ['bold'] },
		})

		expect(wrapper.find('.ql-bold').exists()).toBe(true)
		expect(wrapper.find('.ql-italic').exists()).toBe(false)

		await wrapper.setProps({ toolbarItems: ['italic'] })

		expect(wrapper.find('.ql-bold').exists()).toBe(false)
		expect(wrapper.find('.ql-italic').exists()).toBe(true)
	})
})
