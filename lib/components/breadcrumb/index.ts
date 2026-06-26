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
          true: 'text-neutral-500 hover:text-neutral-500 cursor-default',
        },
      },
      defaultVariants: {
        disabled: false
      }
    }
  )
