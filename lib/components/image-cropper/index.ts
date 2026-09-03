import { cva, type VariantProps } from 'class-variance-authority'

export { default as ImageCropper } from './ImageCropper.vue'
export { default as ImageCropperZoom } from './ImageCropperZoom.vue'
export { default as ImageCropperToolbar } from './ImageCropperToolbar.vue'

export const imageCropperVariants = cva(
	'relative flex flex-col overflow-hidden rounded-lg bg-white dark:bg-neutral-100',
	{
		variants: {
			size: {
				sm: 'w-[320px]',
				md: 'w-[480px]',
				lg: 'w-[640px]',
			},
		},
		defaultVariants: {
			size: 'md',
		},
	},
)

export const imageCropperAreaVariants = cva(
	'relative overflow-hidden bg-neutral-800',
	{
		variants: {
			shape: {
				square: 'rounded-none',
				circle: 'rounded-full',
			},
		},
		defaultVariants: {
			shape: 'square',
		},
	},
)

export const imageCropperZoomVariants = cva(
	'flex items-center gap-2 px-4 py-2',
)

export const imageCropperToolbarVariants = cva(
	'flex items-center justify-between border-t border-main px-4 py-3',
)

export type ImageCropperVariants = VariantProps<typeof imageCropperVariants>
export type ImageCropperAreaVariants = VariantProps<typeof imageCropperAreaVariants>
