import { cva, type VariantProps } from 'class-variance-authority'

export { default as Sidebar } from './Sidebar.vue'
export { default as SidebarHeader } from './SidebarHeader.vue'
export { default as SidebarItem } from './SidebarItem.vue'
export { default as SidebarFooter } from './SidebarFooter.vue'

export const sidebarItemVariants = cva(
	'flex items-center gap-3 rounded-lg text-body-sm font-medium transition-colors cursor-pointer',
	{
		variants: {
			variant: {
				default: 'text-neutral-800 hover:bg-neutral-10',
				active: 'bg-primary-50 text-primary-100',
			},
			size: {
				default: 'px-3 py-2.5',
				collapsed: 'justify-center px-2 py-2.5',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
)

export type SidebarItemVariants = VariantProps<typeof sidebarItemVariants>
