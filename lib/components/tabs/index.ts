export { default as Tabs } from './Tabs.vue'
export { default as TabsContent } from './TabsContent.vue'
export { default as TabsList } from './TabsList.vue'
export { default as TabsTrigger } from './TabsTrigger.vue'
import { cva, type VariantProps } from 'class-variance-authority'

export const tabsListVariants = cva(
	'inline-flex items-center justify-center p-1 text-neutral-60 w-full overflow-x-auto overflow-y-hidden',
	{
		variants: {
			variant: {
				default:
					'bg-white justify-start border-b-2 border-solid border-neutral-10',
				boxes: 'bg-neutral-10 rounded-md',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
)

export type TabsListVariants = VariantProps<typeof tabsListVariants>

export const tabsContentVariants = cva(
	'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-2 ',
	{
		variants: {
			variant: {
				default: '',
				boxes: '',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
)

export type TabsContentVariants = VariantProps<typeof tabsContentVariants>

export const tabsTriggerVariants = cva(
	'w-full inline-flex items-center justify-center whitespace-nowrap px-3 py-2 text-sm font-medium ring-offset-white transition-all disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default:
					'data-[state=active]:text-neutral-100 data-[state=active]:shadow-sm data-[state=active]:font-semibold data-[state=active]:text-primary-100 data-[state=active]:border-b-2 data-[state=active]:border-primary-100 border-b-2 border-neutral-10 dark:text-neutral-10 w-fit -mb-1.5',
				boxes:
					'rounded-md data-[state=active]:bg-white data-[state=active]:text-neutral-100 data-[state=active]:shadow-sm data-[state=active]:font-semibold dark:data-[state=active]:text-neutral-10',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
)

export type TabsTriggerVariants = VariantProps<typeof tabsTriggerVariants>
