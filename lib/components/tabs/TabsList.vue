<script setup lang="ts">
import { cn } from '../../utils/tw-merge'
import { TabsList, type TabsListProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<TabsListProps & { class?: HTMLAttributes['class'] }>()

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
				'inline-flex items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
				props.class
			)
		"
	>
		<slot />
	</TabsList>
</template>
