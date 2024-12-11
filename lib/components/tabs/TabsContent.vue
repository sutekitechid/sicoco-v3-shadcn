<script setup lang="ts">
import { cn } from '../../utils/tw-merge'
import { TabsContent, type TabsContentProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'
import {
	tabsContentVariants,
	type TabsContentVariants,
} from '@/components/tabs'
const props = defineProps<
	TabsContentProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

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
