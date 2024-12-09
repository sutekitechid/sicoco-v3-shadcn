import { cva, type VariantProps } from 'class-variance-authority'

export { default as Upload } from './Upload.vue'
export { default as UploadErrorMessage } from './UploadErrorMessage.vue' 
export { default as UploadIcon } from './UploadIcon.vue'

export const uploadVariants = cva('border border-dashed border-grey-40 rounded-md h-[60px] flex items-center p-2 text-grey-100',
  {
    variants: {
        disabled: {
            true: 'bg-grey-10 text-grey-60',
        },
    },
    defaultVariants: {
        disabled: false
    }
  }
)

export const uploadInputVariants = cva('w-full h-[60px] absolute top-0 left-0 opacity-0',
  {
    variants: {
        disabled: {
            true: 'cursor-not-allowed',
        },
    },
    defaultVariants: {
        disabled: false
    }
  }
)

export type UploadVariants = VariantProps<typeof uploadVariants>

export const uploadIconVariants = cva('h-10 w-10 bg-grey-10/50 flex items-center justify-center text-black rounded-full',
  {
      variants: {
          disabled: {
              true: 'bg-[#F9FAFB]',
          },
      },
      defaultVariants: {
          disabled: false
      }
  }
)

export const checkMaxSize = (file: File, maxSize: number) => {
  console.log('filesize', file?.size)
    return file?.size <= maxSize
}