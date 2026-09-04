import { afterEach, expect, test, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import Drawer from '../lib/components/drawer/Drawer.vue'
import DrawerClose from '../lib/components/drawer/DrawerClose.vue'
import DrawerContent from '../lib/components/drawer/DrawerContent.vue'
import DrawerTitle from '../lib/components/drawer/DrawerTitle.vue'
import DrawerTrigger from '../lib/components/drawer/DrawerTrigger.vue'
import {
	SDrawer,
	SDrawerClose,
	SDrawerContent,
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

test('drawer public exports are available', () => {
	expect(SDrawer).toBe(Drawer)
	expect(SDrawerClose).toBe(DrawerClose)
	expect(SDrawerContent).toBe(DrawerContent)
	expect(SDrawerTitle).toBe(DrawerTitle)
	expect(SDrawerTrigger).toBe(DrawerTrigger)
})
