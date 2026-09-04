<script setup lang="ts">
import { useSlots } from 'vue'
import { Drawer, DrawerContent, DrawerTrigger } from '../drawer'

defineProps<{
	open?: boolean
}>()

const emits = defineEmits<{
	(event: 'update:open', value: boolean): void
}>()

const slots = useSlots()
</script>

<template>
	<Drawer :open="open" @update:open="emits('update:open', $event)">
		<DrawerTrigger as-child>
			<slot name="trigger" />
		</DrawerTrigger>
		<DrawerContent class="flex max-h-[calc(100dvh-1rem)] flex-col p-0">
			<div class="flex shrink-0 items-center px-5 py-2">
				<slot name="header" />
			</div>
			<div class="min-h-0 flex-1 overflow-y-auto">
				<div v-if="slots['range-display']">
					<slot name="range-display" />
				</div>
				<div>
					<slot />
				</div>
			</div>
			<div v-if="slots.footer" class="flex shrink-0 gap-3 px-5 pb-4 pt-1">
				<slot name="footer" />
			</div>
		</DrawerContent>
	</Drawer>
</template>
