import { afterEach, expect, test, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import Drawer from '../lib/components/drawer/Drawer.vue'
import DrawerClose from '../lib/components/drawer/DrawerClose.vue'
import DrawerContent from '../lib/components/drawer/DrawerContent.vue'
import DrawerDescription from '../lib/components/drawer/DrawerDescription.vue'
import DrawerFooter from '../lib/components/drawer/DrawerFooter.vue'
import DrawerHeader from '../lib/components/drawer/DrawerHeader.vue'
import DrawerOverlay from '../lib/components/drawer/DrawerOverlay.vue'
import DrawerPortal from '../lib/components/drawer/DrawerPortal.vue'
import DrawerSwipeHandle from '../lib/components/drawer/DrawerSwipeHandle.vue'
import DrawerTitle from '../lib/components/drawer/DrawerTitle.vue'
import DrawerTrigger from '../lib/components/drawer/DrawerTrigger.vue'
import {
	SDrawer,
	SDrawerClose,
	SDrawerContent,
	SDrawerDescription,
	SDrawerFooter,
	SDrawerHeader,
	SDrawerOverlay,
	SDrawerPortal,
	SDrawerSwipeHandle,
	SDrawerTitle,
	SDrawerTrigger,
} from '../lib/main'

afterEach(() => {
	document.body.innerHTML = ''
})

test('DrawerContent renders its slot in the portal', async () => {
	mount(Drawer, {
		props: { open: true },
		attachTo: document.body,
		slots: {
			default: '<DrawerContent><DrawerTitle>Drawer title</DrawerTitle><p class="drawer-body">Drawer body</p></DrawerContent>',
		},
		global: {
			components: { DrawerContent, DrawerTitle },
		},
	})

	await flushPromises()
	expect(document.querySelector('.drawer-body')?.textContent).toBe('Drawer body')
})

test('DrawerClose uses Button and closes the controlled drawer', async () => {
	const onUpdateOpen = vi.fn()
	mount(Drawer, {
		props: {
			open: true,
			'onUpdate:open': onUpdateOpen,
		},
		attachTo: document.body,
		slots: {
			default: '<DrawerContent><DrawerTitle>Drawer title</DrawerTitle><DrawerClose /></DrawerContent>',
		},
		global: {
			components: {
				DrawerClose,
				DrawerContent,
				DrawerTitle,
				RouterLink: { template: '<a><slot /></a>' },
			},
		},
	})

	await flushPromises()
	const closeButton = document.querySelector<HTMLButtonElement>('[aria-label="Close drawer"]')

	expect(closeButton?.tagName).toBe('BUTTON')
	expect(closeButton?.innerHTML).toContain('si-heroicon-solid-x-mark')
	await closeButton?.click()
	await flushPromises()
	expect(onUpdateOpen.mock.calls[0]?.[0]).toBe(false)
})

test('Drawer renders shadcn-style layout components and a swipe handle by default', async () => {
	mount(Drawer, {
		props: { open: true },
		attachTo: document.body,
		slots: {
			default: `
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>Drawer title</DrawerTitle>
						<DrawerDescription>Drawer description</DrawerDescription>
					</DrawerHeader>
					<DrawerFooter><button>Save</button></DrawerFooter>
				</DrawerContent>
			`,
		},
		global: {
			components: {
				DrawerContent,
				DrawerDescription,
				DrawerFooter,
				DrawerHeader,
				DrawerTitle,
			},
		},
	})

	await flushPromises()

	expect(document.body.textContent).toContain('Drawer title')
	expect(document.body.textContent).toContain('Drawer description')
	expect(document.body.textContent).toContain('Save')
	expect(document.querySelector('[data-slot="drawer-swipe-handle"]')).not.toBeNull()
})

test('DrawerContent can hide its default swipe handle', async () => {
	mount(Drawer, {
		props: { open: true },
		attachTo: document.body,
		slots: {
			default: '<DrawerContent :show-swipe-handle="false"><DrawerTitle>Drawer title</DrawerTitle>Content</DrawerContent>',
		},
		global: {
			components: { DrawerContent, DrawerTitle },
		},
	})

	await flushPromises()

	expect(document.querySelector('[data-slot="drawer-swipe-handle"]')).toBeNull()
})

test('Drawer prevents outside-click dismissal by default', async () => {
	const onUpdateOpen = vi.fn()
	mount(Drawer, {
		props: {
			open: true,
			'onUpdate:open': onUpdateOpen,
		},
		attachTo: document.body,
		slots: {
			default: '<DrawerContent><DrawerTitle>Drawer title</DrawerTitle>Content</DrawerContent>',
		},
		global: {
			components: { DrawerContent, DrawerTitle },
		},
	})

	await flushPromises()
	document.body.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }))
	await flushPromises()

	expect(onUpdateOpen).not.toHaveBeenCalled()
})

test('Drawer can opt into outside-click dismissal', async () => {
	const onUpdateOpen = vi.fn()
	mount(Drawer, {
		props: {
			open: true,
			closeOnClickOutside: true,
			'onUpdate:open': onUpdateOpen,
		},
		attachTo: document.body,
		slots: {
			default: '<DrawerContent><DrawerTitle>Drawer title</DrawerTitle>Content</DrawerContent>',
		},
		global: {
			components: { DrawerContent, DrawerTitle },
		},
	})

	await flushPromises()
	document.body.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }))
	await flushPromises()

	expect(onUpdateOpen).toHaveBeenCalledWith(false, expect.objectContaining({ reason: 'outside-press' }))
})

test('DrawerContent renders a square full-height side panel', async () => {
	mount(Drawer, {
		props: { open: true, swipeDirection: 'right' },
		attachTo: document.body,
		slots: {
			default: '<DrawerContent><DrawerTitle>Drawer title</DrawerTitle>Content</DrawerContent>',
		},
		global: {
			components: { DrawerContent, DrawerTitle },
		},
	})

	await flushPromises()

	const content = document.querySelector('[data-slot="drawer-content"]')
	expect(content?.getAttribute('data-swipe-direction')).toBe('right')
	expect(content?.className).toContain('data-[swipe-direction=right]:right-0')
	expect(content?.className).toContain('data-[swipe-direction=right]:h-dvh')
	expect(content?.className).toContain('data-[swipe-direction=right]:max-h-dvh')
	expect(content?.className).toContain('data-[swipe-direction=right]:w-[450px]')
	expect(content?.className).not.toContain('rounded')
})

test('drawer public exports are available', () => {
	expect(SDrawer).toBe(Drawer)
	expect(SDrawerClose).toBe(DrawerClose)
	expect(SDrawerContent).toBe(DrawerContent)
	expect(SDrawerDescription).toBe(DrawerDescription)
	expect(SDrawerFooter).toBe(DrawerFooter)
	expect(SDrawerHeader).toBe(DrawerHeader)
	expect(SDrawerOverlay).toBe(DrawerOverlay)
	expect(SDrawerPortal).toBe(DrawerPortal)
	expect(SDrawerSwipeHandle).toBe(DrawerSwipeHandle)
	expect(SDrawerTitle).toBe(DrawerTitle)
	expect(SDrawerTrigger).toBe(DrawerTrigger)
})
