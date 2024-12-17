export { default as Sidemenu } from './Sidemenu.vue'

import { cva, type VariantProps } from 'class-variance-authority'

export const sidemenuVariants = cva('flex flex-col items-start', {
  variants: {
    variant: {
      default: 'bg-purple-700',
      primary: 'bg-primary-100'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export type SidemenuVariants = VariantProps<typeof sidemenuVariants>
