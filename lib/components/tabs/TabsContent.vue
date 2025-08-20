<script setup lang="ts">
/**
 * `TabsContent` component used to render the content associated with each tab in a `Tabs` component.
 *
 * The component accepts a `variant` prop for customizing the visual style of the content, as well as the usual props from `TabsContentProps`.
 *
 * @example
 * ```vue
 * <template>
 *   <Tabs variant="boxes">
 *     <TabsList>
 *       <TabsTrigger value="account" badge-count="1"> Account </TabsTrigger>
 *       <TabsTrigger value="password"> Password </TabsTrigger>
 *     </TabsList>
 *     <TabsContent value="account">
 *       Make changes to your account here.
 *     </TabsContent>
 *     <TabsContent value="password"> Change your password here. </TabsContent>
 *   </Tabs>
 * </template>
 *
 * @props {string} class - Additional custom CSS classes for styling the content.
 * @provide {string} variant - The variant of the parent Tabs component.
 *
 * @slot default - Slot for the content to be displayed.
 */

import { cn } from '../../utils/tw-merge'
import { TabsContent, type TabsContentProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'
import { tabsContentVariants } from '.'
const props = defineProps<
	TabsContentProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
	const { ...delegated } = props

	return delegated
})
</script>

<template>
	<TabsContent
		:class="cn(tabsContentVariants(), props.class)"
		v-bind="delegatedProps"
	>
		<slot />
	</TabsContent>
</template>
