import { cva, type VariantProps } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  'inline-flex items-center text-white justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-fit',
  {
    variants: {
      variant: {
        default:
          'bg-primary-100 hover:bg-primary-100/90',
        primary:
          'bg-primary-100 hover:bg-primary-100/90',
        danger:
          'bg-danger-100 hover:bg-danger-100/90',
        warning:
          'bg-warning-100 hover:bg-warning-100/90',
        success:
          'bg-success-100 hover:bg-success-100/90',
        'default light': 'bg-primary-100/10 text-primary-100 hover:bg-primary-100/20',
        'primary light': 'bg-primary-100/10 text-primary-100 hover:bg-primary-100/20',
        'danger light': 'bg-danger-100/10 text-danger-100 hover:bg-danger-100/20',
        'warning light': 'bg-warning-100/10 text-warning-100 hover:bg-warning-100/20',
        'success light': 'bg-success-100/10 text-success-100 hover:bg-success-100/20',
        'light default': 'bg-primary-100/10 text-primary-100 hover:bg-primary-100/20',
        'light primary': 'bg-primary-100/10 text-primary-100 hover:bg-primary-100/20',
        'light danger': 'bg-danger-100/10 text-danger-100 hover:bg-danger-100/20',
        'light warning': 'bg-warning-100/10 text-warning-100 hover:bg-warning-100/20',
        'light success': 'bg-success-100/10 text-success-100 hover:bg-success-100/20',
      },
      size: {
        default: 'h-11 px-4 py-3',
        sm: 'px-3 py-2 text-xs',
        md: 'h-11 px-4 py-3',
        lg: 'px-8 py-4 text-base'
      },
      rounded: {
        true: 'rounded-full',
      },
      outlined: {
        true: 'bg-transparent border border-grey-30 hover:text-grey-10',
      },
      disabled: {
        true: 'bg-grey-10 text-grey-50 cursor-not-allowed',
      }
    },
    compoundVariants: [
      {
        variant: 'default',
        outlined: true,
        disabled: false,
        class: 'text-primary-100 hover:bg-primary-100/90',
      },
      {
        variant: 'primary',
        outlined: true,
        disabled: false,
        class: 'text-primary-100',
      },
      {
        variant: 'danger',
        outlined: true,
        disabled: false,
        class: 'text-danger-100',
      },
      {
        variant: 'warning',
        outlined: true,
        disabled: false,
        class: 'text-warning-100',
      },
      {
        variant: 'success',
        outlined: true,
        disabled: false,
        class: 'text-success-100',
      },
      {
        variant: ['default light', 'primary light', 'danger light', 'warning light', 'success light', 'light default', 'light primary', 'light danger', 'light warning', 'light success'],
        disabled: true,
        class: 'hover:bg-grey-10',
      }
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: false,
      outlined: false,
      disabled: false,
    }
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
