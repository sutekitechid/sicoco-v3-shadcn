<script setup lang="ts">
/**
 * `Tabs` component for managing a tabbed interface with customizable variants.
 *
 * The `Tabs` component allows you to manage tabbed content with two distinct styles: "default" and "boxes". The component accepts a `variant` prop to control the visual style of the tabs and provides this variant down the component tree via the `provide` method.
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
 * @props {string} [variant='default'] - The visual style of the tabs. Can be 'default' or 'boxes'.
 *
 * @emits Emits events according to `TabsRootEmits` from 'reka-ui'.
 *
 * @provide {string} variant - The current variant of the tabs provided to child components.
 */

import type { TabsRootProps, TabsRootEmits } from 'reka-ui'
import { TabsRoot, useForwardPropsEmits } from 'reka-ui'
import { provide } from 'vue'

const props = withDefaults(
	defineProps<TabsRootProps & { variant?: 'default' | 'boxes' }>(),
	{
		variant: 'default',
	}
)

const emits = defineEmits<TabsRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)

provide('tab_variant', props.variant)
</script>

<template>
	<TabsRoot v-bind="forwarded">
		<slot />
	</TabsRoot>
</template>
