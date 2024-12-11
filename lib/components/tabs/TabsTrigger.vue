<script setup lang="ts">
import { cn } from '../../utils/tw-merge'
import { TabsTrigger, type TabsTriggerProps, useForwardProps } from 'radix-vue'
import { computed, inject, type HTMLAttributes } from 'vue'
import {
	tabsTriggerVariants,
	type TabsTriggerVariants,
} from '@/components/tabs'
import Badge from '../badge/Badge.vue'

const props = defineProps<
	TabsTriggerProps & { class?: HTMLAttributes['class'] } & {
		badgeCount?: number | string
	}
>()

const variant = inject<TabsTriggerVariants['variant']>('variant', 'default')

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

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
			<slot />
			<Badge
				v-if="badgeCount"
				type="danger"
				class="text-white bg-[#D92D20] w-6 h-6 font-medium text-sm"
				rounded
			>
				{{ badgeCount }}
			</Badge>
		</span>
	</TabsTrigger>
</template>
