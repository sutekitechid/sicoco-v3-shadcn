import { describe, it, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import Card from '../lib/components/card/Card.vue'
import CardContent from '../lib/components/card/CardContent.vue'
import CardDescription from '../lib/components/card/CardDescription.vue'
import CardFooter from '../lib/components/card/CardFooter.vue'
import CardHeader from '../lib/components/card/CardHeader.vue'
import CardTitle from '../lib/components/card/CardTitle.vue'

test('renders a div with default classes', () => {
	const wrapper = mount(Card)
	const div = wrapper.find('div')

	expect(div.exists()).toBe(true)
	expect(div.classes()).toContain('rounded-lg')
	expect(div.classes()).toContain('border')
	expect(div.classes()).toContain('border-slate-200')
	expect(div.classes()).toContain('bg-white')
	expect(div.classes()).toContain('text-slate-950')
	expect(div.classes()).toContain('shadow-sm')
	expect(div.classes()).toContain('dark:border-slate-800')
	expect(div.classes()).toContain('dark:bg-slate-950')
	expect(div.classes()).toContain('dark:text-slate-50')
})

test('accepts and applies additional classes through the class prop', () => {
	const customClass = 'custom-class'
	const wrapper = mount(Card, {
		props: {
			class: customClass,
		},
	})

	const div = wrapper.find('div')
	expect(div.classes()).toContain(customClass)
})

test('renders content passed via slot', () => {
	const slotContent = '<p>Test Content</p>'
	const wrapper = mount(Card, {
		slots: {
			default: slotContent,
		},
	})

	expect(wrapper.html()).toContain(slotContent)
})

test('accepts and applies additional classes through the class prop', () => {
	const customClass = 'custom-class'
	const wrapper = mount(Card, {
		props: {
			class: customClass,
		},
	})

	const div = wrapper.find('div')
	expect(div.classes()).toContain(customClass)
})

test('renders a card with header, title, description, content, and footer', () => {
	const wrapper = mount(Card, {
		props: {
			class: 'w-[350px]',
		},
		slots: {
			default: `
          <CardHeader>
            <CardTitle>ini sebuah card title</CardTitle>
            <CardDescription>ini sebuah card description</CardDescription>
          </CardHeader>
          <CardContent>
            ini sebuah content
          </CardContent>
          <CardFooter class="flex justify-between px-6 pb-6">
            Ini sebuah footer
          </CardFooter>
        `,
		},
		global: {
			components: {
				CardHeader,
				CardTitle,
				CardDescription,
				CardContent,
				CardFooter,
			},
		},
	})

	expect(wrapper.findComponent(CardHeader).exists()).toBe(true)
	expect(wrapper.findComponent(CardTitle).text()).toBe('ini sebuah card title')
	expect(wrapper.findComponent(CardDescription).text()).toBe(
		'ini sebuah card description'
	)
	expect(wrapper.findComponent(CardContent).text()).toContain(
		'ini sebuah content'
	)
	const footer = wrapper.findComponent(CardFooter)
	expect(footer.exists()).toBe(true)
	expect(footer.classes()).toContain('flex')
	expect(footer.classes()).toContain('justify-between')
	expect(footer.classes()).toContain('px-6')
	expect(footer.classes()).toContain('pb-6')
	expect(footer.text()).toBe('Ini sebuah footer')
})
