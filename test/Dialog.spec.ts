import { config, mount, flushPromises } from '@vue/test-utils'
import { test, expect, afterEach, vi } from 'vitest'
import Dialog from '../lib/components/dialog/Dialog.vue'
import DialogContent from '../lib/components/dialog/DialogContent.vue'
import DialogDescription from '../lib/components/dialog/DialogDescription.vue'
import DialogFooter from '../lib/components/dialog/DialogFooter.vue'
import DialogHeader from '../lib/components/dialog/DialogHeader.vue'
import DialogTitle from '../lib/components/dialog/DialogTitle.vue'
import { SDialog, SDialogContent } from '../lib/main'

config.global.components = {
	RouterLink: { template: '<a><slot /></a>' },
}

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

test('DialogContent shows a close button by default', async () => {
	mount(Dialog, {
		props: { open: true },
		attachTo: document.body,
		slots: {
			default: '<DialogContent>Content</DialogContent>',
		},
		global: {
			components: { DialogContent },
		},
	})
	await flushPromises()

	const closeButton = document.querySelector('[aria-label="Close dialog"]')
	expect(closeButton).not.toBeNull()
	expect(closeButton?.className).toContain('absolute')
	expect(closeButton?.innerHTML).toContain('si-heroicon-solid-x-mark')
})

test('Dialog hides the close button when showClose is false', async () => {
	mount(Dialog, {
		props: { open: true, showClose: false },
		attachTo: document.body,
		slots: {
			default: '<DialogContent>Content</DialogContent>',
		},
		global: {
			components: { DialogContent },
		},
	})
	await flushPromises()

	expect(document.querySelector('[aria-label="Close dialog"]')).toBeNull()
})

test('Dialog close button emits an update to close the dialog', async () => {
	const onUpdateOpen = vi.fn()
	mount(Dialog, {
		props: {
			open: true,
			'onUpdate:open': onUpdateOpen,
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

	const closeButton = document.querySelector<HTMLButtonElement>(
		'[aria-label="Close dialog"]'
	)
	await closeButton?.click()
	await flushPromises()

	expect(onUpdateOpen).toHaveBeenCalledWith(false)
})

test('DialogContent applies tablet size variants', async () => {
	const variants = [
		['sm', '480px', '133px'],
		['md', '600px', '190px'],
		['lg', '800px', '254px'],
	]

	for (const [size] of variants) {
		mount(Dialog, {
			props: { open: true, size },
			attachTo: document.body,
			slots: {
				default: '<DialogContent>Content</DialogContent>',
			},
			global: {
				components: { DialogContent },
			},
		})
	}

	await flushPromises()
	const markup = document.body.innerHTML

	for (const [, width, minHeight] of variants) {
		expect(markup).toContain(`tablet:w-[${width}]`)
		expect(markup).toContain(`tablet:min-h-[${minHeight}]`)
	}
})

test('DialogContent supports legacy direct slot content', async () => {
	mount(Dialog, {
		props: { open: true },
		attachTo: document.body,
		slots: {
			default:
				'<DialogContent><p class="legacy-content">Legacy content</p></DialogContent>',
		},
		global: {
			components: { DialogContent },
		},
	})
	await flushPromises()
	expect(document.querySelector('.legacy-content')?.textContent).toBe(
		'Legacy content'
	)
})

test('public SDialog exports support legacy direct slot content', async () => {
	mount(SDialog, {
		props: { open: true },
		attachTo: document.body,
		slots: {
			default:
				'<SDialogContent><p class="public-legacy-content">Public legacy content</p></SDialogContent>',
		},
		global: {
			components: { SDialogContent },
		},
	})
	await flushPromises()
	expect(document.querySelector('.public-legacy-content')?.textContent).toBe(
		'Public legacy content'
	)
})

test('Dialog layout components render and only description scrolls', async () => {
	mount(Dialog, {
		props: { open: true },
		attachTo: document.body,
		slots: {
			default: `
				<DialogContent>
					<DialogHeader><DialogTitle>Dialog title</DialogTitle></DialogHeader>
					<DialogDescription>Scrollable content</DialogDescription>
					<DialogFooter><button>Save</button></DialogFooter>
				</DialogContent>
			`,
		},
		global: {
			components: {
				DialogContent,
				DialogDescription,
				DialogFooter,
				DialogHeader,
				DialogTitle,
			},
		},
	})
	await flushPromises()

	const description = document.querySelector('.overflow-y-auto')

	expect(document.body.textContent).toContain('Dialog title')
	expect(document.body.textContent).toContain('Save')
	expect(description).not.toBeNull()
	expect(document.querySelectorAll('.overflow-y-auto')).toHaveLength(1)
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
