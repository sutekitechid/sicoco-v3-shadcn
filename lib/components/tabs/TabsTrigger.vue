<script setup lang="ts">
/**
 * `TabsTrigger` component represents an individual tab in the `Tabs` component.
 * It allows customization through the `variant` and `class` properties and includes a badge for additional information.
 *
 * @example
 * ```vue
 * <Tabs variant="boxes">
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
 * @props {string} class - Additional custom CSS classes for styling the tab trigger.
 * @props {number | string} badgeCount - Optional count to display in the badge, which provides additional information.
 *
 * @inject variant - Injected variant from the parent `Tabs` component to determine the styling.
 *
 * @slot - Slot for rendering the content inside the tab trigger.
 */
import { cn } from '../../utils/tw-merge'
import { TabsTrigger, type TabsTriggerProps, useForwardProps } from 'reka-ui'
import { computed, inject, type HTMLAttributes } from 'vue'
import { tabsTriggerVariants, type TabsTriggerVariants } from '.'

const props = defineProps<
	TabsTriggerProps & { class?: HTMLAttributes['class'] }
>()

const variant = inject<TabsTriggerVariants['variant']>('tab_variant', 'default')

const delegatedProps = computed(() => {
	const { ...delegated } = props

	return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
	<TabsTrigger
		v-bind="forwardedProps"
		:class="
			cn(
				tabsTriggerVariants({
					variant,
				}),
				props.class
			)
		"
	>
		<span class="truncate flex items-center gap-2">
			<span data-test="trigger-label"><slot /></span>
		</span>
	</TabsTrigger>
</template>
