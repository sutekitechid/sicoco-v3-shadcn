import { cva, type VariantProps } from 'class-variance-authority'
export { default as Switch } from './Toggle.vue'

export const toggleVariants = cva(
	'peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-4 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white data-[state=checked]:bg-primary-100 data-[state=unchecked]:bg-grey-30 hover:data-[state=unchecked]:bg-grey-20 focus:ring-4 focus:ring-primary-20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:!bg-grey-30'
)

export type ToggleVariants = VariantProps<typeof toggleVariants>
