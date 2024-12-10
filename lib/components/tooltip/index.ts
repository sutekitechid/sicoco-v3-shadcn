
import { cva, type VariantProps } from 'class-variance-authority'

export const tooltipVariant = cva('z-50 overflow-hidden rounded-md bg-white px-3 py-1.5 text-sm shadow-xl animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  {
    variants: {
      variant: {
        default: 'bg-white text-black',
        primary: 'bg-primary-10 text-primary-100',
        danger: 'bg-danger-10 text-danger-100',
        warning: 'bg-warning-10 text-warning-100',
        success: 'bg-success-10 text-success-100',
        black: 'bg-black text-white',
        white: 'bg-white text-black',
      },
    },
    defaultVariants: {
      variant: 'default',
    }
  },
)

export const tooltipArrowVariant = cva('',
    {
      variants: {
        variant: {
          default: 'fill-white',
          primary: 'fill-primary-10',
          danger: 'fill-danger-10',
          warning: 'fill-warning-10',
          success: 'fill-success-10',
          black: 'fill-black',
          white: 'fill-white',
        },
      },
      defaultVariants: {
        variant: 'default',
      }
    },
  )

export type TooltipVariant = VariantProps<typeof tooltipVariant>

export type TooltipContentPosition = 'top' | 'bottom' | 'left' | 'right'

export { default as Tooltip } from './Tooltip.vue'
export { default as TooltipContent } from './TooltipContent.vue'