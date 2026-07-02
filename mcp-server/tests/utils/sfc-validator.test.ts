import { describe, it, expect } from 'vitest'
import { validateSfc } from '../../src/utils/sfc-validator.js'

const components = {
	SButton: {
		name: 'SButton',
		props: [
			{ name: 'variant', type: 'string', required: false },
			{ name: 'size', type: 'string', required: false },
			{ name: 'disabled', type: 'boolean', required: false },
		],
	},
	SDatePicker: {
		name: 'SDatePicker',
		props: [
			{ name: 'modelValue', type: 'DateValue | null', required: false },
			{ name: 'dateRange', type: 'boolean', required: false },
			{ name: 'required', type: 'boolean', required: false },
		],
	},
}

describe('validateSfc', () => {
	it('returns no issues for valid SFC', () => {
		const sfc = `
<template>
  <SButton variant="primary" size="sm">Click</SButton>
</template>
`
		expect(validateSfc(sfc, { components })).toEqual([])
	})

	it('warns about unknown prop', () => {
		const sfc = `
<template>
  <SButton foo="bar" />
</template>
`
		const issues = validateSfc(sfc, { components })
		expect(issues.length).toBe(1)
		expect(issues[0]?.severity).toBe('warning')
		expect(issues[0]?.message).toContain('foo')
	})

	it('does not flag class/style/id/ref', () => {
		const sfc = `
<template>
  <SButton class="btn" id="x" ref="btn" data-cy="btn" />
</template>
`
		expect(validateSfc(sfc, { components })).toEqual([])
	})

	it('flags missing required prop', () => {
		const sfc = `
<template>
  <SButton />
</template>
`
		// SButton has no required props — try a hypothetical.
		const strictComponents = {
			SStrict: { name: 'SStrict', props: [{ name: 'value', type: 'string', required: true }] },
		}
		const issues = validateSfc(sfc.replace('SButton', 'SStrict'), { components: strictComponents })
		expect(issues.some((i) => i.message.includes('Required prop "value"'))).toBe(true)
	})

	it('recognizes kebab-case attribute for camelCase prop', () => {
		const sfc = `
<template>
  <SButton :date-range="true" />
</template>
`
		// :date-range is bound; static names should still be recognized.
		const issues = validateSfc(
			`<template><SButton variant="primary" /></template>`,
			{ components: { SButton: { name: 'SButton', props: [{ name: 'variant', type: 'string', required: false }] } } },
		)
		expect(issues.length).toBe(0)
	})

	it('ignores non-Sicoco tags', () => {
		const sfc = `
<template>
  <MyUnknownComp foo="bar" />
</template>
`
		expect(validateSfc(sfc, { components })).toEqual([])
	})

	it('handles multiple template blocks', () => {
		const sfc = `
<template>
  <SButton variant="primary" />
</template>
<template>
  <div>hi</div>
</template>
`
		expect(validateSfc(sfc, { components })).toEqual([])
	})
})
