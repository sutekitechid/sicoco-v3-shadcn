import { expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import Card from '../lib/components/card/Card.vue'
import CardContent from '../lib/components/card/CardContent.vue'
import CardDescription from '../lib/components/card/CardDescription.vue'
import CardFooter from '../lib/components/card/CardFooter.vue'
import CardHeader from '../lib/components/card/CardHeader.vue'
import CardTitle from '../lib/components/card/CardTitle.vue'
import { cardVariants } from '../lib/components/card'

test('should return default classes if no variants are provided', () => {
	const result = cardVariants({})
	expect(result).toContain('bg-white')
	expect(result).toContain('shadow-none')
	expect(result).toContain('border-none')
	expect(result).toContain('rounded-none')
})

test('should apply shadow class when shadow is true', () => {
	const result = cardVariants({ shadow: true })
	expect(result).toContain('shadow-md')
	expect(result).not.toContain('shadow-none')
})

test('should apply no shadow class when shadow is false', () => {
	const result = cardVariants({ shadow: false })
	expect(result).toContain('shadow-none')
	expect(result).not.toContain('shadow-md')
})

test('should apply border class when border is true', () => {
	const result = cardVariants({ border: true })
	expect(result).toContain('border border-main')
	expect(result).not.toContain('border-none')
})

test('should apply no border class when border is false', () => {
	const result = cardVariants({ border: false })
	expect(result).toContain('border-none')
	expect(result).not.toContain('border border-main')
})

test('should apply rounded class when rounded is true', () => {
	const result = cardVariants({ rounded: true })
	expect(result).toContain('rounded-lg')
	expect(result).not.toContain('rounded-none')
})

test('should apply no rounded class when rounded is false', () => {
	const result = cardVariants({ rounded: false })
	expect(result).toContain('rounded-none')
	expect(result).not.toContain('rounded-lg')
})

test('should handle multiple variants simultaneously', () => {
	const result = cardVariants({ shadow: true, border: true, rounded: true })
	expect(result).toContain('shadow-md')
	expect(result).toContain('border border-main')
	expect(result).toContain('rounded-lg')
})

test('should return correct defaultVariants when no values are provided', () => {
	const result = cardVariants({})
	expect(result).toContain('shadow-none')
	expect(result).toContain('border-none')
	expect(result).toContain('rounded-none')
})

test('should override defaultVariants when specific values are provided', () => {
	const result = cardVariants({ shadow: true, border: false, rounded: true })
	expect(result).toContain('shadow-md')
	expect(result).toContain('border-none')
	expect(result).toContain('rounded-lg')
})

test('renders default slot content', () => {
	const wrapper = mount(Card, {
		slots: {
			default: '<div>Default Content</div>',
		},
	})
	expect(wrapper.html()).toContain('Default Content')
})

test('applies shadow variant class when shadow is true', () => {
	const wrapper = mount(Card, {
		props: { shadow: true },
	})
	expect(wrapper.classes()).toContain('shadow-md')
})

test('does not apply shadow variant class when shadow is false', () => {
	const wrapper = mount(Card, {
		props: { shadow: false },
	})
	expect(wrapper.classes()).toContain('shadow-none')
	expect(wrapper.classes()).not.toContain('shadow-md')
})

test('applies border variant class when border is true', () => {
	const wrapper = mount(Card, {
		props: { border: true },
	})
	expect(wrapper.classes()).toContain('border')
	expect(wrapper.classes()).toContain('border-main')
})

test('does not apply border variant class when border is false', () => {
	const wrapper = mount(Card, {
		props: { border: false },
	})
	expect(wrapper.classes()).toContain('border-none')
	expect(wrapper.classes()).not.toContain('border border-main')
})

test('applies rounded variant class when rounded is true', () => {
	const wrapper = mount(Card, {
		props: { rounded: true },
	})
	expect(wrapper.classes()).toContain('rounded-lg')
})

test('does not apply rounded variant class when rounded is false', () => {
	const wrapper = mount(Card, {
		props: { rounded: false },
	})
	expect(wrapper.classes()).toContain('rounded-none')
	expect(wrapper.classes()).not.toContain('rounded-lg')
})

test('renders custom classes passed via props', () => {
	const wrapper = mount(Card, {
		props: { class: 'custom-class' },
	})
	expect(wrapper.classes()).toContain('custom-class')
})

test('renders all variant combinations correctly', () => {
	const wrapper = mount(Card, {
		props: { shadow: true, border: true, rounded: true },
	})
	expect(wrapper.classes()).toContain('shadow-md')
	expect(wrapper.classes()).toContain('border')
	expect(wrapper.classes()).toContain('border-main')
	expect(wrapper.classes()).toContain('rounded-lg')
})

test('renders full Card component structure with children', () => {
	const wrapper = mount(Card, {
		props: { shadow: true, rounded: true, border: true },
		slots: {
			default: `
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>This is the card content.</CardContent>
        <CardFooter class="flex justify-between px-6 pb-6">
          Card Footer
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

	expect(wrapper.classes()).toContain('bg-white')
	expect(wrapper.classes()).toContain('shadow-md')
	expect(wrapper.classes()).toContain('rounded-lg')
	expect(wrapper.classes()).toContain('border')
	expect(wrapper.classes()).toContain('border-main')

	const header = wrapper.findComponent(CardHeader)
	expect(header.exists()).toBe(true)

	const title = wrapper.findComponent(CardTitle)
	expect(title.exists()).toBe(true)
	expect(title.text()).toBe('Card Title')

	const description = wrapper.findComponent(CardDescription)
	expect(description.exists()).toBe(true)
	expect(description.text()).toBe('Card Description')

	const content = wrapper.findComponent(CardContent)
	expect(content.exists()).toBe(true)
	expect(content.text()).toBe('This is the card content.')

	const footer = wrapper.findComponent(CardFooter)
	expect(footer.exists()).toBe(true)
	expect(footer.text()).toBe('Card Footer')
	expect(footer.classes()).toContain('flex')
	expect(footer.classes()).toContain('justify-between')
	expect(footer.classes()).toContain('px-6')
	expect(footer.classes()).toContain('pb-6')
})
