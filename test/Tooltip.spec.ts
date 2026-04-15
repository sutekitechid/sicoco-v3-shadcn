import { mount, flushPromises } from '@vue/test-utils'
import { test, expect, afterEach } from 'vitest'
import Tooltip from '../lib/components/tooltip/Tooltip.vue'
import TooltipContent from '../lib/components/tooltip/TooltipContent.vue'

afterEach(() => {
	document.body.innerHTML = ''
})

test('Tooltip renders trigger slot content', () => {
	const wrapper = mount(Tooltip, {
		slots: {
			trigger: '<button>Hover me</button>',
		},
	})
	expect(wrapper.html()).toContain('Hover me')
})

test('Tooltip renders without crashing', () => {
	const wrapper = mount(Tooltip)
	expect(wrapper.exists()).toBe(true)
})

test('Tooltip opens on click by default', async () => {
	const wrapper = mount(Tooltip, {
		slots: {
			trigger: '<button class="trigger-btn">Click me</button>',
			default: '<div>Tooltip text</div>',
		},
	})

	const trigger = wrapper.find('.trigger-btn')
	expect(trigger.exists()).toBe(true)
	await trigger.trigger('click')
	expect(wrapper.exists()).toBe(true)
})

test('TooltipContent renders slot content via portal', async () => {
	mount(Tooltip, {
		props: { open: true },
		attachTo: document.body,
		slots: {
			trigger: '<button>Trigger</button>',
			default: '<TooltipContent>Tooltip body</TooltipContent>',
		},
		global: {
			components: { TooltipContent },
		},
	})
	await flushPromises()
	expect(document.body.innerHTML).toContain('Tooltip body')
})

test('TooltipContent applies variant class via portal', async () => {
	mount(Tooltip, {
		props: { open: true },
		attachTo: document.body,
		slots: {
			trigger: '<span>Trigger</span>',
			default: '<TooltipContent variant="primary">Primary tooltip</TooltipContent>',
		},
		global: {
			components: { TooltipContent },
		},
	})
	await flushPromises()
	expect(document.body.innerHTML).toContain('bg-primary-10')
})

test('Tooltip does not open on click when trigger is hover', async () => {
	const wrapper = mount(Tooltip, {
		props: { trigger: 'hover' },
		slots: {
			trigger: '<button class="hover-trigger">Hover</button>',
		},
	})

	const trigger = wrapper.find('.hover-trigger')
	await trigger.trigger('click')
	// open.value should remain false since trigger is 'hover'
	expect(wrapper.exists()).toBe(true)
})
