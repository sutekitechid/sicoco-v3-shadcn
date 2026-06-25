import { cva, type VariantProps } from 'class-variance-authority'

export { default as Upload } from './Upload.vue'
export { default as UploadErrorMessage } from './UploadErrorMessage.vue'
export { default as UploadIcon } from './UploadIcon.vue'
export { default as UploadFileIcon } from './UploadFileIcon.vue'
export { default as UploadFileDetail } from './UploadFileDetail.vue'
export { default as UploadDeleteButton } from './UploadDeleteButton.vue'

export const uploadVariants = cva(
	'border border-dashed border-neutral-300 rounded-md h-[60px] flex items-center p-2 text-neutral-950',
	{
		variants: {
			disabled: {
				true: 'bg-neutral-100/50 text-neutral-500',
			},
		},
		defaultVariants: {
			disabled: false,
		},
	}
)

export const uploadInputVariants = cva(
	'!w-full !h-full absolute top-0 left-0 opacity-0',
	{
		variants: {
			disabled: {
				true: 'cursor-not-allowed',
			},
		},
		defaultVariants: {
			disabled: false,
		},
	}
)

export type UploadVariants = VariantProps<typeof uploadVariants>

export const uploadIconOuterContainerVariants = cva(
	'h-10 w-10 bg-neutral-100 flex items-center justify-center text-neutral-950 rounded-full',
	{
		variants: {
			disabled: {
				true: 'bg-neutral-100',
			},
		},
		defaultVariants: {
			disabled: false,
		},
	}
)

/**
 * Check if file size is less than or equal to maxSize
 * @param file
 * @param maxSize
 * @returns Boolean
 */
export const checkMaxSize = (file: File, maxSize: number) => {
	return file?.size <= maxSize
}
