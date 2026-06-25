export { default as Card } from './Card.vue'
export { default as CardContent } from './CardContent.vue'
export { default as CardDescription } from './CardDescription.vue'
export { default as CardFooter } from './CardFooter.vue'
export { default as CardHeader } from './CardHeader.vue'
export { default as CardTitle } from './CardTitle.vue'
import { cva, type VariantProps } from 'class-variance-authority'

export const cardVariants = cva('bg-white', {
	variants: {
		shadow: {
			true: 'shadow-md',
			false: 'shadow-none',
		},
		border: {
			true: 'border border-neutral-100',
			false: 'border-none',
		},
		rounded: {
			true: 'rounded-lg',
			false: 'rounded-none',
		},
	},
	defaultVariants: {
		shadow: false,
		border: false,
		rounded: false,
	},
})
export type CardVariants = VariantProps<typeof cardVariants>
