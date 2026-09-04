import { cva, type VariantProps } from 'class-variance-authority'

export { default as Slider } from './Slider.vue'

export const sliderVariants = cva(
	'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
)

export const sliderTrackVariants = cva(
	'relative grow overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-300 data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5',
)

export const sliderRangeVariants = cva(
	'absolute bg-primary-default data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full',
)

export const sliderThumbVariants = cva(
	'block size-4 shrink-0 rounded-full border border-primary-default bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 hover:ring-primary-subtle focus-visible:ring-4 focus-visible:ring-primary-subtle focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50',
)

export type SliderVariants = VariantProps<typeof sliderVariants>
