import { cva } from 'class-variance-authority'

export { default as Breadcrumb } from './Breadcrumb.vue'
export { default as BreadcrumbEllipsis } from './BreadcrumbEllipsis.vue'
export { default as BreadcrumbItem } from './BreadcrumbItem.vue'
export { default as BreadcrumbLink } from './BreadcrumbLink.vue'
export { default as BreadcrumbList } from './BreadcrumbList.vue'
export { default as BreadcrumbSeparator } from './BreadcrumbSeparator.vue'
export { default as BreadcrumbDropdown } from './BreadcrumbDropdown.vue'

export const breadcrumbLinkVariant = cva(
  '',
  {
    variants: {
      disabled: {
        true: 'text-disabled hover:text-disabled cursor-default',
      },
      noLink: {
        true: 'cursor-default',
        false: 'hover:text-primary-700 underline',
      },
    },
    defaultVariants: {
      disabled: false
    }
  }
)

export const breadcrumbItemVariant = cva(
  '',
  {
    variants: {
      disabled: {
        true: 'hover:!text-disabled !no-underline cursor-not-allowed'
      }
    }
  }
)

export const breadcrumbItemSeparatorVariant = cva(
  '',
  {
    variants: {
      disabled: {
        true: '!text-disabled cursor-not-allowed'
      }
    }
  }
)
