import { cva, type VariantProps } from 'class-variance-authority'
export { default as Switch } from './Toggle.vue'

export const toggleVariants = cva('si-x cursor-pointer ml-2 ', {
	variants: {
		type: {
			default: '',
			disabled: '',
		},
		size: {
			small: 'text-xs',
			medium: 'text-xs',
			large: 'text-sm',
		},
	},
})

export type ToggleVariants = VariantProps<typeof toggleVariants>
