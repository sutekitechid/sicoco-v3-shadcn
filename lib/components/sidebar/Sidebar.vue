<script setup lang="ts">
import { computed, provide, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

const props = withDefaults(
	defineProps<{
		collapsed?: boolean
		class?: HTMLAttributes['class']
	}>(),
	{
		collapsed: false,
		class: '',
	},
)

const emit = defineEmits<{
	'update:collapsed': [value: boolean]
}>()

const isCollapsed = computed({
	get: () => props.collapsed,
	set: val => emit('update:collapsed', val),
})

provide('sidebar-collapsed', isCollapsed)

function toggleCollapse() {
	isCollapsed.value = !isCollapsed.value
}
</script>

<template>
	<aside
		:class="
			cn(
				'flex flex-col h-full bg-white shadow-1 border-r border-main transition-all duration-300',
				isCollapsed ? 'w-24' : 'w-65',
				props.class,
			)
		"
	>
		<slot :collapsed="isCollapsed" :toggle="toggleCollapse" />
	</aside>
</template>
