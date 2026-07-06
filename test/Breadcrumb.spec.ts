import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test } from 'vitest'

import {
	Breadcrumb,
	BreadcrumbItem,
} from '../lib/components/breadcrumb'

const stubs = {
	'breadcrumb-item': BreadcrumbItem,
}

test('Breadcrumb should render correctly', () => {
	const wrapper = mount(Breadcrumb, {
		slots: {
			default: `
              <breadcrumb-item>
              Home
              </breadcrumb-item>
              <breadcrumb-item>
              Shadcn Breadcrumb
              </breadcrumb-item>`,
		},
		global: {
			stubs,
		},
	})
	expect(wrapper.html()).toContain('Shadcn Breadcrumb')
})

test('Breadcrumb should have correct links', () => {
	const wrapper = mount(Breadcrumb, {
		slots: {
			default: `
              <breadcrumb-item to="/">
              Home
              </breadcrumb-item>
              <breadcrumb-item to="/shadcn-breadcrumb">
              Shadcn Breadcrumb
              </breadcrumb-item>`,
		},
		global: {
			stubs,
		},
	})

	console.log(wrapper.html())

	const links = wrapper.findAll('a')
	expect(links[0].attributes('href')).toBe('/')
	expect(links[1].attributes('href')).toBe('/shadcn-breadcrumb')
})

test('Breadcrumb should have correct separators', () => {
	const wrapper = mount(Breadcrumb, {
		slots: {
			default: `
          <breadcrumb-list>
              <breadcrumb-item>
              Home
              </breadcrumb-item>
              <breadcrumb-separator>
              /
              </breadcrumb-separator>
              <breadcrumb-item>
              Shadcn Breadcrumb
              </breadcrumb-item>
          </breadcrumb-list>`,
		},
		global: {
			stubs,
		},
	})

	expect(wrapper.html()).toContain('si-heroicon-solid-chevron-right')
})

test('Breadcrumb should not has ellipsis', () => {
	const wrapper = mount(Breadcrumb, {
		slots: {
			default: `
              <breadcrumb-item>
              Home
              </breadcrumb-item>
              <breadcrumb-item>
              Shadcn Breadcrumb
              </breadcrumb-item>
              <breadcrumb-item>
              Shadcn Breadcrumb
              </breadcrumb-item>`,
		},
		global: {
			stubs,
		},
	})

	expect(wrapper.html()).not.toContain('si-heroicon-solid-ellipsis-horizontal')
})

describe('Breadcrumb ellipsis threshold by viewport', () => {
	// Breakpoint.MD = 768 from lib/utils/viewport.ts
	const originalInnerWidth = window.innerWidth

	afterEach(() => {
		Object.defineProperty(window, 'innerWidth', {
			writable: true,
			configurable: true,
			value: originalInnerWidth,
		})
	})

	function setViewport(width: number) {
		Object.defineProperty(window, 'innerWidth', {
			writable: true,
			configurable: true,
			value: width,
		})
	}

	function buildItems(count: number): string {
		const labels = ['Home', 'Library', 'Docs', 'Components', 'Breadcrumb', 'Examples', 'Final']
		return labels
			.slice(0, count)
			.map(label => `<breadcrumb-item>${label}</breadcrumb-item>`)
			.join('\n')
	}

	test('mobile (< 768px): shows ellipsis when there are 4 items', () => {
		setViewport(500)
		const wrapper = mount(Breadcrumb, {
			slots: { default: buildItems(4) },
			global: { stubs },
		})
		expect(wrapper.html()).toContain('si-heroicon-solid-ellipsis-horizontal')
	})

	test('mobile (< 768px): hides ellipsis when there are 3 items', () => {
		setViewport(500)
		const wrapper = mount(Breadcrumb, {
			slots: { default: buildItems(3) },
			global: { stubs },
		})
		expect(wrapper.html()).not.toContain('si-heroicon-solid-ellipsis-horizontal')
	})

	test('tablet (>= 768px): shows ellipsis when there are 5 items', () => {
		setViewport(900)
		const wrapper = mount(Breadcrumb, {
			slots: { default: buildItems(5) },
			global: { stubs },
		})
		expect(wrapper.html()).toContain('si-heroicon-solid-ellipsis-horizontal')
	})

	test('tablet (>= 768px): hides ellipsis when there are 4 items', () => {
		setViewport(900)
		const wrapper = mount(Breadcrumb, {
			slots: { default: buildItems(4) },
			global: { stubs },
		})
		expect(wrapper.html()).not.toContain('si-heroicon-solid-ellipsis-horizontal')
	})

	test('desktop (>= 1024px): shows ellipsis when there are 5 items', () => {
		setViewport(1280)
		const wrapper = mount(Breadcrumb, {
			slots: { default: buildItems(5) },
			global: { stubs },
		})
		expect(wrapper.html()).toContain('si-heroicon-solid-ellipsis-horizontal')
	})

	test('desktop (>= 1024px): hides ellipsis when there are 4 items', () => {
		setViewport(1280)
		const wrapper = mount(Breadcrumb, {
			slots: { default: buildItems(4) },
			global: { stubs },
		})
		expect(wrapper.html()).not.toContain('si-heroicon-solid-ellipsis-horizontal')
	})
})

describe('Breadcrumb ellipsis click-to-expand', () => {
	const originalInnerWidth = window.innerWidth

	afterEach(() => {
		Object.defineProperty(window, 'innerWidth', {
			writable: true,
			configurable: true,
			value: originalInnerWidth,
		})
	})

	function setViewport(width: number) {
		Object.defineProperty(window, 'innerWidth', {
			writable: true,
			configurable: true,
			value: width,
		})
	}

	function buildItems(count: number): string {
		const labels = ['Home', 'Library', 'Docs', 'Components', 'Breadcrumb', 'Examples', 'Final']
		return labels
			.slice(0, count)
			.map(label => `<breadcrumb-item>${label}</breadcrumb-item>`)
			.join('\n')
	}

	function countListItems(wrapper: ReturnType<typeof mount>): number {
		return wrapper.findAll('li').length
	}

	test('ellipsis renders as a button when there are more than the threshold', () => {
		setViewport(1280)
		const wrapper = mount(Breadcrumb, {
			slots: { default: buildItems(5) },
			global: { stubs },
		})
		const button = wrapper.find('button[aria-label="Show all breadcrumb items"]')
		expect(button.exists()).toBe(true)
	})

	test('clicking the ellipsis expands all items inline and hides the button', async () => {
		setViewport(1280)
		const wrapper = mount(Breadcrumb, {
			slots: { default: buildItems(5) },
			global: { stubs },
		})

		// Sanity: 5 items on desktop => 4 <li> (2 leading + 2 trailing) + 1 ellipsis button
		expect(wrapper.findAll('button[aria-label="Show all breadcrumb items"]').length).toBe(1)
		expect(countListItems(wrapper)).toBe(4)

		// Trigger expand
		await wrapper.find('button[aria-label="Show all breadcrumb items"]').trigger('click')

		// After expand: 5 <li> immediately (entering items are added to DOM right away)
		expect(countListItems(wrapper)).toBe(5)

		// The leaving ellipsis button stays in the DOM until the 200ms fade
		// transition completes. Wait for it before asserting the button is gone.
		await new Promise(resolve => setTimeout(resolve, 300))

		expect(wrapper.findAll('button[aria-label="Show all breadcrumb items"]').length).toBe(0)
	})

	test('expanded state resets on re-mount', async () => {
		setViewport(1280)
		const wrapper = mount(Breadcrumb, {
			slots: { default: buildItems(5) },
			global: { stubs },
		})
		await wrapper.find('button[aria-label="Show all breadcrumb items"]').trigger('click')
		// Wait for the previous component's transition to settle before unmounting
		await new Promise(resolve => setTimeout(resolve, 300))
		expect(countListItems(wrapper)).toBe(5)

		// Simulate re-mount by re-rendering the component from scratch
		wrapper.unmount()
		const fresh = mount(Breadcrumb, {
			slots: { default: buildItems(5) },
			global: { stubs },
		})
		expect(fresh.findAll('button[aria-label="Show all breadcrumb items"]').length).toBe(1)
		expect(countListItems(fresh)).toBe(4)
	})
})
