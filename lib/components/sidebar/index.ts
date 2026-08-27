import { cva, type VariantProps } from 'class-variance-authority'

export { default as Sidebar } from './Sidebar.vue'
export { default as SidebarHeader } from './SidebarHeader.vue'
export { default as SidebarItem } from './SidebarItem.vue'
export { default as SidebarFooter } from './SidebarFooter.vue'
export { default as SidebarGroup } from './SidebarGroup.vue'

export const sidebarItemVariants = cva(
	'flex items-center gap-3 rounded-lg text-body-md font-medium transition-colors cursor-pointer',
	{
		variants: {
			variant: {
				default: 'text-secondary hover:bg-neutral-10 hover:bg-secondary-subtle',
				active: 'bg-secondary-default text-neutral-50',
			},
			size: {
				default: 'px-3 h-12 w-full',
				collapsed: 'justify-center w-12 h-12',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
)

export type SidebarItemVariants = VariantProps<typeof sidebarItemVariants>
