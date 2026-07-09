import { cva, type VariantProps } from 'class-variance-authority'

export const textAreaVariants = cva(
	'bg-transparent box-border p-3 w-full rounded text-body-md border border-neutral-400 text-neutral-950 dark:text-neutral-500 placeholder:text-neutral-600 transition-colors focus:shadow-primary focus:border-primary-500 dark:focus:border-primary-700 outline-none',
	{
		variants: {
			disabled: {
				true: 'bg-disabled text-disabled cursor-not-allowed',
			},
			readonly: {
				true: 'bg-disabled',
			},
		},
		defaultVariants: {
			disabled: false,
			readonly: false,
		},
	}
)

export type TextAreaVariants = VariantProps<typeof textAreaVariants>
export { default as Textarea } from './Textarea.vue'
