import { cva, type VariantProps } from 'class-variance-authority'

export { default as Accordion } from './Accordion.vue'
export { default as AccordionContent } from './AccordionContent.vue'
export { default as AccordionItem } from './AccordionItem.vue'
export { default as AccordionTrigger } from './AccordionTrigger.vue'

/**
 * Layout CVA for the Accordion root.
 * - default: vertical stack with 2-unit gap between items
 * - flush: vertical stack with no gap (dividers rendered on items themselves)
 */
export const accordionVariants = cva('flex flex-col', {
	variants: {
		variant: {
			default: 'gap-2',
			flush: '',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
})
export type AccordionVariants = VariantProps<typeof accordionVariants>

/**
 * CVA for the AccordionItem border + hover/disabled states.
 * - default: full border + rounded-lg
 * - flush: only bottom border, no rounded corners
 */
export const accordionItemVariants = cva(
	'data-[state=closed]:hover:border-primary-500 data-[state=closed]:hover:bg-primary-50 data-[disabled]:bg-disabled data-[disabled]:hover:bg-disabled data-[disabled]:hover:border-neutral-400',
	{
		variants: {
			variant: {
				default: 'border border-neutral-400 rounded-lg',
				flush: 'border-b border-neutral-400 rounded-none',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
)
export type AccordionItemVariants = VariantProps<typeof accordionItemVariants>
