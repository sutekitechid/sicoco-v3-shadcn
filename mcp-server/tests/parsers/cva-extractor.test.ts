import { describe, it, expect } from 'vitest'
import { extractCvaVariants } from '../../src/parsers/cva-extractor.js'

const SAMPLE_BADGE = `import { cva, type VariantProps } from 'class-variance-authority'

export const badgeVariants = cva(
  'inline-flex whitespace-nowrap border-transparent w-fit items-center font-medium',
  {
    variants: {
      variant: {
        default: '',
        primary: '',
        success: '',
        danger: '',
        'success solid': '',
      },
      rounded: {
        false: 'rounded-lg',
        true: 'rounded-full',
      },
      size: {
        small: 'text-label-sm h-6 px-2',
        medium: 'text-label-md h-7 px-3',
        large: 'text-label-lg h-8 px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      rounded: false,
      size: 'medium',
    },
  },
)
`

describe('extractCvaVariants', () => {
	it('extracts variant axes and their values', () => {
		const variants = extractCvaVariants(SAMPLE_BADGE)
		const variant = variants.find((v) => v.name === 'variant')
		expect(variant).toBeDefined()
		expect(variant?.values).toEqual(
			expect.arrayContaining(['default', 'primary', 'success', 'danger', 'success solid']),
		)
	})

	it('extracts multiple axes', () => {
		const variants = extractCvaVariants(SAMPLE_BADGE)
		const axes = variants.map((v) => v.name).sort()
		expect(axes).toEqual(['rounded', 'size', 'variant'])
	})

	it('applies defaultVariants to each axis', () => {
		const variants = extractCvaVariants(SAMPLE_BADGE)
		const size = variants.find((v) => v.name === 'size')
		expect(size?.default).toBe('medium')
		const variant = variants.find((v) => v.name === 'variant')
		expect(variant?.default).toBe('default')
		const rounded = variants.find((v) => v.name === 'rounded')
		expect(rounded?.default).toBe('false')
	})

	it('returns empty array when no cva call is present', () => {
		expect(extractCvaVariants('export const foo = 42')).toEqual([])
	})

	it('handles multiple cva calls (de-duplicated by axis name)', () => {
		const src = SAMPLE_BADGE.replace(
			/export const badgeVariants = cva/,
			`export const badgeVariants = cva
export const iconVariants = cva(
  'i',
  {
    variants: { size: { sm: '', md: '' } },
    defaultVariants: { size: 'sm' },
  },
)`,
		)
		const variants = extractCvaVariants(src)
		// Both 'variant' axes are merged into one.
		const sizeEntries = variants.filter((v) => v.name === 'size')
		expect(sizeEntries.length).toBe(1)
	})
})
