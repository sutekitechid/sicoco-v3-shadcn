import { test, expect, describe } from 'vitest'
import { sidebarItemVariants } from '../lib/components/sidebar'

describe('sidebarItemVariants', () => {
	test('returns default variant classes', () => {
		const classes = sidebarItemVariants({ variant: 'default' })
		expect(classes).toContain('text-secondary')
		expect(classes).toContain('hover:bg-neutral-10')
		expect(classes).toContain('hover:bg-secondary-subtle')
	})

	test('returns active variant classes', () => {
		const classes = sidebarItemVariants({ variant: 'active' })
		expect(classes).toContain('bg-secondary-default')
		expect(classes).toContain('text-neutral-50')
	})

	test('returns default size classes', () => {
		const classes = sidebarItemVariants({ size: 'default' })
		expect(classes).toContain('px-3')
		expect(classes).toContain('h-12')
		expect(classes).toContain('w-full')
	})

	test('returns collapsed size classes', () => {
		const classes = sidebarItemVariants({ size: 'collapsed' })
		expect(classes).toContain('justify-center')
		expect(classes).toContain('w-12')
		expect(classes).toContain('h-12')
	})

	test('returns combined variant and size classes', () => {
		const classes = sidebarItemVariants({ variant: 'active', size: 'collapsed' })
		expect(classes).toContain('bg-secondary-default')
		expect(classes).toContain('text-neutral-50')
		expect(classes).toContain('justify-center')
		expect(classes).toContain('w-12')
		expect(classes).toContain('h-12')
	})

	test('returns base classes', () => {
		const classes = sidebarItemVariants()
		expect(classes).toContain('flex')
		expect(classes).toContain('items-center')
		expect(classes).toContain('gap-3')
		expect(classes).toContain('rounded-lg')
		expect(classes).toContain('text-body-md')
		expect(classes).toContain('font-medium')
		expect(classes).toContain('transition-colors')
		expect(classes).toContain('cursor-pointer')
	})

	test('uses defaults when no params provided', () => {
		const classes = sidebarItemVariants()
		expect(classes).toContain('text-secondary')
		expect(classes).toContain('px-3')
		expect(classes).toContain('h-12')
		expect(classes).toContain('w-full')
	})
})
