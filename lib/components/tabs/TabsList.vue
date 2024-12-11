<script setup lang="ts">
import { cn } from '../../utils/tw-merge'
import { TabsList, type TabsListProps } from 'radix-vue'
import { computed, inject, type HTMLAttributes } from 'vue'
import { tabsListVariants, type TabsContentVariants } from '@/components/tabs'

const props = defineProps<
	TabsListProps & { class?: HTMLAttributes['class'] & { variant: string } }
>()

const variant = inject<TabsContentVariants['variant']>('variant', 'default')

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props
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
