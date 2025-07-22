<script setup lang="ts">
/**
 * `TabsList` component represents the list of tabs in the Tabs component.
 * It allows customization through the `variant` and `class` properties.
 *
 * @example
 * ```vue
 * <Tabs variant="boxes" class="custom-class">
 *   <TabsList>
 *     <TabsTrigger value="account" badge-count="1"> Account </TabsTrigger>
 *     <TabsTrigger value="password"> Password </TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="account">
 *     Make changes to your account here.
 *   </TabsContent>
 *   <TabsContent value="password"> Change your password here. </TabsContent>
 * </Tabs>
 *
 * @props {string} class - Additional custom CSS classes for styling the tabs list.
 * @props {string} variant - The variant of the tabs list which changes its styling. Can be "default" or "boxes".
 *
 * @inject variant - Injected variant from the parent `Tabs` component to determine the styling.
 *
 * @slot - Slot for rendering the triggers inside the tabs list.
 */
import { cn } from '../../utils/tw-merge'
import { TabsList, type TabsListProps } from 'radix-vue'
import { computed, inject, type HTMLAttributes } from 'vue'
import { tabsListVariants, type TabsContentVariants } from '.'

const props = defineProps<TabsListProps & { class?: HTMLAttributes['class'] }>()

const variant = inject<TabsContentVariants['variant']>('tab_variant', 'default')

const delegatedProps = computed(() => {
	const { ...delegated } = props
	return delegated
})
</script>

<template>
	<TabsList
		v-bind="delegatedProps"
		:class="
			cn(
				tabsListVariants({
					variant,
				}),
				props.class
			)
		"
	>
		<slot />
	</TabsList>
</template>
