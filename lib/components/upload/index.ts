import { cva, type VariantProps } from 'class-variance-authority'

export { default as Upload } from './Upload.vue'
export { default as UploadErrorMessage } from './UploadErrorMessage.vue'
export { default as UploadIcon } from './UploadIcon.vue'
export { default as UploadFileIcon } from './UploadFileIcon.vue'
export { default as UploadFileDetail } from './UploadFileDetail.vue'
export { default as UploadFileItem } from './UploadFileItem.vue'
export { default as UploadDeleteButton } from './UploadDeleteButton.vue'
export { default as UploadViewButton } from './UploadViewButton.vue'
export { default as UploadFailure } from './UploadFailure.vue'
export { default as UploadFileList } from './UploadFileList.vue'
export type { UploadFile, UploadFileMetadata } from './types'

export const uploadVariants = cva(
	'flex flex-col w-full items-center justify-center gap-2 rounded-sm border border-dashed p-4 transition-colors duration-150',
	{
		variants: {
			state: {
				default: 'min-h-36 border-main bg-white cursor-pointer hover:border-primary-default hover:bg-primary-subtle',
				dragging: 'min-h-36 border-primary-default bg-primary-subtle cursor-copy',
				selected: 'gap-0 border-solid border-main bg-white p-0',
				loading: 'min-h-36 border-primary-default bg-white p-6',
				failed: 'gap-0 border-main bg-white p-0',
			},
			disabled: {
				true: 'cursor-not-allowed border-neutral-300 bg-disabled text-disabled',
			},
			invalid: {
				true: 'border-danger-default! shadow-danger',
			},
		},
		defaultVariants: {
			state: 'default',
			disabled: false,
			invalid: false,
		},
	}
)

export const uploadInputVariants = cva(
	'sr-only',
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

/**
 * Check if file size is less than or equal to maxSize
 * @param file
 * @param maxSize
 * @returns Boolean
 */
export const checkMaxSize = (file: File, maxSize: number) => {
	return file?.size <= maxSize
}
