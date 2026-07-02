import { describe, it, expect } from 'vitest'
import { validateSfc } from '../../src/utils/sfc-validator.js'

const componentSpecs = {
	SButton: {
		name: 'SButton',
		props: [
			{ name: 'variant', type: 'string', required: false },
			{ name: 'size', type: 'string', required: false },
			{ name: 'disabled', type: 'boolean', required: false },
		],
	},
}

describe('validate_usage behavior', () => {
	it('returns no issues for valid code', () => {
		const sfc = `<template><SButton variant="primary" size="md" /></template>`
		const issues = validateSfc(sfc, { components: componentSpecs })
		expect(issues.length).toBe(0)
	})

	it('reports unknown prop', () => {
		const sfc = `<template><SButton variant="primary" foo="bar" /></template>`
		const issues = validateSfc(sfc, { components: componentSpecs })
		expect(issues.some((i) => i.attr === 'foo')).toBe(true)
	})

	it('reports missing required prop when one exists', () => {
		const sfc = `<template><SButton /></template>`
		const strictSpecs = {
			SStrict: {
				name: 'SStrict',
				props: [{ name: 'value', type: 'string', required: true }],
			},
		}
		const issues = validateSfc(
			`<template><SStrict /></template>`,
			{ components: strictSpecs },
		)
		expect(issues.some((i) => i.attr === 'value' && i.message.includes('Required'))).toBe(
			true,
		)
	})

	it('does not flag class/style/id/ref/data-* attributes', () => {
		const sfc = `<template><SButton class="x" id="y" data-cy="z" ref="r" /></template>`
		const issues = validateSfc(sfc, { components: componentSpecs })
		expect(issues.length).toBe(0)
	})
})
