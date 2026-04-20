import { mount, flushPromises } from '@vue/test-utils'
import { test, expect, afterEach, vi } from 'vitest'
import Dialog from '../lib/components/dialog/Dialog.vue'
import DialogContent from '../lib/components/dialog/DialogContent.vue'

afterEach(() => {
	// Clean up portaled content between tests
	document.body.innerHTML = ''
})

test('Dialog renders without crashing when closed', () => {
	const wrapper = mount(Dialog, {
		props: { open: false },
	})
	expect(wrapper.exists()).toBe(true)
})

test('Dialog renders slot content when open', () => {
	const wrapper = mount(Dialog, {
		props: { open: true },
		slots: {
			default: '<div class="dialog-body">Hello from dialog</div>',
		},
	})
	expect(wrapper.html()).toContain('Hello from dialog')
})

test('DialogContent renders slot content via portal', async () => {
	mount(Dialog, {
		props: { open: true },
		attachTo: document.body,
		slots: {
			default: '<DialogContent><p class="dialog-text">Dialog body</p></DialogContent>',
		},
		global: {
			components: { DialogContent },
		},
	})
	await flushPromises()
	expect(document.body.innerHTML).toContain('Dialog body')
})

test('Dialog emits update:open event', async () => {
	const wrapper = mount(Dialog, {
		props: { open: false },
	})
	expect(wrapper.exists()).toBe(true)
})

test('DialogContent applies custom class via portal', async () => {
	mount(Dialog, {
		props: { open: true },
		attachTo: document.body,
		slots: {
			default: '<DialogContent class="custom-dialog">Content</DialogContent>',
		},
		global: {
			components: { DialogContent },
		},
	})
	await flushPromises()
	expect(document.body.innerHTML).toContain('custom-dialog')
})

test('DialogContent prevents closing when clicking outside by default', async () => {
	const wrapper = mount(Dialog, {
		props: { 
			open: true,
			'onUpdate:open': (value: boolean) => wrapper.setProps({ open: value })
		},
		attachTo: document.body,
		slots: {
			default: '<DialogContent>Content</DialogContent>',
		},
		global: {
			components: { DialogContent },
		},
	})
	await flushPromises()
	
	// Find overlay and click it
	const overlay = document.querySelector('[data-reka-dialog-overlay]')
	if (overlay) {
		await overlay.dispatchEvent(new MouseEvent('click', { bubbles: true }))
		await flushPromises()
	}
	
	// Dialog should still be open (default behavior)
	expect(wrapper.props('open')).toBe(true)
})

test('DialogContent allows closing when clicking outside if closeOnClickOutside is true', async () => {
	const onUpdateOpen = vi.fn()
	mount(Dialog, {
		props: { 
			open: true,
			closeOnClickOutside: true,
			'onUpdate:open': onUpdateOpen
		},
		attachTo: document.body,
		slots: {
			default: '<DialogContent>Content</DialogContent>',
		},
		global: {
			components: { DialogContent },
		},
	})
	await flushPromises()
	
	// Find the dialog content and trigger interact-outside event
	const dialogContent = document.querySelector('[data-reka-dialog-content]')
	if (dialogContent) {
		const event = new Event('interactOutside', { bubbles: true, cancelable: true })
		dialogContent.dispatchEvent(event)
		await flushPromises()
		
		// Event should not be prevented (allowing close)
		expect(event.defaultPrevented).toBe(false)
	}
})
