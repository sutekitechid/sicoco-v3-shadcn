import { mount } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'
import BadgeFilter from '../lib/components/badge/BadgeFilter.vue'
import {
	badgeFilterCounterVariants,
	badgeFilterVariants,
} from '../lib/components/badge'

describe('BadgeFilter', () => {
	test('renders default slot content', () => {
		const wrapper = mount(BadgeFilter, {
			props: { value: 'cat' },
			slots: { default: 'Category' },
		})

		expect(wrapper.text()).toContain('Category')
	})

	test('renders as a button by default', () => {
		const wrapper = mount(BadgeFilter, {
			props: { value: 'cat' },
			slots: { default: 'Category' },
		})

		const root = wrapper.find('[data-cy="badge-filter"]')
		expect(root.element.tagName).toBe('BUTTON')
	})

	test('wraps content with the base Badge component', () => {
		const wrapper = mount(BadgeFilter, {
			props: { value: 'cat' },
			slots: { default: 'Category' },
		})

		// Badge component renders a div inside the button
		const badgeDiv = rootDiv(wrapper)
		expect(badgeDiv.exists()).toBe(true)
		// Badge base classes from badgeVariants
		const cls = badgeDiv.classes().join(' ')
		expect(cls).toContain('inline-flex')
		expect(cls).toContain('whitespace-nowrap')
		expect(cls).toContain('items-center')
	})

	test('applies fixed padding py-2 px-4', () => {
		const wrapper = mount(BadgeFilter, {
			props: { value: 'cat' },
			slots: { default: 'Category' },
		})

		const cls = rootDiv(wrapper).classes().join(' ')
		expect(cls).toContain('py-2')
		expect(cls).toContain('px-4')
	})

	test('does not accept size prop', () => {
		// Size prop is no longer in the component API; verify it's ignored
		const wrapper = mount(BadgeFilter, {
			props: { value: 'cat', size: 'small' as never },
			slots: { default: 'Category' },
		})

		const cls = rootDiv(wrapper).classes().join(' ')
		expect(cls).not.toContain('h-6')
		expect(cls).not.toContain('text-label-sm')
	})

	test('hides counter when number is false', () => {
		const wrapper = mount(BadgeFilter, {
			props: { value: 'cat', count: 5, number: false },
			slots: { default: 'Category' },
		})

		expect(wrapper.find('[data-cy="badge-filter-counter"]').exists()).toBe(false)
	})

	test('hides counter when count is not provided', () => {
		const wrapper = mount(BadgeFilter, {
			props: { value: 'cat' },
			slots: { default: 'Category' },
		})

		expect(wrapper.find('[data-cy="badge-filter-counter"]').exists()).toBe(false)
	})

	test('renders counter with provided count value', () => {
		const wrapper = mount(BadgeFilter, {
			props: { value: 'cat', count: 12 },
			slots: { default: 'Category' },
		})

		const counter = wrapper.find('[data-cy="badge-filter-counter"]')
		expect(counter.exists()).toBe(true)
		expect(counter.text()).toBe('12')
	})

	test('accepts string count value', () => {
		const wrapper = mount(BadgeFilter, {
			props: { value: 'cat', count: '99+' },
			slots: { default: 'Category' },
		})

		expect(wrapper.find('[data-cy="badge-filter-counter"]').text()).toBe('99+')
	})

	test('emits click event with value when clicked', async () => {
		const wrapper = mount(BadgeFilter, {
			props: { value: 'cat' },
			slots: { default: 'Category' },
		})

		await wrapper.find('[data-cy="badge-filter"]').trigger('click')

		expect(wrapper.emitted('click')).toBeTruthy()
		expect(wrapper.emitted('click')?.[0]).toEqual(['cat'])
	})

	test('does not emit click when inactive', async () => {
		const wrapper = mount(BadgeFilter, {
			props: { value: 'cat', inactive: true },
			slots: { default: 'Category' },
		})

		await wrapper.find('[data-cy="badge-filter"]').trigger('click')

		expect(wrapper.emitted('click')).toBeFalsy()
	})

	test('sets disabled attribute when inactive', () => {
		const wrapper = mount(BadgeFilter, {
			props: { value: 'cat', inactive: true },
			slots: { default: 'Category' },
		})

		const root = wrapper.find('[data-cy="badge-filter"]')
		expect(root.attributes('disabled')).toBeDefined()
		expect(root.attributes('aria-disabled')).toBe('true')
	})

	test('toggles selected state via aria-pressed', async () => {
		const wrapper = mount(BadgeFilter, {
			props: { value: 'cat' },
			slots: { default: 'Category' },
		})

		const root = wrapper.find('[data-cy="badge-filter"]')
		expect(root.attributes('aria-pressed')).toBe('false')

		await root.trigger('click')
		expect(root.attributes('aria-pressed')).toBe('true')

		await root.trigger('click')
		expect(root.attributes('aria-pressed')).toBe('false')
	})

	test('does not toggle selected state when inactive', async () => {
		const wrapper = mount(BadgeFilter, {
			props: { value: 'cat', inactive: true },
			slots: { default: 'Category' },
		})

		const root = wrapper.find('[data-cy="badge-filter"]')
		await root.trigger('click')

		expect(root.attributes('aria-pressed')).toBeUndefined()
	})

	test('default state badge uses transparent bg and neutral border', () => {
		const wrapper = mount(BadgeFilter, {
			props: { value: 'cat' },
			slots: { default: 'Category' },
		})

		const cls = rootDiv(wrapper).classes().join(' ')
		expect(cls).toContain('bg-transparent')
		expect(cls).toContain('border-neutral-300')
		expect(cls).toContain('text-main')
	})

	test('inactive badge uses neutral styling', () => {
		const wrapper = mount(BadgeFilter, {
			props: { value: 'cat', inactive: true },
			slots: { default: 'Category' },
		})

		const cls = rootDiv(wrapper).classes().join(' ')
		expect(cls).toContain('bg-neutral-50')
		expect(cls).toContain('border-neutral-300')
		expect(cls).toContain('text-neutral-500')
		expect(cls).toContain('cursor-not-allowed')
	})

	test('selected badge applies secondary styling after click', async () => {
		const wrapper = mount(BadgeFilter, {
			props: { value: 'cat' },
			slots: { default: 'Category' },
		})

		await wrapper.find('[data-cy="badge-filter"]').trigger('click')

		const cls = rootDiv(wrapper).classes().join(' ')
		expect(cls).toContain('bg-secondary-50')
		expect(cls).toContain('border-secondary-500')
	})

	test('counter uses default state classes initially', () => {
		const wrapper = mount(BadgeFilter, {
			props: { value: 'cat', count: 5 },
			slots: { default: 'Category' },
		})

		const counter = wrapper.find('[data-cy="badge-filter-counter"]')
		expect(counter.classes().join(' ')).toContain('bg-secondary-500')
		expect(counter.classes().join(' ')).toContain('text-white')
	})

	test('counter uses selected state classes when selected', async () => {
		const wrapper = mount(BadgeFilter, {
			props: { value: 'cat', count: 5 },
			slots: { default: 'Category' },
		})

		await wrapper.find('[data-cy="badge-filter"]').trigger('click')

		const counter = wrapper.find('[data-cy="badge-filter-counter"]')
		expect(counter.classes().join(' ')).toContain('bg-secondary-500')
	})

	test('counter uses inactive state classes when inactive', () => {
		const wrapper = mount(BadgeFilter, {
			props: { value: 'cat', count: 5, inactive: true },
			slots: { default: 'Category' },
		})

		const counter = wrapper.find('[data-cy="badge-filter-counter"]')
		expect(counter.classes().join(' ')).toContain('bg-neutral-500')
	})

	test('counter renders as a perfect circle', () => {
		const wrapper = mount(BadgeFilter, {
			props: { value: 'cat', count: 5 },
			slots: { default: 'Category' },
		})

		const counter = wrapper.find('[data-cy="badge-filter-counter"]')
		const cls = counter.classes().join(' ')
		expect(cls).toContain('rounded-full')
		expect(cls).toContain('aspect-square')
		expect(cls).toContain('min-w-5')
		expect(cls).toContain('min-h-5')
	})

	test('merges custom class via cn()', () => {
		const wrapper = mount(BadgeFilter, {
			props: { value: 'cat', class: 'custom-class' },
			slots: { default: 'Category' },
		})

		const root = wrapper.find('[data-cy="badge-filter"]')
		expect(root.classes()).toContain('custom-class')
	})

	test('badgeFilterCounterVariants helper produces base classes', () => {
		expect(badgeFilterCounterVariants({ state: 'default' })).toContain(
			'rounded-full'
		)
	})

	test('supports keyboard activation through button element', () => {
		const wrapper = mount(BadgeFilter, {
			props: { value: 'cat' },
			slots: { default: 'Category' },
		})

		const root = wrapper.find('[data-cy="badge-filter"]')
		expect(root.element.tagName).toBe('BUTTON')
		expect(root.attributes('type')).toBe('button')
	})

	test('wrapper button has reset styling (no chrome)', () => {
		const wrapper = mount(BadgeFilter, {
			props: { value: 'cat' },
			slots: { default: 'Category' },
		})

		const root = wrapper.find('[data-cy="badge-filter"]')
		const cls = root.classes().join(' ')
		expect(cls).toContain('bg-transparent')
		expect(cls).toContain('p-0')
		expect(cls).toContain('border-0')
	})

	test('uses badgeFilterVariants default state initially', () => {
		const wrapper = mount(BadgeFilter, {
			props: { value: 'cat' },
			slots: { default: 'Category' },
		})

		const cls = rootDiv(wrapper).classes().join(' ')
		expect(cls).toContain('border-neutral-300')
		expect(cls).toContain('bg-transparent')
		expect(cls).toContain('text-main')
		expect(cls).toContain('hover:bg-secondary-50')
		expect(cls).toContain('hover:border-secondary-500')
	})

	test('uses badgeFilterVariants selected state after click', async () => {
		const wrapper = mount(BadgeFilter, {
			props: { value: 'cat' },
			slots: { default: 'Category' },
		})

		await wrapper.find('[data-cy="badge-filter"]').trigger('click')

		const cls = rootDiv(wrapper).classes().join(' ')
		expect(cls).toContain('border-secondary-500')
		expect(cls).toContain('bg-secondary-50')
	})

	test('uses badgeFilterVariants inactive state when inactive', () => {
		const wrapper = mount(BadgeFilter, {
			props: { value: 'cat', inactive: true },
			slots: { default: 'Category' },
		})

		const cls = rootDiv(wrapper).classes().join(' ')
		expect(cls).toContain('border-neutral-300')
		expect(cls).toContain('bg-neutral-50')
		expect(cls).toContain('text-neutral-500')
		expect(cls).toContain('cursor-not-allowed')
	})

	test('adds 8px gap between slot and counter via badgeFilterVariants base', () => {
		const wrapper = mount(BadgeFilter, {
			props: { value: 'cat', count: 5 },
			slots: { default: 'Category' },
		})

		const cls = rootDiv(wrapper).classes().join(' ')
		expect(cls).toContain('gap-2')
	})

	test('badgeFilterVariants helper produces base classes', () => {
		expect(badgeFilterVariants({ state: 'default' })).toContain('gap-2')
	})

	test('badgeFilterVariants defaults to default state', () => {
		expect(badgeFilterVariants()).toContain('bg-transparent')
	})

	describe('v-model single-select', () => {
		test('reflects selected state from modelValue', () => {
			const wrapper = mount(BadgeFilter, {
				props: { value: 'cat', modelValue: 'cat' },
				slots: { default: 'Category' },
			})

			const root = wrapper.find('[data-cy="badge-filter"]')
			expect(root.attributes('aria-pressed')).toBe('true')
		})

		test('is unselected when modelValue does not match value', () => {
			const wrapper = mount(BadgeFilter, {
				props: { value: 'cat', modelValue: 'other' },
				slots: { default: 'Category' },
			})

			const root = wrapper.find('[data-cy="badge-filter"]')
			expect(root.attributes('aria-pressed')).toBe('false')
		})

		test('emits update:modelValue with value on click when not selected', async () => {
			const wrapper = mount(BadgeFilter, {
				props: { value: 'cat', modelValue: null },
				slots: { default: 'Category' },
			})

			await wrapper.find('[data-cy="badge-filter"]').trigger('click')

			expect(wrapper.emitted('update:modelValue')).toBeTruthy()
			expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['cat'])
		})

		test('emits update:modelValue with null when clicking selected badge (deselect)', async () => {
			const wrapper = mount(BadgeFilter, {
				props: { value: 'cat', modelValue: 'cat' },
				slots: { default: 'Category' },
			})

			await wrapper.find('[data-cy="badge-filter"]').trigger('click')

			expect(wrapper.emitted('update:modelValue')).toBeTruthy()
			expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
		})

		test('does not toggle internally when modelValue is provided', async () => {
			const wrapper = mount(BadgeFilter, {
				props: { value: 'cat', modelValue: null },
				slots: { default: 'Category' },
			})

			const root = wrapper.find('[data-cy="badge-filter"]')
			await root.trigger('click')

			// Component stays unselected because parent didn't update modelValue
			expect(root.attributes('aria-pressed')).toBe('false')
		})

		test('switches selection when parent updates modelValue', async () => {
			const wrapper = mount(BadgeFilter, {
				props: { value: 'cat', modelValue: null },
				slots: { default: 'Category' },
			})

			const root = wrapper.find('[data-cy="badge-filter"]')
			expect(root.attributes('aria-pressed')).toBe('false')

			await wrapper.setProps({ modelValue: 'cat' })
			expect(root.attributes('aria-pressed')).toBe('true')

			await wrapper.setProps({ modelValue: 'other' })
			expect(root.attributes('aria-pressed')).toBe('false')
		})

		test('does not emit update:modelValue when inactive', async () => {
			const wrapper = mount(BadgeFilter, {
				props: { value: 'cat', modelValue: null, inactive: true },
				slots: { default: 'Category' },
			})

			await wrapper.find('[data-cy="badge-filter"]').trigger('click')

			expect(wrapper.emitted('update:modelValue')).toBeFalsy()
		})

		test('still emits click event alongside update:modelValue', async () => {
			const wrapper = mount(BadgeFilter, {
				props: { value: 'cat', modelValue: null },
				slots: { default: 'Category' },
			})

			await wrapper.find('[data-cy="badge-filter"]').trigger('click')

			expect(wrapper.emitted('click')).toBeTruthy()
			expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		})
	})
})

function rootDiv(wrapper: ReturnType<typeof mount>) {
	return wrapper.find('[data-cy="badge-filter"] > div')
}