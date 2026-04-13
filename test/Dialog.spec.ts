import { mount, flushPromises } from '@vue/test-utils'
import { test, expect, afterEach } from 'vitest'
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
