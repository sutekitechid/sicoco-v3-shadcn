import { mount, flushPromises } from '@vue/test-utils'
import { test, expect } from 'vitest'
import Accordion from '../lib/components/accordion/Accordion.vue'
import AccordionContent from '../lib/components/accordion/AccordionContent.vue'
import AccordionItem from '../lib/components/accordion/AccordionItem.vue'
import AccordionTrigger from '../lib/components/accordion/AccordionTrigger.vue'
import { h } from 'vue'

test('Accordion renders correctly', () => {
	const wrapper = mount(Accordion, {
		props: {
			modelValue: 'item1',
			collapsible: true,
		},
	})
	expect(wrapper.element.tagName).toBe('DIV')
})

test('Default prop type is "single"', () => {
	const wrapper = mount(Accordion, {
		propsData: {},
	})

	expect(wrapper.props('type')).toBe('single')
})

test('Accordion should render slots correctly', () => {
	const wrapper = mount(Accordion, {
		props: {
			modelValue: 'item1',
			collapsible: true,
		},
		slots: {
			default: '<span>abcd</span>',
		},
	})
	expect(wrapper.html()).toBe(
		'<div destroyonhide="true" variant="default" class="flex flex-col gap-2"><span>abcd</span></div>'
	)
})

test('AccordionItem opens and closes correctly', async () => {
	const wrapper = mount(Accordion, {
		props: {
			collapsible: true,
		},
		slots: {
			default: [
				h(
					AccordionItem,
					{ value: 'item1' },
					{
						default: () => [
							h(AccordionTrigger, {}, { default: () => 'Trigger 1' }),
							h(AccordionContent, {}, { default: () => 'Content 1' }),
						],
					}
				),
			],
		},
	})

	// Pastikan awalnya tidak ada konten yang terlihat
	expect(wrapper.html()).not.toContain('Content 1')

	// Klik Trigger 1 untuk membuka "Content 1"
	const trigger = wrapper.find('button[data-state="closed"]')
	await trigger.trigger('click')

	// Periksa apakah "Content 1" sekarang terlihat
	expect(wrapper.html()).toContain('Content 1')
	expect(trigger.attributes('data-state')).toBe('open')

	// Klik Trigger 1 lagi untuk menutup "Content 1"
	await trigger.trigger('click')

	// Pastikan "Content 1" tidak terlihat lagi
	expect(wrapper.html()).not.toContain('Content 1')
	expect(trigger.attributes('data-state')).toBe('closed')
})

test('only one AccordionContent is visible at a time', async () => {
	const wrapper = mount(Accordion, {
		props: {
			collapsible: true,
		},
		slots: {
			default: [
				h(
					AccordionItem,
					{ value: 'item1' },
					{
						default: () => [
							h(AccordionTrigger, {}, { default: () => 'Trigger 1' }),
							h(AccordionContent, {}, { default: () => 'Content 1' }),
						],
					}
				),
				h(
					AccordionItem,
					{ value: 'item2' },
					{
						default: () => [
							h(AccordionTrigger, {}, { default: () => 'Trigger 2' }),
							h(AccordionContent, {}, { default: () => 'Content 2' }),
						],
					}
				),
			],
		},
	})

	expect(wrapper.html()).not.toContain('Content 1')
	expect(wrapper.html()).not.toContain('Content 2')

	const trigger1 = wrapper.find('button[data-state="closed"]')
	await trigger1.trigger('click')

	expect(wrapper.html()).toContain('Content 1')
	expect(trigger1.attributes('data-state')).toBe('open')

	const trigger2 = wrapper.findAll('button[data-state="closed"]').at(0)
	await trigger2?.trigger('click')

	expect(wrapper.html()).toContain('Content 2')
	expect(wrapper.html()).not.toContain('Content 1')
	expect(trigger1.attributes('data-state')).toBe('closed')
	expect(trigger2?.attributes('data-state')).toBe('open')
})

test('Default accordion item is open on render', async () => {
	const wrapper = mount(Accordion, {
		props: {
			defaultValue: 'item1',
		},
		slots: {
			default: [
				h(
					AccordionItem,
					{ value: 'item1', key: 'item1' },
					{
						default: () => [
							h(AccordionTrigger, {}, { default: () => 'Trigger 1' }),
							h(AccordionContent, {}, { default: () => 'Content 1' }),
						],
					}
				),
				h(
					AccordionItem,
					{ value: 'item2', key: 'item2' },
					{
						default: () => [
							h(AccordionTrigger, {}, { default: () => 'Trigger 2' }),
							h(AccordionContent, {}, { default: () => 'Content 2' }),
						],
					}
				),
			],
		},
	})
	await flushPromises()

	expect(wrapper.html()).toContain('Content 1')
	expect(wrapper.find('button[data-state="open"]').text()).toBe('Trigger 1')

	expect(wrapper.html()).not.toContain('Content 2')
})

test('Clicking on the AccordionItem area (outside trigger) toggles it', async () => {
	const wrapper = mount(Accordion, {
		props: { collapsible: true },
		slots: {
			default: [
				h(
					AccordionItem,
					{ value: 'item1' },
					{
						default: () => [
							h(AccordionTrigger, {}, { default: () => 'Trigger 1' }),
							h(AccordionContent, {}, { default: () => 'Content 1' }),
						],
					}
				),
			],
		},
	})

	const item = wrapper.find('[data-orientation="vertical"]')
	expect(item.exists()).toBe(true)
	expect(item.attributes('data-state')).toBe('closed')

	await item.trigger('click')
	await flushPromises()

	expect(item.attributes('data-state')).toBe('open')

	// Click again to close
	await item.trigger('click')
	await flushPromises()

	expect(item.attributes('data-state')).toBe('closed')
})

test('Multiple AccordionItems can be open at the same time', async () => {
	const wrapper = mount(Accordion, {
		props: {
			type: 'multiple',
		},
		slots: {
			default: [
				h(
					AccordionItem,
					{ value: 'item1', key: 'item1' },
					{
						default: () => [
							h(AccordionTrigger, {}, { default: () => 'Trigger 1' }),
							h(AccordionContent, {}, { default: () => 'Content 1' }),
						],
					}
				),
				h(
					AccordionItem,
					{ value: 'item2', key: 'item2' },
					{
						default: () => [
							h(AccordionTrigger, {}, { default: () => 'Trigger 2' }),
							h(AccordionContent, {}, { default: () => 'Content 2' }),
						],
					}
				),
				h(
					AccordionItem,
					{ value: 'item3', key: 'item3' },
					{
						default: () => [
							h(AccordionTrigger, {}, { default: () => 'Trigger 3' }),
							h(AccordionContent, {}, { default: () => 'Content 3' }),
						],
					}
				),
			],
		},
	})

	await flushPromises()

	// Buka item pertama
	await wrapper.findAll('button')[0].trigger('click')
	expect(wrapper.findAll('button[data-state="open"]').length).toBe(1)

	// Buka item kedua
	await wrapper.findAll('button')[1].trigger('click')
	expect(wrapper.findAll('button[data-state="open"]').length).toBe(2)

	// Buka item ketiga
	await wrapper.findAll('button')[2].trigger('click')
	expect(wrapper.findAll('button[data-state="open"]').length).toBe(3)
})
